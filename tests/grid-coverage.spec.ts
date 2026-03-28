import { test, expect, type Page } from '@playwright/test';

const MAX_WIDTH = 1800;

async function getGridDivBox(page: Page) {
  const gridDiv = page.locator('main > div').first();
  await gridDiv.waitFor({ state: 'visible' });
  return gridDiv.boundingBox();
}

const viewports = [
  { label: 'small desktop', width: 1280, height: 720 },
  { label: 'standard desktop', width: 1440, height: 900 },
  { label: 'large desktop', width: 1920, height: 1080 },
  { label: 'tall viewport', width: 1440, height: 1200 },
];

for (const viewport of viewports) {
  test.describe(`${viewport.label} (${viewport.width}x${viewport.height})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('grid div width covers the viewport', async ({ page }) => {
      await page.goto('/');
      const box = await getGridDivBox(page);
      const expectedWidth = Math.min(viewport.width, MAX_WIDTH);
      expect(box!.width).toBeGreaterThanOrEqual(expectedWidth);
    });

    test('grid div height covers the viewport', async ({ page }) => {
      await page.goto('/');
      const box = await getGridDivBox(page);
      expect(box!.height).toBeGreaterThanOrEqual(viewport.height);
    });

    test('grid div covers main from the top (no gap above)', async ({ page }) => {
      await page.goto('/');
      const box = await getGridDivBox(page);
      const mainBox = await page.locator('main').boundingBox();
      // div may overflow above main (centering), but must not start below main's top
      expect(box!.y).toBeLessThanOrEqual(mainBox!.y);
    });

    test('grid div covers main to the right edge (no gap on right)', async ({ page }) => {
      await page.goto('/');
      const box = await getGridDivBox(page);
      const mainBox = await page.locator('main').boundingBox();
      expect(box!.x + box!.width).toBeGreaterThanOrEqual(mainBox!.x + mainBox!.width);
    });
  });
}
