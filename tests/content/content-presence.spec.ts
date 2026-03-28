import { expect, test } from "@playwright/test";

const viewports = [
  { label: "desktop-large", width: 1440, height: 900 },
  { label: "desktop-small", width: 1280, height: 720 },
];

for (const viewport of viewports) {
  test.describe(`content presence (${viewport.label})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("about page has 4 non-empty paragraphs", async ({ page }) => {
      await page.goto("/theBuzz/about");
      await expect(page.getByRole("heading", { name: "About" })).toBeVisible({
        timeout: 30000,
      });

      const paragraphs = page.locator("article p, section p");
      await expect(paragraphs).toHaveCount(4);

      const texts = await paragraphs.allTextContents();
      for (const text of texts) {
        expect(text.trim().length).toBeGreaterThan(0);
      }
    });

    test("experience page has 7 entries with company names and date ranges", async ({
      page,
    }) => {
      await page.goto("/theBuzz/experience");
      await expect(
        page.getByRole("heading", { name: "Experience" }),
      ).toBeVisible({ timeout: 30000 });

      const entries = page.locator("article");
      await expect(entries).toHaveCount(7);

      const dates = page.locator("article header p");
      const dateValues = await dates.allTextContents();
      for (const date of dateValues) {
        expect(date).toMatch(/^\d{4}-\d{4}$/);
      }

      await expect(
        page.getByRole("heading", { level: 2, name: /LawPDF/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { level: 2, name: /Bynet/i }),
      ).toBeVisible();
    });

    test("toolbox page has all category headings and no broken images", async ({
      page,
    }) => {
      await page.goto("/theBuzz/toolbox");
      await expect(page.getByRole("heading", { name: "Toolbox" })).toBeVisible({
        timeout: 30000,
      });

      const categoryHeadings = page.locator("section[aria-labelledby] h2");
      await expect(categoryHeadings).toHaveCount(7);

      const brokenImageCount = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll("img"));
        return images.filter((image) => image.naturalWidth === 0).length;
      });

      expect(brokenImageCount).toBe(0);
    });
  });
}
