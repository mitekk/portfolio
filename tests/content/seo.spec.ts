import { expect, test, type Page } from "@playwright/test";

async function assertBaseSeo(page: Page) {
  await page.waitForFunction(() => document.title.trim().length > 0);

  const title = await page.title();
  expect(title.trim().length).toBeGreaterThan(0);

  const description = await page
    .locator('meta[name="description"]')
    .first()
    .getAttribute("content");
  expect(description?.trim().length ?? 0).toBeGreaterThan(0);

  const canonicalHref = await page
    .locator('link[rel="canonical"]')
    .first()
    .getAttribute("href");
  expect(canonicalHref?.trim().length ?? 0).toBeGreaterThan(0);

  for (const property of ["og:title", "og:description", "og:url", "og:image"]) {
    const value = await page
      .locator(`meta[property="${property}"]`)
      .first()
      .getAttribute("content");

    expect(value?.trim().length ?? 0).toBeGreaterThan(0);
  }
}

test.describe("SEO metadata (desktop-large)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("home page has title/description/canonical/og + JSON-LD", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(".intro-overlay")).toBeVisible({
      timeout: 30000,
    });

    await assertBaseSeo(page);

    await expect(
      page.locator('script[type="application/ld+json"]'),
    ).toHaveCount(2);
  });

  test("about page has title/description/canonical/og tags", async ({
    page,
  }) => {
    await page.goto("/theBuzz/about");
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible({
      timeout: 30000,
    });

    await assertBaseSeo(page);
  });

  test("experience page has title/description/canonical/og tags", async ({
    page,
  }) => {
    await page.goto("/theBuzz/experience");
    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible(
      { timeout: 30000 },
    );

    await assertBaseSeo(page);
  });

  test("toolbox page has title/description/canonical/og tags", async ({
    page,
  }) => {
    await page.goto("/theBuzz/toolbox");
    await expect(page.getByRole("heading", { name: "Toolbox" })).toBeVisible({
      timeout: 30000,
    });

    await assertBaseSeo(page);
  });
});
