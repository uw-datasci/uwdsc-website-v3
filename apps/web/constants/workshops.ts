import type { LucideIcon } from "lucide-react";
import { Binary, Brain, Database, LineChart, Network, Sparkles } from "lucide-react";

export interface WorkshopPillar {
  id: string;
  title: string;
  blurb: string;
  topics: string[];
  icon: LucideIcon;
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
    blurb:
      "The everyday toolkit: wrangling messy datasets, cleaning columns, and getting from raw CSV to something you can actually analyze.",
    topics: ["Pandas", "NumPy", "Data cleaning", "Jupyter"],
    icon: Binary,
  },
  {
    id: "data-viz",
    title: "Data Visualization & Storytelling",
    blurb:
      "Turning numbers into charts people understand — and charts into a narrative that actually makes a case.",
    topics: ["Matplotlib", "Seaborn", "Dashboards", "Presenting findings"],
    icon: LineChart,
  },
  {
    id: "ml-foundations",
    title: "ML Foundations",
    blurb:
      "The core ideas behind machine learning: regression, classification, and how to know if a model is actually working.",
    topics: ["Regression", "Classification", "scikit-learn", "Model evaluation"],
    icon: Brain,
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    blurb:
      "Neural networks from first principles through to the architectures behind modern computer vision and NLP.",
    topics: ["Neural networks", "PyTorch", "Computer vision", "NLP"],
    icon: Network,
  },
  {
    id: "real-data",
    title: "Working with Real Data",
    blurb:
      "Databases, APIs, and the unglamorous plumbing that gets data from the real world into a notebook.",
    topics: ["SQL", "APIs", "Web scraping", "Data pipelines"],
    icon: Database,
  },
  {
    id: "applied-projects",
    title: "Applied Projects",
    blurb:
      "Workshops built around a real dataset and a real question — practicing the full pipeline end to end, not just the theory.",
    topics: ["End-to-end projects", "Kaggle", "Reproducibility", "Team workflows"],
    icon: Sparkles,
  },
];
