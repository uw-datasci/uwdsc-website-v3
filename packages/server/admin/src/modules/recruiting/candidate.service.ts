import type { RecruitingCapabilities, RecruitingCycleSummary } from "@uwdsc/common/recruiting";
import type { CandidateSection, CandidateView } from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import { formatTermCode } from "@uwdsc/common/utils";
import {
  CandidateRepository,
  type AnswerLinkRow,
  type CandidatePositionRow,
} from "./candidate.repository";

type Capabilities = Pick<RecruitingCapabilities, "cycle">;

/**
 * Sort answers into General, then each applied position by priority, then anything
 * whose question is no longer linked to either.
 */
function buildSections(
  rows: readonly AnswerLinkRow[],
  positions: readonly CandidatePositionRow[]
): CandidateSection[] {
  const answers = new Map<number, AnswerLinkRow>();
  const order = new Map<string, number>();
  for (const row of rows) {
    answers.set(row.question_id, row);
    if (row.linked) order.set(`${row.position_id}:${row.question_id}`, row.sort_order ?? 0);
  }

  const placed = new Set<number>();
  const take = (positionId: number | null) =>
    [...answers.values()]
      .filter(
        (row) => !placed.has(row.question_id) && order.has(`${positionId}:${row.question_id}`)
      )
      .sort(
        (a, b) =>
          (order.get(`${positionId}:${a.question_id}`) ?? 0) -
          (order.get(`${positionId}:${b.question_id}`) ?? 0)
      )
      .map((row) => {
        placed.add(row.question_id);
        return {
          questionId: row.question_id,
          question: row.question_text,
          answer: row.answer_text,
        };
      });

  const sections: CandidateSection[] = [
    { key: "general", title: "General", subtitle: "Asked of everyone", answers: take(null) },
    ...positions.map((position) => ({
      key: `position-${position.position_id}`,
      title: `#${position.priority} · ${position.position_name}`,
      subtitle: position.subteam_name,
      answers: take(position.position_id),
    })),
  ];

  const other = [...answers.values()]
    .filter((row) => !placed.has(row.question_id))
    .map((row) => ({
      questionId: row.question_id,
      question: row.question_text,
      answer: row.answer_text,
    }));
  if (other.length > 0) {
    sections.push({ key: "other", title: "Other answers", subtitle: null, answers: other });
  }
  return sections;
}

class CandidateService {
  private readonly repository = new CandidateRepository();

  async getCandidate(caps: Capabilities, applicationId: string): Promise<CandidateView> {
    const cycle = this.requireCycle(caps);
    const candidate = await this.repository.getCandidate(cycle.id, cycle.termId, applicationId);
    if (!candidate) throw new ApiError("Candidate not found in this cycle", 404);

    try {
      const [positions, answers, pastRoles] = await Promise.all([
        this.repository.getPositions(cycle.id, applicationId),
        this.repository.getAnswers(applicationId),
        this.repository.getPastRoles(candidate.profile_id),
      ]);

      return {
        applicationId: candidate.id,
        profileId: candidate.profile_id,
        name: candidate.full_name,
        email: candidate.email,
        personalEmail: candidate.personal_email,
        program: candidate.major,
        year: candidate.year_of_study,
        location: candidate.location,
        linkedinUrl: candidate.linkedin_url,
        githubUrl: candidate.github_url,
        portfolioUrl: candidate.portfolio_url,
        returning: candidate.applicant_role === "exec" || candidate.applicant_role === "alum",
        submittedAt: candidate.submitted_at,
        pastRoles: pastRoles.map((row) => ({
          termCode: formatTermCode(row.term_code),
          positionName: row.position_name,
          subteamName: row.subteam_name,
        })),
        sections: buildSections(answers, positions),
      };
    } catch (error) {
      throw new ApiError(`Failed to load the application: ${(error as Error).message}`, 500);
    }
  }

  /** The candidate's profile id, for signing their resume. 404 outside the cycle. */
  async getResumeOwner(caps: Capabilities, applicationId: string): Promise<string> {
    const cycle = this.requireCycle(caps);
    const candidate = await this.repository.getCandidate(cycle.id, cycle.termId, applicationId);
    if (!candidate) throw new ApiError("Candidate not found in this cycle", 404);
    return candidate.profile_id;
  }

  private requireCycle(caps: Capabilities): RecruitingCycleSummary {
    if (!caps.cycle) throw new ApiError("There's no hiring cycle yet", 404);
    return caps.cycle;
  }
}

export const candidateService = new CandidateService();
