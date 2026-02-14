import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const term = await applicationService.getActiveTerm();
    if (!term) {
      return NextResponse.json(
        { error: "No active application period" },
        { status: 404 },
      );
    }

    return NextResponse.json(term);
  } catch (error) {
    console.error("Error fetching active term:", error);
    return NextResponse.json(
      { error: "Failed to fetch active term" },
      { status: 500 },
    );
  }
}
