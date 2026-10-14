import type { Metadata } from "next";
import { PageIntro, ButtonLink, Eyebrow } from "@/components/ui/Primitives";
import { ProfessionalHistory } from "@/components/professional/ProfessionalHistory";
import { profile, projects } from "@/lib/content";
import { PrintButton } from "@/features/resume/PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Pau Alcázar — Data & AI Engineer. Verified professional experience, Computer Engineering education and selected software projects.",
};

export default function Resume() {
  return (
    <main id="main" tabIndex={-1} className="inner-page section-wrap resume">
      <PageIntro number="CV" title={profile.name} description={profile.role} />
      <div className="button-row no-print">
        <a href="/pau-alcazar-resume.pdf" download className="button primary">
          Download public CV ↗
        </a>
        <PrintButton />
      </div>
      <div className="resume-grid">
        <aside>
          <Eyebrow>PROFILE</Eyebrow>
          <p>{profile.summary}</p>
          <p>{profile.location}</p>
          <a href={profile.linkedin}>LinkedIn ↗</a>
          <br />
          <a href={profile.github}>GitHub ↗</a>
        </aside>
        <div>
          <ProfessionalHistory />
          <section aria-labelledby="resume-projects-heading">
            <Eyebrow>SELECTED INDEPENDENT PRODUCTS</Eyebrow>
            <h2 id="resume-projects-heading">Built beyond the brief.</h2>
            {projects.map((project) => (
              <article className="resume-project" key={project.slug}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a href={project.repository_url}>
                  {project.repository_url.replace("https://", "")}
                </a>
              </article>
            ))}
          </section>
        </div>
      </div>
      <div className="button-row no-print">
        <ButtonLink href="/about/#toolbox">Explore the Toolbox</ButtonLink>
        <ButtonLink href="/contact/">Start a conversation</ButtonLink>
      </div>
    </main>
  );
}
