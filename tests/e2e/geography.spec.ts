import { expect, test } from "@playwright/test";

test("Camí Curt graph explorer provides real, accessible routes without WebGL", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/work/camicurt/");
  const start = page.getByLabel("Start", { exact: true });
  const destination = page.getByLabel("Destination", { exact: true });
  await expect(start.locator("option")).toHaveCount(41);
  await expect(destination.locator("option")).toHaveCount(41);

  await start.selectOption("barcelones");
  await destination.selectOption("maresme");
  await expect(page.getByRole("status")).toContainText("1 border crossing");
  await expect(page.getByRole("status")).toContainText("Barcelonès → Maresme");
  await expect(
    page.getByRole("img", {
      name: "Catalonia: a route from Barcelonès to Maresme",
      exact: true,
    }),
  ).toBeVisible();

  await destination.selectOption("barcelones");
  await expect(page.getByRole("status")).toContainText("0 border crossings");

  await page.setViewportSize({ width: 390, height: 844 });
  await destination.scrollIntoViewIfNeeded();
  await destination.focus();
  await expect(destination).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(errors).toEqual([]);
});
