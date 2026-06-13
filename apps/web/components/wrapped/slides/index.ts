import type { WrappedSlideData } from "../types";

/**
 * Placeholder DSC Wrapped slides.
 *
 * TODO(db): Replace this static array with data fetched per-user. The intended
 * path is a `lib/api/` client wrapper -> `app/api/wrapped` route -> service ->
 * repository (see CLAUDE.md "API architecture"). Components consume
 * `WrappedSlideData[]`, so swapping the source here is the only change needed.
 */
export const WRAPPED_SLIDES: readonly WrappedSlideData[] = [
  {
    id: "intro",
    eyebrow: "Data Science Club",
    title: "Your DSC Wrapped",
    subtitle: "Let's look back at everything since you joined.",
    background: "bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600",
    foreground: "text-white",
  },
  {
    id: "events",
    eyebrow: "You showed up",
    title: "Events attended",
    stat: "00",
    subtitle: "Workshops, socials, and talks combined.",
    background: "bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700",
    foreground: "text-white",
  },
  {
    id: "streak",
    eyebrow: "On a roll",
    title: "Longest attendance streak",
    stat: "0",
    subtitle: "Events in a row without missing one.",
    background: "bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700",
    foreground: "text-white",
  },
  {
    id: "membership",
    eyebrow: "Time flies",
    title: "Member for",
    stat: "0 yrs",
    subtitle: "Since the day you joined DSC.",
    background: "bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700",
    foreground: "text-white",
  },
  {
    id: "minutes",
    eyebrow: "Locked in",
    title: "Minutes on the site",
    stat: "0",
    subtitle: "Browsing events, your profile, and more.",
    background: "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700",
    foreground: "text-white",
  },
  {
    id: "password-resets",
    eyebrow: "Oops",
    title: "Password resets",
    stat: "0",
    subtitle: "We've all been there.",
    background: "bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800",
    foreground: "text-white",
  },
  {
    id: "top-event",
    eyebrow: "Your headliner",
    title: "Top event",
    subtitle: "Placeholder Event Name",
    background: "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500",
    foreground: "text-white",
  },
  {
    id: "club-highest-attendance",
    eyebrow: "Club fun fact",
    title: "Highest-attendance event",
    stat: "0",
    subtitle: "Placeholder Event Name packed the room.",
    background: "bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700",
    foreground: "text-white",
  },
  {
    id: "club-most-visited",
    eyebrow: "Club fun fact",
    title: "Most visited event page",
    subtitle: "Placeholder Event Name had everyone clicking.",
    background: "bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700",
    foreground: "text-white",
  },
  {
    id: "club-snack",
    eyebrow: "Club fun fact",
    title: "Most common snack",
    subtitle: "Placeholder Snack fueled the club this year.",
    background: "bg-gradient-to-br from-lime-500 via-green-600 to-emerald-700",
    foreground: "text-white",
  },
  {
    id: "award-chronically-online",
    eyebrow: "Award unlocked",
    title: "Chronically Online 🏆",
    subtitle: "You spent a remarkable amount of time on the site.",
    background: "bg-gradient-to-br from-purple-600 via-violet-700 to-fuchsia-800",
    foreground: "text-white",
  },
  {
    id: "award-super-fan",
    eyebrow: "Award unlocked",
    title: "DSC Super Fan 🌟",
    subtitle: "You showed up to more events than almost anyone.",
    background: "bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600",
    foreground: "text-white",
  },
  {
    id: "outro",
    eyebrow: "That's a wrap",
    title: "Here's to what's next 👋",
    subtitle: "Thanks for being part of DSC since day one.",
    background: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700",
    foreground: "text-white",
  },
];
