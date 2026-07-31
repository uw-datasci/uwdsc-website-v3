import Image from "next/image";
import { cn } from "@uwdsc/ui/lib/utils";
import { tiltWarp, atkinsonHyperlegibleMono, displayFontClass as display, monoFontClass as mono } from "../../fonts";
import type { FunFactPolaroid, FunFactsSlideData } from "../../types";

interface FunFactsSlideProps {
  readonly slide: FunFactsSlideData;
}

/**
 * Scattered-polaroid "fun facts" slide: 3 overlapping rotated polaroid
 * cards
 *
 * Data injection points (see {@link FunFactsSlideData}):
 * - `slide.heading`: not currently rendered here, dropped to match the
 *   Figma reference, which has no heading on this frame.
 * - `slide.facts`: exactly 3 entries, in slot order [back, middle, front].
 *   Each polaroid's swatch color comes from `fact.visual.color` (or an
 *   image via `visual.icon`), and `fact.label`/`fact.value` render as the
 *   caption below it.
 *
 * Not driven by data: each slot's position and rotation are hardcoded in
 * the `centerX`/`centerY`/`rotate` props passed to `Polaroid` below, so more
 * or fewer than 3 facts will misalign the layout. The slide background is a
 * hardcoded `bg-[#e6c6e0]`.
 */
export function FunFactsSlide({ slide }: FunFactsSlideProps) {
  const [back, middle, front] = slide.facts;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center overflow-hidden bg-[#e6c6e0] px-6 pt-8 pb-6 text-black",
        tiltWarp.variable,
        atkinsonHyperlegibleMono.variable,
      )}
    >
      <div className="relative mt-6 w-full max-w-80 flex-1">
        {back ? <Polaroid fact={back} centerX="30%" centerY="24%" rotate="-4.59deg" /> : null}
        {middle ? <Polaroid fact={middle} centerX="65%" centerY="47%" rotate="12.44deg" /> : null}
        {front ? <Polaroid fact={front} centerX="35%" centerY="74%" rotate="-13.76deg" /> : null}
      </div>
    </div>
  );
}

interface PolaroidProps {
  readonly fact: FunFactPolaroid;
  readonly centerX: string;
  readonly centerY: string;
  readonly rotate: string;
}

function Polaroid({ fact, centerX, centerY, rotate }: PolaroidProps) {
  return (
    <div
      className="absolute inline-flex w-max flex-col items-center bg-white pt-2.5 pr-3.5 pb-5 pl-3.5"
      style={{ left: centerX, top: centerY, transform: `translate(-50%, -50%) rotate(${rotate})` }}
    >
      <div
        className="relative aspect-179/230 w-36 overflow-hidden sm:w-40"
        style={{ backgroundColor: fact.visual.color }}
      >
        {fact.visual.icon ? <Image src={fact.visual.icon} alt="" fill className="object-cover" /> : null}
      </div>
      <div className="mt-2 flex flex-col items-center gap-0.5">
        <p className={cn(mono, "text-center text-[0.625rem] leading-tight whitespace-nowrap text-black")}>{fact.label}</p>
        <p className={cn(display, "text-center text-[0.9375rem] leading-none whitespace-nowrap text-black")}>{fact.value}</p>
      </div>
    </div>
  );
}
