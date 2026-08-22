import { cn } from "@uwdsc/ui";
import type { ProjectTopic } from "@/constants/projects";

interface MotifProps {
  readonly className?: string;
}

/** A stream of variable-width token bars — stands in for NLP / language. */
function NlpMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <rect x="10" y="14" width="70" height="10" rx="5" fill="currentColor" opacity="0.9" />
      <rect x="10" y="32" width="46" height="10" rx="5" fill="currentColor" opacity="0.7" />
      <rect x="10" y="50" width="80" height="10" rx="5" fill="currentColor" opacity="0.5" />
      <rect x="10" y="68" width="32" height="10" rx="5" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

/** Nested bounding boxes over a dot grid — stands in for computer vision / detection. */
function ComputerVisionMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      {[18, 38, 58, 78].flatMap((y) =>
        [18, 38, 58, 78].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="currentColor" opacity="0.35" />
        )),
      )}
      <rect
        x="12"
        y="12"
        width="76"
        height="76"
        rx="8"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.4"
      />
      <rect
        x="30"
        y="28"
        width="44"
        height="40"
        rx="6"
        stroke="currentColor"
        strokeWidth="3.5"
        opacity="0.9"
      />
    </svg>
  );
}

/** A bipartite graph — two node columns with crossing edges — stands in for recommendation systems. */
function RecommendationMotif({ className }: MotifProps) {
  const left = [16, 50, 84];
  const right = [22, 50, 78];

  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      {left.flatMap((ly) =>
        right.map((ry) => (
          <line
            key={`${ly}-${ry}`}
            x1="20"
            y1={ly}
            x2="80"
            y2={ry}
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.35"
          />
        )),
      )}
      {left.map((y) => (
        <circle key={`l-${y}`} cx="20" cy={y} r="6" fill="currentColor" opacity="0.9" />
      ))}
      {right.map((y) => (
        <circle key={`r-${y}`} cx="80" cy={y} r="6" fill="currentColor" opacity="0.9" />
      ))}
    </svg>
  );
}

/** Three clustered scatter groups — stands in for unsupervised learning / clustering. */
function UnsupervisedMotif({ className }: MotifProps) {
  const clusterA = [
    [18, 20],
    [28, 14],
    [24, 30],
    [12, 32],
  ];
  const clusterB = [
    [70, 18],
    [82, 24],
    [76, 34],
    [88, 12],
  ];
  const clusterC = [
    [40, 70],
    [52, 78],
    [46, 60],
    [58, 66],
  ];

  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="22" cy="24" r="18" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <circle cx="79" cy="22" r="18" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <circle cx="49" cy="69" r="18" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      {[...clusterA, ...clusterB, ...clusterC].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="currentColor" opacity="0.85" />
      ))}
    </svg>
  );
}

const MOTIFS: Record<ProjectTopic, (props: MotifProps) => React.JSX.Element> = {
  nlp: NlpMotif,
  "computer-vision": ComputerVisionMotif,
  "recommendation-systems": RecommendationMotif,
  "unsupervised-learning": UnsupervisedMotif,
};

interface TopicMotifProps {
  readonly topic: ProjectTopic;
  readonly className?: string;
}

export function TopicMotif({ topic, className }: TopicMotifProps) {
  const Motif = MOTIFS[topic];

  return <Motif className={cn("h-full w-full", className)} />;
}
