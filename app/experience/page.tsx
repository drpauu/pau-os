import type { Metadata } from "next";
import { PageIntro, Eyebrow, ButtonLink } from "@/components/ui/Primitives";
import { ProfessionalHistory } from "@/components/professional/ProfessionalHistory";
import { professional } from "@/lib/professional";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Pau Alcázar’s experience: Data & AI Analyst at Accenture, technology tutor at Superprof and Computer Engineering graduate from UPC–EPSEVG.",
};

export default function Experience() {
  return (
    <main id="main" tabIndex={-1} className="inner-page section-wrap">
      <PageIntro
        number="02"
        title="Engineering in practice"
        description="Data, AI and cloud systems. Built with the people who need them, maintained beyond the first release."
      />
      <div className="resume-grid experience-layout">
        <aside>
          <Eyebrow>PROFESSIONAL BACKGROUND</Eyebrow>
          <p>{professional.summary}</p>
          <p className="mono muted">{professional.location}</p>
          <ButtonLink href="/resume/" primary>
            View resume
          </ButtonLink>
        </aside>
        <div>
          <ProfessionalHistory />
        </div>
      </div>
    </main>
  );
}
