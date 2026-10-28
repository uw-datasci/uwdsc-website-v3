import { RaftResponse } from "@uw-datasci/raft";
import { offerLinkResponseSchema } from "@uwdsc/common/schemas";
import { offerResponseService } from "@uwdsc/core";
import { withRaftRoute, type RouteContext } from "@uwdsc/core/http";
import { allowOfferRequest } from "@/lib/utils/offer";

export const POST = withRaftRoute(
  async (request, { params }: RouteContext<{ token: string }>) => {
    const { token } = await params;
    if (!(await allowOfferRequest(request.headers, token))) {
      return RaftResponse.json(
        { error: "Too many tries. Wait a few minutes and try again." },
        429
      );
    }

    const parsed = offerLinkResponseSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return RaftResponse.badRequest(parsed.error.issues[0]?.message ?? "Invalid response");
    }

    const view = await offerResponseService.respondByToken(token, parsed.data);
    return RaftResponse.ok(view);
  }
);
