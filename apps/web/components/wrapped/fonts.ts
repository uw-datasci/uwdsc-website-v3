import { Tilt_Warp, Atkinson_Hyperlegible_Mono } from "next/font/google";

export const tiltWarp = Tilt_Warp({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tilt-warp"
});

export const atkinsonHyperlegibleMono = Atkinson_Hyperlegible_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-atkinson-mono",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "monospace"]
});

export const displayFontClass = "font-[family-name:var(--font-tilt-warp)]";
export const monoFontClass = "font-[family-name:var(--font-atkinson-mono)]";
