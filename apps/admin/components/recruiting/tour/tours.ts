import type { RecruitingTour } from "@uwdsc/common/constants";

export interface TourStep {
  id: string;
  href: string | null;
  target: string;
  title: string;
  body: string;
}

const VP_STEPS: TourStep[] = [
  {
    id: "stepper",
    href: "/recruiting",
    target: "stepper",
    title: "Where the cycle is",
    body: "Each step of the hiring cycle, in order. Most of your work happens in Review: deciding who's Wanted for your subteam's positions.",
  },
  {
    id: "attention",
    href: "/recruiting",
    target: "attention",
    title: "What needs you now",
    body: "This list and your checklist update on their own. Work through them top to bottom and nothing slips.",
  },
  {
    id: "questions",
    href: "/recruiting/setup",
    target: "questions",
    title: "Write questions for your positions",
    body: "Add questions for your subteam's positions before applications open. Other subteams' questions are read-only.",
  },
  {
    id: "mine",
    href: "/recruiting/board",
    target: "my-positions",
    title: "Start with your own positions",
    body: "My positions is on, so you only see your subteam's candidates. Turn it off to read every subteam's candidates. You can open them, but only their own VP can move them.",
  },
  {
    id: "columns",
    href: "/recruiting/board",
    target: "columns",
    title: "Move candidates by dragging",
    body: "Drag a card from In Review to Interviewing, then to Wanted or Not Wanted. Columns you can't drop into dim, and Undo shows for 6 seconds. Click a card to read the application and leave notes.",
  },
  {
    id: "help",
    href: null,
    target: "help",
    title: "Replay any time",
    body: "That's the tour. Use this button to see it again.",
  },
];

const PRES_STEPS: TourStep[] = [
  {
    id: "stepper",
    href: "/recruiting",
    target: "stepper",
    title: "Where the cycle is",
    body: "Each step lights up as the cycle moves. Dates and card statuses drive it, so there's nothing to update by hand.",
  },
  {
    id: "attention",
    href: "/recruiting",
    target: "attention",
    title: "What needs you now",
    body: "Expired offers, conflicts and Wanted candidates ready for an offer show up here first.",
  },
  {
    id: "leadership",
    href: "/recruiting",
    target: "tab-leadership",
    title: "Leadership",
    body: "Next term's presidents and VPs. Changes after the lock apply roles right away, after the same confirm step.",
  },
  {
    id: "schedule",
    href: "/recruiting/setup",
    target: "schedule",
    title: "Dates and offer window",
    body: "Set when applications open and close, and how long candidates have to answer an offer.",
  },
  {
    id: "board",
    href: "/recruiting/board",
    target: "columns",
    title: "You can move any card",
    body: "VPs move their own subteam's candidates. You can move anyone, including applicants for public VP seats.",
  },
  {
    id: "offers",
    href: "/recruiting/offers",
    target: "offers-ready",
    title: "Offers and rejections",
    body: "Send offers one at a time, and every email is previewed first. Candidates answer by link, and rejections go out in one batch.",
  },
  {
    id: "help",
    href: null,
    target: "help",
    title: "Finalize, then replay any time",
    body: "Once every offer is answered, Finalize updates roles and the team page in one step. Use this button to see the tour again.",
  },
];

export const TOURS: Record<RecruitingTour, TourStep[]> = {
  "pres-v1": PRES_STEPS,
  "vp-v1": VP_STEPS,
};

export function tourFor(role: "pres" | "vp"): RecruitingTour {
  return role === "pres" ? "pres-v1" : "vp-v1";
}
