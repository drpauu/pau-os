import { Hero } from "@/features/laboratory/Hero";
import { ProjectList } from "@/features/projects/ProjectList";
import { Eyebrow, ButtonLink } from "@/components/ui/Primitives";
import { getProjects } from "@/lib/supabase/content";
export default async function Home() {
  const projects = await getProjects();
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <section className="manifesto section-wrap">
        <Eyebrow>THE WAY I WORK</Eyebrow>
        <div>
          <h2>
            Curiosity is the starting point.
            <br />
            <span className="muted">Engineering makes it real.</span>
          </h2>
          <p>
            I build at the intersection of software, data and human performance.
            From understanding the problem to the last interaction, I care about
            the whole system.
          </p>
        </div>
        <span className="manifesto-mark" aria-hidden="true">
          ↗
        </span>
      </section>
      <section id="selected-work" className="section-wrap selected-work">
        <div className="section-heading">
          <div>
            <Eyebrow>SELECTED WORK / 01—03</Eyebrow>
            <h2>
              Ideas, made tangible<span className="accent">.</span>
            </h2>
          </div>
          <span className="mono muted">INDEPENDENT PRODUCTS</span>
        </div>
        <ProjectList projects={projects} />
      </section>
      <section className="about-strip section-wrap">
        <div>
          <Eyebrow>THE ENGINEER BEHIND THE LAB</Eyebrow>
          <h2>
            A technical mind.
            <br />
            An athlete’s discipline.
          </h2>
        </div>
        <div>
          <p>
            Computer Science graduate from UPC. Data & AI consultant with
            experience at Accenture. I bring the same focus to building software
            that I bring to high-performance sport.
          </p>
          <ButtonLink href="/about/">A little more about me</ButtonLink>
        </div>
      </section>
      <section className="contact-strip section-wrap">
        <Eyebrow>MAKE THE NEXT CONNECTION</Eyebrow>
        <h2>
          Good work starts
          <br />
          with a conversation<span className="accent">.</span>
        </h2>
        <ButtonLink href="/contact/" primary>
          Let’s talk
        </ButtonLink>
      </section>
    </main>
  );
}
