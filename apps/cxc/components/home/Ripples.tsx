"use client";

import React from "react";
import { motion } from "framer-motion";

interface RippleGroupProps {
  cx: number;
  cy: number;
  outerRx: number;
  outerRy: number;
  innerRx: number;
  innerRy: number;
  count: number;
  solidCount?: number;
  opacity?: number;
  scale?: number;
  delayOffset?: number;
}

const generateRings = (
  outerRx: number,
  outerRy: number,
  innerRx: number,
  innerRy: number,
  count: number,
  solidCount = 2
) => {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const rx = lerp(innerRx, outerRx, t);
    const ry = lerp(innerRy, outerRy, t);
    const isSolid = i < solidCount;
    const cyOffset = t * 20; // downward offset for visual depth
    return { rx, ry, dashed: !isSolid, cyOffset };
  });
};

const RippleGroup = ({
  cx,
  cy,
  outerRx,
  outerRy,
  innerRx,
  innerRy,
  count,
  solidCount = 2,
  opacity = 1,
  scale = 1,
  delayOffset = 0,
}: RippleGroupProps) => {
  const rings = generateRings(outerRx, outerRy, innerRx, innerRy, count, solidCount);

  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 600"
      width="100%"
      height="360"
      className="absolute pointer-events-none"
      style={{ opacity, transform: `scale(${scale})` }}
    >
      {rings.map((r, i) => (
        <motion.ellipse
          key={i}
          cx={cx}
          cy={cy + r.cyOffset}
          rx={r.rx}
          ry={r.ry}
          fill="none"
          stroke="currentColor"
          strokeWidth={3} // thicker lines
          strokeDasharray={r.dashed ? "6 8" : undefined}
          className="text-white"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delayOffset + i * 0.15,
          }}
        />
      ))}
    </svg>
  );
};

interface RipplesProps {
  height?: number;
}

export default function Ripples({ height = 200 }: RipplesProps) {
  return (
    <div className="relative w-full" style={{ height }}>
      {/* Medium Left Ripple */}
      <div className="absolute -left-[16%] top-[50%] -translate-y-1/2 scale-[1] opacity-70 w-[500px] h-[360px]">
        <RippleGroup
          cx={600}
          cy={300}
          outerRx={400}
          outerRy={120}
          innerRx={250}
          innerRy={50}
          count={4}
          solidCount={2}
          delayOffset={0.2}
        />
      </div>

      {/* Small Center Ripple (higher) */}
      <div className="absolute left-1/2 top-[33%] -translate-x-1/2 -translate-y-1/2 scale-[0.7] opacity-60 w-[500px] h-[360px]">
        <RippleGroup
          cx={600}
          cy={300}
          outerRx={200}
          outerRy={60}
          innerRx={140}
          innerRy={40}
          count={2}
          solidCount={2}
          delayOffset={0}
        />
      </div>

      {/* Large Right Ripple */}
      <div className="absolute -right-[16%] top-[52%] -translate-y-1/2 scale-[1.1] opacity-80 w-[500px] h-[360px]">
        <RippleGroup
          cx={600}
          cy={300}
          outerRx={500}
          outerRy={150}
          innerRx={250}
          innerRy={60}
          count={5}
          solidCount={3}
          delayOffset={0.4}
        />
      </div>
    </div>
  );
}
