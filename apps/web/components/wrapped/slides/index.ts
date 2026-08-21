import type { WrappedSlideData } from "../types";

/**
 * Placeholder DSC Wrapped slides.
 *
 * TODO(db): Replace this static array with data fetched per-user. The
 * intended path is a `lib/api/` client wrapper -> `app/api/wrapped` route ->
 * service -> repository (see CLAUDE.md "API architecture"). Components
 * consume `WrappedSlideData[]`, so swapping the source here is the only
 * change needed.
 */
export const WRAPPED_SLIDES: readonly WrappedSlideData[] = [
  {
    id: "intro",
    layout: "hero",
    eyebrow: "Data Science Club",
    title: "Your DSC Wrapped",
    subtitle: "Let's look back at everything since you joined.",
    background: "bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600",
    foreground: "text-white"
  },
  {
    id: "events-nutshell",
    layout: "events-nutshell",
    heading: "YOUR EVENTS IN A NUTSHELL",
    events: [
      {
        id: "event-1",
        name: "Event Name",
        description: "Event description",
        color: "#9cd8ea"
      },
      {
        id: "event-2",
        name: "Event Name",
        description: "Event description",
        color: "#ff8f64"
      },
      {
        id: "event-3",
        name: "Event Name",
        description: "Event description",
        color: "#ff7075"
      },
      {
        id: "event-4",
        name: "Event Name",
        description: "Event description",
        color: "#ccda96"
      },
      {
        id: "event-5",
        name: "Event Name",
        description: "Event description",
        color: "#e6c6e0"
      }
    ],
    statValue: "5",
    statCaption: "total events attended with us!"
  },
  {
    id: "streak",
    layout: "streak",
    heading: "YOUR LONGEST STREAK",
    visual: { color: "#ff8f64" },
    subheading: "YOU'RE ON FIRE!!!",
    captionLines: ["That's more than 65%", "of other members of DSC"]
  },
  {
    id: "membership",
    layout: "membership",
    eyebrow: "Your first day w DSC",
    joinDate: "January 10, 2024",
    visual: { color: "#e6c6e0" },
    headline: "# terms since then as a member!",
    caption: "# number of days with us!"
  },
  {
    id: "minutes",
    layout: "minutes-on-site",
    eyebrow: "Locked in",
    heading: "MINUTES ON THE SITE",
    stat: "0",
    captionLines: ["More time spent than", "# of DSC members"]
  },
  {
    id: "password-resets",
    layout: "password-resets",
    eyebrow: "Oops",
    heading: "LOCKED OUT",
    stat: "0",
    captionLines: ["times, we've all been there."]
  },
  {
    id: "fun-facts",
    layout: "fun-facts",
    heading: "TERM FUN FACTS!",
    facts: [
      {
        id: "highest-attendance",
        value: "Estimathon",
        label: "Highest attended event",
        visual: { color: "#ccda96" }
      },
      {
        id: "common-snack",
        value: "Boba",
        label: "Most eaten snack",
        visual: { color: "#ff7075" }
      },
      {
        id: "most-visited-page",
        value: "BOT",
        label: "Most visited event page",
        visual: { color: "#9cd8ea" }
      }
    ]
  },
  {
    id: "awards",
    layout: "awards",
    awards: [
      {
        id: "award-chronically-online",
        title: "Chronically Online",
        topPercent: "Top 10%"
      },
      { id: "award-super-fan", title: "DSC Super Fan", topPercent: "Top 10%" },
      {
        id: "award-password-resets",
        title: "Most Password Resets",
        topPercent: "Top 10%"
      }
    ]
  },
  {
    id: "outro",
    layout: "hero",
    eyebrow: "That's a wrap",
    title: "Here's to what's next 👋",
    subtitle: "Thanks for being part of DSC since day one.",
    background: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700",
    foreground: "text-white"
  }
];
