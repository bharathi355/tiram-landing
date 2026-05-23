"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

type Direction = "up" | "left" | "none";

function enterVars(direction: Direction): CSSProperties {
  if (direction === "left") return { "--enter-x": "24px", "--enter-y": "0" } as CSSProperties;
  if (direction === "none") return { "--enter-x": "0", "--enter-y": "0" } as CSSProperties;
  return { "--enter-x": "0", "--enter-y": "16px" } as CSSProperties;
}

export function FadeSlideIn({
  children,
  className,
  delay = 0,
  direction = "up",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  as?: ElementType;
}) {
  const style = {
    ...enterVars(direction),
    animationDelay: `${delay}ms`,
  } as CSSProperties;

  return (
    <Tag className={`animate-fade-slide-in ${className ?? ""}`} style={style}>
      {children}
    </Tag>
  );
}

export function CssMarquee({
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
  const trackClassName = `flex shrink-0 items-center gap-10 pr-10 animate-marquee ${
    pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
  }`;

  return (
    <div className={`group relative flex overflow-hidden ${className ?? ""}`}>
      <div
        className={trackClassName}
        style={{ animationDuration: `${speedSeconds}s` }}
        aria-hidden={false}
      >
        {children}
      </div>
      <div
        className={trackClassName}
        style={{ animationDuration: `${speedSeconds}s` }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}