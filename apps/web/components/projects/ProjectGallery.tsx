"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Project } from "@/constants/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetail } from "./ProjectDetail";

interface ProjectGalleryProps {
  readonly projects: Project[];
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement | null>());

  const activeProject = projects.find((project) => project.id === activeId) ?? null;

  const handleClose = useCallback(() => {
    if (activeId) cardRefs.current.get(activeId)?.focus();
    setActiveId(null);
  }, [activeId]);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isActive={project.id === activeId}
          onOpen={() => setActiveId(project.id)}
          ref={(el) => {
            cardRefs.current.set(project.id, el);
          }}
        />
      ))}

      <AnimatePresence>
        {activeProject ? <ProjectDetail project={activeProject} onClose={handleClose} /> : null}
      </AnimatePresence>
    </div>
  );
}
