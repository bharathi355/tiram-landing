"use client";

/**
 * Reusable motion primitives for the marketing landing page.
 *
 * These wrap framer-motion in small, opinionated components that keep the
 * section files declarative. Every animation gates on `useInView({ once: true })`
 * so the page does not re-animate on scroll-back, and respects
 * `prefers-reduced-motion` via the `useReducedMotion` hook — when reduced
 * motion is requested, components render their final state immediately.
 */

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET = 24;

function variantsFor(direction: Direction): Variants {
  const hidden: Record<string, number> = { opacity: 0 };
  if (direction === "up") hidden.y = OFFSET;
  if (direction === "down") hidden.y = -OFFSET;
  if (direction === "left") hidden.x = OFFSET;
  if (direction === "right") hidden.x = -OFFSET;
  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as: Tag = "div",
  amount = 0.25,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  as?: ElementType;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  // Memoise the motion-wrapped tag — calling `motion(Tag)` inline returns a
  // new component identity on every render, which makes React tear down and
  // remount the DOM subtree (visible as a flicker whenever a parent updates
  // unrelated state, e.g. the pricing toggle).
  const MotionTag = useMemo(() => motion(Tag), [Tag]);
  const variants = variantsFor(reduce ? "none" : direction);

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

const STAGGER_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StaggerContainer({
  children,
  className,
  as: Tag = "div",
  stagger = 0.08,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: number;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  const MotionTag = useMemo(() => motion(Tag), [Tag]);

  const variants: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: 0.05 },
        },
      };

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const MotionTag = useMemo(() => motion(Tag), [Tag]);
  const variants: Variants = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : STAGGER_ITEM;
  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  );
}

/**
 * Animates a number from 0 → `value` once it enters the viewport.
 * `value` is the numeric end state; `prefix`/`suffix` are static strings
 * displayed around it (e.g. `₹`, `s`, `×`). For non-numeric metrics
 * (e.g. "Daily"), pass `value={null}` and the component renders the label
 * from `children` directly without animating.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className,
  fallback,
}: {
  value: number | null;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  fallback?: ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });
  const rounded = useTransform(spring, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === null) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue, reduce]);

  useEffect(() => {
    return rounded.on("change", (latest) => setDisplay(latest));
  }, [rounded]);

  if (value === null) {
    return (
      <span ref={ref} className={className}>
        {fallback}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/**
 * Infinite horizontal marquee. Children are rendered twice and translated
 * with a CSS keyframe (`animate-marquee`) defined in globals.css so it
 * keeps running off the main thread. Pauses on hover for accessibility
 * and disables itself on `prefers-reduced-motion`.
 */
export function Marquee({
  children,
  className,
  pauseOnHover = true,
  speedSeconds = 40,
}: {
  children: ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  speedSeconds?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`group relative flex overflow-hidden ${className ?? ""}`}
      // Pointer events are forwarded to the inner track via class.
    >
      <div
        className={`flex shrink-0 items-center gap-10 pr-10 ${
          reduce ? "" : "motion-safe:animate-marquee"
        } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{ animationDuration: `${speedSeconds}s` }}
        aria-hidden={false}
      >
        {children}
      </div>
      <div
        className={`flex shrink-0 items-center gap-10 pr-10 ${
          reduce ? "" : "motion-safe:animate-marquee"
        } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{ animationDuration: `${speedSeconds}s` }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}

export { motion, AnimatePresence, useReducedMotion, useInView };
