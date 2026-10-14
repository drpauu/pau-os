import { createHash } from "node:crypto";

export const TOOLBOX_URL =
  "https://raw.githubusercontent.com/drpauu/drpauu/main/README.md";
export const CATEGORY_TITLES = [
  "Languages and data formats",
  "Frontend and web",
  "Backend, databases and security",
  "Testing, delivery and operations",
  "Algorithms and computer science",
];

/** @param {string} readme */
export function parseToolbox(readme) {
  const normalized = readme.replaceAll("\r\n", "\n");
  const headings = [...normalized.matchAll(/^## Toolbox\s*$/gm)];
  if (headings.length !== 1)
    throw new Error("Expected exactly one '## Toolbox' section.");
  const start = headings[0].index + headings[0][0].length;
  const rest = normalized.slice(start);
  const next = rest.search(/^## /m);
  const section = rest.slice(0, next === -1 ? undefined : next).trim();
  const groups = [
    ...section.matchAll(/^### (.+)\n([\s\S]*?)(?=^### |$(?![\s\S]))/gm),
  ];
  if (section.slice(0, groups[0]?.index ?? section.length).trim()) {
    throw new Error("Unsupported Toolbox content before the first category.");
  }
  const names = groups.map((group) => group[1].trim());
  if (JSON.stringify(names) !== JSON.stringify(CATEGORY_TITLES)) {
    throw new Error(
      `Toolbox category/order mismatch. Expected ${CATEGORY_TITLES.join(" | ")}; found ${names.join(" | ")}.`,
    );
  }
  const categories = groups.map((group, index) => {
    const body = group[2].trim();
    const items = [...body.matchAll(/`([^`\n]+)`/g)].map((item) => item[1]);
    if (!items.length || new Set(items).size !== items.length) {
      throw new Error(`Empty or duplicate Toolbox items in '${names[index]}'.`);
    }
    // Do not silently drop a technology if GitHub changes its Markdown structure.
    const residue = body.replace(/`([^`\n]+)`/g, "").replace(/[·\s]/g, "");
    if (residue)
      throw new Error(
        `Unsupported Toolbox markup in '${names[index]}': ${residue.slice(0, 80)}`,
      );
    return { title: names[index], items };
  });
  return {
    source: TOOLBOX_URL,
    sectionSha256: createHash("sha256").update(section).digest("hex"),
    categories,
  };
}

/** @param {string} readme @param {unknown} generated */
export function validateToolboxSnapshot(readme, generated) {
  const parsed = parseToolbox(readme);
  if (JSON.stringify(generated) !== JSON.stringify(parsed)) {
    throw new Error(
      "Generated data/toolbox.json differs from the committed README source. Regenerate with --accept-changes.",
    );
  }
  return parsed;
}

/** @param {{categories: {title: string, items: string[]}[]}} previous
 * @param {{categories: {title: string, items: string[]}[]}} current */
export function describeToolboxChanges(previous, current) {
  const changes = [];
  if (
    JSON.stringify(previous.categories.map((c) => c.title)) !==
    JSON.stringify(current.categories.map((c) => c.title))
  ) {
    changes.push("Category names or order changed");
  }
  for (const group of current.categories) {
    const old = previous.categories.find(
      (category) => category.title === group.title,
    );
    if (!old) continue;
    const removed = old.items.filter((item) => !group.items.includes(item));
    const added = group.items.filter((item) => !old.items.includes(item));
    if (removed.length)
      changes.push(`${group.title}: missing ${removed.join(", ")}`);
    if (added.length) changes.push(`${group.title}: added ${added.join(", ")}`);
    const retainedOld = old.items.filter((item) => group.items.includes(item));
    const retainedNew = group.items.filter((item) => old.items.includes(item));
    if (JSON.stringify(retainedOld) !== JSON.stringify(retainedNew))
      changes.push(`${group.title}: items reordered`);
  }
  return changes;
}

/** Fetch failure is distinct from a malformed or changed upstream section.
 * @param {typeof fetch} fetcher */
export async function fetchToolboxReadme(fetcher = fetch) {
  const response = await fetcher(TOOLBOX_URL, {
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}`);
  return response.text();
}
