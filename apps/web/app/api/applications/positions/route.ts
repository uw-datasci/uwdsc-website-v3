import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const data = await applicationService.getPositionsWithQuestions();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 },
    );
  }
}
