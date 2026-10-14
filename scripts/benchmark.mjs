import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
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
const page = await b.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await page.addInitScript(() => {
  window.__metrics = { lcp: 0, cls: 0 };
  new PerformanceObserver((list) => {
    window.__metrics.lcp = list.getEntries().at(-1).startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries())
      if (!e.hadRecentInput) window.__metrics.cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
});
await page.goto("http://127.0.0.1:3102/", { waitUntil: "networkidle" });
const render = await page.evaluate(() => {
  const c = document.createElement("canvas"),
    gl = c.getContext("webgl2");
  const value = gl.getParameter(
    gl.getExtension("WEBGL_debug_renderer_info").UNMASKED_RENDERER_WEBGL,
  );
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return value;
});
const result = {
  time: new Date().toISOString(),
  viewport: "1440x1000 DPR1",
  renderer: render,
  modes: {},
};
for (const quality of ["high", "medium", "low"]) {
  await page
    .getByRole("combobox", { name: "Scene quality" })
    .selectOption(quality);
  await page.waitForTimeout(6800);
  result.modes[quality] = await page.evaluate(() => ({
    metrics: window.__metrics,
    canvas: [...document.querySelectorAll("canvas")].map((c) => ({
      ...c.dataset,
    })),
    heapMB: performance.memory
      ? Math.round(performance.memory.usedJSHeapSize / 1e6)
      : null,
  }));
}
result.resources = await page.evaluate(() => {
  const entries = performance.getEntriesByType("resource");
  return {
    requests: entries.length,
    transferBytes: entries.reduce((sum, e) => sum + e.transferSize, 0),
    jsBytes: entries
      .filter((e) => e.name.includes(".js"))
      .reduce((sum, e) => sum + e.encodedBodySize, 0),
  };
});
await fs.writeFile(
  "docs/performance-measurements.json",
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));
await b.close();
