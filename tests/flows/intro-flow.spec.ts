import { expect, test } from "@playwright/test";

const viewports = [
  { label: "desktop-large", width: 1440, height: 900 },
  { label: "desktop-small", width: 1280, height: 720 },
];

for (const viewport of viewports) {
  test.describe(`intro flow (${viewport.label})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("prompter completes, mode toggles, and CTA navigates to /theBuzz/about", async ({
      page,
    }) => {
      await page.goto("/");

      const overlay = page.locator(".intro-overlay");
      await expect(overlay).toBeVisible({ timeout: 30000 });

      await expect(page.getByText(/Hi, I'm Mitya/i)).toBeVisible({
        timeout: 30000,
      });

      const cta = page.getByRole("button", { name: "Get to know me" });
      await expect(cta).toBeVisible({ timeout: 30000 });

      const avatar = page.getByRole("img", { name: /Portrait of Mitya Kurs/i });
      await expect(avatar).toBeVisible();
      const avatarBox = await avatar.boundingBox();
      expect(avatarBox?.width ?? 0).toBeGreaterThan(60);
      expect(avatarBox?.height ?? 0).toBeGreaterThan(60);

      await page
        .getByRole("button", { name: "Trip" })
        .evaluate((element: HTMLButtonElement) => element.click());
      await expect(page.locator(".sepia")).toBeVisible({ timeout: 15000 });

      await cta.click();

      await expect(page).toHaveURL(/\/theBuzz\/about$/, { timeout: 30000 });
      await expect(page.locator(".intro-overlay")).toHaveCount(0);
    });
  });
}
