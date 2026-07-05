"use client";

import type { ComponentType } from "react";
import type { WrappedSlideData } from "../types";
import { HeroSlide } from "./layouts/HeroSlide";
import { EventsNutshellSlide } from "./layouts/EventsNutshellSlide";
import { StreakSlide } from "./layouts/StreakSlide";
import { MembershipSlide } from "./layouts/MembershipSlide";

interface WrappedSlideProps {
  readonly slide: WrappedSlideData;
}


const SLIDE_LAYOUTS: {
  [L in WrappedSlideData["layout"]]: ComponentType<{
    slide: Extract<WrappedSlideData, { layout: L }>;
  }>;
} = {
  hero: HeroSlide,
  "events-nutshell": EventsNutshellSlide,
  streak: StreakSlide,
  membership: MembershipSlide,
};


export function WrappedSlide({ slide }: WrappedSlideProps) {
  const Layout = SLIDE_LAYOUTS[slide.layout] as ComponentType<{
    slide: WrappedSlideData;
  }>;
  return <Layout slide={slide} />;
}
