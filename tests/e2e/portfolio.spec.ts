import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const toolbox: { categories: { title: string; items: string[] }[] } =
  JSON.parse(
    fs.readFileSync(
      new URL("../../data/toolbox.json", import.meta.url),
      "utf8",
    ),
  );
const slugs = [
  "camicurt",
  "athra",
  "alcoholfabet",
  "trackflow",
  "adhoc-medical-data-processing",
  "connect4-ai",
  "checkers-ai",
  "esinmath",
];
const titles = [
  "CAMÍ CURT",
  "ATHRA",
  "ALCOHOLFABET",
  "TRACKFLOW",
  "AD-HOC MEDICAL DATA PROCESSING",
  "CONNECT4 AI",
  "CHECKERS AI",
  "ESINMATH",
];
const installationSlugs = slugs.slice(0, 4);
const installationTitles = titles.slice(0, 4);
const routes = [
  "/",
  "/work/",
  ...slugs.map((s) => `/work/${s}/`),
  "/experience/",
  "/about/",
  "/resume/",
  "/contact/",
];

test("direct routes, verified media, exact main navigation and browser history", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => localStorage.setItem("pau-quality", "low"));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("meta[name=description]")).toHaveAttribute(
      "content",
      /.+/,
    );
  }
  expect(
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link")
      .allTextContents(),
  ).toEqual(["Home", "Work", "Experience", "About", "Contact"]);
  await expect(page.getByRole("link", { name: "Resume / CV" })).toBeVisible();
  await page.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/work\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/contact\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/work\/$/);
  for (const asset of [
    "/pau-alcazar-resume.pdf",
    ...["athra", "trackflow", "cami-curt", "alcoholfabet", "laboratory"].map(
      (s) => `/images/${s}.webp`,
    ),
    "/images/pinned-medical-operations.webp",
    "/images/pinned-connect4-ai.webp",
    "/images/pinned-checkers-ai.webp",
    "/images/pinned-esinmath.webp",
    "/images/og.png",
    "/sitemap.xml",
    "/robots.txt",
  ])
    expect((await request.get(asset)).status()).toBe(200);
  expect((await request.get("/Pau_Alcazar_CV.pdf")).status()).toBe(404);
  expect((await request.get("/lab/")).status()).toBe(404);
  await page.goto("/work/adhoc-medical-data-processing/");
  await expect(
    page.getByText(/Source link withheld pending repository privacy/),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "View source" })).toHaveCount(0);
  await page.goto("/resume/");
  await expect(page.locator("main")).not.toContainText("CONNECT4 AI");
  const legacy = await page.goto("/projects/cami-curt/");
  expect(legacy?.status()).toBe(200);
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    /\/work\/camicurt\/$/,
  );
  expect(errors).toEqual([]);
});

test("home and Work preserve the featured-product then GitHub-pin order", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("pau-quality", "low"));
  for (const route of ["/", "/work/"]) {
    await page.goto(route);
    expect(await page.locator(".project-copy h2").allTextContents()).toEqual(
      titles,
    );
  }
  for (let i = 0; i < slugs.length; i++) {
    await page.goto(`/work/${slugs[i]}/`);
    await expect(page.locator(".case-end a")).toHaveAttribute(
      "href",
      `/work/${slugs[(i + 1) % slugs.length]}/`,
    );
  }
});

test("terminal remains an optional keyboard easter egg with safe commands", async ({
  page,
}) => {
  await page.goto("/about/");
  const anchor = page.getByRole("link", { name: "Resume / CV" });
  await anchor.focus();
  await page.keyboard.press("Control+k");
  const input = page.getByRole("textbox", { name: "Terminal command" });
  await expect(input).toBeFocused();
  await input.fill("who");
  await input.press("Tab");
  await expect(input).toHaveValue("whoami");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText("Pau Alcázar");
  await input.fill("<script>alert(1)</script>");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText("Command not found");
  await input.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(anchor).toBeFocused();
  await page.keyboard.press("Control+k");
  await input.fill("open athra");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/work\/athra\/$/);
});

test("camera redirects safely, every installation focuses, and quality fallback works", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page
    .getByRole("combobox", { name: "Scene quality" })
    .selectOption("high");
  await expect(page.locator("canvas")).toBeVisible();
  await page.waitForTimeout(1800);
  for (let i = 0; i < installationTitles.length; i++) {
    await page
      .getByRole("button", { name: `Focus ${installationTitles[i]} station` })
      .click();
    await page.waitForTimeout(1150);
    await expect(
      page.getByRole("button", {
        name: `Focus ${installationTitles[i]} station`,
      }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.screenshot({
      path: `docs/screenshots/installation-${installationSlugs[i]}.png`,
    });
  }
  await page.getByRole("button", { name: "Focus ATHRA station" }).click();
  await page.getByRole("button", { name: "Focus CAMÍ CURT station" }).click();
  await page.getByRole("button", { name: "Focus TRACKFLOW station" }).click();
  await page.waitForTimeout(1400);
  await expect(
    page.locator("[data-station=trackflow] .station-visit"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset observatory view" }).click();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: "docs/screenshots/observatory.png" });
  await page
    .getByRole("combobox", { name: "Scene quality" })
    .selectOption("low");
  await expect(page.locator("canvas")).toHaveCount(0);
  for (const title of installationTitles)
    await expect(
      page.getByRole("link", { name: `Read ${title} case study` }),
    ).toBeVisible();
  expect(errors).toEqual([]);
});

test("actual comarca graph explores adjacent, distant and same-node paths", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/work/camicurt/");
  await page
    .getByRole("combobox", { name: "Start", exact: true })
    .selectOption("barcelones");
  await page
    .getByRole("combobox", { name: "Destination", exact: true })
    .selectOption("maresme");
  await expect(page.getByRole("status")).toContainText("1 border crossing");
  await page
    .getByRole("combobox", { name: "Destination", exact: true })
    .selectOption("barcelones");
  await expect(page.getByRole("status")).toContainText("0 border crossings");
  await page
    .getByRole("combobox", { name: "Destination", exact: true })
    .selectOption("montsia");
  await expect(page.getByRole("status")).toContainText("Montsià");
  expect(errors).toEqual([]);
});

test("Toolbox matches all synchronized categories and supports keyboard selection", async ({
  page,
}) => {
  await page.goto("/about/");
  for (const category of toolbox.categories) {
    await page
      .getByRole("tab", {
        name: new RegExp(category.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      })
      .click();
    const items = await page
      .getByRole("tabpanel")
      .filter({ visible: true })
      .getByRole("listitem")
      .allTextContents();
    expect(items.map((text) => text.replace(/^\d+\s*/, ""))).toEqual(
      category.items,
    );
  }
  const first = page.getByRole("tab").first();
  await first.focus();
  await first.press("ArrowDown");
  await expect(page.getByRole("tab").nth(1)).toBeFocused();
});

test("no WebGL retains all navigation and static scene", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (["webgl", "webgl2", "experimental-webgl"].includes(type)) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Explore my work" }),
  ).toBeVisible();
  await page.screenshot({ path: "docs/screenshots/fallback.png" });
  await page.getByRole("link", { name: "Read CAMÍ CURT case study" }).click();
  await expect(page.locator("h1")).toHaveText("CAMÍ CURT");
});

test("professional and project HTML remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3101/work/");
  expect(await page.locator(".project-copy h2").allTextContents()).toEqual(
    titles,
  );
  await page.getByRole("link", { name: "CAMÍ CURT", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("CAMÍ CURT");
  await page.goto("http://127.0.0.1:3101/experience/");
  await expect(page.locator("main")).toContainText("Accenture");
  await context.close();
});

test("reduced motion, keyboard navigation and WCAG automated checks", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  for (const route of routes) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    if (
      ["/about/", "/experience/", "/resume/", "/work/camicurt/"].includes(route)
    )
      await page.screenshot({
        path: `docs/screenshots/${route.replaceAll("/", "-").slice(1, -1)}.png`,
        fullPage: true,
      });
  }
});
for (const [name, width, height] of [
  ["desktop-large", 1920, 1080],
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
] as const) {
  test(`responsive ${name}: composition and project navigation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page
      .getByRole("combobox", { name: "Scene quality" })
      .selectOption(width > 800 ? "high" : "medium");
    await page.waitForTimeout(2400);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `docs/screenshots/${name}.png`,
      fullPage: true,
    });
    if (width < 800) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.getByRole("link", { name: "Work", exact: true }).click();
      await expect(page).toHaveURL(/\/work\/$/);
      await page.screenshot({
        path: `docs/screenshots/${name}-work.png`,
        fullPage: true,
      });
      expect(await page.locator(".project-copy h2").allTextContents()).toEqual(
        titles,
      );
    }
  });
}
