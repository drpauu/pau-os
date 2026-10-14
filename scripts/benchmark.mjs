import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
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
const result = {
  time: new Date().toISOString(),
  viewport: process.env.PAU_BENCHMARK_VIEWPORT === "mobile"
    ? "390x844 DPR1 touch emulation"
    : "1440x1000 DPR1",
  method: process.env.PAU_BENCHMARK_VIEWPORT === "mobile"
    ? "Chromium touch/mobile emulation on the host GPU; fresh browser context and preselected quality per mode; localhost cold navigation; 6.8s settling sample. This does not represent physical phone performance."
    : "Fresh browser context and preselected quality per mode; localhost cold navigation; 6.8s settling sample.",
  renderer: null,
  modes: {},
};
try {
  for (const quality of ["high", "medium", "low"]) {
    const mobile = process.env.PAU_BENCHMARK_VIEWPORT === "mobile";
    const context = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      isMobile: mobile,
      hasTouch: mobile,
    });
    const page = await context.newPage();
    await page.addInitScript((q) => {
      localStorage.setItem("pau-quality", q);
      window.__metrics = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        window.__metrics.lcp = list.getEntries().at(-1).startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput) window.__metrics.cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    }, quality);
    await page.goto(process.env.PAU_BENCHMARK_URL ?? "http://127.0.0.1:3102/", {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(6800);
    result.modes[quality] = await page.evaluate(() => {
      const entries = performance.getEntriesByType("resource");
      return {
        metrics: window.__metrics,
        canvas: [...document.querySelectorAll("canvas")].map((c) => ({
          ...c.dataset,
        })),
        heapMB: performance.memory
          ? Math.round(performance.memory.usedJSHeapSize / 1e6)
          : null,
        resources: {
          requests: entries.length,
          transferBytes: entries.reduce((sum, e) => sum + e.transferSize, 0),
          jsBytes: entries
            .filter((e) => e.name.includes(".js"))
            .reduce((sum, e) => sum + e.encodedBodySize, 0),
        },
      };
    });
    if (quality === "high")
      result.renderer = await page.evaluate(() => {
        const gl = document.querySelector("canvas")?.getContext("webgl2");
        const extension = gl?.getExtension("WEBGL_debug_renderer_info");
        return extension
          ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL)
          : "Unavailable";
      });
    await context.close();
  }
  const output = process.env.PAU_BENCHMARK_VIEWPORT === "mobile"
    ? "docs/performance-mobile-emulation.json"
    : "docs/performance-measurements.json";
  await fs.writeFile(
    output,
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
