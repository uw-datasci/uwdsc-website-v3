import Link from "next/link";
import { Button } from "@uwdsc/ui";
import SectionWrapper from "@/components/SectionWrapper";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { PROJECTS } from "@/constants/projects";

export default function ProjectsPage() {
  return (
    <SectionWrapper className="pt-14 lg:pt-20">
      <ProjectsHero />

      <div className="mt-16">
        <ProjectGallery projects={PROJECTS} />
      </div>

      <div className="mt-20 flex flex-col items-center gap-4 text-center">
        <p className="text-grey2">Want to build something like this with us?</p>
        <div className="rounded-full bg-linear-to-tr from-pink-500 to-indigo-700 p-px">
          <Button asChild variant="ghost" size="lg" className="bg-background px-6 py-6 text-sm">
            <Link href="/#contact">Get involved →</Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
