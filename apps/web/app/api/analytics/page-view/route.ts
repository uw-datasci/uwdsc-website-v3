import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { createSupabaseServerClient } from "@uwdsc/db";
import { cookies } from "next/headers";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const POST = withRaftRoute(async (request) => {
  const body = (await request.json()) as { path?: string; visitor_id?: string };
  const { path, visitor_id: visitorId } = body;

  if (!path?.startsWith("/")) return RaftResponse.badRequest("Invalid path");

  if (!visitorId || !UUID_REGEX.test(visitorId)) {
    return RaftResponse.badRequest("Invalid visitor_id");
  }

  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getAll() {
      return cookieStore.getAll();
    },
    set(name: string, value: string, options?) {
      cookieStore.set(name, value, options);
    }
  });

  const { error } = await supabase.rpc("log_page_view", {
    p_path: path,
    p_visitor_id: visitorId
  });

  if (error) {
    console.error("Failed to log page view:", error);
    return RaftResponse.serverError(error, "Failed to log page view");
  }

  return RaftResponse.ok({ success: true });
});
