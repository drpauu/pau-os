import type { Metadata } from "next";
import { PageIntro, Eyebrow, ButtonLink } from "@/components/ui/Primitives";
import { profile } from "@/lib/content";
export const metadata: Metadata = {
  title: "About Pau",
  description:
    "Pau Alcázar: Computer Science graduate from UPC, Data & AI consultant, software engineer and high-performance athlete.",
};
export default function About() {
  return (
    <main id="main" tabIndex={-1} className="inner-page section-wrap">
      <PageIntro
        number="02"
        title="Built on curiosity"
        description="I’m Pau. An engineer who likes understanding how things work — and then making them work better."
      />
      <div className="about-editorial">
        <div className="monogram-panel" aria-hidden="true">
          <span>PA</span>
          <div className="mono">ENGINEERING / DATA / PERFORMANCE</div>
        </div>
        <div>
          <Eyebrow>BARCELONA, SPAIN</Eyebrow>
          <h2>
            Following the problem.
            <br />
            Across disciplines.
          </h2>
          <p>{profile.summary}</p>
          <p>
            My background in Computer Science at the Universitat Politècnica de
            Catalunya gives me the foundations. My experience in data and
            technology at Accenture brings a professional context. Building
            independent products is where I connect the two.
          </p>
          <p>
            High-performance sport is another part of that perspective:
            consistency, deliberate practice and learning from feedback. ATHRA
            and TrackFlow explore the meeting point between those interests.
          </p>
          <div className="button-row">
            <ButtonLink href="/resume/" primary>
              View resume
            </ButtonLink>
            <ButtonLink href={profile.linkedin} external>
              LinkedIn
            </ButtonLink>
          </div>
        </div>
      </div>
      <section className="toolbox">
        <Eyebrow>THE TOOLBOX</Eyebrow>
        <h2>Tools follow the problem.</h2>
        <div className="skill-columns">
          {Object.entries(profile.skills).map(([group, skills]) => (
            <div key={group}>
              <h3>{group}</h3>
              <ul>
                {skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="muted">
          My interests extend to data engineering, software architecture and
          cybersecurity. The projects show where I have put those interests into
          practice.
        </p>
      </section>
    </main>
  );
}
