"use client";

import ClubStats from "@/components/home_sections/ClubStats";
import ContactUs from "@/components/home_sections/ContactUs";
import Faq from "@/components/home_sections/Faq";
import Hero from "@/components/home_sections/Hero";
import MailingList from "@/components/home_sections/MailingList";
import PastEvents from "@/components/home_sections/PastEvents";
import Sponsors from "@/components/home_sections/Sponsors";
import WhatWeDo from "@/components/home_sections/WhatWeDo";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { profile, isLoading, mutate } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Hero profile={profile} mutate={mutate} />
      <WhatWeDo />
      <ClubStats />
      <PastEvents />
      <Sponsors />
      <MailingList />
      <Faq />
      <ContactUs />
    </div>
  );
}
