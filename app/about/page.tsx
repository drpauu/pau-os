import type { Metadata } from "next";
import { PageIntro, Eyebrow, ButtonLink } from "@/components/ui/Primitives";
import { profile } from "@/lib/content";
import { professional } from "@/lib/professional";
import { ToolboxExplorer } from "@/features/toolbox/ToolboxExplorer";

export const metadata: Metadata = {
  title: "About Pau",
  description:
    "Pau Alcázar, Data & AI Engineer. Computer Engineering graduate from UPC–EPSEVG, building data systems, APIs and independent digital products.",
};

export default function About() {
  return (
    <main id="main" tabIndex={-1} className="inner-page section-wrap">
      <PageIntro
        number="03"
        title="Built on curiosity"
        description="I’m Pau. I like understanding a problem deeply enough to build something useful."
      />
      <div className="about-editorial">
        <div className="monogram-panel" aria-hidden="true">
          <span>PA</span>
          <div className="mono">ENGINEERING / DATA / PRODUCTS</div>
        </div>
        <div>
          <Eyebrow>{professional.location}</Eyebrow>
          <h2>
            From understanding.
            <br />
            To implementation.
          </h2>
          <p>{professional.summary}</p>
          <p>{professional.about}</p>
          <p>{professional.approach}</p>
          <div className="button-row">
            <ButtonLink href="/experience/" primary>
              My experience
            </ButtonLink>
            <ButtonLink href={profile.github} external>
              GitHub
            </ButtonLink>
          </div>
        </div>
      </div>
      <ToolboxExplorer />
    </main>
  );
}
