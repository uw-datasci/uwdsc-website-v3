import SectionWrapper from "@/components/SectionWrapper";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectsCta } from "@/components/projects/ProjectsCta";
import { PROJECTS } from "@/constants/projects";

export default function ProjectsPage() {
  return (
    <SectionWrapper className="pt-14 lg:pt-20">
      <ProjectsHero />

      <div className="mt-16">
        <ProjectGallery projects={PROJECTS} />
      </div>

      <ProjectsCta />
    </SectionWrapper>
  );
}
