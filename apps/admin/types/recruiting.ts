import type { SelectionStatus } from "@uwdsc/common/recruiting";
import type { LeadershipSlot } from "@uwdsc/common/schemas";
import type { BoardCard, LeadershipPerson } from "@uwdsc/common/types";

/** Callbacks and lookups the roster cards share. */
export interface SlotEditor {
  readonly people: Record<string, LeadershipPerson>;
  readonly subteamNames: ReadonlyMap<number, string>;
  readonly seatedIds: ReadonlySet<string>;
  readonly disabled: boolean;
  update: (slotId: string, patch: Partial<LeadershipSlot>) => void;
  remove: (slotId: string) => void;
  pick: (slotId: string, person: LeadershipPerson) => void;
  addPresident: () => void;
  addVp: (positionId: number) => void;
  readonly retired: ReadonlySet<number>;
  readonly canEditStructure: boolean;
  retireBlocker: (subteamId: number) => string | null;
  setRetired: (subteamId: number, retired: boolean) => void;
  structureChanged: () => Promise<void>;
}

export type BoardSource = "all" | "new" | "returning";

/** One candidate's cards that share a status, shown as a single card on the board. */
export interface BoardGroup {
  id: string;
  status: SelectionStatus;
  cards: BoardCard[];
}

export interface BoardFilters {
  mine: boolean;
  positionId: number | null;
  subteamId: number | null;
  source: BoardSource;
  hasNotes: boolean;
  search: string;
}
