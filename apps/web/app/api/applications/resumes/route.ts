import { NextRequest } from "next/server";
import { createAuthService, createResumeService } from "@/lib/services";

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return Response.json(
        { error: "Missing 'file' upload field" },
        { status: 400 }
      );
    }

    // Authenticate user
    const authService = await createAuthService();
    const { user, error: userErr } = await authService.getCurrentUser();

    if (userErr || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Upload resume using service
    const resumeService = await createResumeService();
    const result = await resumeService.uploadResume({ file, userId: user.id });

    if (!result.success) {
      // Determine appropriate status code based on error type
      let statusCode = 500;
      if (result.error?.includes("too large")) statusCode = 413;
      else if (result.error?.includes("Invalid file type")) statusCode = 415;
      else if (result.error?.includes("Unsupported content type"))
        statusCode = 415;

      return Response.json({ error: result.error }, { status: statusCode });
    }

    return Response.json({
      message: result.message,
      key: result.key,
    });
  } catch (err: any) {
    console.error("Resume upload error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
