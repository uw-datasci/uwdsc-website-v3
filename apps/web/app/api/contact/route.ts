import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { contactService } from "@uwdsc/core";

export const POST = withRaftRoute(async (request) => {
  const body = await request.json();
  const { name, email, subject, message } = body as Record<string, string>;

  if (!name?.trim()) return RaftResponse.badRequest("Name is required");
  if (!email?.trim()) return RaftResponse.badRequest("Email is required");
  if (!subject?.trim()) return RaftResponse.badRequest("Subject is required");
  if (!message?.trim() || message.trim().length < 10) {
    return RaftResponse.badRequest("Message must be at least 10 characters");
  }

  await contactService.submit({
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    source: "contact_form",
  });

  return RaftResponse.ok({ success: true });
});
