import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  headless: true,
  channel: "chromium",
  args: [
    "--no-sandbox",
    "--enable-gpu",
    "--use-gl=angle",
    "--use-angle=gl",
    "--ignore-gpu-blocklist",
  ],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto("http://127.0.0.1:3100", {
  waitUntil: "networkidle",
  timeout: 90000,
});
await page.waitForTimeout(6000);
await page.screenshot({ path: "docs/first-desktop.png" });
console.log(
  JSON.stringify(
    {
      errors,
      canvas: await page.locator("canvas").count(),
      stats: await page
        .locator("canvas")
        .evaluateAll((cs) => cs.map((c) => ({ ...c.dataset }))),
    },
    null,
    2,
  ),
);
await browser.close();
