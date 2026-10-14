import { chromium } from "@playwright/test";
for (const mode of [
  {
    headless: true,
    channel: "chromium",
    args: [
      "--no-sandbox",
      "--enable-gpu",
      "--use-gl=angle",
      "--use-angle=gl",
      "--ignore-gpu-blocklist",
    ],
  },
  { headless: false, args: ["--no-sandbox", "--ignore-gpu-blocklist"] },
]) {
  const b = await chromium.launch(mode);
  const p = await b.newPage();
  console.log({
    mode: mode.headless,
    renderer: await p.evaluate(() => {
      const gl = document.createElement("canvas").getContext("webgl2");
      if (!gl) return "unavailable";
      return gl.getParameter(
        gl.getExtension("WEBGL_debug_renderer_info").UNMASKED_RENDERER_WEBGL,
      );
    }),
  });
  await b.close();
}
