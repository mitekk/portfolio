import { expect, test } from "@playwright/test";

const viewports = [
  { label: "desktop-large", width: 1440, height: 900 },
  { label: "desktop-small", width: 1280, height: 720 },
];

for (const viewport of viewports) {
  test.describe(`navigation flow (${viewport.label})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("nav links, arrow keys, avatar, active indicator, back/forward", async ({ page }) => {
      await page.goto("/theBuzz/about");

      const sidebar = page.locator("nav");
      await expect(sidebar).toBeVisible({ timeout: 30000 });

      await page.getByRole("link", { name: "experience" }).click();
      await expect(page).toHaveURL(/\/theBuzz\/experience$/);
      await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();

      await page.getByRole("link", { name: "toolbox" }).click();
      await expect(page).toHaveURL(/\/theBuzz\/toolbox$/);
      await expect(page.getByRole("heading", { name: "Toolbox" })).toBeVisible();

      await page.getByRole("link", { name: "about" }).click();
      await expect(page).toHaveURL(/\/theBuzz\/about$/);
      await expect(page.getByRole("heading", { name: "About" })).toBeVisible();

      await page.keyboard.press("ArrowDown");
      await expect(page).toHaveURL(/\/theBuzz\/experience$/);
      await expect(page.locator("nav .nav-link.active")).toContainText("experience");
      await page.keyboard.press("ArrowDown");
      await expect(page).toHaveURL(/\/theBuzz\/toolbox$/);
      await expect(page.locator("nav .nav-link.active")).toContainText("toolbox");
      await page.keyboard.press("ArrowDown");
      await expect(page).toHaveURL(/\/theBuzz\/about$/);
      await expect(page.locator("nav .nav-link.active")).toContainText("about");

      await page.keyboard.press("ArrowUp");
      await expect(page).toHaveURL(/\/theBuzz\/toolbox$/);
      await expect(page.locator("nav .nav-link.active")).toContainText("toolbox");
      await page.keyboard.press("ArrowUp");
      await expect(page).toHaveURL(/\/theBuzz\/experience$/);
      await expect(page.locator("nav .nav-link.active")).toContainText("experience");

      const activeLink = page.locator("nav .nav-link.active");
      await expect(activeLink).toContainText("experience");

      await page.getByRole("link", { name: "toolbox" }).click();
      await expect(page).toHaveURL(/\/theBuzz\/toolbox$/);
      await page.goBack();
      await expect(page).toHaveURL(/\/theBuzz\/experience$/);
      await page.goForward();
      await expect(page).toHaveURL(/\/theBuzz\/toolbox$/);

      await page.getByRole("link", { name: "Go to intro page" }).click();
      await expect(page).toHaveURL(/\/$/);
    });
  });
}
