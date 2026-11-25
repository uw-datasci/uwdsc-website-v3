import { createHash } from "node:crypto";
import { RateLimitRepository } from "./rateLimit.repository";

class RateLimitService {
  private readonly repository = new RateLimitRepository();

  /**
   * Count one request for `scope` + `identifier` and say whether it's within `limit` per
   * `windowSeconds`. The identifier (an IP or token) is only stored hashed.
   */
  async allow(
    scope: string,
    identifier: string,
    limit: number,
    windowSeconds: number
  ): Promise<boolean> {
    const key = `${scope}:${createHash("sha256").update(identifier).digest("hex")}`;
    const hits = await this.repository.hit(key, windowSeconds);
    return hits <= limit;
  }
}

export const rateLimitService = new RateLimitService();
