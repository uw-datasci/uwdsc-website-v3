import { cn } from "@uwdsc/ui";
import { PROJECT_TOPICS, type ProjectTopic } from "@/constants/projects";

interface TopicBadgeProps {
  readonly topic: ProjectTopic;
  readonly className?: string;
}

export function TopicBadge({ topic, className }: TopicBadgeProps) {
  const { label, badgeClass } = PROJECT_TOPICS[topic];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        badgeClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
