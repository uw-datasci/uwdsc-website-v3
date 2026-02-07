import { NextRequest, NextResponse } from "next/server";
import { markAsPaidSchema, editMemberSchema } from "@/lib/schemas/membership";
import { profileService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/members/[id]
 * Update member information or mark as paid
 * Admin only endpoint
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    // Verify admin access
    const { isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized) return isUnauthorized;

    // TODO: Add proper admin role check

    const body = await request.json();
    const { id } = await params;

    // Determine operation type based on payload
    const isMarkAsPaid = "payment_method" in body;

    if (isMarkAsPaid) {
      // Validate mark as paid data
      const validationResult = markAsPaidSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: "Validation error",
            message:
              validationResult.error.issues[0]?.message || "Invalid data",
          },
          { status: 400 },
        );
      }

      const result = await profileService.markMemberAsPaid(
        id,
        validationResult.data,
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to mark as paid" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { success: true, message: "Member marked as paid" },
        { status: 200 },
      );
    } else {
      // Validate edit member data
      const validationResult = editMemberSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: "Validation error",
            message:
              validationResult.error.issues[0]?.message || "Invalid data",
          },
          { status: 400 },
        );
      }

      const result = await profileService.updateMember(
        id,
        validationResult.data,
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to update member" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { success: true, message: "Member updated successfully" },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Failed to update member",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/members/[id]
 * Delete a member
 * Admin only endpoint
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Verify admin access
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized) return isUnauthorized;

    // TODO: Add proper admin role check

    const { id } = await params;

    const result = await profileService.deleteMember(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to delete member" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Member deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Failed to delete member",
      },
      { status: 500 },
    );
  }
}
