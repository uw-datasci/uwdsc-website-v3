"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button, cn } from "@uwdsc/ui";
import { Mail, Instagram, Linkedin, Youtube } from "react-feather";
import { RiSpotifyLine, RiTiktokLine, RiTwitterXLine } from "react-icons/ri";
import { RxDiscordLogo } from "react-icons/rx";
import type { ComponentType } from "react";

interface SocialLink {
  name: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
  hoverClassName: string;
}

const SOCIALS: SocialLink[] = [
  {
    name: "Email",
    icon: Mail,
    href: "mailto:contact@uwdatascience.ca",
    hoverClassName: "hover:text-[#0078D4]",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/uwaterloodsc/",
    hoverClassName: "hover:text-[#FF0069]",
  },
  {
    name: "Discord",
    icon: RxDiscordLogo,
    href: "https://discord.gg/VFVkyP5mgm",
    hoverClassName: "hover:text-[#5865F2]",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/company/waterloo-data-science-club/",
    hoverClassName: "hover:text-[#0A66C2]",
  },
  {
    name: "Youtube",
    icon: Youtube,
    href: "https://www.youtube.com/channel/UCknY88pglf2xz_S72WHIDxg",
    hoverClassName: "hover:text-[#FF0000]",
  },
  {
    name: "Twitter",
    icon: RiTwitterXLine,
    href: "https://twitter.com/uwaterloodsc",
    hoverClassName: "hover:text-white",
  },
  {
    name: "Tiktok",
    icon: RiTiktokLine,
    href: "https://vm.tiktok.com/ZMF3YveUq/",
    hoverClassName: "hover:text-[#25F4EE]",
  },
  {
    name: "Spotify",
    icon: RiSpotifyLine,
    href: "https://open.spotify.com/show/4iWipypyDClyRHM47JIMzg",
    hoverClassName: "hover:text-[#1DB954]",
  },
];

const tiltTransition = { type: "spring", stiffness: 400, damping: 18 } as const;

export function FooterSocialLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {SOCIALS.map((social) => {
        const Icon = social.icon;

        return (
          <motion.div
            key={social.name}
            whileHover={{ rotate: 10 }}
            transition={tiltTransition}
          >
            <Button
              size="icon"
              variant="ghost"
              asChild
              className={cn(
                "text-muted-foreground transition-colors hover:bg-transparent dark:hover:bg-transparent",
                social.hoverClassName,
              )}
            >
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
              >
                <Icon className="size-6" />
              </Link>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
