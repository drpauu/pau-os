import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";

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
  mode: "Fourteen static routes, desktop WebGL, mobile touch navigation and TrackFlow artwork; existing owner-only read authorization",
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
    "/work/adhoc-medical-data-processing/",
    "/work/connect4-ai/",
    "/work/checkers-ai/",
    "/work/esinmath/",
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
  const livePdf = await context.request.get(
    origin + "/pau-alcazar-resume.pdf",
    { headers: { "OAI-Sites-Authorization": `Bearer ${token}` } },
  );
  const livePdfBytes = await livePdf.body();
  const localPdfBytes = await fs.readFile("public/pau-alcazar-resume.pdf");
  evidence.resumePdf = {
    status: livePdf.status(),
    contentType: livePdf.headers()["content-type"],
    bytes: livePdfBytes.length,
    matchesLocalArtifact:
      livePdf.status() === 200 && livePdfBytes.equals(localPdfBytes),
    sha256: createHash("sha256").update(livePdfBytes).digest("hex"),
  };
  if (!evidence.resumePdf.matchesLocalArtifact)
    throw new Error(
      "Deployed public CV PDF differs from the verified local artifact.",
    );
  await page.goto(origin + "/resume/", { waitUntil: "networkidle" });
  await page.screenshot({
    path: "docs/screenshots/live-private-resume.png",
    fullPage: true,
  });
  await page.goto(origin + "/", { waitUntil: "networkidle" });
  await page
    .getByRole("combobox", { name: "Scene quality" })
    .selectOption("high");
  await page.locator("canvas").waitFor({ state: "visible", timeout: 20000 });
  await page.waitForTimeout(4500);
  evidence.webgl = await page
    .locator("canvas")
    .evaluate((canvas) => ({ ...canvas.dataset }));
  evidence.webglRenderer = await page.evaluate(() => {
    const gl = document.querySelector("canvas")?.getContext("webgl2");
    const extension = gl?.getExtension("WEBGL_debug_renderer_info");
    return extension
      ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL)
      : "Unavailable";
  });
  evidence.settledFpsSamples = [];
  for (let sample = 0; sample < 3; sample++) {
    await page.waitForTimeout(3100);
    evidence.settledFpsSamples.push(
      await page.locator("canvas").getAttribute("data-fps"),
    );
  }
  await page.screenshot({ path: "docs/screenshots/live-private-3d.png" });

  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });
  await mobileContext.route("**/*", (route) => {
    if (new URL(route.request().url()).origin === origin)
      return route.continue({
        headers: {
          ...route.request().headers(),
          "OAI-Sites-Authorization": `Bearer ${token}`,
        },
      });
    return route.continue();
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on("pageerror", (e) => evidence.errors.push(e.message));
  await mobilePage.addInitScript(() =>
    localStorage.setItem("pau-quality", "medium"),
  );
  await mobilePage.goto(origin + "/", { waitUntil: "networkidle" });
  await mobilePage.locator("canvas").waitFor({
    state: "visible",
    timeout: 20000,
  });
  evidence.mobile = {
    viewport: "375x812 touch emulation",
    horizontalOverflow: await mobilePage.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  };
  await mobilePage.screenshot({ path: "docs/screenshots/live-mobile-home.png" });
  await mobilePage.waitForTimeout(6800);
  evidence.mobile.mediumFps = await mobilePage
    .locator("canvas")
    .getAttribute("data-fps");
  await mobilePage
    .getByRole("button", { name: "Next project installation" })
    .click();
  const scene = mobilePage.locator(".scene-container");
  await scene.evaluate((element) => {
    for (const [type, x, y] of [
      ["pointerdown", 280, 490],
      ["pointerup", 190, 493],
    ])
      element.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          pointerType: "touch",
          clientX: x,
          clientY: y,
        }),
      );
  });
  const athraFocus = mobilePage.getByRole("button", {
    name: "Focus ATHRA station",
  });
  await athraFocus.waitFor();
  if ((await athraFocus.getAttribute("aria-pressed")) !== "true")
    throw new Error("Deployed mobile swipe did not focus ATHRA.");
  evidence.mobile.swipeFocusedAthra = true;
  await mobilePage.goto(origin + "/work/", { waitUntil: "networkidle" });
  const trackflowImage = mobilePage.locator(".project-trackflow img");
  await trackflowImage.waitFor({ state: "visible" });
  await trackflowImage.scrollIntoViewIfNeeded();
  await mobilePage.waitForFunction(() => {
    const image = document.querySelector(".project-trackflow img");
    return image?.complete && image.naturalWidth === 1200;
  });
  evidence.mobile.trackflowImage = await trackflowImage.evaluate((image) => ({
    naturalWidth: image.naturalWidth,
    alt: image.alt,
  }));
  if (evidence.mobile.trackflowImage.naturalWidth !== 1200)
    throw new Error("Deployed TrackFlow illustration did not load as expected.");
  await mobilePage.locator(".project-trackflow").screenshot({
    path: "docs/screenshots/live-mobile-trackflow.png",
  });
  if (evidence.mobile.horizontalOverflow)
    throw new Error("Deployed mobile homepage has horizontal overflow.");
  await mobileContext.close();

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
      mobile: evidence.mobile,
      resumePdfMatches: evidence.resumePdf.matchesLocalArtifact,
      status: "passed",
      errors: evidence.errors,
      screenshot: "docs/screenshots/live-private.png",
    }),
  );
} finally {
  await browser.close();
}
