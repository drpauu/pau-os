import type { Metadata } from "next";
import { PageIntro, ButtonLink, Eyebrow } from "@/components/ui/Primitives";
import { profile } from "@/lib/content";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect with Pau Alcázar about software engineering, data and independent products.",
};
export default function Contact() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="inner-page section-wrap contact-page"
    >
      <PageIntro
        number="05"
        title="Let’s connect"
        description="Have a problem worth solving, an interesting team or a product in mind? I’d like to hear about it."
      />
      <div className="contact-layout">
        <div className="contact-orbit" aria-hidden="true">
          <div />
          <div />
          <span>↗</span>
        </div>
        <div>
          <Eyebrow>OPEN A CONVERSATION</Eyebrow>
          <h2>
            Engineering.
            <br />
            Data. New possibilities.
          </h2>
          <p>
            Based in Barcelona. Interested in engineering opportunities
            and thoughtful collaborations.
          </p>
          <ButtonLink href={profile.linkedin} external primary>
            Connect on LinkedIn
          </ButtonLink>
          <ButtonLink href={profile.github} external>
            Explore my GitHub
          </ButtonLink>
          <p className="contact-note mono">
            A DIRECT CONNECTION. NO FORM, NO TRACKING.
          </p>
        </div>
      </div>
    </main>
  );
}
