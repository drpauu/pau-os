import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

// Review-first, local-only replacement for the obsolete bulk live-site capture.
// Existing published media and provenance are never overwritten by this helper.
const [slug, address] = process.argv.slice(2);
if (!["athra", "trackflow", "cami-curt"].includes(slug) || !address) {
  throw new Error(
    "Usage: node scripts/capture-sources.mjs <athra|trackflow|cami-curt> <local-preview-url>. Use fixture data only. Alcoholfabet has its own isolated capture script.",
  );
}
const url = new URL(address);
if (
  !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
  url.protocol !== "http:" ||
  url.username ||
  url.password
) {
  throw new Error(
    "Source captures require a local HTTP preview; remote applications are not contacted.",
  );
}
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.route("**/*", (route) => {
    const request = route.request(),
      target = new URL(request.url());
    if (
      !["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) ||
      !["GET", "HEAD"].includes(request.method())
    )
      return route.abort();
    return route.continue();
  });
  const response = await page.goto(url.href, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  if (!response?.ok())
    throw new Error(
      `Capture refused: HTTP ${response?.status() ?? "unavailable"}`,
    );
  await fs.mkdir("docs/media-review", { recursive: true });
  const output = `docs/media-review/${slug}-candidate.png`;
  await page.screenshot({ path: output });
  console.log(
    `Candidate saved to ${output}. Inspect for private data and errors before publishing; existing images/provenance unchanged.`,
  );
} finally {
  await browser.close();
}
