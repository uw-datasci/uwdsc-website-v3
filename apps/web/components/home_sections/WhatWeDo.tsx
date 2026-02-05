import { WHAT_WE_DO_CARDS } from "@/constants/home";
import { SectionTitle } from "@uwdsc/ui";
import WhatWeDoCard from "../home/WhatWeDoCard";
import SectionWrapper from "../SectionWrapper";

export default function WhatWeDo() {
  return (
    <SectionWrapper>
      <SectionTitle mb="my-7 md:mb-10" className="text-xl md:text-2xl!">
        WHAT WE DO
      </SectionTitle>
      <div className="mx-auto grid max-w-90 gap-6 md:max-w-180 md:grid-cols-2 xl:max-w-none xl:grid-cols-3">
        {WHAT_WE_DO_CARDS.map((card) => (
          <WhatWeDoCard {...card} key={card.title} />
        ))}
      </div>
    </SectionWrapper>
  );
}
