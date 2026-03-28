import { expect, test } from "@playwright/test";

const viewports = [
  { label: "desktop-large", width: 1440, height: 900 },
  { label: "desktop-small", width: 1280, height: 720 },
];

for (const viewport of viewports) {
  test.describe(`keyboard navigation (${viewport.label})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("ArrowDown and ArrowUp navigate sections in order", async ({
      page,
    }) => {
      await page.goto("/theBuzz/about");
      await expect(page.locator("nav")).toBeVisible({ timeout: 30000 });

      await page.keyboard.press("ArrowDown");
      await expect(page).toHaveURL(/\/theBuzz\/experience$/);
      await expect(page.locator("nav .nav-link.active")).toContainText(
        "experience",
      );
      await page.keyboard.press("ArrowDown");
      await expect(page).toHaveURL(/\/theBuzz\/toolbox$/);
      await expect(page.locator("nav .nav-link.active")).toContainText(
        "toolbox",
      );

      await page.keyboard.press("ArrowUp");
      await expect(page).toHaveURL(/\/theBuzz\/experience$/);
      await expect(page.locator("nav .nav-link.active")).toContainText(
        "experience",
      );
      await page.keyboard.press("ArrowUp");
      await expect(page).toHaveURL(/\/theBuzz\/about$/);
      await expect(page.locator("nav .nav-link.active")).toContainText("about");
    });

    test("Tab moves focus across interactive elements without trapping", async ({
      page,
    }) => {
      await page.goto("/theBuzz/about");
      await expect(page.locator("nav")).toBeVisible({ timeout: 30000 });

      const focusedElements = new Set<string>();

      for (let i = 0; i < 8; i++) {
        await page.keyboard.press("Tab");
        const focused = await page.evaluate(() => {
          const active = document.activeElement as HTMLElement | null;
          if (!active) return "none";

          const text = active.textContent?.trim().slice(0, 30) ?? "";
          const href = active.getAttribute("href") ?? "";
          return `${active.tagName}:${href}:${text}`;
        });

        focusedElements.add(focused);
      }

      expect(focusedElements.size).toBeGreaterThan(1);

      const bodyFocused = await page.evaluate(
        () => document.activeElement === document.body,
      );
      expect(bodyFocused).toBe(false);
    });

    test("Enter on focused nav link triggers navigation", async ({ page }) => {
      await page.goto("/theBuzz/about");
      await expect(page.locator("nav")).toBeVisible({ timeout: 30000 });

      const toolboxLink = page.getByRole("link", { name: "toolbox" });
      await toolboxLink.focus();
      await page.keyboard.press("Enter");

      await expect(page).toHaveURL(/\/theBuzz\/toolbox$/);
    });
  });
}
