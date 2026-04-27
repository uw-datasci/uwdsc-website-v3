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

      <div className="flex flex-col justify-center items-center gap-6">
        {CONTACT_BUTTONS.map((button) => (
          <div
            key={button.id}
            className="rounded-full bg-linear-to-tr from-pink-500 to-indigo-700 p-px"
          >
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="bg-background px-4 py-6 text-sm"
            >
              <a
                href={button.href}
                target={button.id !== "email" ? "_blank" : undefined}
                rel={button.id !== "email" ? "noreferrer" : undefined}
              >
                {button.icon}
                {button.label}
              </a>
            </Button>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
