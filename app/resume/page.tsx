import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Primitives";
import { ProfessionalHistory } from "@/components/professional/ProfessionalHistory";
import { profile } from "@/lib/content";
import { professional } from "@/lib/professional";
import { PrintButton } from "@/features/resume/PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Pau Alcázar — Data & AI Engineer. Full public CV with experience, technical skills, education and selected project work.",
};

export default function Resume() {
  const resume = professional.resume;

  return (
    <main id="main" tabIndex={-1} className="inner-page section-wrap resume">
      <div className="page-intro resume-intro">
        <h1>{resume.fullName}</h1>
        <p>{resume.headline}</p>
      </div>
      <div className="button-row no-print">
        <a href="/pau-alcazar-resume.pdf" download className="button primary">
          Download public CV ↗
        </a>
        <PrintButton />
      </div>
      <div className="resume-grid">
        <aside>
          <p>{profile.location}</p>
          <p>{resume.availability}</p>
          <a href={profile.linkedin}>LinkedIn ↗</a>
          <br />
          <a href={profile.github}>GitHub ↗</a>
        </aside>
        <div className="resume-content">
          <section aria-labelledby="resume-profile-heading">
            <h2 id="resume-profile-heading">Professional summary</h2>
            <p>{resume.summary}</p>
          </section>
          <section aria-labelledby="resume-skills-heading">
            <h2 id="resume-skills-heading">Core technical skills</h2>
            <div className="resume-skills">
              {resume.skills.map((group) => (
                <article key={group.category}>
                  <h3>{group.category}</h3>
                  <p>{group.items.join(", ")}.</p>
                </article>
              ))}
            </div>
          </section>
          <ProfessionalHistory />
          <section aria-labelledby="resume-work-heading">
            <h2 id="resume-work-heading">Selected project portfolio</h2>
            {resume.selectedWork.map((project) => (
              <article className="resume-project" key={project.title}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p className="resume-project-stack">
                  <strong>Technology: </strong>
                  {project.technologies}.
                </p>
                {"url" in project && project.url && (
                  <a href={project.url}>
                    {project.url.replace("https://", "")}
                  </a>
                )}
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
