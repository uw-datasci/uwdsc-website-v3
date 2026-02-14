import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const { searchParams } = new URL(request.url);
    const termId = searchParams.get("termId");
    if (!termId) {
      return NextResponse.json(
        { error: "termId is required" },
        { status: 400 },
      );
    }

    const application = await applicationService.getApplicationForUser(
      user.id,
      termId,
    );
    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const body = await request.json();
    const { termId } = body;
    if (!termId) {
      return NextResponse.json(
        { error: "termId is required" },
        { status: 400 },
      );
    }

    const application = await applicationService.createApplication(
      user.id,
      termId,
    );
    return NextResponse.json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    const message =
      error && typeof error === "object" && "message" in error
        ? (error as Error).message
        : "Failed to create application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
