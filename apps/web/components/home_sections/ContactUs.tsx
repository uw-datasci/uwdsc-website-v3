import { Instagram, Mail } from "react-feather";
import { RxDiscordLogo } from "react-icons/rx";
import SectionWrapper from "../SectionWrapper";
import Chip from "../home/Chip";

const CHIPS = [
  {
    label: "contact@uwdatascience.ca",
    href: "mailto:contact@uwdatascience.ca",
    icon: <Mail className="w-5 text-white" />,
  },
  {
    label: "@uwaterloodsc",
    href: "https://www.instagram.com/uwaterloodsc/",
    icon: <Instagram className="w-5 text-white" />,
  },
  {
    label: "discord.gg/VFVkyP5mgm",
    href: "https://discord.gg/VFVkyP5mgm",
    icon: <RxDiscordLogo size={24} className="text-white" />,
  },
];

export default function ContactUs() {
  return (
    <SectionWrapper
      id="contact"
      className="grid gap-10 md:grid-cols-2 md:gap-16"
    >
      <div>
        <h2 className="mb-7 text-4xl font-bold text-white md:text-5xl xl:text-6xl">
          Contact Us
        </h2>
        <p className="leading-loose text-white md:text-lg lg:text-md xl:text-lg">
          Have a question or interested in sponsoring us? Send us a message
          through our social medias, or even visit our office at{" "}
          <span className="font-bold">MC 3031</span>. We&apos;ll get back to you
          ASAP!
        </p>
      </div>

      <div className="flex flex-col justify-center items-center gap-4">
        {CHIPS.map((chip, i) => (
          <div
            key={`chip-${i}`}
            className="w-40 text-sm px-3 py-1"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Chip icon={chip.icon} href={chip.href}>
              {chip.label}
            </Chip>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
