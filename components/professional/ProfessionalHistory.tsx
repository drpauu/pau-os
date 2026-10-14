import { Eyebrow } from "@/components/ui/Primitives";
import { professional } from "@/lib/professional";

/** Shared public CV content: no separate wording or dates to drift across pages. */
export function ProfessionalHistory() {
  return (
    <>
      <section aria-labelledby="experience-heading">
        <Eyebrow>PROFESSIONAL EXPERIENCE</Eyebrow>
        <h2 id="experience-heading">From requirements to running systems.</h2>
        {professional.experience.map((position) => (
          <article className="experience-entry" key={position.id}>
            <p className="mono muted">{position.dates}</p>
            <h3>{position.company}</h3>
            <p className="position-title">{position.title}</p>
            <p>{position.summary}</p>
            <ul className="responsibility-list">
              {position.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section aria-labelledby="education-heading">
        <Eyebrow>EDUCATION</Eyebrow>
        <h2 id="education-heading">The foundations.</h2>
        {professional.education.map((education) => (
          <article className="experience-entry" key={education.degree}>
            <p className="mono muted">{education.dates}</p>
            <h3>{education.degree}</h3>
            <p>{education.institution}</p>
            <p>{education.description}</p>
          </article>
        ))}
      </section>
      <section aria-labelledby="languages-heading">
        <Eyebrow>LANGUAGES</Eyebrow>
        <h2 id="languages-heading">Across conversations.</h2>
        <p>{professional.languages.join(" · ")}</p>
      </section>
    </>
  );
}
