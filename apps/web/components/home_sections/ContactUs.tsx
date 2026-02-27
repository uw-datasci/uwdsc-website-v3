import { Instagram, Mail } from "react-feather";
import { RxDiscordLogo } from "react-icons/rx";
import SectionWrapper from "../SectionWrapper";
import { Button } from "@uwdsc/ui";

const CONTACT_BUTTONS = [
  {
    id: "email",
    label: "contact@uwdatascience.ca",
    href: "mailto:contact@uwdatascience.ca",
    icon: <Mail className="w-5 text-white" />,
  },
  {
    id: "instagram",
    label: "@uwaterloodsc",
    href: "https://www.instagram.com/uwaterloodsc/",
    icon: <Instagram className="w-5 text-white" />,
  },
  {
    id: "discord",
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
        {CONTACT_BUTTONS.map((button) => (
          <Button
            key={button.id}
            variant="default"
            size="lg"
            className="text-sm px-3 py-1"
          >
            {button.icon}
            {button.label}
          </Button>
        ))}
      </div>
    </SectionWrapper>
  );
}
