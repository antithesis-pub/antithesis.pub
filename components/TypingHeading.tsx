"use client";

import { useEffect, useState } from "react";

type TypingHeadingProps = {
  text: string;
  delayMs?: number;
  className?: string;
};

export function TypingHeading({
  text,
  delayMs = 0,
  className = "",
}: TypingHeadingProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let timeoutId: number | undefined;
    let intervalId: number | undefined;

    const start = () => {
      let i = 0;
      intervalId = window.setInterval(() => {
        i += 1;
        setDisplay(text.slice(0, i));
        if (i >= text.length && intervalId) {
          window.clearInterval(intervalId);
        }
      }, 60); // typing speed
    };

    if (delayMs > 0) {
      timeoutId = window.setTimeout(start, delayMs);
    } else {
      start();
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, delayMs]);

  return (
    <h1
      className={`text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-300 ${className}`}
    >
      {display}
      <span className="border-r border-zinc-500 ml-0.5 animate-pulse" />
    </h1>
  );
}