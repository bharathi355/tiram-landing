"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";
import { supportWhatsappUrl } from "@/lib/brand";
import { ScrollReveal, AnimatePresence, motion } from "../shell/motion";

// Optional `more` field lets a FAQ item deep-link to a long-form article.
// Only the GST FAQ uses it today (linking to gstr-1-vs-gstr-3b-difference);
// other items omit it and render unchanged. The FAQPage JSON-LD emitter
// reads only `q` and `a`, so the deep-link is a visible-UI enhancement and
// does not contaminate the structured-data answer text.
type Item = {
  q: string;
  a: string;
  more?: { slug: string; label: string };
};

export function Faq() {
  const t = useTranslations("landing.faq");
  const locale = useLocale();
  const items = t.raw("items") as Item[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const contactHref = supportWhatsappUrl(t("whatsappMessage"));

  return (
    <section
      id="faq"
      className="bg-slate-50/60 py-20 sm:py-28 dark:bg-slate-900/40"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t("intro")}
          </p>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          delay={0.1}
          className="mt-12 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900"
        >
          {items.map((it, i) => {
            const open = openIndex === i;
            return (
              <div key={i} className="p-1">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-4 text-left text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 dark:text-slate-50 dark:hover:bg-slate-800/50"
                >
                  <span>{it.q}</span>
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex-none"
                  >
                    <ChevronDown
                      className="h-4 w-4 text-slate-500"
                      aria-hidden
                    />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 px-4 pb-4">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {it.a}
                        </p>
                        {it.more ? (
                          <p className="text-sm">
                            <a
                              href={`/${locale}/articles/${it.more.slug}`}
                              className="font-medium text-accent-600 underline-offset-2 hover:text-accent-500 hover:underline dark:text-accent-400"
                            >
                              → {it.more.label}
                            </a>
                          </p>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15} className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
            {t("contactPrompt")}
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t("contactBody")}
          </p>
          <a
            data-testid="faq-whatsapp-cta"
            href={contactHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-emerald-500 bg-emerald-500 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/25 dark:border-emerald-400 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {t("contactCta")}
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
