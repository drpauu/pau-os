import { describe, expect, it } from "vitest";
import { projects } from "../lib/content";
import {
  REQUIRED_PROJECT_ORDER,
  REQUIRED_PINNED_PROJECT_ORDER,
  validatePublishedProjects,
  validateSnapshotParity,
} from "../lib/supabase/project-validation";

describe("public content publication boundary", () => {
  it("requires all featured projects in the editorial order", () => {
    expect(
      validatePublishedProjects(projects)
        .slice(0, 4)
        .map((project) => project.slug),
    ).toEqual(REQUIRED_PROJECT_ORDER);
    expect(
      validatePublishedProjects(projects)
        .slice(4, 8)
        .map((project) => project.slug),
    ).toEqual(REQUIRED_PINNED_PROJECT_ORDER);
    expect(() =>
      validatePublishedProjects(
        projects.filter((project) => project.slug !== "alcoholfabet"),
      ),
    ).toThrow(/alcoholfabet/);
  });
  it("rejects stale ordering, duplicates and unpublished records", () => {
    expect(() =>
      validatePublishedProjects(
        projects.map((project, index) => ({
          ...project,
          sort_order: projects.length - index,
        })),
      ),
    ).toThrow(/position/);
    expect(() => validatePublishedProjects([...projects, projects[0]])).toThrow(
      /Duplicate/,
    );
    expect(() =>
      validatePublishedProjects(
        projects.map((project, index) => ({
          ...project,
          published: index !== 0,
        })),
      ),
    ).toThrow(/Unpublished/);
  });
  it("rejects remote claims that differ from the source-reviewed snapshot", () => {
    const remote = validatePublishedProjects(
      projects.map((project, index) => ({
        ...project,
        description: index === 0 ? "Unreviewed claim" : project.description,
      })),
    );
    expect(() => validateSnapshotParity(remote, projects)).toThrow(/differs/);
    expect(() =>
      validateSnapshotParity(validatePublishedProjects(projects), projects),
    ).not.toThrow();
  });
});
