import { chromium } from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
const results = [];
for (const [slug, url] of [
  ["trackflow", "https://track-flow-frontend.vercel.app"],
  ["cami-curt", "https://camicurt.cat"],
  ["athra", "http://localhost:3000"],
]) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  try {
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `docs/${slug}-source.png` });
    await sharp(`docs/${slug}-source.png`)
      .webp({ quality: 86 })
      .toFile(`public/images/${slug}.webp`);
    results.push({
      slug,
      url,
      status: response.status(),
      title: await page.title(),
      text: (await page.locator("body").innerText()).slice(0, 400),
    });
  } catch (e) {
    results.push({ slug, error: e.message });
  }
  await page.close();
}
await fs.writeFile(
  "docs/screenshots-provenance.json",
  JSON.stringify({ capturedAt: new Date().toISOString(), results }, null, 2),
);
console.log(JSON.stringify(results, null, 2));
await browser.close();
