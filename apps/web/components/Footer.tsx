import { Button } from "@uwdsc/ui";
import Image from "next/image";
import Link from "next/link";
import { Mail, Instagram, Linkedin, Youtube } from "react-feather";
import { RiSpotifyLine, RiTiktokLine, RiTwitterXLine } from "react-icons/ri";
import { RxDiscordLogo } from "react-icons/rx";

const SOCIALS = [
  {
    name: "Email",
    icon: <Mail className="size-6" />,
    href: "mailto:contact@uwdatascience.ca",
  },
  {
    name: "Instagram",
    icon: <Instagram className="size-6" />,
    href: "https://www.instagram.com/uwaterloodsc/",
  },
  {
    name: "Discord",
    icon: <RxDiscordLogo className="size-6" />,
    href: "https://discord.gg/VFVkyP5mgm",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="size-6" />,
    href: "https://www.linkedin.com/company/waterloo-data-science-club/",
  },
  {
    name: "Youtube",
    icon: <Youtube className="size-6" />,
    href: "https://www.youtube.com/channel/UCknY88pglf2xz_S72WHIDxg",
  },
  {
    name: "Twitter",
    icon: <RiTwitterXLine className="size-6" />,
    href: "https://twitter.com/uwaterloodsc",
  },
  {
    name: "Tiktok",
    icon: <RiTiktokLine className="size-6" />,
    href: "https://vm.tiktok.com/ZMF3YveUq/",
  },
  {
    name: "Spotify",
    icon: <RiSpotifyLine className="size-6" />,
    href: "https://open.spotify.com/show/4iWipypyDClyRHM47JIMzg",
  },
];

export default function Footer() {
  return (
    <>
      <hr className="border-b border-[#454545]" />
      <footer className="mx-container mb-12 mt-9 flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center sm:items-start">
          <Link
            href="/"
            className="relative w-11.5 h-11.5 lg:w-13.5 lg:h-13.5 mb-4 hover:cursor-pointer block"
          >
            <Image
              src="/logos/dsc.svg"
              alt="uwdsc logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
          <a
            href="mailto:contact@uwdatascience.ca"
            className="font-medium text-white"
          >
            contact@uwdatascience.ca
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {SOCIALS.map((social) => (
            <Button size="icon" key={social.name} variant="ghost">
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </Link>
            </Button>
          ))}
        </div>
      </footer>
    </>
  );
}
