import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const profile = await applicationService.getProfileAutofill(user.id);
    return NextResponse.json(profile ?? {});
  } catch (error) {
    console.error("Error fetching profile autofill:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
