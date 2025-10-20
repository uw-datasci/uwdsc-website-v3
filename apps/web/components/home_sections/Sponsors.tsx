import { CURRENT_SPONSORS } from "@/constants/home";
import SectionTitle from "../team/SectionTitle";
import Link from "next/link";
import Image from "next/image";

export default function Sponsors() {
  return (
    <section className="mx-7 sm:mx-9 md:mx-12 xl:mx-auto xl:max-w-[1200px] mb-24 lg:mb-52 pt-14 lg:pt-20">
      <SectionTitle mb="mb-20" className="text-xl md:!text-2xl text-nowrap">
        OUR SPONSORS
      </SectionTitle>
      <div className="flex flex-wrap justify-center items-center gap-20 md:gap-24 lg:gap-32">
        {CURRENT_SPONSORS.map((sponsor) => {
          return sponsor.link ? (
            <Link
              href={sponsor.link}
              rel="noopener noreferrer"
              target="_blank"
              key={sponsor.name}
              className="flex items-center justify-center"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={200}
                height={100}
                className="w-auto h-20 lg:h-24 object-contain"
              />
            </Link>
          ) : (
            <div
              key={sponsor.name}
              className="flex items-center justify-center"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={200}
                height={100}
                className="w-auto h-20 lg:h-24 object-contain"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
