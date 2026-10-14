import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/Primitives";
import { ProjectList } from "@/features/projects/ProjectList";
import { getProjects } from "@/lib/supabase/content";
export const metadata: Metadata = {
  title: "Selected projects",
  description:
    "Four independent products and four more pinned projects spanning algorithms, data and software engineering.",
};
export default async function Projects() {
  return (
    <main id="main" tabIndex={-1} className="inner-page section-wrap">
      <PageIntro
        number="01"
        title="Selected work"
        description="Independent products first, followed by the projects you have pinned on GitHub."
      />
      <ProjectList projects={await getProjects()} />
    </main>
  );
}
