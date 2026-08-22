"use client";

import { CountingNumber } from "@uwdsc/ui";
import { PROJECTS } from "@/constants/projects";

const projectCount = PROJECTS.length;
const builderCount = PROJECTS.reduce((total, project) => total + project.team.length, 0);
const topicCount = new Set(PROJECTS.map((project) => project.topic)).size;

const STATS = [
  { label: "Projects Shipped", value: projectCount, suffix: "+" },
  { label: "Student Builders", value: builderCount, suffix: "+" },
  { label: "Areas Explored", value: topicCount, suffix: "" },
];

export function ProjectsHero() {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="bg-primary/20 pointer-events-none absolute left-1/2 top-0 -z-10 h-112 w-md -translate-x-1/2 -translate-y-1/3 rounded-full blur-[120px]" />

      <h1 className="my-6 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">Projects</h1>
      <p className="mx-auto mb-14 max-w-2xl text-sm text-grey2 sm:text-lg">
        Student-led builds spanning NLP, computer vision, and beyond!
        <br />
        Conceived, designed, and shipped by DSC project teams each term.
      </p>

      <div className="grid w-full max-w-2xl grid-cols-3 gap-6 sm:gap-10">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-2">
            <p className="font-family-clash flex items-center justify-center text-3xl font-bold text-white sm:text-5xl">
              <CountingNumber number={stat.value} inView inViewOnce />
              {stat.suffix}
            </p>
            <p className="gradient-text bg-linear-to-b from-white to-[#ffffff80] text-xs font-bold sm:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
