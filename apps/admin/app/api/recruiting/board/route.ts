import { RaftResponse } from "@uw-datasci/raft";
import { boardService } from "@uwdsc/admin";
import { requireBoard, withRecruiting } from "@/guards/withRecruiting";

/**
 * GET /api/recruiting/board
 * Every card in the cycle (light payload) plus the positions and subteams to filter by.
 */
export const GET = withRecruiting(async (_request, _context, _user, recruiting) => {
  return RaftResponse.ok(await boardService.getBoard(recruiting));
}, requireBoard);
