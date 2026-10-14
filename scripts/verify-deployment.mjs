import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

// Existing owner-authorized read token only. Never create/rotate access credentials.
if (!process.stdin.isTTY)
  throw new Error("Run in a TTY so credential input can be hidden.");
process.stdin.setRawMode(true);
process.stdin.resume();
console.log("Ready for deployment verification JSON on stdin (input hidden).");
const line = await new Promise((resolve) => {
  let input = "";
  const handler = (chunk) => {
    input += chunk.toString();
    if (input.includes("\n")) {
      process.stdin.off("data", handler);
      resolve(input.slice(0, input.indexOf("\n")));
    }
  };
  process.stdin.on("data", handler);
});
process.stdin.setRawMode(false);
process.stdin.pause();
const { url, token } = JSON.parse(line);
const origin = new URL(url).origin;
if (!origin.startsWith("https://") || !token)
  throw new Error("HTTPS origin and existing read token required.");
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
const evidence = {
  url: origin,
  checkedAt: new Date().toISOString(),
  mode: "Ten static route checks plus live WebGL; existing owner-only read authorization",
  routes: [],
  errors: [],
};
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.route("**/*", (route) => {
    if (new URL(route.request().url()).origin === origin)
      return route.continue({
        headers: {
          ...route.request().headers(),
          "OAI-Sites-Authorization": `Bearer ${token}`,
        },
      });
    return route.continue();
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => evidence.errors.push(e.message));
  await page.addInitScript(() => localStorage.setItem("pau-quality", "low"));
  for (const path of [
    "/",
    "/work/",
    "/work/camicurt/",
    "/work/athra/",
    "/work/alcoholfabet/",
    "/work/trackflow/",
    "/experience/",
    "/about/",
    "/resume/",
    "/contact/",
  ]) {
    const response = await page.goto(origin + path, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    const heading = await page.locator("main h1").innerText({ timeout: 15000 });
    evidence.routes.push({ path, status: response?.status(), heading });
    if (response?.status() !== 200)
      throw new Error("Unexpected deployed route status.");
    if (path === "/")
      await page.screenshot({ path: "docs/screenshots/live-private.png" });
  }
  await page.goto(origin + "/", { waitUntil: "networkidle" });
  await page
    .getByRole("combobox", { name: "Scene quality" })
    .selectOption("high");
  await page.locator("canvas").waitFor({ state: "visible", timeout: 20000 });
  await page.waitForTimeout(4500);
  evidence.webgl = await page
    .locator("canvas")
    .evaluate((canvas) => ({ ...canvas.dataset }));
  await page.screenshot({ path: "docs/screenshots/live-private-3d.png" });
  if (evidence.errors.length)
    throw new Error("Deployed page reported browser errors.");
  await fs.writeFile(
    "docs/live-verification.json",
    JSON.stringify(evidence, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      checkedRoutes: evidence.routes.length,
      webgl: !!evidence.webgl,
      status: "passed",
      errors: evidence.errors,
      screenshot: "docs/screenshots/live-private.png",
    }),
  );
} finally {
  await browser.close();
}
