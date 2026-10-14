import { chromium } from "@playwright/test";
import { professional } from "../lib/professional.ts";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

// The visible Resume page and the downloadable PDF use this same public model.
// The private source CV is never copied into the public directory.
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const root = fileURLToPath(new URL("../", import.meta.url));
const resume = professional.resume;
const skills = resume.skills
  .map(
    (group) =>
      `<article class="skill"><h3>${escape(group.category)}</h3><p>${group.items.map(escape).join(", ")}.</p></article>`,
  )
  .join("");
const experience = professional.experience
  .map(
    (position) =>
      `<article class="entry"><div class="row"><h3>${escape(position.company)}</h3><span>${escape(position.dates)}</span></div><p class="position">${escape(position.title)} · ${escape(position.location)}</p><p>${escape(position.summary)}</p><ul>${position.responsibilities.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></article>`,
  )
  .join("");
const education = professional.education
  .map(
    (item) =>
      `<article class="entry"><div class="row"><h3>${escape(item.degree)}</h3><span>${escape(item.dates)}</span></div><p class="institution">${escape(item.institution)}</p><p>${escape(item.description)}</p></article>`,
  )
  .join("");
const selectedWork = resume.selectedWork
  .map(
    (project) =>
      `<article class="project"><h3>${escape(project.title)}</h3><p>${escape(project.description)}</p><p><strong>Technology: </strong>${escape(project.technologies)}.</p>${project.url ? `<a href="${escape(project.url)}">${escape(project.url.replace("https://", ""))}</a>` : ""}</article>`,
  )
  .join("");

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escape(resume.fullName)} — Resume</title><style>
  @page { size:A4; margin:15mm 16mm; } * { box-sizing:border-box } body { font-family:Arial,sans-serif; color:#17272e; font-size:9pt; line-height:1.42; margin:0 } header { border-bottom:2px solid #346d6b; padding-bottom:12px; margin-bottom:15px } h1 { font-size:25pt; letter-spacing:-.7px; margin:0 0 4px } .role { font-size:10pt; font-weight:bold; margin:0 0 7px; color:#346d6b; letter-spacing:.5px } .contact { font-size:8pt; color:#536168 } a { color:#346d6b; text-decoration:none } section { margin:0 0 14px } h2 { font-size:9pt; text-transform:uppercase; letter-spacing:1.5px; color:#346d6b; margin:0 0 7px; border-bottom:1px solid #c6d0d2; padding-bottom:4px } h3 { font-size:9.5pt; margin:0 0 4px } p { margin:4px 0 6px } .row { display:flex; justify-content:space-between; gap:20px; align-items:baseline } .row span { white-space:nowrap; font-size:8pt; color:#536168 } .position { margin:2px 0 5px; font-weight:600 } .entry { margin:0 0 11px; break-inside:avoid } ul { padding-left:15px; margin:5px 0 } li { margin-bottom:3px } .institution { margin:2px 0 5px } .skill { margin:0 0 7px; break-inside:avoid } .skill h3 { display:inline; margin-right:5px } .skill p { display:inline } .project { margin:0 0 10px; break-inside:avoid } .project p { margin:3px 0 5px } .availability { margin:3px 0 0 }
  .languages { break-inside:avoid }
  </style></head><body><header><h1>${escape(resume.fullName)}</h1><p class="role">${escape(resume.headline)}</p><div class="contact">${escape(professional.location)} · ${escape(resume.availability)}<br><a href="https://github.com/drpauu">github.com/drpauu</a> · <a href="https://www.linkedin.com/in/pau-alcázar-perdomo/">LinkedIn</a></div></header>
  <section><h2>Professional Summary</h2><p>${escape(resume.summary)}</p></section>
  <section><h2>Core Technical Skills</h2>${skills}</section>
  <section><h2>Professional Experience</h2>${experience}</section>
  <section><h2>Education</h2>${education}</section>
  <section class="languages"><h2>Languages</h2><p>${professional.languages.map(escape).join(" · ")}</p></section>
  <section><h2>Selected Project Portfolio</h2>${selectedWork}</section>
  </body></html>`);
  await page.pdf({
    path: `${root}public/pau-alcazar-resume.pdf`,
    format: "A4",
    printBackground: true,
    tagged: true,
  });
  await fs.writeFile(
    `${root}docs/public-cv-review.json`,
    JSON.stringify(
      {
        generatedFrom: "lib/professional.ts",
        generatedSections: [
          "professional summary",
          "core technical skills",
          "professional experience",
          "education",
          "languages",
          "selected project portfolio",
        ],
        originalCopied: false,
        sourceSha256: professional.provenance.sourceSha256,
        reviewedOn: professional.provenance.reviewedOn,
        excluded: [
          "private phone",
          "private email",
          "named clients",
          "client-specific project names and identifying details",
        ],
        editorialReview:
          "Public resume content is generated from one canonical model used by both the HTML page and downloadable PDF. Client identities and private contact details are omitted.",
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Generated the complete privacy-safe public CV from the shared Resume content model.",
  );
} finally {
  await browser.close();
}
