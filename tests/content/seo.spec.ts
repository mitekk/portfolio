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

/**
 * Every theBuzz route emits a ProfilePage whose mainEntity references the single
 * `#person` node, plus a BreadcrumbList. Asserting the @id — not just a count —
 * is what catches a page minting its own competing Person entity.
 */
async function assertProfileSchema(page: Page, canonicalEnds: string) {
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) =>
      nodes.map((n) => JSON.parse(n.textContent ?? "{}")),
    );

  expect(blocks).toHaveLength(2);

  const profile = blocks.find((b) => b["@type"] === "ProfilePage");
  expect(profile).toBeTruthy();
  expect(profile.url).toContain(canonicalEnds);
  expect(profile.mainEntity["@id"]).toMatch(/#person$/);
  expect(profile.isPartOf["@id"]).toMatch(/#website$/);

  const breadcrumb = blocks.find((b) => b["@type"] === "BreadcrumbList");
  expect(breadcrumb).toBeTruthy();
  expect(breadcrumb.itemListElement).toHaveLength(2);
  expect(breadcrumb.itemListElement[0].name).toBe("Home");
  expect(breadcrumb.itemListElement[1].item).toContain(canonicalEnds);
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
    await assertProfileSchema(page, "/theBuzz/about");
  });

  test("experience page has title/description/canonical/og tags", async ({
    page,
  }) => {
    await page.goto("/theBuzz/experience");
    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible(
      { timeout: 30000 },
    );

    await assertBaseSeo(page);
    await assertProfileSchema(page, "/theBuzz/experience");

    // The seven roles are derived from the rendered list, so a job added to the
    // page and not to the schema is impossible by construction - this guards the
    // derivation itself.
    const profile = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) =>
        nodes
          .map((n) => JSON.parse(n.textContent ?? "{}"))
          .find((b) => b["@type"] === "ProfilePage"),
      );
    expect(profile.mainEntity.worksFor).toHaveLength(7);
    expect(profile.mainEntity.worksFor[0]).toMatchObject({
      "@type": "OrganizationRole",
      startDate: "2025",
      worksFor: { name: "LawPDF" },
    });
  });

  test("toolbox page has title/description/canonical/og tags", async ({
    page,
  }) => {
    await page.goto("/theBuzz/toolbox");
    await expect(page.getByRole("heading", { name: "Toolbox" })).toBeVisible({
      timeout: 30000,
    });

    await assertBaseSeo(page);
    await assertProfileSchema(page, "/theBuzz/toolbox");
  });
});
