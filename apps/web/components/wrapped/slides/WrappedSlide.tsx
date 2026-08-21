"use client";

import type { ComponentType } from "react";
import type { WrappedSlideData } from "../types";
import { HeroSlide } from "./layouts/HeroSlide";
import { EventsNutshellSlide } from "./layouts/EventsNutshellSlide";
import { StreakSlide } from "./layouts/StreakSlide";
import { MembershipSlide } from "./layouts/MembershipSlide";
import { MinutesOnSiteSlide } from "./layouts/MinutesOnSiteSlide";
import { PasswordResetsSlide } from "./layouts/PasswordResetsSlide";
import { FunFactsSlide } from "./layouts/FunFactsSlide";
import { AwardsSlide } from "./layouts/AwardsSlide";

interface WrappedSlideProps {
  readonly slide: WrappedSlideData;
}

/** Maps each `layout` discriminant to the component that renders it. */
const SLIDE_LAYOUTS: {
  [L in WrappedSlideData["layout"]]: ComponentType<{
    slide: Extract<WrappedSlideData, { layout: L }>;
  }>;
} = {
  hero: HeroSlide,
  "events-nutshell": EventsNutshellSlide,
  streak: StreakSlide,
  membership: MembershipSlide,
  "minutes-on-site": MinutesOnSiteSlide,
  "password-resets": PasswordResetsSlide,
  "fun-facts": FunFactsSlide,
  awards: AwardsSlide,
};

/** Renders `slide` with whichever layout component matches its `layout` discriminant. */
export function WrappedSlide({ slide }: WrappedSlideProps) {
  const Layout = SLIDE_LAYOUTS[slide.layout] as ComponentType<{
    slide: WrappedSlideData;
  }>;
  return <Layout slide={slide} />;
}
