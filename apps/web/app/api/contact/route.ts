import { ApiResponse } from "@uwdsc/common/utils";
import { contactService } from "@uwdsc/core";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as Record<string, string>;

    if (!name?.trim()) return ApiResponse.badRequest("Name is required");
    if (!email?.trim()) return ApiResponse.badRequest("Email is required");
    if (!subject?.trim()) return ApiResponse.badRequest("Subject is required");
    if (!message?.trim() || message.trim().length < 10)
      return ApiResponse.badRequest("Message must be at least 10 characters");

    await contactService.submit({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(), source: "contact_form" });

    return ApiResponse.ok({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return ApiResponse.serverError(error, "An unexpected error occurred");
  }
}
