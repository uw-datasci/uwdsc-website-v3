"use client";

import { useEffect, useState } from "react";

interface TypingProps {
  text: string;
  speed?: number;
  caretSize?: string;
  className?: string;
}

export default function Typing({
  text,
  speed = 75,
  caretSize,
  className = "",
}: TypingProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span
        className={`inline-block cursor-blink ${caretSize ? caretSize : ""}`}
      >
        |
      </span>
    </span>
  );
}
