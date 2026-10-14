import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  parseToolbox,
  describeToolboxChanges,
  fetchToolboxReadme,
  validateToolboxSnapshot,
} from "./toolbox.mjs";

const sourcePath = new URL(
  "../data/sources/github-profile-readme.md",
  import.meta.url,
);
const outputPath = new URL("../data/toolbox.json", import.meta.url);
const args = new Set(process.argv.slice(2));
const allowed = new Set(["--accept-changes", "--check", "--offline"]);

async function main() {
  for (const arg of args)
    if (!allowed.has(arg)) throw new Error(`Unknown argument: ${arg}`);
  if (args.has("--check") && args.has("--accept-changes"))
    throw new Error("--check cannot accept changes.");

  let previous;
  try {
    previous = validateToolboxSnapshot(
      await readFile(sourcePath, "utf8"),
      JSON.parse(await readFile(outputPath, "utf8")),
    );
  } catch (error) {
    if (!args.has("--accept-changes")) throw error;
  }

  let readme;
  if (args.has("--offline")) {
    readme = await readFile(sourcePath, "utf8");
  } else {
    try {
      readme = await fetchToolboxReadme();
    } catch (error) {
      if (!previous) throw error;
      console.warn(
        `[toolbox] GitHub unavailable: ${error.message}. Using validated committed snapshot ${previous.sectionSha256.slice(0, 12)}.`,
      );
      return;
    }
  }

  // Parse outside the fetch catch: upstream corruption must never look like an outage.
  const current = parseToolbox(readme);
  const changes = previous
    ? describeToolboxChanges(previous, current)
    : ["Initial Toolbox snapshot"];
  if (changes.length) {
    console.error(
      `[toolbox] Source changes detected:\n- ${changes.join("\n- ")}`,
    );
    if (!args.has("--accept-changes")) {
      throw new Error(
        "Review the GitHub Toolbox changes, then run npm run sync:toolbox -- --accept-changes. The previous snapshot is preserved.",
      );
    }
  }
  if (!args.has("--check")) {
    await mkdir(fileURLToPath(new URL("../data/sources/", import.meta.url)), {
      recursive: true,
    });
    await writeFile(sourcePath, readme);
    await writeFile(outputPath, `${JSON.stringify(current, null, 2)}\n`);
  }
  const count = current.categories.reduce(
    (sum, category) => sum + category.items.length,
    0,
  );
  console.log(
    `[toolbox] Verified ${current.categories.length} categories / ${count} items in source order (${current.sectionSha256.slice(0, 12)}).`,
  );
}

main().catch((error) => {
  console.error(`[toolbox] Synchronization failed: ${error.message}`);
  process.exitCode = 1;
});
