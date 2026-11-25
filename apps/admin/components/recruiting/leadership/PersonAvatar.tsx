import { Avatar, AvatarFallback, cn } from "@uwdsc/ui";
import { initials } from "@/lib/utils/recruiting";

/** Initials avatar for roster rows. */
export function PersonAvatar({
  name,
  className,
}: {
  readonly name: string;
  readonly className?: string;
}) {
  return (
    <Avatar aria-hidden className={cn("size-8 flex-none", className)}>
      <AvatarFallback className="text-[11px] font-semibold">
        {initials(name) || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
