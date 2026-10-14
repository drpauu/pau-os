import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import {
  CATEGORY_TITLES,
  describeToolboxChanges,
  fetchToolboxReadme,
  parseToolbox,
  validateToolboxSnapshot,
} from "../scripts/toolbox.mjs";
import toolbox from "../data/toolbox.json";

const source = readFileSync(
  new URL("../data/sources/github-profile-readme.md", import.meta.url),
  "utf8",
);

describe("GitHub Toolbox source contract", () => {
  it("matches every source category and item in the generated snapshot", () => {
    expect(parseToolbox(source)).toEqual(toolbox);
    expect(toolbox.categories.map((category) => category.title)).toEqual(
      CATEGORY_TITLES,
    );
    expect(
      toolbox.categories.reduce(
        (count, category) => count + category.items.length,
        0,
      ),
    ).toBe(80);
    expect(toolbox.categories[0].items).toEqual([
      "C++",
      "C",
      "Python",
      "JavaScript",
      "TypeScript",
      "Java",
      "Erlang",
      "MATLAB",
      "Shell",
      "PowerShell",
      "SQL",
      "PL/pgSQL",
      "HTML",
      "CSS",
      "ReScript",
      "JSON",
      "Jupyter Notebooks",
      "Make",
    ]);
  });
  it("excludes technologies mentioned outside the Toolbox section", () => {
    expect(
      parseToolbox(source + "\n### Languages\n`Invented technology`\n"),
    ).toEqual(toolbox);
  });
  it("rejects missing/reordered categories and unknown markup instead of silently losing items", () => {
    expect(() =>
      parseToolbox(source.replace("### Frontend and web", "### Web frontend")),
    ).toThrow(/category\/order mismatch/);
    expect(() =>
      parseToolbox(source.replace("`React DOM`", "React DOM")),
    ).toThrow(/Unsupported Toolbox markup/);
    expect(() =>
      parseToolbox(source.replace("## Toolbox", "## Tools")),
    ).toThrow(/exactly one/);
    expect(() =>
      parseToolbox(source.replace("`React DOM`", "`React`")),
    ).toThrow(/duplicate/);
  });
  it("reports removals, spelling changes, additions and item reorderings", () => {
    const changed = parseToolbox(
      source
        .replace("`C++` · `C`", "`C` · `C++`")
        .replace("`ReScript`", "`Rescript`")
        .replace(" · `Make`", ""),
    );
    expect(describeToolboxChanges(toolbox, changed)).toEqual([
      "Languages and data formats: missing ReScript, Make",
      "Languages and data formats: added Rescript",
      "Languages and data formats: items reordered",
    ]);
  });
  it("handles CRLF without changing spelling or order", () => {
    expect(parseToolbox(source.replaceAll("\n", "\r\n"))).toEqual(toolbox);
  });
  it("refuses to validate a fallback whose generated items were changed", () => {
    expect(validateToolboxSnapshot(source, toolbox)).toEqual(toolbox);
    expect(() =>
      validateToolboxSnapshot(source, { ...toolbox, categories: [] }),
    ).toThrow(/differs/);
  });
  it("keeps the real sync command usable during a simulated network outage", () => {
    const hook =
      "data:text/javascript," +
      encodeURIComponent(
        "globalThis.fetch = async () => { throw new Error('simulated offline'); };",
      );
    const result = spawnSync(
      process.execPath,
      ["--import", hook, "scripts/sync-toolbox.mjs", "--check"],
      {
        cwd: fileURLToPath(new URL("../", import.meta.url)),
        encoding: "utf8",
      },
    );
    expect(result.status).toBe(0);
    expect(result.stderr).toContain("Using validated committed snapshot");
    expect(result.stderr).toContain("simulated offline");
  });
  it("distinguishes GitHub outages from valid source responses without credentials", async () => {
    const ok = vi.fn<typeof fetch>().mockResolvedValue(new Response(source));
    expect(await fetchToolboxReadme(ok)).toBe(source);
    expect(ok.mock.calls[0][1]).not.toHaveProperty("headers");
    const failure = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("unavailable", { status: 503 }));
    await expect(fetchToolboxReadme(failure)).rejects.toThrow("HTTP 503");
  });
});
