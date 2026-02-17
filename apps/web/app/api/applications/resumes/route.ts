import { tryGetCurrentUser } from "@/lib/api/utils";
import { createResumeService } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 },
      );
    }

    const resumeService = await createResumeService();
    const result = await resumeService.uploadResume({
      file,
      userId: user.id,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Upload failed" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: "Upload successful",
      key: result.key,
      url: result.key,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 },
    );
  }
}
