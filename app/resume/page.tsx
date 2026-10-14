import type { Metadata } from "next";
import { PageIntro, ButtonLink, Eyebrow } from "@/components/ui/Primitives";
import { profile, projects } from "@/lib/content";
import { PrintButton } from "@/features/resume/PrintButton";
export const metadata: Metadata = {
  title: "Resume",
  description:
    "Pau Alcázar — software engineering, data and AI. Computer Science graduate from UPC. Experience at Accenture.",
};
export default function Resume() {
  return (
    <main id="main" tabIndex={-1} className="inner-page section-wrap resume">
      <PageIntro number="04" title="Pau Alcázar" description={profile.role} />
      <div className="button-row no-print">
        <a href="/pau-alcazar-resume.pdf" download className="button primary">
          Download PDF ↗
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
          <section>
            <Eyebrow>PROFESSIONAL EXPERIENCE</Eyebrow>
            <h2>Accenture</h2>
            <h3>Data & AI Consultant · Analyst</h3>
            <p>
              Professional experience in data and technology, connecting
              analysis with implementation.
            </p>
          </section>
          <section>
            <Eyebrow>EDUCATION</Eyebrow>
            <h2>Computer Science</h2>
            <p>Universitat Politècnica de Catalunya (UPC)</p>
          </section>
          <section>
            <Eyebrow>SELECTED PRODUCTS</Eyebrow>
            {projects.map((p) => (
              <div className="resume-project" key={p.slug}>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <a href={p.repository_url}>
                  {p.repository_url.replace("https://", "")}
                </a>
              </div>
            ))}
          </section>
          <section>
            <Eyebrow>TECHNICAL PRACTICE</Eyebrow>
            <p>{Object.values(profile.skills).flat().join(" · ")}</p>
          </section>
          <section>
            <Eyebrow>BEYOND ENGINEERING</Eyebrow>
            <p>High-performance sport. Catalan, Spanish and English.</p>
          </section>
        </div>
      </div>
      <div className="no-print">
        <ButtonLink href="/contact/">Start a conversation</ButtonLink>
      </div>
    </main>
  );
}
