import type { ExecPosition, Question } from "@uwdsc/common/types";

/**
 * Position with questions for application form.
 * Uses ExecPosition (id, name) + questions from DB (Question has question_text).
 */
export interface PositionWithQuestions extends ExecPosition {
  questions: Pick<Question, "id" | "question_text" | "placeholder">[];
}

/**
 * Hardcoded positions for now - these can be seamlessly replaced with database data
 */
export const AVAILABLE_POSITIONS: PositionWithQuestions[] = [
  {
    id: "events-exec",
    name: "Events Exec",
    questions: [
      {
        id: "events-experience",
        question_text:
          "Describe your experience organizing or coordinating events. What was your role and what did you learn?",
        placeholder:
          "Share details about events you've organized, your responsibilities, challenges faced, and outcomes...",
      },
      {
        id: "events-skills",
        question_text:
          "What specific skills do you bring to event planning and execution? (e.g., logistics, vendor management, team coordination)",
        placeholder:
          "Describe your relevant skills and how you've applied them in past events...",
      },
    ],
  },
  {
    id: "design-exec",
    name: "Design Exec",
    questions: [
      {
        id: "design-portfolio",
        question_text:
          "Tell us about your design experience and any relevant projects. Include links to your portfolio if available.",
        placeholder:
          "Describe your design skills, tools you use (Figma, Adobe CC, etc.), and link to your portfolio or past work...",
      },
      {
        id: "design-style",
        question_text:
          "How would you describe your design style and approach? What type of design work are you most passionate about?",
        placeholder:
          "Share your design philosophy, preferred styles, and what excites you most about design...",
      },
    ],
  },
  {
    id: "outreach-exec",
    name: "Outreach Exec",
    questions: [
      {
        id: "outreach-experience",
        question_text:
          "What experience do you have with outreach, partnerships, or building relationships with external organizations?",
        placeholder:
          "Share your experience with networking, reaching out to companies, building partnerships, or community engagement...",
      },
      {
        id: "outreach-strategy",
        question_text:
          "Describe a successful outreach initiative you've led or been part of. What made it successful?",
        placeholder:
          "Tell us about a specific outreach campaign or partnership you worked on and the results achieved...",
      },
    ],
  },
];
