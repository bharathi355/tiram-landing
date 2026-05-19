---
name: seo-aeo-research
description: "Use when: researching SEO, AEO, GEO, generative engine optimization, AI search visibility, AI citations, AI Overviews, ChatGPT/Perplexity/Copilot grounding, landing page optimization, static page copy, metadata, structured data, sitemap.xml, robots.txt, llms.txt, Search Console, keyword/entity strategy, or ranking Tiram as the best billing and inventory product for Indian SMBs."
argument-hint: "Goal, page scope, target geography, competitors, and allowed implementation level"
---

# SEO, AEO, and GEO Research

Use this skill to research and improve Tiram's organic visibility in traditional search engines, answer engines, and generative engines. The goal is to make the product easier to discover, understand, cite, and trust for high-intent buyers of Indian SMB billing and inventory software.

Be ambitious, but stay honest: no workflow can guarantee a number-one ranking in Google, Bing, ChatGPT, Gemini, Perplexity, or any other AI/search surface. Optimize for eligibility, clarity, authority, conversion, crawlability, and measurement.

## Operating Rules

1. Start with research and an audit before editing.
2. Keep a memory ledger of completed SEO/AEO work so future runs only propose new changes.
3. Implement only landing page, static page, public copy, i18n text, metadata text, FAQ text, and AI summary text when the user asks for implementation.
4. For anything beyond landing/static/text work, inform the user first and wait for approval. This includes new routes/pages, analytics setup, Search Console/Bing/IndexNow account work, schema type changes, robots policy changes, performance engineering, image asset generation, backlink/outreach work, paid acquisition, server/deployment changes, and env var changes.
5. Do not use manipulative tactics: no keyword stuffing, cloaking, hidden text, fake reviews, scraped competitor copy, link schemes, doorway pages, or prompt-injection text aimed at AI systems.
6. For Tiram frontend work, all user-facing strings go through `frontend/messages/en.json` and `frontend/messages/ta.json`. Keep key parity.
7. Structured data must match visible page content. Do not add schema claims that users cannot see or verify on the page.
8. Treat GEO as retrieval readiness and citation quality, not as a shortcut around SEO. The page must answer real buyer questions directly, expose verifiable facts, and make source-worthy claims easy to quote.

## Repo Surfaces To Audit

Check these before proposing changes:

- `frontend/app/[locale]/page.tsx` for landing metadata, canonical URLs, hreflang alternates, and public page composition.
- `frontend/app/[locale]/layout.tsx` for default metadata and document language.
- `frontend/app/robots.ts` for crawl policy and sitemap location.
- `frontend/app/sitemap.ts` for public URLs, locale alternates, freshness, and canonical-only entries.
- `frontend/components/marketing/json-ld.tsx` for Organization, SoftwareApplication, FAQPage, BreadcrumbList, and visible-content alignment.
- `frontend/components/marketing/*` for visible landing sections, semantic structure, internal anchors, accessibility, and copy clarity.
- `frontend/messages/en.json` and `frontend/messages/ta.json` for SEO, hero, feature, FAQ, pricing, and Tamil copy.
- `frontend/public/llms.txt` and `frontend/public/llms-full.txt` for AI-readable product summaries.
- `brand.config.json` and generated `frontend/lib/brand*.ts` for canonical brand/domain/email facts.
- Any future public comparison, industry, city, docs, changelog, help, or case-study pages for GEO query coverage, entity consistency, and citation-worthy proof.

## Authoritative Research Sources

When internet access is available, refresh the research against current docs instead of relying only on memory:

- Google Search Essentials: technical requirements, spam policies, and key best practices.
- Google SEO Starter Guide: crawlability, useful content, titles, snippets, images, internal links, and duplicate URL handling.
- Google structured data docs: JSON-LD, rich result eligibility, and requirement that markup matches visible content.
- Google AI features docs: AI Overviews and AI Mode use normal Search eligibility; no special AI markup is required.
- Bing Webmaster Guidelines: Copilot/grounding relies on the same discovery, freshness, canonical, structure, and content-quality signals.
- OpenAI crawler docs: distinguish `OAI-SearchBot` for ChatGPT search visibility from `GPTBot` for training permissions.
- llms.txt proposal: use `/llms.txt` as a concise, Markdown, LLM-readable product map; treat it as complementary to sitemap and robots, not a ranking guarantee.
- Perplexity, ChatGPT search, Copilot, and Google AI Overviews behavior as observable systems: inspect which sources are cited, what answer formats appear, which facts are retrieved, and where Tiram lacks crawlable proof.

## GEO Requirements

GEO means Generative Engine Optimization: preparing public content so AI answer engines can retrieve, summarize, compare, and cite it accurately. GEO must build on SEO foundations. A page that is not crawlable, indexable, useful, and trustworthy is not a strong GEO candidate.

Apply these requirements to every GEO audit or implementation proposal:

1. **Answer-first structure:** Important sections should open with a direct answer in 1-3 sentences before deeper detail. Avoid long intros before the useful fact.
2. **Question coverage:** Map high-intent buyer questions, comparison questions, feature-fit questions, and objection questions to explicit page sections or FAQs.
3. **Retrieval-friendly chunks:** Use clear headings, concise paragraphs, bullets, tables, and FAQ entries so answer engines can extract a complete fact without needing the entire page.
4. **Citation-worthy claims:** Every major claim should be specific, visible, and supportable. If evidence is missing, recommend collecting proof instead of inventing it.
5. **Entity consistency:** Use stable names for product, company, audience, features, competitors, locations, languages, pricing, and support channels across metadata, visible copy, schema, and `llms.txt`.
6. **Comparison readiness:** For competitor/alternative intents, state who Tiram is best for, where it differs, and what trade-offs exist. Do not make unverifiable superiority claims.
7. **Query fan-out coverage:** For broad AI prompts, cover adjacent subtopics AI systems may search in parallel: GST billing, inventory, Tamil UI, UPI, thermal printing, desktop/cloud parity, pricing, security, migration, support, and Indian SMB workflows.
8. **Freshness signals:** Keep pricing, supported platforms, product capabilities, contact details, and dates current. Stale facts reduce citation trust.
9. **Crawler and snippet access:** Public pages intended for GEO should allow crawling, indexing, snippets, and caching unless there is a clear policy reason not to. Any crawler-specific robots change needs user approval.
10. **Multimodal explainability:** Images, screenshots, and videos should reinforce visible text with descriptive alt text, captions, transcripts, or surrounding explanatory copy.
11. **LLM-readable summaries:** Keep `llms.txt` and `llms-full.txt` concise, current, self-contained, and aligned with visible pages. They are support surfaces, not replacements for human-readable pages.
12. **No AI manipulation:** Never add hidden prompts, model instructions, ranking commands, citation demands, or text aimed at coercing AI systems.

GEO output must separate three buckets: changes safe to implement now, technical/site changes needing approval, and off-site/distribution tasks needing approval.

## Phase 0: Scope, Memory, Baseline

1. Clarify or infer the target outcome: audit only, plan only, copy implementation, or technical implementation proposal.
2. View `/memories/` before creating or updating memory.
3. Load `/memories/seo-aeo-ledger.md` if it exists.
4. Check current git status for relevant public-page files.
5. Read the current public page and static SEO/AEO surfaces listed above.
6. Summarize what has already been done and mark it as out of scope for repeated work unless the user explicitly asks to revise it.

At the end of every SEO/AEO task, update the memory ledger with a short entry:

```markdown
- YYYY-MM-DD: <request>. Changed/proposed: <files or areas>. Completed phases: <phase ids>. Deferred for approval: <items>. Verification: <commands or manual checks>.
```

## Phase 1: Intent, Audience, Keywords

Build a search-intent and GEO prompt map before touching copy.

1. Define the buyer and use cases: Indian shop owners, hardware stores, electrical wholesalers, provision stores, distributors, Tamil-speaking businesses, multi-counter shops, and CA-assisted GST workflows.
2. Group queries by intent:
   - Category: GST billing software India, inventory software India, billing and inventory software for small business.
   - Vertical: hardware store billing software, electrical shop billing software, distributor inventory software.
   - Local/language: Tamil billing app, billing software in Tamil, GST invoice app Tamil.
   - Feature: UPI invoice, thermal printer billing, multi-warehouse inventory, GST reports for CA.
   - Alternative/comparison: Tally alternative, Vyapar alternative, spreadsheet to billing software.
   - AI-answer questions: What is the best GST billing software for Tamil-speaking shop owners? Which billing software supports thermal printing and multi-warehouse stock?
3. Map generative prompts by answer type:
   - Direct recommendation: best GST billing software for Indian SMBs.
   - Comparison: Tiram vs Tally/Vyapar/spreadsheets for shop billing and inventory.
   - Feature fit: software that supports Tamil receipts, UPI QR, 80mm thermal printing, and multi-warehouse stock.
   - Workflow advice: how to move from paper ledger or spreadsheet billing to GST-ready software.
   - Objection handling: pricing, desktop/cloud choice, data security, CA reports, and support.
4. Identify the primary page intent for each URL. One URL should answer one main topic.
5. Prefer natural buyer language over exact-match keyword repetition.

Output: a prioritized keyword/prompt/intent matrix with target page, user question, buyer stage, AI answer type, and evidence needed.

## Phase 2: Entity And Positioning

Make the product entity easy for crawlers, knowledge systems, and AI systems to understand.

1. Define the canonical entity facts:
   - Product: Tiram.
   - Category: billing and inventory software for Indian SMBs.
   - Audience: shop owners, distributors, and small businesses in India.
   - Differentiators: GST-ready, UPI-native, multi-warehouse, Tamil + English, thermal/A4 printing, role-based multi-org access, daily revenue/margin reports.
   - Canonical site: from `brand.config.json` or `SITE_URL` fallback.
2. Check that the same facts appear consistently in visible copy, metadata, JSON-LD, and `llms.txt`.
3. Build a GEO fact table: claim, visible source, schema/source file, proof status, freshness status, and whether it is safe for AI citation.
4. Flag ambiguous claims, unsupported superlatives, or missing proof.
5. Do not invent testimonials, customer counts, certifications, awards, ratings, or compliance claims.

Output: entity fact sheet, GEO fact table, and consistency gaps.

## Phase 3: Technical SEO Audit

Audit crawl/index foundations.

1. Confirm public pages are indexable and not accidentally blocked by `robots.ts`, middleware, auth redirects, or locale handling.
2. Confirm canonical URLs are stable and use the production domain.
3. Confirm hreflang alternates include all supported locales and `x-default`.
4. Confirm sitemap includes only canonical, public, indexable URLs and omits authenticated app routes.
5. Confirm important content is rendered as text, not only inside canvas/images/client-only widgets.
6. Confirm mobile layout, page experience, and Core Web Vitals risks are considered.
7. Confirm images/assets have meaningful alt text where they carry information.
8. Check titles and meta descriptions for uniqueness, accuracy, and click value.

Output: technical findings ordered by impact and risk.

## Phase 4: Landing And Static Content Optimization

Improve the page for buyers first, search second.

1. Put the main answer early: what Tiram is, who it is for, and why it is different.
2. Align H1, hero copy, metadata, and first viewport with the primary intent.
3. Add or refine sections that answer buying questions: GST support, Tamil support, UPI receipts, thermal printing, inventory/warehouse handling, migration from spreadsheets/Tally/Vyapar, pricing, desktop/cloud parity, data security, and support.
4. Strengthen FAQ with real high-intent questions and concise answers.
5. Add answer-first copy blocks where a generative engine could quote a complete answer without losing context.
6. Keep Tamil natural and business-friendly. If Tamil quality is uncertain, use the `tamil-i18n` agent for review.
7. Keep copy specific and provable. Replace vague claims with concrete capabilities.
8. Avoid clutter. Do not add columns or sections just because a keyword exists.

Allowed implementation in this phase: visible landing/static copy, i18n message updates, metadata strings, FAQ text, and public AI summary text.

Output: revised copy map or applied content diff.

## Phase 5: Structured Data And AEO

Make page facts machine-readable without overstating them.

1. Validate existing JSON-LD for Organization, SoftwareApplication, FAQPage, and BreadcrumbList.
2. Ensure FAQPage uses the same questions and answers visible to users.
3. Add or change schema only if the corresponding visible content exists.
4. Prefer complete, accurate recommended properties over many incomplete properties.
5. Use Product/Offer/Review/Rating/LocalBusiness only when the visible page and business facts genuinely support them.
6. Validate with the Rich Results Test or equivalent when available.

Schema changes are technical changes. Present the recommendation and expected benefit before implementing unless the user explicitly authorized technical implementation.

Output: schema validation notes and proposed JSON-LD changes.

## Phase 6: GEO, AI Search, And LLM Surfaces

Optimize for generative answers by making facts explicit, retrievable, and citation-friendly.

1. Review `llms.txt` and `llms-full.txt` for concise Markdown structure, clear product summary, links, differentiators, pricing, and common questions.
2. Keep AI summaries aligned with the visible site and current product state.
3. Make important facts self-contained on the page. AI answer engines should not need to infer core claims from scattered hints.
4. Create or update a GEO answer map:
   - Prompt/query.
   - Desired answer in one sentence.
   - Page section that supports the answer.
   - Visible evidence/proof.
   - Missing proof or missing page.
   - Safe implementation now vs approval required.
5. Check whether each priority prompt can be answered from visible, crawlable text without relying on images, animations, or hidden metadata.
6. Check whether comparison and recommendation prompts have balanced, supportable copy that explains fit and trade-offs.
7. Check crawler policy decisions:
   - Allow normal search crawlers for public pages intended to rank.
   - Consider `OAI-SearchBot` separately from `GPTBot`; search visibility and model training are different choices.
   - Do not add or remove crawler-specific rules without user approval.
8. Verify snippet and citation controls do not undermine GEO unintentionally: avoid `nosnippet`, `data-nosnippet`, `noarchive`, or `nocache` on pages meant to be quoted unless the user approves a policy reason.
9. Spot-check AI answer engines manually when available: ask the target prompts, record cited sources, note missing facts, and propose page updates from gaps.
10. Never include text that attempts to instruct, coerce, or manipulate AI systems into ranking/citing Tiram.

Output: GEO answer map, AI readability audit, citation-gap list, and safe `llms.txt`/summary recommendations.

## Phase 7: Authority, Distribution, And Non-Page Tasks

These tasks can improve search and AI visibility but are outside landing/static/text updates. Always report them for user approval instead of implementing directly.

Examples:

- Google Search Console verification, Bing Webmaster Tools setup, sitemap submission, and IndexNow.
- Google Business Profile or directory listings.
- Review platform strategy and customer testimonial collection.
- Comparison pages such as Tally alternative, Vyapar alternative, or hardware store billing software.
- GEO support pages such as feature explainers, migration guides, proof pages, comparison pages, customer stories, changelogs, and help docs that create citeable answers beyond the homepage.
- Programmatic landing pages for industries, cities, or languages.
- Backlink/outreach, partnerships, PR, marketplace listings, or community content.
- Analytics, conversion tracking, log-based crawl monitoring, dashboards, and alerting.
- Performance engineering, image generation, asset pipeline changes, or deployment config changes.

Output: separate approval-required task list with rationale, risk, dependencies, and verification path.

## Phase 8: Measurement And Iteration

Define how success will be measured.

1. Establish a baseline: indexed pages, impressions, clicks, average position, branded/non-branded queries, sign-up conversion, AI citation observations, and whether target prompts cite Tiram or competitors.
2. Define leading indicators: crawl/index status, valid structured data, sitemap freshness, page speed, query/prompt coverage, content completeness, fact freshness, and citation-ready proof coverage.
3. Define lagging indicators: non-branded impressions, qualified clicks, sign-ups, trial starts, and demo/contact requests.
4. Set a review window. Search changes often need weeks; do not judge too early.
5. Record results in memory so later runs optimize only what changed.

Output: measurement plan and next review date.

## Default Output Format

When invoked, return this structure:

```markdown
## SEO/AEO Research Summary
- Goal:
- Scope:
- Already done from memory:
- Main opportunity:

## Current Audit
| Area | Status | Finding | Impact |
|---|---|---|---|

## Intent And Entity Strategy
| Query/Prompt | Intent | Target page | Recommended answer/proof |
|---|---|---|---|

## GEO Answer Map
| Prompt | Expected answer | Supporting source | Citation gap | Next action |
|---|---|---|---|---|

## Phased Plan
| Phase | Recommendation | Impact | Effort | Files/Surfaces | Can implement now? |
|---|---|---:|---:|---|---|

## Approval Required Before Implementation
- <non-text or external task>

## Implemented Changes
- <only when changes were made>

## Verification
- <commands run or manual checks>

## Memory Update
- <ledger entry written>
```

## Verification Commands

Use the smallest reliable verification set for the change:

- `cd frontend && npm run check:i18n` after message changes.
- `cd frontend && npm run typecheck` after TypeScript or metadata changes.
- `cd frontend && npm run build` for sitemap/robots/metadata/schema changes when feasible.
- Manually inspect generated `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and landing page HTML when a dev server is available.
- Use Rich Results Test, Search Console URL Inspection, Bing Webmaster Tools, PageSpeed Insights, and AI search spot checks when external access/account setup is available.

## Example Prompts

- `/seo-aeo-research Audit Tiram's landing page for SEO and AI search visibility. Do not implement yet.`
- `/seo-aeo-research Optimize the landing page copy for Tamil-speaking GST billing software buyers; implement only i18n text changes.`
- `/seo-aeo-research Review robots, sitemap, JSON-LD, and llms.txt. Tell me which technical tasks need approval before implementation.`
- `/seo-aeo-research Build a 30-day SEO/AEO plan to make Tiram the most discoverable GST billing and inventory product for Indian SMBs.`
