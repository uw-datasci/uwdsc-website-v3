import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import { WorkshopsHero } from "@/components/workshops/WorkshopsHero";
import { UpcomingWorkshop } from "@/components/workshops/UpcomingWorkshop";
import { WhatWeTeach } from "@/components/workshops/WhatWeTeach";
import { PastWorkshopsArchive } from "@/components/workshops/PastWorkshopsArchive";
import { eventService } from "@uwdsc/core";

export const dynamic = "force-dynamic";

export default async function WorkshopsPage() {
  const workshops = await eventService.getEventsByCategory("workshop");

  // getEventsByCategory orders by start_time DESC. Filtering preserves that order, which is
  // exactly what the past archive wants (most recent first); upcoming needs the opposite
  // (soonest first), so it's re-sorted ascending.
  const now = Date.now();
  const upcoming = workshops
    .filter((event) => new Date(event.end_time).getTime() >= now)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  const past = workshops.filter((event) => new Date(event.end_time).getTime() < now);

  return (
    <SectionWrapper className="pt-14 lg:pt-20">
      <WorkshopsHero />

      {workshops.length === 0 ? (
        <div className="mb-16 flex flex-col items-center gap-2 rounded-3xl border border-grey3 px-8 py-12 text-center">
          <p className="text-lg font-medium text-white">
            This term&apos;s workshop schedule is being finalized.
          </p>
          <p className="text-grey2">
            Check the{" "}
            <Link href="/calendar" className="text-white underline underline-offset-4">
              calendar
            </Link>{" "}
            for everything else we&apos;ve got coming up.
          </p>
        </div>
      ) : (
        <div className="mb-16 flex flex-col gap-16">
          {upcoming.length > 0 && <UpcomingWorkshop events={upcoming} />}
          <PastWorkshopsArchive events={past} />
        </div>
      )}

      <WhatWeTeach />
    </SectionWrapper>
  );
}
