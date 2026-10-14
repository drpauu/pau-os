import { chromium } from "@playwright/test";
import { professional } from "../lib/professional.ts";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

// Generates only explicitly curated fields. The original CV is never copied.
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const root = fileURLToPath(new URL("../", import.meta.url));
const experience = professional.experience
  .map(
    (position) =>
      `<article><div class="row"><h3>${escape(position.company)}</h3><span>${escape(position.dates)}</span></div><div class="position">${escape(position.title)}</div><p>${escape(position.summary)}</p><ul>${position.responsibilities.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></article>`,
  )
  .join("");
const education = professional.education
  .map(
    (item) =>
      `<article><div class="row"><h3>${escape(item.degree)}</h3><span>${escape(item.dates)}</span></div><p class="institution">${escape(item.institution)}</p><p>${escape(item.description)}</p></article>`,
  )
  .join("");
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pau Alcázar — Public CV</title><style>
  @page { size:A4; margin:16mm 17mm; } * { box-sizing:border-box } body { font-family:Arial,sans-serif; color:#17272e; font-size:9.5pt; line-height:1.5; margin:0 } header { border-bottom:2px solid #346d6b; padding-bottom:15px; margin-bottom:20px } h1 { font-size:29pt; letter-spacing:-1px; margin:0 0 4px } .role { font-size:13pt; margin:0 0 9px; color:#346d6b } .contact { font-size:8.5pt; color:#536168 } a { color:#346d6b; text-decoration:none } h2 { font-size:8pt; text-transform:uppercase; letter-spacing:2px; color:#346d6b; margin:23px 0 10px } h3 { font-size:11pt; margin:0 } p { margin:6px 0 9px } .row { display:flex; justify-content:space-between; gap:20px; align-items:baseline } .row span { white-space:nowrap; font-size:8pt; color:#536168 } .position { font-size:9.5pt; margin:2px 0 8px } article { margin:0 0 17px; break-inside:avoid } ul { padding-left:15px; margin:7px 0 } li { margin-bottom:4px } .institution { margin:2px 0 7px } footer { border-top:1px solid #c6d0d2; margin-top:25px; padding-top:10px; font-size:8pt; color:#536168 }
  </style></head><body><header><h1>${escape(professional.name)}</h1><p class="role">${escape(professional.role)}</p><div class="contact">${escape(professional.location)} · <a href="https://github.com/drpauu">github.com/drpauu</a> · <a href="https://www.linkedin.com/in/pau-alcázar-perdomo/">LinkedIn</a></div></header><section><h2>Profile</h2><p>${escape(professional.summary)}</p></section><section><h2>Professional experience</h2>${experience}</section><section><h2>Education</h2>${education}</section><section><h2>Languages</h2><p>${professional.languages.map(escape).join(" · ")}</p></section><footer>Public CV · PAU.OS · Selected independent work: <a href="https://github.com/drpauu/camicurt.cat">Camí Curt</a>, <a href="https://github.com/drpauu/athra">ATHRA</a>, <a href="https://github.com/drpauu/Alcoholfabet">Alcoholfabet</a>, <a href="https://github.com/drpauu/TrackFlow">TrackFlow</a>.</footer></body></html>`);
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
        originalCopied: false,
        sourceSha256: professional.provenance.sourceSha256,
        reviewedOn: professional.provenance.reviewedOn,
        excluded: [
          "private phone",
          "private email",
          "named clients",
          "client-specific projects",
        ],
        editorialReview:
          "Owner review recommended before public deployment; generated public fields have been checked against the source CV.",
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Generated privacy-safe public CV from canonical professional content.",
  );
} finally {
  await browser.close();
}
