import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const application = await applicationService.updateApplication(
      id,
      user.id,
      body,
    );

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or cannot be updated" },
        { status: 404 },
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}
