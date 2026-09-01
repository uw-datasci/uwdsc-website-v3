import Image from "next/image";
import { cn } from "@uwdsc/ui/lib/utils";
import type { SlideVisual } from "../../types";

interface SlideVisualSwatchProps {
  readonly visual: SlideVisual;
  readonly size: number;
  readonly className?: string;
}

/**
 * placeholder
 */
export function SlideVisualSwatch({ visual, size, className }: SlideVisualSwatchProps) {
  if (visual.icon) {
    return (
      <Image
        src={visual.icon}
        alt=""
        width={size}
        height={size}
        className={cn("shrink-0 object-contain", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn("shrink-0", className)}
      style={{ backgroundColor: visual.color, width: size, height: size }}
    />
  );
}
