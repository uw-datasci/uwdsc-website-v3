export type PillarId =
  | "python-pandas"
  | "data-viz"
  | "ml-foundations"
  | "deep-learning"
  | "real-data"
  | "applied-projects";

export interface WorkshopPillar {
  id: PillarId;
  title: string;
  blurb: string;
  topics: string[];
  /** Motif tint, e.g. "text-violet-400" — matches PROJECT_TOPICS' accent convention. */
  motifClass: string;
  /** Topic-chip tint. */
  chipClass: string;
}

/**
 * Curated "what we teach" pillars for the /workshops page. Hardcoded editorially (same pattern
 * as constants/projects.ts) rather than derived from past events, since the workshop archive is
 * often thin or empty and this section needs to read well on day one regardless.
 */
export const WORKSHOP_PILLARS: WorkshopPillar[] = [
  {
    id: "python-pandas",
    title: "Python & Pandas",
    blurb: "Wrangle messy datasets and get from raw CSV to something you can analyze.",
    topics: ["Pandas", "NumPy", "Data cleaning", "Jupyter"],
    motifClass: "text-violet-400",
    chipClass: "bg-violet-500/10 text-violet-200/90",
  },
  {
    id: "data-viz",
    title: "Data Visualization & Storytelling",
    blurb: "Turn numbers into charts people understand, and charts into a real narrative.",
    topics: ["Matplotlib", "Seaborn", "Dashboards", "Presenting findings"],
    motifClass: "text-sky-400",
    chipClass: "bg-sky-500/10 text-sky-200/90",
  },
  {
    id: "ml-foundations",
    title: "ML Foundations",
    blurb: "Core ML ideas: regression, classification, and how to tell if a model works.",
    topics: ["Regression", "Classification", "scikit-learn", "Model evaluation"],
    motifClass: "text-emerald-400",
    chipClass: "bg-emerald-500/10 text-emerald-200/90",
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    blurb:
      "Neural networks from first principles to the architectures behind modern CV and NLP.",
    topics: ["Neural networks", "PyTorch", "Computer vision", "NLP"],
    motifClass: "text-amber-400",
    chipClass: "bg-amber-500/10 text-amber-200/90",
  },
  {
    id: "real-data",
    title: "Working with Real Data",
    blurb: "Databases, APIs, and the plumbing that gets real-world data into a notebook.",
    topics: ["SQL", "APIs", "Web scraping", "Data pipelines"],
    motifClass: "text-rose-400",
    chipClass: "bg-rose-500/10 text-rose-200/90",
  },
  {
    id: "applied-projects",
    title: "Applied Projects",
    blurb: "Built around a real dataset and question, practicing the full pipeline end to end.",
    topics: ["End-to-end projects", "Kaggle", "Reproducibility", "Team workflows"],
    motifClass: "text-cyan-400",
    chipClass: "bg-cyan-500/10 text-cyan-200/90",
  },
];
