import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3101",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    channel: "chromium",
    launchOptions: {
      args: process.env.PAU_SOFTWARE_GPU === "1" ? ["--no-sandbox", "--use-angle=swiftshader"] : [
        "--no-sandbox",
        "--enable-gpu",
        "--use-gl=angle",
        "--use-angle=gl",
        "--ignore-gpu-blocklist",
      ],
    },
  },
  webServer: {
    command: "npx serve out -l 3101",
    url: "http://127.0.0.1:3101",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
