import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { professional } from "../lib/professional";
import { profile, projects, projectSchema } from "../lib/content";
import publicCvReview from "../docs/public-cv-review.json";

describe("CV-derived public information", () => {
  it("uses one canonical role and identity across public content", () => {
    expect(profile.name).toBe(professional.name);
    expect(profile.role).toBe(professional.role);
    expect(profile.location).toBe(professional.location);
    expect(profile.summary).toBe(professional.summary);
  });

  it("retains valid CV provenance for every position and qualification", () => {
    expect(professional.provenance.sourceSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(professional.provenance.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const entry of [
      ...professional.experience,
      ...professional.education,
    ]) {
      expect(entry.provenance.source).toBe(professional.provenance.sourceId);
      expect(entry.provenance.page).toBeGreaterThan(0);
      expect(entry.provenance.section).toMatch(
        /^(PROFESSIONAL EXPERIENCE|EDUCATION)$/,
      );
      expect(entry.start).toMatch(/^\d{4}(-\d{2})?$/);
      if (entry.end) expect(entry.end >= entry.start).toBe(true);
    }
  });

  it("ties the reviewed model to the original CV when available without exposing its contents", () => {
    // The private input is deliberately absent from CI/source control.
    const path = new URL(
      `../${professional.provenance.sourceFile}`,
      import.meta.url,
    );
    if (existsSync(path)) {
      const digest = createHash("sha256")
        .update(readFileSync(path))
        .digest("hex");
      expect(digest).toBe(professional.provenance.sourceSha256);
    }
    expect(publicCvReview.sourceSha256).toBe(
      professional.provenance.sourceSha256,
    );
  });

  it("publishes a separately generated PDF, never the original private file", () => {
    expect(
      existsSync(
        new URL(
          `../public/${professional.provenance.sourceFile}`,
          import.meta.url,
        ),
      ),
    ).toBe(false);
    const publicPdf = readFileSync(
      new URL("../public/pau-alcazar-resume.pdf", import.meta.url),
    );
    expect(publicPdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(createHash("sha256").update(publicPdf).digest("hex")).not.toBe(
      professional.provenance.sourceSha256,
    );
    expect(publicCvReview.originalCopied).toBe(false);
    expect(publicCvReview.excluded).toEqual(
      expect.arrayContaining([
        "private phone",
        "private email",
        "named clients",
        "client-specific projects",
      ]),
    );
  });
});

describe("public project source boundaries", () => {
  it("keeps eight verified projects with distinct source links where safe and local cover art", () => {
    const linkedRepositories = projects.flatMap((project) =>
      project.repository_url ? [project.repository_url] : [],
    );
    expect(new Set(linkedRepositories).size).toBe(linkedRepositories.length);
    expect(
      projects.filter((project) => !project.repository_url).map((p) => p.slug),
    ).toEqual(["adhoc-medical-data-processing"]);
    for (const project of projects) {
      if (project.repository_url)
        expect(project.repository_url).toMatch(
          /^https:\/\/github\.com\/drpauu\//,
        );
      expect(project.content.source.length).toBeGreaterThan(30);
      expect(
        existsSync(new URL(`../public${project.cover_image}`, import.meta.url)),
      ).toBe(true);
    }
  });

  it("rejects unsafe gallery destinations and path traversal", () => {
    for (const image of [
      "javascript:alert(1)",
      "https://example.org/private.jpg",
      "/images/../../Pau_Alcazar_CV.pdf",
      "data:image/svg+xml,<svg/>",
    ]) {
      expect(
        projectSchema.safeParse({ ...projects[0], gallery: [image] }).success,
      ).toBe(false);
    }
  });
});
