/**
 * Shape of a single DSC Wrapped slide.
 *
 * This is the seam between the (currently hardcoded) placeholder content and
 * the database-driven content that will replace it later. As long as the data
 * source keeps producing `WrappedSlideData[]`, the rendering and animation
 * code in `WrappedStory`/`WrappedSlide` does not need to change.
 */
export interface WrappedSlideData {
  /** Stable identifier — also used as the React key and progress-bar key. */
  readonly id: string;
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
