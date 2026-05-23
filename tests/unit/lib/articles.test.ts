/**
 * Tests for the article registry + JSON-LD schema builders. These are pure
 * functions with no React/I/O dependencies, so they're tested directly here
 * rather than via DOM rendering. The page route's emitted <script> tags
 * stringify the same outputs, so verifying the schema shape covers both the
 * <Article> and the <FAQPage> JSON-LD blocks that ship on every article page.
 */
import { describe, expect, it } from "vitest";
import {
  ARTICLES,
  buildArticleFaqSchema,
  buildArticleSchema,
  getArticle,
} from "@/lib/articles";

const SITE_URL = "https://tiram.co.in";

describe("ARTICLES registry", () => {
  it("contains the SEO and demand-generation articles in canonical slug form", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(slugs).toContain("gstr-1-export-tiram");
    expect(slugs).toContain("counter-billing-barcode-quick-bill");
    expect(slugs).toContain("purchase-to-insights-workflow");
    expect(slugs).toContain("gstr-1-vs-gstr-3b-difference");
    expect(slugs).toContain("business-health-dashboard-indian-smb");
  });

  it("uses hyphenated, English-only slugs (no caps, no spaces, no transliteration)", () => {
    for (const a of ARTICLES) {
      expect(a.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("every entry has parseable publishedAt and updatedAt ISO dates", () => {
    for (const a of ARTICLES) {
      expect(Number.isNaN(new Date(a.publishedAt).getTime())).toBe(false);
      expect(Number.isNaN(new Date(a.updatedAt).getTime())).toBe(false);
    }
  });
});

describe("getArticle", () => {
  it("returns the article for a known slug", () => {
    const a = getArticle("gstr-1-vs-gstr-3b-difference");
    expect(a).toBeDefined();
    expect(a?.slug).toBe("gstr-1-vs-gstr-3b-difference");
  });

  it("returns undefined for an unknown slug — the page route uses this to call notFound()", () => {
    expect(getArticle("definitely-not-a-real-article")).toBeUndefined();
  });
});

describe("buildArticleSchema", () => {
  const article = ARTICLES[0];

  it("emits Article schema with the locale-canonical mainEntityOfPage", () => {
    const schema = buildArticleSchema({
      article,
      locale: "en",
      siteUrl: SITE_URL,
      headline: "Test headline",
      description: "Test description",
    });
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("Test headline");
    expect(schema.description).toBe("Test description");
    expect(schema.mainEntityOfPage).toBe(
      `${SITE_URL}/en/articles/${article.slug}`,
    );
    expect(schema.inLanguage).toBe("en-IN");
    // Author/publisher are the Tiram Organization, not a person — we don't
    // attribute articles to individuals.
    expect(schema.author["@type"]).toBe("Organization");
    expect(schema.publisher["@type"]).toBe("Organization");
  });

  it("uses ta-IN as inLanguage for the Tamil locale", () => {
    const schema = buildArticleSchema({
      article,
      locale: "ta",
      siteUrl: SITE_URL,
      headline: "த",
      description: "த",
    });
    expect(schema.inLanguage).toBe("ta-IN");
    expect(schema.mainEntityOfPage).toBe(
      `${SITE_URL}/ta/articles/${article.slug}`,
    );
  });

  it("dates flow from the registry, not from build time", () => {
    const schema = buildArticleSchema({
      article,
      locale: "en",
      siteUrl: SITE_URL,
      headline: "h",
      description: "d",
    });
    expect(schema.datePublished).toBe(article.publishedAt);
    expect(schema.dateModified).toBe(article.updatedAt);
  });
});

describe("buildArticleFaqSchema", () => {
  it("maps the article's FAQ list into the FAQPage shape with one Question per entry", () => {
    const faq = [
      { q: "Q1", a: "A1" },
      { q: "Q2", a: "A2" },
      { q: "Q3", a: "A3" },
    ];
    const schema = buildArticleFaqSchema(faq);
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(3);
    expect(schema.mainEntity[0].name).toBe("Q1");
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe("A1");
    expect(schema.mainEntity[2].acceptedAnswer["@type"]).toBe("Answer");
  });
});
