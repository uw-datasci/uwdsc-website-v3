"use client";

import { forwardRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Github, Users } from "lucide-react";
import { PROJECT_TOPICS, type Project } from "@/constants/projects";
import { TopicBadge } from "./TopicBadge";
import { TopicMotif } from "./TopicMotif";

interface ProjectCardProps {
  readonly project: Project;
  readonly isActive: boolean;
  readonly onOpen: () => void;
}

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(function ProjectCard(
  { project, isActive, onOpen },
  ref,
) {
  const { motifClass } = PROJECT_TOPICS[project.topic];

  // Only open when the card itself is focused — otherwise Enter/Space on the
  // nested "View repo" link would bubble here and fire both actions at once.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      layoutId={`project-shell-${project.id}`}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      style={{ opacity: isActive ? 0 : 1, pointerEvents: isActive ? "none" : "auto" }}
      className="group relative flex h-full cursor-pointer flex-col items-start gap-4 overflow-hidden rounded-3xl border border-grey3 p-6 text-left duration-300 ease-in-out hover:border-grey2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="bg-gradient-purple absolute inset-0 opacity-[0.07] transition-opacity duration-300 ease-in-out group-hover:opacity-15" />

      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-32 w-32 opacity-15 transition-opacity duration-300 ease-in-out group-hover:opacity-30 ${motifClass}`}
      >
        <TopicMotif topic={project.topic} />
      </div>

      <motion.div layoutId={`project-badge-${project.id}`} className="relative z-10">
        <TopicBadge topic={project.topic} />
      </motion.div>

      <motion.h3
        layoutId={`project-title-${project.id}`}
        className="relative z-10 text-2xl font-bold text-white"
      >
        {project.title}
      </motion.h3>

      <p className="relative z-10 line-clamp-3 flex-1 leading-loose text-grey2 duration-300 ease-in-out group-hover:text-grey1">
        {project.description}
      </p>

      <div className="relative z-10 flex w-full items-center justify-between text-sm text-grey2">
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
          {project.team.length} {project.team.length === 1 ? "member" : "members"}
        </span>
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="flex items-center gap-2 rounded-sm underline-offset-4 transition-colors duration-300 ease-in-out hover:text-white hover:underline focus-visible:text-white focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background group-hover:text-grey1"
        >
          <Github className="h-4 w-4 shrink-0" aria-hidden="true" />
          View repo
        </a>
      </div>
    </motion.div>
  );
});
