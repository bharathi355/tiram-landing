// Tiny markdown subset renderer for article body strings stored in i18n JSON.
//
// Supports only what article authors actually need inside a JSON value:
//   - paragraphs separated by `\n\n`
//   - `**bold**` and `_italic_` inline spans (no nesting)
//   - unordered lists where every consecutive line starts with `- `
//
// Anything richer (headings, links, code blocks, images, tables) belongs in
// the structured shape (sections[], faq[], comparisonTable) — not inside a
// prose body string. Keeping the surface tiny lets us avoid a react-markdown
// / remark dependency, which the project doesn't justify for two articles.
//
// If a future article genuinely needs richer markup, install react-markdown
// once and delete this file — don't pile features on here. See CLAUDE.md §0
// "no new infra without a forcing function" for the rule.

import type { ReactNode } from "react";

interface Props {
  source: string;
}

export function MiniMd({ source }: Props) {
  const blocks: ReactNode[] = [];
  // Split on one-or-more blank lines.
  const rawBlocks = source.split(/\n\s*\n/);
  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i].trim();
    if (!block) continue;
    const lines = block.split("\n");
    const isList =
      lines.length > 0 && lines.every((l) => l.trim().startsWith("- "));
    if (isList) {
      blocks.push(
        <ul
          key={i}
          className="mt-4 list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-300"
        >
          {lines.map((l, j) => (
            <li key={j}>{renderInline(l.replace(/^\s*-\s+/, ""))}</li>
          ))}
        </ul>,
      );
    } else {
      blocks.push(
        <p
          key={i}
          className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300"
        >
          {renderInline(block)}
        </p>,
      );
    }
  }
  return <>{blocks}</>;
}

// Tokenise inline runs: `**bold**` and `_italic_`. The regex matches either
// form; we then dispatch on the leading character. Non-greedy by relying on
// `[^*]` / `[^_]` rather than `.*?` so the lexer fails fast on unterminated
// runs (the text is rendered literally, which is the right fallback).
const INLINE_RE = /(\*\*[^*]+\*\*|_[^_]+_)/g;

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  // Reset because we share the regex instance across calls.
  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > lastIndex) {
      out.push(text.slice(lastIndex, m.index));
    }
    const token = m[0];
    if (token.startsWith("**")) {
      out.push(
        <strong
          key={key++}
          className="font-semibold text-slate-900 dark:text-slate-100"
        >
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      out.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    lastIndex = m.index + token.length;
  }
  if (lastIndex < text.length) {
    out.push(text.slice(lastIndex));
  }
  return out;
}
