"use client";

import { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, X } from "lucide-react";
import { Button } from "@uwdsc/ui";
import type { Project } from "@/constants/projects";
import { TopicBadge } from "./TopicBadge";

interface ProjectDetailProps {
  readonly project: Project;
  readonly onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        layoutId={reduceMotion ? undefined : `project-shell-${project.id}`}
        onClick={(event) => event.stopPropagation()}
        className="relative my-auto flex max-h-[85dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-grey2 bg-background focus:outline-none"
      >
        <div className="bg-gradient-purple absolute inset-0 opacity-[0.07]" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full text-white hover:bg-white/10"
        >
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="relative overflow-y-auto p-8 sm:p-10">
          <motion.div
            layoutId={reduceMotion ? undefined : `project-badge-${project.id}`}
            className="mb-4 w-fit"
          >
            <TopicBadge topic={project.topic} />
          </motion.div>

          <motion.h2
            id={titleId}
            layoutId={reduceMotion ? undefined : `project-title-${project.id}`}
            className="mb-6 pr-10 text-3xl font-bold text-white sm:text-4xl"
          >
            {project.title}
          </motion.h2>

          <p className="mb-8 leading-loose text-grey1">{project.description}</p>

          <div className="mb-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-grey2">Team</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {project.team.map((member) => (
                <li
                  key={member.name}
                  className="flex items-center justify-between gap-3 rounded-lg bg-grey3/20 px-4 py-3"
                >
                  <span className="font-medium text-white">{member.name}</span>
                  <span className="shrink-0 rounded-full bg-grey3/40 px-3 py-1 text-xs text-grey1">
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-purple inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-transform duration-200 hover:scale-105"
          >
            <Github className="h-4 w-4 shrink-0" aria-hidden="true" />
            View repo
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
