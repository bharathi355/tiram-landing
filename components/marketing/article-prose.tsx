// Hand-rolled prose-style wrapper for article body content.
//
// We deliberately do NOT install @tailwindcss/typography. Two articles is not
// a forcing function for a new dep (CLAUDE.md §0). Revisit if/when we ship
// article #5 — at that point the plugin earns its keep. Until then, this
// 30-line component carries the same load.
//
// Headings (h1, h2) are styled at the shell level because they sit *outside*
// the prose block in the visual hierarchy (heading → prose → next heading).

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
}

export function ArticleProse({ children, className }: Props) {
  return (
    <div
      className={cn(
        "text-base leading-relaxed text-slate-700 dark:text-slate-300",
        // Reset first-child top margin so the section heading visually owns
        // the spacing above the prose. Without this every section gets an
        // extra `mt-4` that pushes prose away from its heading.
        "[&>p:first-child]:mt-0 [&>ul:first-child]:mt-0",
        // Link styling matches the rest of the marketing site (accent-600).
        "[&_a]:font-medium [&_a]:text-accent-600 [&_a]:underline-offset-2 hover:[&_a]:text-accent-500 dark:[&_a]:text-accent-400",
        className,
      )}
    >
      {children}
    </div>
  );
}
