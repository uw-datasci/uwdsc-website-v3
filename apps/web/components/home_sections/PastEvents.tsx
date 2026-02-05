import { PAST_EVENTS } from "@/constants/home";
import EventCard from "../home/EventCard";
import SectionWrapper from "../SectionWrapper";
import {
  SectionTitle,
  Carousel,
  CarouselPrevious,
  CarouselNext,
  CarouselContent,
  CarouselItem,
} from "@uwdsc/ui";

export default function PastEvents() {
  return (
    <SectionWrapper>
      <SectionTitle
        mb="mb-8 lg:mb-12"
        className="text-xl md:text-2xl! text-nowrap"
      >
        Past Events
      </SectionTitle>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-62.5 md:max-w-2xl xl:max-w-6xl"
      >
        <CarouselPrevious className="rounded-md md:p-5! border-purple-500!" />

        <CarouselNext className="rounded-md md:p-5! border-purple-500!" />
        <CarouselContent className="">
          {/* // TODO: Replace constant with fetch from db - add case for loading, or empty events - refer to website-v2*/}
          {PAST_EVENTS.map((event, index) => (
            <CarouselItem key={index} className="md:basis-1/2 xl:basis-1/3">
              <div className="p-1">
                <EventCard {...event} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </SectionWrapper>
  );
}
