import type { LeadershipSlot } from "@uwdsc/common/schemas";
import type { LeadershipPerson } from "@uwdsc/common/types";

/** Callbacks and lookups the roster cards share. */
export interface SlotEditor {
  readonly people: Record<string, LeadershipPerson>;
  readonly subteamNames: ReadonlyMap<number, string>;
  /** People already on next term's roster (can't be picked again). */
  readonly seatedIds: ReadonlySet<string>;
  readonly disabled: boolean;
  update: (slotId: string, patch: Partial<LeadershipSlot>) => void;
  remove: (slotId: string) => void;
  /** Seat someone as the slot's successor. */
  pick: (slotId: string, person: LeadershipPerson) => void;
  addPresident: () => void;
  addVp: (positionId: number) => void;
}
