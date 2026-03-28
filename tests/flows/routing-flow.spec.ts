import { expect, test } from "@playwright/test";

test.describe("routing flow (desktop-large)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("CV file is downloadable (HTTP 200)", async ({ page }) => {
    const response = await page.request.get("/Mitya_Kurs.pdf");

    expect(response.status()).toBe(200);
  });

  test("unknown path renders 404", async ({ page }) => {
    await page.goto("/does-not-exist");

    await expect(
      page.getByRole("heading", { name: "404 - Not Found" }),
    ).toBeVisible();
  });

  test("sessionStorage.redirect sends user to /theBuzz/experience and clears key", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("redirect", "/theBuzz/experience");
    });

    await page.goto("/");

    await expect(page).toHaveURL(/\/theBuzz\/experience$/, { timeout: 30000 });

    const redirectValue = await page.evaluate(() =>
      sessionStorage.getItem("redirect"),
    );
    expect(redirectValue).toBeNull();
  });
});
