import { expect, test } from "@playwright/test";

const viewports = [
  { label: "desktop-large", width: 1440, height: 900, desktop: true },
  { label: "desktop-small", width: 1280, height: 720, desktop: true },
  { label: "tablet", width: 700, height: 700, desktop: false },
  { label: "mobile", width: 375, height: 812, desktop: false },
];

for (const viewport of viewports) {
  test.describe(`responsive layout (${viewport.label})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("navigation layout matches viewport breakpoint", async ({ page }) => {
      await page.goto("/theBuzz/about");

      const sidebar = page.locator("nav");
      const mobileHeader = page.locator("header").first();
      const mobileFooter = page.locator("footer").first();

      if (viewport.desktop) {
        await expect(sidebar).toBeVisible({ timeout: 30000 });
        await expect(mobileHeader).toBeHidden();
        await expect(mobileFooter).toBeHidden();

        await expect(page.getByText("LinkedIn", { exact: true })).toBeVisible();
        await expect(page.getByText("GitHub", { exact: true })).toBeVisible();
      } else {
        await expect(mobileHeader).toBeVisible({ timeout: 30000 });
        await expect(mobileFooter).toBeVisible({ timeout: 30000 });
        await expect(sidebar).toBeHidden();

        await expect(mobileFooter.locator("img")).toHaveCount(4);
        await expect(page.getByText("LinkedIn", { exact: true })).toBeHidden();
        await expect(page.getByText("GitHub", { exact: true })).toBeHidden();
      }
    });
  });
}

test.describe("responsive layout (mobile wave density)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("wave background uses reduced checkerboard density", async ({ page }) => {
    await page.goto("/theBuzz/about");
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible({
      timeout: 30000,
    });

    await expect
      .poll(async () => page.locator(".shape-group").count(), {
        timeout: 30000,
      })
      .toBeGreaterThan(0);

    const waveStats = await page.evaluate(() => {
      const groups = Array.from(document.querySelectorAll(".shape-group"));
      const lefts = new Set<number>();
      const tops = new Set<number>();

      groups.forEach((group) => {
        const el = group as HTMLElement;
        lefts.add(Math.round(parseFloat(el.style.left || "0")));
        tops.add(Math.round(parseFloat(el.style.top || "0")));
      });

      return {
        groupCount: groups.length,
        inferredFullGridCount: lefts.size * tops.size,
      };
    });

    expect(waveStats.groupCount).toBeGreaterThan(0);
    expect(waveStats.inferredFullGridCount).toBeGreaterThan(0);
    expect(waveStats.groupCount).toBeLessThan(waveStats.inferredFullGridCount);
  });
});
