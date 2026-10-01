"use client";

import useSWR from "swr";
import { getProfilePhotoStatus } from "@/lib/api/profile-photo";

export function useProfilePhotoUrl(profilePhotoKey: string | null | undefined) {
  const { data } = useSWR(
    profilePhotoKey ? ["profile-photo-url", profilePhotoKey] : null,
    async () => {
      const status = await getProfilePhotoStatus();
      return status.url;
    }
  );

  return data ?? null;
}
