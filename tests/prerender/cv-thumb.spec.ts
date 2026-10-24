import { expect, test } from "@playwright/test";

/**
 * The CV thumbnail is the one PNG in public/ that a visitor actually downloads —
 * it is an eager <img> on /cv. The rest are social cards and manifest icons that
 * no page load touches, and they stay PNG because the consumers that fetch them
 * (LinkedIn's card renderer, iOS home-screen icons) are the ones least reliable
 * about WebP.
 */
test("/cv serves its thumbnail as webp", async ({ page }) => {
  const images: { file: string; size: number }[] = [];
  page.on("response", async (r) => {
    const file = new URL(r.url()).pathname;
    if (/cv-thumb/.test(file)) {
      images.push({ file, size: (await r.body()).length });
    }
  });

  await page.goto("/cv/");
  await page.locator('img[alt*="CV"]').first().waitFor();
  await page.waitForTimeout(400);

  expect(images).toHaveLength(1);
  expect(images[0].file).toMatch(/\.webp$/);
  expect(
    images[0].size,
    `${images[0].file} is ${images[0].size} bytes`,
  ).toBeLessThan(100_000);
});
