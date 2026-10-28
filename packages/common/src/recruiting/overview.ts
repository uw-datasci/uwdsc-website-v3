import type {
  AttentionItem,
  ChecklistItem,
  OverviewCount,
  OverviewRoles,
  OverviewStep,
  OverviewView,
  RoleGroup,
} from "../types/api/recruiting";
import { formatShortDate, joinNames } from "../utils/recruiting";
import type { RecruitingCycleSummary, RecruitingViewer } from "./capabilities";
import { wantedSubteams } from "./board";
import { offerBlocker, rejectionBatch, seatState, type DecisionCard } from "./offers";
import type { SelectionStatus } from "./status";

export interface OverviewCard {
  selectionId: string;
  applicationId: string;
  name: string;
  status: SelectionStatus;
  positionId: number;
  positionName: string;
  subteamId: number | null;
  subteamName: string | null;
  isVp: boolean;
  noteCount: number;
  offerExpiresAt: string | null;
}

export interface OverviewPosition {
  positionId: number;
  name: string;
  subteamId: number | null;
  subteamName: string | null;
  isVp: boolean;
  isOpen: boolean;
  openings: number;
  questionCount: number;
}

export interface OverviewInput {
  viewer: RecruitingViewer;
  cycle: RecruitingCycleSummary;
  schedule: { releaseDate: string | null; hardDeadline: string | null };
  cards: readonly OverviewCard[];
  positions: readonly OverviewPosition[];
}

const MAX_ATTENTION = 5;
const DUE_SOON_MS = 12 * 60 * 60 * 1000;
const UNDECIDED: readonly SelectionStatus[] = ["In Review", "Interviewing"];

const plural = (count: number, word: string, many = `${word}s`) =>
  `${count} ${count === 1 ? word : many}`;

/** "A, B and C" for up to three names, then "and n more". */
function nameList(names: readonly string[], max = 3): string {
  const unique = [...new Set(names)];
  if (unique.length <= max) return joinNames(unique);
  return `${unique.slice(0, max).join(", ")} and ${unique.length - max} more`;
}

function countBy<T>(items: readonly T[], key: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return counts;
}

function isOwn(viewer: RecruitingViewer, item: { subteamId: number | null; isVp: boolean }) {
  return viewer.role === "pres" || (!item.isVp && item.subteamId === viewer.subteamId);
}

function toDecision(card: OverviewCard): DecisionCard {
  return {
    selectionId: card.selectionId,
    applicationId: card.applicationId,
    name: card.name,
    positionId: card.positionId,
    positionName: card.positionName,
    status: card.status,
  };
}

interface Facts {
  now: number;
  locked: boolean;
  released: boolean;
  closed: boolean;
  hasCards: boolean;
  applied: number;
  undecided: number;
  offersOut: number;
  accepted: number;
  conflicts: Set<string>;
}

function buildSteps(input: OverviewInput, facts: Facts): OverviewStep[] {
  const { cycle, schedule, viewer } = input;
  const finalized = cycle.finalizedAt !== null;
  const release = schedule.releaseDate;
  const hard = schedule.hardDeadline;
  const reviewStarted = input.cards.some((card) => card.status !== "In Review");
  const offersStarted =
    facts.offersOut + facts.accepted > 0 ||
    input.cards.some((card) => card.status === "Declined Offer");

  const lock: OverviewStep = facts.locked
    ? {
        key: "lock",
        label: "Lock leadership",
        sub: cycle.rosterLockedAt ? `Done ${formatShortDate(cycle.rosterLockedAt)}` : "Done",
        state: "done",
      }
    : { key: "lock", label: "Lock leadership", sub: "Not locked yet", state: "current" };

  let setup: OverviewStep = {
    key: "setup",
    label: "Set up",
    sub: "Dates and questions",
    state: "next",
  };
  if (facts.locked && facts.released) setup = { ...setup, sub: "Done", state: "done" };
  else if (facts.locked) {
    setup = {
      ...setup,
      sub: release ? `Applications open ${formatShortDate(release)}` : "Set the dates",
      state: "current",
    };
  }

  let open: OverviewStep = {
    key: "open",
    label: "Applications open",
    sub: release ? `Opens ${formatShortDate(release)}` : "Dates not set",
    state: "next",
  };
  if (facts.released && facts.closed) {
    open = {
      ...open,
      sub: `${release ? `${formatShortDate(release)} to ` : ""}${hard ? formatShortDate(hard) : ""} · ${facts.applied} applied`,
      state: "done",
    };
  } else if (facts.released) {
    open = {
      ...open,
      sub: `${hard ? `Closes ${formatShortDate(hard)} · ` : ""}${facts.applied} applied`,
      state: "current",
    };
  }

  let review: OverviewStep = {
    key: "review",
    label: "Review",
    sub: "After applications close",
    state: "next",
  };
  if (facts.closed && facts.hasCards && facts.undecided === 0) {
    review = { ...review, sub: "Everyone decided", state: "done" };
  } else if (facts.closed) {
    review = {
      ...review,
      sub: `Now · ${plural(facts.undecided, "card")} to decide`,
      state: "current",
    };
  } else if (facts.released && reviewStarted) {
    review = { ...review, sub: "Started early", state: "partial" };
  }

  let offers: OverviewStep = {
    key: "offers",
    label: "Offers",
    sub: "Run by presidents",
    state: "next",
  };
  if (finalized) offers = { ...offers, sub: `${facts.accepted} accepted`, state: "done" };
  else if (offersStarted) {
    offers = {
      ...offers,
      sub:
        viewer.role === "pres"
          ? `Started · ${facts.offersOut} out, ${facts.accepted} accepted`
          : "Started · run by presidents",
      state: "partial",
    };
  }

  const finalize: OverviewStep = finalized
    ? {
        key: "finalize",
        label: "Finalize",
        sub: cycle.finalizedAt ? `Done ${formatShortDate(cycle.finalizedAt)}` : "Done",
        state: "done",
      }
    : { key: "finalize", label: "Finalize", sub: "After offers", state: "next" };

  return [lock, setup, open, review, offers, finalize];
}

function buildSummary(step: OverviewStep, input: OverviewInput, facts: Facts): string {
  switch (step.key) {
    case "lock":
      return "Confirm next term's leadership to open recruiting.";
    case "setup":
      return input.schedule.releaseDate
        ? `Applications open ${formatShortDate(input.schedule.releaseDate)}. Finish your questions before then.`
        : "Set the application dates and write questions for each position.";
    case "open":
      return input.schedule.hardDeadline
        ? `Applications close ${formatShortDate(input.schedule.hardDeadline)}. ${facts.applied} applied so far.`
        : `${facts.applied} applied so far.`;
    case "review":
      return `${plural(facts.undecided, "card")} still need a Wanted or Not Wanted decision.`;
    case "offers":
      return `${plural(facts.offersOut, "offer")} out, ${facts.accepted} accepted.`;
    case "finalize":
      return input.cycle.finalizedAt
        ? "The team is finalized."
        : "Finalize once every offer is answered.";
    default:
      return "";
  }
}

function buildCounts(
  input: OverviewInput,
  cards: readonly OverviewCard[],
  facts: Facts,
  seatsTotal: number
): OverviewCount[] {
  const by = countBy(cards, (card) => card.status);
  const n = (status: SelectionStatus) => by.get(status) ?? 0;
  const candidates = new Set(cards.map((card) => card.applicationId)).size;
  const noNote = cards.filter(
    (card) => card.status === "Interviewing" && card.noteCount === 0
  ).length;
  const expired = cards.filter(
    (card) =>
      card.status === "Offer Sent" &&
      card.offerExpiresAt &&
      new Date(card.offerExpiresAt).getTime() <= facts.now
  ).length;

  if (input.viewer.role === "pres") {
    const subteams = new Set(
      cards
        .filter((card) => card.status === "In Review")
        .map((card) => card.subteamName ?? "Presidents")
    ).size;
    const conflicted = new Set(
      cards
        .filter((card) => card.status === "Wanted" && facts.conflicts.has(card.applicationId))
        .map((card) => card.applicationId)
    ).size;
    return [
      {
        key: "applicants",
        label: "Applicants",
        value: candidates,
        sub: plural(cards.length, "position pick"),
        status: null,
      },
      {
        key: "review",
        label: "In Review",
        value: n("In Review"),
        sub: `across ${plural(subteams, "subteam")}`,
        status: "In Review",
      },
      {
        key: "interviewing",
        label: "Interviewing",
        value: n("Interviewing"),
        sub: `${noNote} without a note`,
        status: "Interviewing",
      },
      {
        key: "wanted",
        label: "Wanted",
        value: n("Wanted"),
        sub: `${conflicted} in conflict`,
        status: "Wanted",
      },
      {
        key: "offers",
        label: "Offers out",
        value: n("Offer Sent"),
        sub: `${expired} expired`,
        status: "Offer Sent",
      },
      {
        key: "accepted",
        label: "Accepted",
        value: n("Accepted Offer"),
        sub: `of ${plural(seatsTotal, "seat")}`,
        status: "Accepted Offer",
      },
    ];
  }

  const positions = new Set(cards.map((card) => card.positionId)).size;
  const elsewhere = cards.filter(
    (card) => card.status === "Wanted" && facts.conflicts.has(card.applicationId)
  ).length;
  return [
    {
      key: "candidates",
      label: "Candidates",
      value: candidates,
      sub: `${plural(cards.length, "card")}, ${plural(positions, "position")}`,
      status: null,
    },
    {
      key: "review",
      label: "In Review",
      value: n("In Review"),
      sub: "waiting for a first look",
      status: "In Review",
    },
    {
      key: "interviewing",
      label: "Interviewing",
      value: n("Interviewing"),
      sub: `${noNote} without a note`,
      status: "Interviewing",
    },
    {
      key: "wanted",
      label: "Wanted",
      value: n("Wanted"),
      sub: `${elsewhere} also wanted elsewhere`,
      status: "Wanted",
    },
    {
      key: "notWanted",
      label: "Not Wanted",
      value: n("Not Wanted"),
      sub: "emailed when presidents send rejections",
      status: "Not Wanted",
    },
    {
      key: "offers",
      label: "Offers out",
      value: n("Offer Sent"),
      sub: "sent by presidents",
      status: "Offer Sent",
    },
  ];
}

function questionGaps(positions: readonly OverviewPosition[]): OverviewPosition[] {
  return positions.filter((position) => position.isOpen && position.questionCount === 0);
}

function buildAttention(
  input: OverviewInput,
  cards: readonly OverviewCard[],
  positions: readonly OverviewPosition[],
  facts: Facts,
  seats: ReturnType<typeof seatState>
): AttentionItem[] {
  const items: AttentionItem[] = [];
  const isPres = input.viewer.role === "pres";

  if (facts.locked && !input.schedule.releaseDate && isPres) {
    items.push({
      id: "dates",
      tone: "warn",
      icon: "clock",
      title: "Application dates aren't set",
      desc: "Applicants can't apply until the release date and deadlines are set.",
      action: "Set dates",
      href: "/recruiting/setup",
    });
  }

  const gaps = questionGaps(positions);
  if (!facts.released && gaps.length > 0) {
    items.push({
      id: "questions",
      tone: "info",
      icon: "question",
      title: `${plural(gaps.length, "position")} ${gaps.length === 1 ? "has" : "have"} no questions`,
      desc: `${nameList(gaps.map((p) => p.name))}. Add at least one before applications open.`,
      action: "Write questions",
      href: "/recruiting/setup",
    });
  }

  if (isPres) {
    const offered = cards.filter((card) => card.status === "Offer Sent");
    const expired = offered.filter(
      (card) => card.offerExpiresAt && new Date(card.offerExpiresAt).getTime() <= facts.now
    );
    if (expired.length > 0) {
      items.push({
        id: "expired",
        tone: "error",
        icon: "expired",
        title: `${plural(expired.length, "offer")} expired without a reply`,
        desc: `${nameList(
          expired.map((c) => `${c.name} (${c.positionName})`),
          2
        )}. Resend or release the seat.`,
        action: "Review",
        href: "/recruiting/offers#expired",
      });
    }
    const dueSoon = offered.filter((card) => {
      if (!card.offerExpiresAt) return false;
      const left = new Date(card.offerExpiresAt).getTime() - facts.now;
      return left > 0 && left <= DUE_SOON_MS;
    });
    if (dueSoon.length > 0) {
      items.push({
        id: "due",
        tone: "offer",
        icon: "clock",
        title: `${plural(dueSoon.length, "offer")} due in the next 12 hours`,
        desc: `${nameList(dueSoon.map((c) => c.name))}.`,
        action: "View offers",
        href: "/recruiting/offers#sent",
      });
    }

    const wanted = cards.filter((card) => card.status === "Wanted");
    if (wanted.length > 0) {
      const decisions = cards.map(toDecision);
      const byApp = new Map<string, DecisionCard[]>();
      for (const card of decisions)
        byApp.set(card.applicationId, [...(byApp.get(card.applicationId) ?? []), card]);
      const conflicted = new Set(
        wanted
          .filter((card) => facts.conflicts.has(card.applicationId))
          .map((card) => card.applicationId)
      ).size;
      const single = wanted.filter((card) => !facts.conflicts.has(card.applicationId));
      const ready = single.filter(
        (card) => !offerBlocker(toDecision(card), byApp.get(card.applicationId) ?? [], seats)
      ).length;
      const waiting = single.length - ready;
      const total = single.length + conflicted;
      const parts = [`${ready} can go out now.`];
      if (waiting > 0)
        parts.push(`${waiting} ${waiting === 1 ? "is" : "are"} waiting on a seat.`);
      if (conflicted > 0)
        parts.push(`${conflicted} ${conflicted === 1 ? "is a conflict" : "are conflicts"}.`);
      items.push({
        id: "ready",
        tone: "want",
        icon: "send",
        title: `${plural(total, "Wanted candidate")} ${total === 1 ? "is" : "are"} ready for an offer`,
        desc: parts.join(" "),
        action: "Go to Offers",
        href: "/recruiting/offers",
      });
    }

    if (facts.conflicts.size > 0) {
      const names = cards
        .filter((card) => facts.conflicts.has(card.applicationId))
        .map((card) => card.name);
      items.push({
        id: "conflicts",
        tone: "warn",
        icon: "warn",
        title: `${plural(facts.conflicts.size, "candidate is", "candidates are")} wanted by two subteams`,
        desc: `${nameList(names)}. Pick which position each one is offered.`,
        action: "Resolve",
        href: "/recruiting/offers#ready",
      });
    }
  }

  const inReview = cards.filter((card) => card.status === "In Review");
  if (inReview.length > 0) {
    const bySubteam = [...countBy(inReview, (card) => card.subteamName ?? "Presidents")]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `${name} ${count}`);
    items.push({
      id: "inReview",
      tone: "review",
      icon: "inbox",
      title: `${plural(inReview.length, "candidate")} still in In Review`,
      desc: isPres
        ? `${bySubteam.join(", ")}.`
        : "Open each one, read the application and move it along.",
      action: "Open board",
      href: "/recruiting/board",
    });
  }

  if (!isPres) {
    const noNotes = cards.filter(
      (card) => card.status === "Interviewing" && card.noteCount === 0
    );
    if (noNotes.length > 0) {
      items.push({
        id: "notes",
        tone: "review",
        icon: "note",
        title: `${plural(noNotes.length, "candidate")} in Interviewing ${noNotes.length === 1 ? "has" : "have"} no notes`,
        desc: `${nameList(noNotes.map((c) => c.name))}.`,
        action: "Add notes",
        href: "/recruiting/board",
      });
    }
    const elsewhere = cards.filter(
      (card) => card.status === "Wanted" && facts.conflicts.has(card.applicationId)
    );
    if (elsewhere.length > 0) {
      items.push({
        id: "elsewhere",
        tone: "warn",
        icon: "warn",
        title: `${plural(elsewhere.length, "of your Wanted candidates is", "of your Wanted candidates are")} also wanted elsewhere`,
        desc: `${nameList(elsewhere.map((c) => c.name))}. Presidents pick the offer, so add a note if you feel strongly.`,
        action: "View",
        href: "/recruiting/board",
      });
    }
  }

  return items.slice(0, MAX_ATTENTION);
}

function buildChecklist(
  input: OverviewInput,
  cards: readonly OverviewCard[],
  positions: readonly OverviewPosition[],
  facts: Facts
): ChecklistItem[] {
  const hasCards = cards.length > 0;
  const questionsDone = positions.length > 0 && questionGaps(positions).length === 0;

  if (input.viewer.role === "vp") {
    return [
      { id: "tour", label: "Take the tour", done: false, href: "/recruiting" },
      {
        id: "questions",
        label: "Write questions for your positions",
        done: questionsDone,
        href: "/recruiting/setup",
      },
      {
        id: "review",
        label: "Look at every candidate in In Review",
        done: hasCards && !cards.some((card) => card.status === "In Review"),
        href: "/recruiting/board",
      },
      {
        id: "notes",
        label: "Leave a note on everyone in Interviewing",
        done:
          hasCards &&
          !cards.some((card) => card.status === "Interviewing" && card.noteCount === 0),
        href: "/recruiting/board",
      },
      {
        id: "decide",
        label: "Mark everyone Wanted or Not Wanted",
        done: hasCards && !cards.some((card) => UNDECIDED.includes(card.status)),
        href: "/recruiting/board",
      },
    ];
  }

  const rejectionsLeft = rejectionBatch(cards.map(toDecision), {
    notWanted: true,
    inReview: false,
    interviewing: false,
  }).recipients.length;
  return [
    {
      id: "lock",
      label: "Lock next term's leadership",
      done: facts.locked,
      href: "/recruiting/leadership",
    },
    {
      id: "dates",
      label: "Set the dates and offer window",
      done: !!input.schedule.releaseDate && !!input.schedule.hardDeadline,
      href: "/recruiting/setup",
    },
    {
      id: "questions",
      label: "Every hiring position has questions",
      done: questionsDone,
      href: "/recruiting/setup",
    },
    {
      id: "offers",
      label: "Send offers to Wanted candidates",
      done:
        facts.offersOut + facts.accepted > 0 && !cards.some((card) => card.status === "Wanted"),
      href: "/recruiting/offers",
    },
    {
      id: "rejections",
      label: "Send rejections",
      done: cards.some((card) => card.status === "Rejection Sent") && rejectionsLeft === 0,
      href: "/recruiting/offers",
    },
    {
      id: "finalize",
      label: "Finalize the team",
      done: input.cycle.finalizedAt !== null,
      href: "/recruiting/finalize",
    },
  ];
}

function buildRoles(
  input: OverviewInput,
  positions: readonly OverviewPosition[],
  allCards: readonly OverviewCard[]
): OverviewRoles {
  const seatFor = (position: OverviewPosition) => {
    const cards = allCards.filter((card) => card.positionId === position.positionId);
    return {
      positionId: position.positionId,
      name: position.name,
      openings: position.openings,
      accepted: cards.filter((card) => card.status === "Accepted Offer").length,
      offers: cards.filter((card) => card.status === "Offer Sent").length,
    };
  };
  const open = positions.filter((position) => position.isOpen);
  const groupsOf = (list: readonly OverviewPosition[]): RoleGroup[] => {
    const groups = new Map<string, RoleGroup>();
    for (const position of list) {
      const name = position.subteamName ?? "Presidents";
      const group = groups.get(name) ?? { subteamName: name, seats: [] };
      group.seats.push(seatFor(position));
      groups.set(name, group);
    }
    return [...groups.values()];
  };

  const isPres = input.viewer.role === "pres";
  const mine = open.filter((position) => isOwn(input.viewer, position));
  const groups = groupsOf(mine);
  const seats = groups.flatMap((group) => group.seats);

  let others: string | null = null;
  if (!isPres) {
    const rest = groupsOf(open.filter((position) => !isOwn(input.viewer, position))).map(
      (group) => {
        const filled = group.seats.reduce(
          (sum, seat) => sum + Math.min(seat.accepted, seat.openings),
          0
        );
        const total = group.seats.reduce((sum, seat) => sum + seat.openings, 0);
        return `${group.subteamName} ${filled} of ${total} filled`;
      }
    );
    others = rest.length > 0 ? rest.join(" · ") : null;
  }

  return {
    title: isPres ? "Roles" : "Your roles",
    filled: seats.reduce((sum, seat) => sum + Math.min(seat.accepted, seat.openings), 0),
    total: seats.reduce((sum, seat) => sum + seat.openings, 0),
    groups,
    others,
  };
}

/** Everything on Recruiting → Overview, from the cycle's cards, positions and dates. */
export function buildOverview(input: OverviewInput, now: Date = new Date()): OverviewView {
  const at = now.getTime();
  const release = input.schedule.releaseDate
    ? new Date(input.schedule.releaseDate).getTime()
    : null;
  const hard = input.schedule.hardDeadline
    ? new Date(input.schedule.hardDeadline).getTime()
    : null;

  const conflicts = new Set<string>();
  for (const [applicationId, cards] of groupByApplication(input.cards)) {
    if (wantedSubteams(cards).length >= 2) conflicts.add(applicationId);
  }

  const cards = input.cards.filter((card) => isOwn(input.viewer, card));
  const positions = input.positions.filter((position) => isOwn(input.viewer, position));
  const facts: Facts = {
    now: at,
    locked: input.cycle.rosterLockedAt !== null,
    released: release !== null && release <= at,
    closed: hard !== null && hard <= at,
    hasCards: cards.length > 0,
    applied: new Set(input.cards.map((card) => card.applicationId)).size,
    undecided: cards.filter((card) => UNDECIDED.includes(card.status)).length,
    offersOut: cards.filter((card) => card.status === "Offer Sent").length,
    accepted: cards.filter((card) => card.status === "Accepted Offer").length,
    conflicts,
  };

  const openings = new Map(input.positions.map((p) => [p.positionId, p.openings]));
  const seats = seatState(openings, input.cards.map(toDecision));
  const seatsTotal = input.positions
    .filter((p) => p.isOpen)
    .reduce((sum, p) => sum + p.openings, 0);

  const steps = buildSteps(input, facts);
  const index = steps.findIndex((step) => step.state !== "done");
  const current = steps[index === -1 ? steps.length - 1 : index] ?? steps[0];

  return {
    stepNumber: (index === -1 ? steps.length - 1 : index) + 1,
    stepLabel: current?.label ?? "",
    summary: current ? buildSummary(current, input, facts) : "",
    steps,
    counts: buildCounts(input, cards, facts, seatsTotal),
    attention: buildAttention(input, cards, positions, facts, seats),
    checklist: buildChecklist(input, cards, positions, facts),
    roles: buildRoles(input, input.positions, input.cards),
  };
}

function groupByApplication(cards: readonly OverviewCard[]): Map<string, OverviewCard[]> {
  const groups = new Map<string, OverviewCard[]>();
  for (const card of cards)
    groups.set(card.applicationId, [...(groups.get(card.applicationId) ?? []), card]);
  return groups;
}
