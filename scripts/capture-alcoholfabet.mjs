import { chromium } from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs/promises";

// Render the actual public interface against isolated menu-only responses.
// No request is sent to the application's auth/database endpoints.
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const fixtureId = "00000000-0000-4000-8000-000000000001";
const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
const token = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: fixtureId, role: "authenticated", exp: 4102444800 })}.portfolio-fixture-not-a-credential`;
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const intercepted = [];
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname.endsWith(".supabase.co")) {
      intercepted.push({ path: url.pathname, method: request.method() });
      if (url.pathname.startsWith("/auth/v1/")) {
        const user = {
          id: fixtureId,
          aud: "authenticated",
          role: "authenticated",
          is_anonymous: true,
          app_metadata: {},
          user_metadata: {},
          created_at: "2026-01-01T00:00:00.000Z",
        };
        await route.fulfill({
          json: url.pathname.endsWith("/user")
            ? user
            : {
                access_token: token,
                refresh_token: "isolated-menu-fixture",
                expires_in: 3600,
                expires_at: 4102444800,
                token_type: "bearer",
                user,
              },
        });
      } else if (url.pathname.endsWith("/get_access_context")) {
        await route.fulfill({
          json: {
            authorized: true,
            activeGameId: null,
            scoreboard: { pauWins: 0, teclaWins: 0, completedGames: 0 },
          },
        });
      } else await route.abort();
    } else if (!["GET", "HEAD"].includes(request.method())) await route.abort();
    else await route.continue();
  });
  const response = await page.goto("https://alcoholfabet.cat", {
    waitUntil: "networkidle",
    timeout: 45000,
  });
  await page
    .getByRole("button", { name: /Jugar en persona/i })
    .first()
    .waitFor({ timeout: 15000 });
  await page.screenshot({ path: "docs/alcoholfabet-source.png" });
  await sharp("docs/alcoholfabet-source.png")
    .webp({ quality: 86 })
    .toFile("public/images/alcoholfabet.webp");
  const provenance = JSON.parse(
    await fs.readFile("docs/screenshots-provenance.json", "utf8"),
  );
  provenance.results = provenance.results.filter(
    (item) => item.slug !== "alcoholfabet",
  );
  provenance.results.push({
    slug: "alcoholfabet",
    url: "https://alcoholfabet.cat",
    status: response.status(),
    capturedAt: new Date().toISOString(),
    title: await page.title(),
    note: "Actual public interface rendered with an isolated anonymous menu fixture and empty score. All Supabase requests intercepted locally. No production auth or game session created.",
    interceptedRequests: intercepted,
  });
  await fs.writeFile(
    "docs/screenshots-provenance.json",
    JSON.stringify(provenance, null, 2) + "\n",
  );
  console.log(
    "Captured actual Alcoholfabet interface using isolated menu-only responses; no backend request sent.",
  );
} finally {
  await browser.close();
}
