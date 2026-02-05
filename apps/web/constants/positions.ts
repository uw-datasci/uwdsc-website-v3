/**
 * Position data structure for application form
 * This will eventually come from the database
 */

export interface PositionQuestion {
  id: string;
  question: string;
  placeholder: string;
}

export interface Position {
  id: string;
  name: string;
  questions: PositionQuestion[];
}

/**
 * Hardcoded positions for now - these can be seamlessly replaced with database data
 */
export const AVAILABLE_POSITIONS: Position[] = [
  {
    id: "events-exec",
    name: "Events Exec",
    questions: [
      {
        id: "events-experience",
        question:
          "Describe your experience organizing or coordinating events. What was your role and what did you learn?",
        placeholder:
          "Share details about events you've organized, your responsibilities, challenges faced, and outcomes...",
      },
      {
        id: "events-skills",
        question:
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
        question:
          "Tell us about your design experience and any relevant projects. Include links to your portfolio if available.",
        placeholder:
          "Describe your design skills, tools you use (Figma, Adobe CC, etc.), and link to your portfolio or past work...",
      },
      {
        id: "design-style",
        question:
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
        question:
          "What experience do you have with outreach, partnerships, or building relationships with external organizations?",
        placeholder:
          "Share your experience with networking, reaching out to companies, building partnerships, or community engagement...",
      },
      {
        id: "outreach-strategy",
        question:
          "Describe a successful outreach initiative you've led or been part of. What made it successful?",
        placeholder:
          "Tell us about a specific outreach campaign or partnership you worked on and the results achieved...",
      },
    ],
  },
];
