import { describe, it, expect } from "vitest";
import { shortestPath, edges } from "../features/lab/pathfinding";
import { runCommand, completeCommand } from "../features/terminal/commands";
import { projects, projectSchema } from "../lib/content";
describe("Dijkstra", () => {
  it("finds lowest weight rather than fewest edges", () => {
    expect(shortestPath(edges, "A", "F")).toMatchObject({
      path: ["A", "C", "E", "F"],
      cost: 10,
    });
    expect(
      shortestPath(
        [
          { a: "A", b: "C", weight: 10 },
          { a: "A", b: "B", weight: 1 },
          { a: "B", b: "C", weight: 1 },
        ],
        "A",
        "C",
      ),
    ).toMatchObject({ path: ["A", "B", "C"], cost: 2 });
  });
  it("handles same node and disconnected targets", () => {
    expect(shortestPath(edges, "A", "A")).toMatchObject({
      path: ["A"],
      cost: 0,
    });
    expect(
      shortestPath([...edges, { a: "X", b: "Y", weight: 1 }], "A", "X").cost,
    ).toBe(Infinity);
  });
  it("rejects unsupported negative weights", () => {
    expect(() =>
      shortestPath([{ a: "A", b: "B", weight: -1 }], "A", "B"),
    ).toThrow();
  });
  it("never enters an invalid-node loop", () => {
    expect(shortestPath(edges, "A", "unknown").path).toEqual([]);
  });
});
describe("portfolio terminal", () => {
  it("accepts only known internal destinations", () => {
    expect(runCommand("open athra").route).toBe("/projects/athra/");
    expect(runCommand("open https://evil.example").route).toBeUndefined();
  });
  it("does not execute injected commands or HTML", () => {
    expect(runCommand("whoami; rm -rf /").route).toBeUndefined();
    expect(runCommand("<script>alert(1)</script>").route).toBeUndefined();
  });
  it("autocompletes commands and preserves ambiguous input", () => {
    expect(completeCommand("who")).toBe("whoami");
    expect(completeCommand("s")).toBe("s");
  });
  it("restricts theme names", () => {
    expect(runCommand("theme titanium").theme).toBe("titanium");
    expect(runCommand("theme javascript:alert(1)").theme).toBeUndefined();
  });
  it("implements the required command vocabulary", () => {
    for (const c of [
      "help",
      "whoami",
      "projects",
      "skills",
      "experience",
      "education",
      "github",
      "resume",
      "contact",
      "clear",
      "ls",
      "open",
      "theme",
    ])
      expect(runCommand(c)).toBeDefined();
  });
});
describe("public content", () => {
  it("validates the verified project snapshot", () => {
    projects.forEach((p) =>
      expect(projectSchema.safeParse(p).success).toBe(true),
    );
  });
  it("rejects executable links and asset traversal", () => {
    expect(
      projectSchema.safeParse({
        ...projects[0],
        repository_url: "javascript:alert(1)",
      }).success,
    ).toBe(false);
    expect(
      projectSchema.safeParse({
        ...projects[0],
        cover_image: "/images/../../secret.png",
      }).success,
    ).toBe(false);
  });
});
