import { cn } from "@uwdsc/ui";
import type { PillarId } from "@/constants/workshops";

interface MotifProps {
  readonly className?: string;
}

/** A DataFrame: index gutter, filled header row, outlined body rows, one selected column. */
function DataFrameMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <rect x="8" y="12" width="10" height="76" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="22" y="12" width="70" height="14" rx="2" fill="currentColor" opacity="0.9" />
      <rect
        x="22"
        y="30"
        width="70"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.35"
      />
      <rect
        x="22"
        y="50"
        width="70"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.35"
      />
      <rect
        x="22"
        y="70"
        width="70"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.35"
      />
      <rect x="58" y="30" width="16" height="56" rx="2" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

/** A trend line with markers riding over low-opacity bars — stands in for viz / storytelling. */
function ChartMotif({ className }: MotifProps) {
  const bars = [
    { x: 10, h: 30 },
    { x: 26, h: 46 },
    { x: 42, h: 22 },
    { x: 58, h: 58 },
    { x: 74, h: 38 },
  ];
  const points = "14,58 30,42 46,50 62,26 78,34";

  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={88 - bar.h}
          width="10"
          height={bar.h}
          rx="2"
          fill="currentColor"
          opacity="0.25"
        />
      ))}
      <polyline
        points={points}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {points.split(" ").map((point) => {
        const [x, y] = point.split(",");
        return <circle key={point} cx={x} cy={y} r="3.5" fill="currentColor" opacity="0.9" />;
      })}
    </svg>
  );
}

/** A rising scatter with a fit line and residual ticks — stands in for regression / ML foundations. */
function RegressionMotif({ className }: MotifProps) {
  const dots: [number, number][] = [
    [10, 82],
    [18, 68],
    [24, 74],
    [32, 60],
    [40, 64],
    [48, 50],
    [56, 46],
    [64, 38],
    [72, 42],
    [82, 24],
  ];

  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <line
        x1="6"
        y1="88"
        x2="90"
        y2="16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />
      <line
        x1="40"
        y1="64"
        x2="40"
        y2="55"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="64"
        y1="38"
        x2="64"
        y2="46"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="currentColor" opacity="0.55" />
      ))}
    </svg>
  );
}

/** A left-to-right 3-4-2 node network — stands in for deep learning / neural nets. */
function NetworkMotif({ className }: MotifProps) {
  const layers = [
    [24, 50, 76],
    [16, 38, 62, 84],
    [38, 62],
  ];
  const xs = [16, 50, 84];

  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      {layers.flatMap((layer, i) => {
        const next = layers[i + 1];
        const nextX = xs[i + 1];
        if (!next || nextX === undefined) return [];
        return layer.flatMap((y) =>
          next.map((ny) => (
            <line
              key={`${i}-${y}-${ny}`}
              x1={xs[i]}
              y1={y}
              x2={nextX}
              y2={ny}
              stroke="currentColor"
              strokeWidth="1.25"
              opacity="0.25"
            />
          ))
        );
      })}
      {layers.flatMap((layer, i) =>
        layer.map((y) => (
          <circle
            key={`n-${i}-${y}`}
            cx={xs[i]}
            cy={y}
            r="6"
            fill="currentColor"
            opacity={i === 1 ? 0.9 : 0.65}
          />
        ))
      )}
    </svg>
  );
}

/** A database cylinder feeding a funnel into a clean stacked table — stands in for working with real data. */
function PipelineMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <ellipse
        cx="18"
        cy="24"
        rx="12"
        ry="5"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.8"
      />
      <path
        d="M6 24 V50 C6 53 11 55 18 55 C25 55 30 53 30 50 V24"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.8"
      />
      <ellipse
        cx="18"
        cy="50"
        rx="12"
        ry="5"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.4"
      />
      <path
        d="M36 38 H50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M46 32 L52 38 L46 44"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path d="M58 20 H82 L74 44 H66 Z" fill="currentColor" opacity="0.3" />
      <path
        d="M84 62 H92"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M86 56 L92 62 L86 68"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <rect x="10" y="64" width="80" height="10" rx="2" fill="currentColor" opacity="0.9" />
      <rect
        x="10"
        y="78"
        width="80"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.4"
      />
    </svg>
  );
}

/** A branching-and-merging DAG — stands in for end-to-end applied project pipelines. */
function DagMotif({ className }: MotifProps) {
  const nodes: [number, number][] = [
    [10, 50],
    [42, 22],
    [42, 78],
    [70, 50],
    [90, 50],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
  ];

  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      {edges.map(([from, to]) => {
        const a = nodes[from];
        const b = nodes[to];
        if (!a || !b) return null;
        return (
          <line
            key={`${from}-${to}`}
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.35"
          />
        );
      })}
      {nodes.map(([x, y], i) => (
        <rect
          key={`${x}-${y}`}
          x={x - 8}
          y={y - 8}
          width="16"
          height="16"
          rx="4"
          fill="currentColor"
          opacity={i === 3 ? 0.9 : 0.6}
        />
      ))}
    </svg>
  );
}

const MOTIFS: Record<PillarId, (props: MotifProps) => React.JSX.Element> = {
  "python-pandas": DataFrameMotif,
  "data-viz": ChartMotif,
  "ml-foundations": RegressionMotif,
  "deep-learning": NetworkMotif,
  "real-data": PipelineMotif,
  "applied-projects": DagMotif,
};

interface PillarMotifProps {
  readonly pillar: PillarId;
  readonly className?: string;
}

export function PillarMotif({ pillar, className }: PillarMotifProps) {
  const Motif = MOTIFS[pillar];

  return <Motif className={cn("h-full w-full", className)} />;
}
