/**
 * Shape of a single DSC Wrapped slide.
 *
 * This is the seam between the (currently hardcoded) placeholder content and
 * the database-driven content that will replace it later. As long as the data
 * source keeps producing `WrappedSlideData[]`, the rendering and animation
 * code in `WrappedStory`/`WrappedSlide` does not need to change.
 */

interface BaseSlideData {
  /** Stable identifier — also used as the React key and progress-bar key. */
  readonly id: string;
  /**
   * How long this slide stays on screen before auto-advancing, in ms.
   * Optional per-slide override; falls back to {@link DEFAULT_SLIDE_DURATION_MS}.
   */
  readonly durationMs?: number;
}

/** Generic full-bleed headline/stat slide — the original uniform template. */
export interface HeroSlideData extends BaseSlideData {
  readonly layout: "hero";
  /** Small label shown above the headline (e.g. "Your 2026 in DSC"). */
  readonly eyebrow?: string;
  /** Main headline for the slide. */
  readonly title: string;
  /** Large hero stat/number, optional (e.g. "47" events attended). */
  readonly stat?: string;
  /** Supporting copy shown beneath the title/stat. */
  readonly subtitle?: string;
  /** Tailwind classes for the slide background (gradient/solid). */
  readonly background: string;
  /** Tailwind text-color class for foreground content. */
  readonly foreground?: string;
}

/**
 * A placeholder visual: a color swatch today, a real SVG/image once one is
 * supplied. Shared by any slide with a spot reserved for per-item or
 * headline artwork — see `SlideVisualSwatch` for the rendering side.
 */
export interface SlideVisual {
  /** Fallback swatch color shown when `icon` isn't set (hex or CSS color). */
  readonly color: string;
  /** Future SVG/image src; overrides the color swatch when set. */
  readonly icon?: string;
}

/** One ranked event row in an {@link EventsNutshellSlideData} slide. */
export interface NutshellEventItem extends SlideVisual {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

/**
 * Ranked top-events list + a headline stat, matching the Figma "Events in a Nutshell" design.
 *
 * Data injection points:
 * - `events`: the ranked list rows (#1, #2, ...). The layout is designed for
 *   up to 5 rows (matching the 5 decorative divider squares under the list);
 *   the component itself does not slice the array, so more than 5 will
 *   render but will crowd/overflow the design.
 * - `statValue` + `statCaption`: the "N total events attended with us!" line
 *   at the bottom — `statValue` holds the number, `statCaption` the trailing copy.
 */
export interface EventsNutshellSlideData extends BaseSlideData {
  readonly layout: "events-nutshell";
  /** e.g. "YOUR EVENTS IN A NUTSHELL" */
  readonly heading: string;
  /** Up to 5 ranked event rows — see class-level doc. */
  readonly events: readonly NutshellEventItem[];
  /** Total event count, e.g. "5". */
  readonly statValue: string;
  /** Rendered right after `statValue` on one line, e.g. "total events attended with us!" */
  readonly statCaption: string;
}

/**
 * Big headline stat + supporting captions, matching the Figma "Longest Streak" design.
 *
 * Data injection points:
 * - Streak length (e.g. "14 days") and the percentile comparison (e.g. "more
 *   than 65% of other members") have no dedicated numeric fields today —
 *   both are baked into free text (`subheading` / `captionLines`). Whoever
 *   wires this up to real data will need to interpolate those numbers into
 *   the strings (or add dedicated fields) rather than finding a `streakDays`
 *   or `percentile` prop to set.
 */
export interface StreakSlideData extends BaseSlideData {
  readonly layout: "streak";
  /** e.g. "YOUR LONGEST STREAK" */
  readonly heading: string;
  readonly visual: SlideVisual;
  /** e.g. "YOU'RE ON FIRE!!!" — not currently used to carry the streak length. */
  readonly subheading: string;
  /** Supporting mono caption lines below the subheading, e.g. ["That's more than 65%", "of other members of DSC"] — the percentage lives in this free text. */
  readonly captionLines: readonly string[];
}

/**
 * Join date + tenure stat, matching the Figma "Your first day w DSC" design.
 *
 * Data injection points:
 * - `joinDate`: the member's start date.
 * - `headline`: the term count, e.g. "12 terms since then as a member!" — the
 *   number is embedded in the sentence, not a separate field.
 * - `caption`: the day count, e.g. "1,234 days with us!" — likewise embedded.
 */
export interface MembershipSlideData extends BaseSlideData {
  readonly layout: "membership";
  /** e.g. "Your first day w DSC" */
  readonly eyebrow: string;
  /** Starting/join date, e.g. "January 10, 2024" */
  readonly joinDate: string;
  readonly visual: SlideVisual;
  /** Term count sentence, e.g. "12 terms since then as a member!" — wraps under the visual. */
  readonly headline: string;
  /** Day count sentence, e.g. "1,234 days with us!" */
  readonly caption: string;
}

export type WrappedSlideData =
  | HeroSlideData
  | EventsNutshellSlideData
  | StreakSlideData
  | MembershipSlideData;

/** Default auto-advance duration for a slide when it doesn't specify its own. */
export const DEFAULT_SLIDE_DURATION_MS = 5000;
