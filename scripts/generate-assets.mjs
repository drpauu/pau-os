import { chromium } from "@playwright/test";
import sharp from "sharp";
const b = await chromium.launch({
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
const p = await b.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await p.goto(process.env.PAU_CAPTURE_URL ?? "http://127.0.0.1:3100", {
  waitUntil: "networkidle",
});
await p.selectOption('select[aria-label="Scene quality"]', "high");
await p.waitForTimeout(4500);
const hidden = await p.addStyleTag({
  content:
    ".hero-title,.hero-meta,.scene-coordinate,.scene-controls,.station-dock,.hero-bottom,.hero-grid,.scene-labels{display:none!important}",
});
await p.locator("canvas").screenshot({ path: "docs/laboratory-render.png" });
await sharp("docs/laboratory-render.png")
  .webp({ quality: 88 })
  .toFile("public/images/laboratory.webp");
await hidden.evaluate((e) => e.remove());
await p.evaluate(() => {
  window.scrollTo(0, 0);
  document.querySelectorAll("*").forEach((e) => {
    if (e.scrollLeft) e.scrollLeft = 0;
  });
});
await p.screenshot({ path: "docs/asset-desktop.png" });
await sharp("docs/asset-desktop.png")
  .resize(1200, 630, { fit: "cover", position: "top" })
  .png()
  .toFile("public/images/og.png");
await p.goto(
  (process.env.PAU_CAPTURE_URL ?? "http://127.0.0.1:3100") + "/resume/",
  { waitUntil: "networkidle" },
);
await p.pdf({
  path: "public/pau-alcazar-resume.pdf",
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});
await b.close();
console.log(
  "Generated original laboratory fallback, Open Graph image and factual resume PDF.",
);
