import SectionWrapper from "@/components/SectionWrapper";
import SectionTitle from "@/components/team/SectionTitle";
import TeamCard from "@/components/team/TeamCard";

import { TEAM } from "@/constants/team";

export default function Team() {
  return (
    <SectionWrapper className="pt-14 lg:pt-20">
      <h1 className="mb-14 text-center text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
        Team
      </h1>
      <div className="grid gap-32">
        {TEAM.map((subteam) => (
          <div key={subteam.id}>
            <SectionTitle mb="mb-12">{subteam.name}</SectionTitle>
            <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
              {subteam.members.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
