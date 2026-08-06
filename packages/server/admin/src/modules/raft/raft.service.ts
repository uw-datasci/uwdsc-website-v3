import type {
  RaftError,
  RaftFilters,
  RaftGroupFilters,
  RaftOverview,
} from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import { RaftRepository } from "./raft.repository";

class RaftService {
  private readonly repository: RaftRepository;

  constructor() {
    this.repository = new RaftRepository();
  }

  async getOverview(filters: RaftFilters): Promise<RaftOverview> {
    try {
      const [stats, timeSeries, byApp, bySeverity, topEndpoints, apps, environments] =
        await Promise.all([
          this.repository.getStats(filters),
          this.repository.getTimeSeries(filters),
          this.repository.getByApp(filters),
          this.repository.getBySeverity(filters),
          this.repository.getTopEndpoints(filters),
          this.repository.getDistinctApps(),
          this.repository.getDistinctEnvironments(),
        ]);

      return {
        stats,
        timeSeries,
        byApp,
        bySeverity,
        topEndpoints,
        apps,
        environments,
      };
    } catch (error) {
      throw new ApiError(`Failed to fetch raft overview: ${(error as Error).message}`, 500);
    }
  }

  async getErrorGroups(filters: RaftGroupFilters) {
    try {
      if (filters.mode === "occurrences") {
        const { errors, total } = await this.repository.getOccurrences(filters);
        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 20;
        return { errors, total, page, pageSize };
      }

      const { groups, total } = await this.repository.getErrorGroups(filters);
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 20;
      return { groups, total, page, pageSize };
    } catch (error) {
      throw new ApiError(`Failed to fetch raft errors: ${(error as Error).message}`, 500);
    }
  }

  async getErrorById(id: string): Promise<RaftError | null> {
    try {
      return await this.repository.getErrorById(id);
    } catch (error) {
      throw new ApiError(`Failed to fetch raft error: ${(error as Error).message}`, 500);
    }
  }

  async setResolved(id: string, resolved: boolean): Promise<RaftError | null> {
    try {
      return await this.repository.setResolved(id, resolved);
    } catch (error) {
      throw new ApiError(`Failed to update raft error: ${(error as Error).message}`, 500);
    }
  }
}

export const raftService = new RaftService();
