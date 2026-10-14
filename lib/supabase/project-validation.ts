import { projectSchema, type Project } from "@/lib/content";

export const REQUIRED_PROJECT_ORDER = [
  "camicurt",
  "athra",
  "alcoholfabet",
  "trackflow",
] as const;

/** A remote CMS must not replace the flagship or silently remove a case study. */
export function validatePublishedProjects(rows: unknown[]): Project[] {
  const parsed = rows.map((row) => projectSchema.parse(row));
  const slugs = new Set(parsed.map((project) => project.slug));
  if (slugs.size !== parsed.length)
    throw new Error("Duplicate published project slugs.");
  if (parsed.some((project) => !project.published))
    throw new Error("Unpublished project in public content.");
  if (
    parsed.some(
      (project) =>
        !Number.isInteger(project.sort_order) || project.sort_order < 1,
    )
  ) {
    throw new Error("Project sort order must be a positive integer.");
  }
  if (
    new Set(parsed.map((project) => project.sort_order)).size !== parsed.length
  ) {
    throw new Error("Duplicate project sort orders.");
  }
  const ordered = parsed.toSorted((a, b) => a.sort_order - b.sort_order);
  REQUIRED_PROJECT_ORDER.forEach((slug, index) => {
    if (
      ordered[index]?.slug !== slug ||
      ordered[index]?.sort_order !== index + 1 ||
      !ordered[index]?.featured
    ) {
      throw new Error(
        `Published project position ${index + 1} must be featured '${slug}'. Review the database snapshot before enabling remote content.`,
      );
    }
  });
  return ordered;
}

/** Supabase is an approved publishing mirror; new claims need source review first. */
export function validateSnapshotParity(
  remote: Project[],
  verified: Project[],
): void {
  const expected = validatePublishedProjects(verified);
  if (JSON.stringify(remote) !== JSON.stringify(expected)) {
    throw new Error(
      "Supabase content differs from the verified source snapshot. Review and synchronize published content before building in remote mode.",
    );
  }
}
