import { expect, test } from "@playwright/test";

/**
 * @fontsource ships a .woff beside every .woff2 as a fallback for browsers that
 * predate woff2 — roughly IE11 and Safari 9. Nothing that can run this site is in
 * that set, and the fallback is never requested, so the three .woff files are
 * dead weight in the image.
 */
test("the stylesheet offers woff2 only", async ({ page, request }) => {
  await page.goto("/");
  const href = await page
    .locator('link[rel="stylesheet"]')
    .first()
    .getAttribute("href");
  expect(href).toBeTruthy();

  const css = await (await request.get(href!)).text();

  expect(css).toContain("woff2");
  expect(css, "a .woff fallback is still being offered").not.toMatch(
    /format\(['"]woff['"]\)/,
  );
});
