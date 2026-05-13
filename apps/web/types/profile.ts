import type { CompleteProfileData } from "@uwdsc/common/types";

/** Payload for completing profile (after email verification). Server sets is_math_soc_member from faculty. */
export type CompleteProfilePayload = Omit<CompleteProfileData, "is_math_soc_member">;
