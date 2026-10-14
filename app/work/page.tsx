import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/Primitives";
import { ProjectList } from "@/features/projects/ProjectList";
import { getProjects } from "@/lib/supabase/content";
export const metadata: Metadata = {
  title: "Selected projects",
  description:
    "Camí Curt, ATHRA, Alcoholfabet and TrackFlow: verified engineering case studies.",
};
export default async function Projects() {
  return (
    <main id="main" tabIndex={-1} className="inner-page section-wrap">
      <PageIntro
        number="01"
        title="Selected work"
        description="Independent products. Real constraints. A closer look at the decisions behind the interface."
      />
      <ProjectList projects={await getProjects()} />
    </main>
  );
}
