"use client";

import dynamic from "next/dynamic";
import { SectionSkeleton } from "../shared/section-skeleton";

const HowItWorks = dynamic(
  () => import("../sections/how-it-works").then((mod) => mod.HowItWorks),
  { ssr: true, loading: () => <SectionSkeleton minHeight={560} /> },
);
const BuiltForRegion = dynamic(
  () => import("../sections/built-for-region").then((mod) => mod.BuiltForRegion),
  { ssr: true, loading: () => <SectionSkeleton minHeight={560} /> },
);
const WhyTiram = dynamic(
  () => import("../sections/why-tiram").then((mod) => mod.WhyTiram),
  { ssr: true, loading: () => <SectionSkeleton minHeight={400} /> },
);
const Features = dynamic(
  () => import("../sections/features").then((mod) => mod.Features),
  { ssr: true, loading: () => <SectionSkeleton minHeight={720} /> },
);
const Pricing = dynamic(
  () => import("../sections/pricing").then((mod) => mod.Pricing),
  { ssr: true, loading: () => <SectionSkeleton minHeight={760} /> },
);
const Faq = dynamic(
  () => import("../sections/faq").then((mod) => mod.Faq),
  { ssr: true, loading: () => <SectionSkeleton minHeight={700} /> },
);
const FinalCta = dynamic(
  () => import("../sections/final-cta").then((mod) => mod.FinalCta),
  { ssr: true, loading: () => <SectionSkeleton minHeight={360} /> },
);

export const DeferredMarketingFooter = dynamic(
  () => import("./marketing-footer").then((mod) => mod.MarketingFooter),
  { ssr: true, loading: () => <SectionSkeleton minHeight={360} /> },
);

export function MarketingDeferredSections() {
  return (
    <>
      <HowItWorks />
      <BuiltForRegion />
      <WhyTiram />
      <Features />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}