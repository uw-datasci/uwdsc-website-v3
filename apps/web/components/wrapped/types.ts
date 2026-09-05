/**
 * Shape of a single DSC Wrapped slide.
 *
 * This is the seam between the (currently hardcoded) placeholder content and
 * the database-driven content that will replace it later. As long as the data
 * source keeps producing `WrappedSlideData[]`, the rendering and animation
 * code in `WrappedStory`/`WrappedSlide` does not need to change.
 */

interface BaseSlideData {
  /** Stable identifier. Also used as the React key and progress-bar key. */
  readonly id: string;
  /**
   * How long this slide stays on screen before auto-advancing, in ms.
   * Optional per-slide override; falls back to {@link DEFAULT_SLIDE_DURATION_MS}.
   */
  readonly durationMs?: number;
}

/**
 * Generic full-bleed headline/stat slide, the original uniform template
 * used for the intro, outro, and "top event" slides.
 *
 * Data injection points:
 * - `eyebrow`: optional small label above the title.
 * - `title`: the main headline.
 * - `stat`: optional large hero number.
 * - `subtitle`: optional supporting copy below the title/stat.
 * - `background`: Tailwind classes for the slide background. This is the
 *   customization point for slide color, no hardcoded colors to edit.
 * - `foreground`: Tailwind text-color class for the content. Defaults to
 *   `text-white` when omitted.
 */
export interface HeroSlideData extends BaseSlideData {
  readonly layout: "hero";
  /** Small label shown above the headline, e.g. "Your 2026 in DSC". */
  readonly eyebrow?: string;
  /** Main headline for the slide. */
  readonly title: string;
  /** Large hero stat/number, optional, e.g. "47" events attended. */
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
 * headline artwork. See `SlideVisualSwatch` for the rendering side.
 *
 * Only {@link EventsNutshellSlideData} actually renders this today (via
 * `SlideVisualSwatch`). {@link StreakSlideData} and {@link MembershipSlideData}
 * both declare a `visual` field but their components render hardcoded
 * decorative art instead, so setting `visual` there currently has no effect.
 */
export interface SlideVisual {
  /** Fallback swatch color shown when `icon` isn't set (hex or CSS color). */
  readonly color: string;
  /** Future SVG/image src, overrides the color swatch when set. */
  readonly icon?: string;
}

/** One ranked event row in an {@link EventsNutshellSlideData} slide. */
export interface NutshellEventItem extends SlideVisual {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

/**
 * Ranked top-events list plus a headline stat, matching the Figma "Events in
 * a Nutshell" design.
 *
 * Data injection points:
 * - `heading`: the title at the top of the slide.
 * - `events`: the ranked list rows (#1, #2, ...), up to 5. The layout is
 *   sized for 5 rows to match the 5 decorative divider squares under the
 *   list. The component doesn't slice the array, so more than 5 will render
 *   but will crowd or overflow the design.
 * - `statValue`: the number in the "N total events attended with us!" line
 *   at the bottom.
 * - `statCaption`: the trailing copy rendered right after `statValue` on
 *   that same line.
 *
 * Not driven by data: the decorative pattern SVGs behind the heading
 * (`topPatterns`) and the divider squares under the list (`dividerSquares`)
 * are hardcoded in `EventsNutshellSlide.tsx`.
 */
export interface EventsNutshellSlideData extends BaseSlideData {
  readonly layout: "events-nutshell";
  /** e.g. "YOUR EVENTS IN A NUTSHELL" */
  readonly heading: string;
  /** Up to 5 ranked event rows. See class-level doc. */
  readonly events: readonly NutshellEventItem[];
  /** Total event count, e.g. "5". */
  readonly statValue: string;
  /** Rendered right after `statValue` on one line, e.g. "total events attended with us!" */
  readonly statCaption: string;
}

/**
 * Big headline stat plus supporting captions, matching the Figma "Longest
 * Streak" design.
 *
 * Data injection points:
 * - `heading`: the title at the top of the slide.
 * - `subheading`: the line under the title, e.g. "YOU'RE ON FIRE!!!".
 * - `captionLines`: supporting mono caption lines below the circle, one per
 *   array entry.
 *
 * There's no dedicated field for the streak length or the percentile
 * comparison. Both need to be written directly into `subheading` or
 * `captionLines` as free text (e.g. "14 days", "more than 65% of other
 * members") rather than set as separate numeric props.
 *
 * Not driven by data: `slide.visual` is declared but unused. The circle
 * behind the caption is a hardcoded `bg-[#ffd7df]` swatch, and the slide
 * background is a hardcoded `bg-[#9cd8ea]`, both in `StreakSlide.tsx`.
 */
export interface StreakSlideData extends BaseSlideData {
  readonly layout: "streak";
  /** e.g. "YOUR LONGEST STREAK" */
  readonly heading: string;
  readonly visual: SlideVisual;
  /** e.g. "YOU'RE ON FIRE!!!" */
  readonly subheading: string;
  /** Supporting mono caption lines below the subheading, e.g. ["That's more than 65%", "of other members of DSC"]. */
  readonly captionLines: readonly string[];
}

/**
 * Join date plus tenure stat, matching the Figma "Your first day w DSC" design.
 *
 * Data injection points:
 * - `eyebrow`: small label above the join date.
 * - `joinDate`: the member's start date.
 * - `headline`: the term-count sentence, e.g. "12 terms since then as a
 *   member!". The number is embedded in the sentence, there's no separate
 *   numeric field.
 * - `caption`: the day-count sentence, e.g. "1,234 days with us!", likewise
 *   embedded as free text.
 *
 * Not driven by data: `slide.visual` is declared but unused. The mushroom,
 * flower, leaf and ladybug doodles scattered above and below the text are
 * hardcoded in `MembershipSlide.tsx` (`OrnamentSvg`, positioned via
 * `topOrnaments`/`bottomOrnaments`), and the slide background is a hardcoded
 * `bg-[#ccda96]`.
 */
export interface MembershipSlideData extends BaseSlideData {
  readonly layout: "membership";
  /** e.g. "Your first day w DSC" */
  readonly eyebrow: string;
  /** Starting/join date, e.g. "January 10, 2024" */
  readonly joinDate: string;
  readonly visual: SlideVisual;
  /** Term count sentence, e.g. "12 terms since then as a member!". Wraps under the visual. */
  readonly headline: string;
  /** Day count sentence, e.g. "1,234 days with us!" */
  readonly caption: string;
}

/**
 * Big centered hero stat with decorative blob shapes ringed around it,
 * matching the Spotify Wrapped "My Minutes Listened" reference layout.
 *
 * Data injection points:
 * - `eyebrow`: small label above the heading, e.g. "Locked in".
 * - `heading`: headline above the stat, e.g. "MINUTES ON THE SITE".
 * - `stat`: the big hero number, e.g. "1,234".
 * - `captionLines`: supporting mono caption lines below the stat, one per
 *   array entry, e.g. ["Browsing events, your profile,", "and more."].
 *
 * Not driven by data: the blob shapes and colors (`MushroomBlob`,
 * `FlowerBlob`, `LeafBlob`), the corner accents (`CritterAccentSvg`), and
 * the slide background (`bg-[#ff8f64]`) are all hardcoded in
 * `MinutesOnSiteSlide.tsx`.
 */
export interface MinutesOnSiteSlideData extends BaseSlideData {
  readonly layout: "minutes-on-site";
  /** e.g. "Locked in" */
  readonly eyebrow: string;
  /** e.g. "MINUTES ON THE SITE" */
  readonly heading: string;
  /** Big hero stat, e.g. "1,234" */
  readonly stat: string;
  /** Supporting mono caption lines below the stat. */
  readonly captionLines: readonly string[];
}

/**
 * Big centered stat with the same decorative blobs as
 * {@link MinutesOnSiteSlideData}, piled along the bottom of the slide instead
 * of ringing the number, e.g. "Locked out # times". Same field shape as
 * {@link MinutesOnSiteSlideData}, with the pile arrangement baked into its
 * own component.
 *
 * Data injection points:
 * - `eyebrow`: small label above the heading, e.g. "Oops".
 * - `heading`: headline above the stat, e.g. "LOCKED OUT".
 * - `stat`: the big hero number, e.g. "12".
 * - `captionLines`: supporting mono caption lines below the stat.
 *
 * Not driven by data: the blob shapes and colors, the pile layout
 * (`pileOrnaments`), and the slide background are hardcoded in
 * `PasswordResetsSlide.tsx`.
 */
export interface PasswordResetsSlideData extends BaseSlideData {
  readonly layout: "password-resets";
  readonly eyebrow: string;
  readonly heading: string;
  readonly stat: string;
  readonly captionLines: readonly string[];
}

/**
 * One polaroid "fun fact" card in a {@link FunFactsSlideData} slide.
 */
export interface FunFactPolaroid {
  readonly id: string;
  readonly visual: SlideVisual;
  /** Big headline value on the caption strip, e.g. "100" or "Boba". */
  readonly value: string;
  /** Caption under the value, e.g. "Highest attended event". */
  readonly label: string;
}

/**
 * Scattered-polaroid "fun facts" slide: 3 overlapping rotated polaroid
 * cards
 *
 * Data injection points:
 * - `heading`: the title at the top of the slide.
 * - `facts`: exactly 3 polaroid entries, in slot order [back, middle, front].
 *   Each polaroid's color comes from `facts[i].visual.color` (or an image
 *   via `visual.icon`), and its `label`/`value` render as the caption below
 *   the swatch.
 *
 * Not driven by data: each slot's position and rotation are hardcoded in
 * `FunFactsSlide.tsx` (the `centerX`/`centerY`/`rotate` props passed to
 * `Polaroid`), so more or fewer than 3 entries will misalign the layout.
 */
export interface FunFactsSlideData extends BaseSlideData {
  readonly layout: "fun-facts";
  /** e.g. "TERM FUN FACTS!" */
  readonly heading: string;
  /** Exactly 3 polaroids. See class-level doc. */
  readonly facts: readonly FunFactPolaroid[];
}

/** One award in an {@link AwardsSlideData} podium slide. */
export interface AwardEntry {
  readonly id: string;
  /** e.g. "Chronically Online" */
  readonly title: string;
  /** Percentile line under the title, e.g. "Top 10%". */
  readonly topPercent: string;
}

/**
 * Podium slide: three full-height colored columns of different heights,
 * each with a hand-drawn doodle above it and a title plus percentile line
 * at the top of the column,
 *
 * Data injection points:
 * - `awards`: exactly 3 entries. `awards[0]` sits in the tallest center
 *   column, `awards[1]` in the left column, `awards[2]` in the right column.
 *   Each entry's `title` and `topPercent` render as the two caption lines.
 *
 * Not driven by data: column heights, colors and the doodle SVGs
 * (`CherryDoodle`, `BirdDoodle`, `PetalDoodle`) are hardcoded in the
 * `columns` array in `AwardsSlide.tsx`. Edit that array to restyle a column,
 * or edit a doodle's `fill` values to recolor it.
 */
export interface AwardsSlideData extends BaseSlideData {
  readonly layout: "awards";
  /** Exactly 3 entries. See class-level doc. */
  readonly awards: readonly AwardEntry[];
}

export type WrappedSlideData =
  | HeroSlideData
  | EventsNutshellSlideData
  | StreakSlideData
  | MembershipSlideData
  | MinutesOnSiteSlideData
  | PasswordResetsSlideData
  | FunFactsSlideData
  | AwardsSlideData;

/** Default auto-advance duration for a slide when it doesn't specify its own. */
export const DEFAULT_SLIDE_DURATION_MS = 5000;
