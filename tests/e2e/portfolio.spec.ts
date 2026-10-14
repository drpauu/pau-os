import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("direct routes, actual project assets, metadata and browser history", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/",
    "/projects/",
    "/projects/athra/",
    "/projects/trackflow/",
    "/projects/cami-curt/",
    "/about/",
    "/lab/",
    "/resume/",
    "/contact/",
  ]) {
    const r = await page.goto(route);
    expect(r?.status()).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("meta[name=description]")).toHaveAttribute(
      "content",
      /.+/,
    );
    expect(await page.locator("main").innerText()).not.toHaveLength(0);
  }
  await page.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/contact\/$/);
  for (const asset of [
    "/pau-alcazar-resume.pdf",
    "/images/athra.webp",
    "/images/trackflow.webp",
    "/images/cami-curt.webp",
    "/images/laboratory.webp",
    "/images/og.png",
    "/sitemap.xml",
    "/robots.txt",
  ])
    expect((await request.get(asset)).status()).toBe(200);
  expect(errors).toEqual([]);
});
test("terminal commands, completion, history, focus and safe navigation", async ({
  page,
}) => {
  await page.goto("/about/");
  const trigger = page.getByRole("button", { name: "Open terminal" });
  await trigger.click();
  const input = page.getByRole("textbox", { name: "Terminal command" });
  await expect(input).toBeFocused();
  await input.fill("who");
  await input.press("Tab");
  await expect(input).toHaveValue("whoami");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText("Pau Alcázar");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("whoami");
  await input.fill("theme titanium");
  await input.press("Enter");
  await expect(page.locator("[data-theme]")).toHaveAttribute(
    "data-theme",
    "titanium",
  );
  await input.fill("clear");
  await input.press("Enter");
  await expect(page.locator(".terminal-entry")).toHaveCount(0);
  await input.fill("<script>alert(1)</script>");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText("Command not found");
  await input.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await input.fill("open athra");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/projects\/athra\/$/);
});
test("camera stations, quality controls and optional audio", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await page
    .getByRole("combobox", { name: "Scene quality" })
    .selectOption("high");
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator("[data-station=athra]")).toBeVisible();
  const before = await page
    .locator("[data-station=athra]")
    .getAttribute("style");
  await page.getByRole("button", { name: "Focus ATHRA station" }).click();
  await page.waitForTimeout(1600);
  expect(
    await page.locator("[data-station=athra]").getAttribute("style"),
  ).not.toBe(before);
  await expect(
    page.getByRole("link", { name: "Open case study ↗", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset laboratory view" }).click();
  await page.getByRole("button", { name: "Enable ambient audio" }).click();
  await expect(
    page.getByRole("button", { name: "Mute ambient audio" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Mute ambient audio" }).click();
  await page
    .getByRole("combobox", { name: "Scene quality" })
    .selectOption("low");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Read ATHRA case study" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("graph experiment computes real paths through mouse and keyboard", async ({
  page,
}) => {
  await page.goto("/lab/");
  await expect(page.locator(".path-output")).toContainText("Cost: 10");
  await page.getByRole("combobox", { name: "DESTINATION" }).selectOption("A");
  await expect(page.locator(".path-output")).toContainText("Cost: 0");
  const target = page.getByRole("button", { name: "Set destination D" });
  await target.focus();
  await target.press("Enter");
  await expect(page.locator(".path-output")).toContainText("Cost: 8");
  await page.getByRole("button", { name: "Hide solution" }).click();
  await expect(page.locator(".path-output")).toContainText("Path hidden");
});
test("no WebGL retains all portfolio navigation", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (
        type === "webgl" ||
        type === "webgl2" ||
        type === "experimental-webgl"
      )
        return null;
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
  await expect(page.locator("h1")).toContainText("CAMÍ CURT");
});
test("HTML remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3101/projects/");
  await expect(
    page.getByRole("link", { name: "ATHRA", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "ATHRA", exact: true }).click();
  await expect(page.locator("h1")).toContainText("ATHRA");
  await context.close();
});
test("reduced motion, keyboard skip link and accessible content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page
    .getByRole("combobox", { name: "Scene quality" })
    .selectOption("medium");
  await page.waitForTimeout(300);
  for (const route of [
    "/",
    "/projects/athra/",
    "/about/",
    "/lab/",
    "/resume/",
    "/contact/",
  ]) {
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
  }
});
for (const [name, width, height] of [
  ["desktop-large", 1920, 1080],
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
] as const) {
  test(`responsive capture ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page
      .getByRole("combobox", { name: "Scene quality" })
      .selectOption(width > 800 ? "high" : "medium");
    await page.waitForTimeout(3000);
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
      await page
        .getByRole("link", { name: "Resume", exact: true })
        .first()
        .click();
      await expect(page).toHaveURL(/\/resume\/$/);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    }
  });
}
