import Image, { type StaticImageData } from "next/image";

interface WhatWeDoCardProps {
  title: string;
  description: string;
  graphic: StaticImageData;
};

/**
 * Card to display what we do
 * ex. WHAT WE DO section on home page
 */

export default function WhatWeDoCard({
  title,
  description,
  graphic,
}: Readonly<WhatWeDoCardProps>) {
  return (
    <div className="duration-300 ease-in-out group relative flex aspect-3/2 flex-col justify-end overflow-hidden rounded-3xl border border-grey3 px-6 pb-8 hover:border-grey2">
      <div className="z-10">
        <h4 className="mb-2 text-2xl font-bold text-white">{title}</h4>
        <p className="duration-300 ease-in-out leading-loose text-grey2 group-hover:text-grey1 xl:text-lg">
          {description}
        </p>
      </div>
      <Image
        src={graphic}
        alt={title}
        className="duration-300 ease-in-out absolute -right-[10%] -top-[10%] w-[60%] opacity-20 group-hover:opacity-40"
      />
    </div>
  );
}
