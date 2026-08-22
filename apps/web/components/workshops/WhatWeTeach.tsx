import { SectionTitle } from "@uwdsc/ui";
import { WORKSHOP_PILLARS } from "@/constants/workshops";

/**
 * Curated "what we teach" grid. This is what makes the page worth visiting even before any
 * event has been tagged as a workshop -- see the empty-state note in PastWorkshopsArchive.
 */
export function WhatWeTeach() {
  return (
    <div>
      <SectionTitle mb="mb-8 lg:mb-12" className="text-xl md:text-2xl!">
        What We Teach
      </SectionTitle>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {WORKSHOP_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-grey3 p-6 duration-300 ease-in-out hover:border-grey2"
            >
              <div className="bg-gradient-purple absolute inset-0 opacity-[0.07] transition-opacity duration-300 ease-in-out group-hover:opacity-15" />

              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grey3/30">
                  <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
              </div>

              <p className="relative z-10 leading-loose text-grey2 duration-300 ease-in-out group-hover:text-grey1">
                {pillar.blurb}
              </p>

              <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-2">
                {pillar.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-grey3/20 px-3 py-1 text-xs text-grey1"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
