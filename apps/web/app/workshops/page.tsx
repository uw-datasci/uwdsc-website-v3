import SectionWrapper from "@/components/SectionWrapper";
import { UpcomingWorkshop } from "@/components/workshops/UpcomingWorkshop";
import { WhatWeDo } from "@/components/workshops/WhatWeDo";
import { PastWorkshopsArchive } from "@/components/workshops/PastWorkshopsArchive";
import { WorkshopsCta } from "@/components/workshops/WorkshopsCta";
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
      <h1 className="my-14 text-center text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
        Workshops
      </h1>

      <div className="flex flex-col gap-16">
        <WhatWeDo />
        {upcoming.length > 0 && <UpcomingWorkshop events={upcoming} />}
        <PastWorkshopsArchive events={past} />
      </div>

      <WorkshopsCta />
    </SectionWrapper>
  );
}
