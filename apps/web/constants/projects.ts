export type ProjectTopic = "nlp" | "computer-vision" | "recommendations" | "unsupervised";

interface ProjectTopicMeta {
  label: string;
  badgeClass: string;
  motifClass: string;
}

interface ProjectMember {
  name: string;
  role: string;
}

export interface Project {
  id: string;
  title: string;
  topic: ProjectTopic;
  repo: string;
  description: string;
  team: ProjectMember[];
}

export const PROJECT_TOPICS: Record<ProjectTopic, ProjectTopicMeta> = {
  nlp: {
    label: "NLP",
    badgeClass: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    motifClass: "text-violet-400",
  },
  "computer-vision": {
    label: "Computer Vision",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    motifClass: "text-emerald-400",
  },
  recommendations: {
    label: "Recommendation Systems",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    motifClass: "text-amber-400",
  },
  unsupervised: {
    label: "Unsupervised Learning",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    motifClass: "text-sky-400",
  },
};

export const PROJECTS: Project[] = [
  {
    id: "crm-importer",
    title: "LLM-Assisted CRM Importer & Grounded Query System",
    topic: "nlp",
    repo: "https://github.com/UW-DSC-PROJ-JAN2026/main",
    description:
      "This project is an LLM-Assisted CRM Importer and Grounded Query System that converts CSV/XLSX exports into strict, schema-validated JSON and enables safe natural-language querying. The system uses LLMs for structured field mapping and parsing, while deterministic validation, normalization, and guarded query planning ensure all outputs are grounded in real database records.",
    team: [
      { name: "Abeer Kashar", role: "Project Manager" },
      { name: "Nikiel Lange", role: "ML Engineer" },
      { name: "Ethan Fung", role: "ML Engineer" },
      { name: "Paul Park", role: "ML Engineer" },
      { name: "Harishan Ganeshanathan", role: "ML Engineer" },
    ],
  },
  {
    id: "therapy-agent",
    title: "Therapy-Style Conversational Agent",
    topic: "nlp",
    repo: "https://github.com/uw-datasci/ProjectC",
    description:
      "This project builds a systematic evaluation framework to study how prompt-engineered guardrails behave under benign, ambiguous, and adversarial inputs. It belongs to the area of AI safety and responsible AI research by using a high-risk conversational setting as a controlled testbed to surface real failure modes like boundary erosion, hallucinated authority, and instruction leakage. Rather than building a production therapy tool, the agent is deliberately scoped as an experimental system with explicit non-goals, making it an ideal environment to probe where LLM guardrails hold and where they break.",
    team: [
      { name: "Luna Nguyen", role: "Project Manager" },
      { name: "Fouzan Abdullah", role: "Mentor" },
      { name: "Ruben Ispiryan", role: "ML Engineer" },
      { name: "Alia Cai", role: "QA/ML Engineer" },
      { name: "Matthew Li", role: "ML Engineer" },
    ],
  },
  {
    id: "parcourslab",
    title: "ParcoursLab",
    topic: "recommendations",
    repo: "https://github.com/aaryanshroff/parcours-lab",
    description:
      "ParcoursLab is a natural-language based course recommendation system grounded in a human-curated skills database that builds a personalized learning roadmap for your career or university degree. It can both parse your resume and the posting for your dream job to help you identify and develop required skills, as well as curate just the right electives to get you into grad school for the field you want. Discover a more intelligent way to plan your degree than just a checklist, while still prioritizing transparency, agency, and human feedback.",
    team: [
      { name: "Aaryan Shroff", role: "Project Manager" },
      { name: "Aditi Jha", role: "Backend Engineer" },
      { name: "Dishita Chawla", role: "Backend Engineer" },
      { name: "Amanda Xi", role: "Frontend Engineer" },
      { name: "Jaemin Ham", role: "ML Engineer" },
    ],
  },
  {
    id: "clearscan",
    title: "ClearScan",
    topic: "computer-vision",
    repo: "https://github.com/uw-datasci/ProjectB",
    description:
      "ClearScan is a hybrid barcode recognition system designed to improve reliability under real-world imaging conditions. The system first uses a standard high-speed barcode decoder for normal cases. If decoding fails or confidence is low, the image is automatically routed to a trained computer vision model that is optimized for damaged and degraded barcodes. This fallback mechanism allows the system to recover codes that would otherwise require manual intervention, while maintaining fast performance on clean inputs.",
    team: [
      { name: "Sharanya Basu", role: "Project Manager" },
      { name: "Alex Xu", role: "ML Engineer" },
      { name: "Rohan Saha", role: "ML Engineer" },
      { name: "Sandy Banh", role: "ML Engineer" },
    ],
  },
  {
    id: "shifting-lines",
    title: "Shifting Lines",
    topic: "unsupervised",
    repo: "https://github.com/uw-datasci/Shifting-Lines-Visualizing-NHL-Role-Crossover",
    description:
      'Shifting Lines is a project that asks: are some NHL "defensemen" actually playing like forwards, and could teams be misusing talent by locking players into rigid roles? Inspired by a game where two defensemen scored back-to-back goals, it uses stats and clustering to group players by how they actually play rather than their official position.',
    team: [{ name: "Jeffrey Kasa", role: "Project Owner" }],
  },
  {
    id: "word-cloud",
    title: "Word Cloud",
    topic: "nlp",
    repo: "https://github.com/uw-datasci/Word-Cloud",
    description:
      "Word-Cloud turns a big dump of Postmedia news articles into visual and analytical insights. It parses raw articles into a clean, organized dataset, automatically sorting each one into topics like Business or Politics. From there, it prepares the text in two ways: one version strips things down to core keywords for generating word clouds and spotting trends, while the other keeps the text natural and intact so it can be analyzed for sentiment.",
    team: [{ name: "Tanay Kashyap", role: "Project Owner" }],
  },
  {
    id: "viennalytics",
    title: "Viennalytics",
    topic: "unsupervised",
    repo: "https://github.com/elphoun/viennalytics",
    description:
      "Viennalytics is a stylized chess analytics site that turns a huge archive of real games into something you can actually explore. It has two main parts: a written report with interactive charts that walks through interesting findings (which openings win most, how skill level affects results, which moves players tend to follow up with), and a live opening explorer where you can search any chess opening, see it played out on a chessboard, and instantly get its win rate, popularity, and engine evaluation.",
    team: [{ name: "Michael Zhang", role: "Project Owner" }],
  },
];

/** Not used yet — kept so wiring up topic filter pills later is a small change. */
export function filterProjectsByTopic(
  projects: Project[],
  topic: ProjectTopic | "all"
): Project[] {
  if (topic === "all") return projects;
  return projects.filter((project) => project.topic === topic);
}

export function getTopicCounts(projects: Project[]): Record<ProjectTopic, number> {
  const counts = {
    nlp: 0,
    "computer-vision": 0,
    recommendations: 0,
    unsupervised: 0,
  } satisfies Record<ProjectTopic, number>;

  for (const project of projects) counts[project.topic] += 1;

  return counts;
}
