import { test, expect } from '@playwright/test';

/**
 * These tests guard against the layout clipping regression where the background
 * tile grid's height exceeds the viewport (due to Math.ceil(rows/4)*4 rounding),
 * causing the content overlay to be cut off by `overflow:hidden` on <main>.
 *
 * Fix: both the buzz-page and intro-page overlays now use `fixed inset-0` so
 * they are always bounded to the viewport, independent of the grid's height.
 */

const viewports = [
  { label: 'small desktop', width: 1280, height: 720 },
  { label: 'standard desktop', width: 1440, height: 900 },
  { label: 'large desktop', width: 1920, height: 1080 },
];

for (const vp of viewports) {
  test.describe(`layout clipping — ${vp.label} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    // ── BuzzPage overlay ──────────────────────────────────────────────────────

    test('buzz overlay does not extend below the viewport', async ({ page }) => {
      await page.goto('/theBuzz/about');
      await page.locator('nav').waitFor({ state: 'visible' });

      // The fixed overlay wraps the nav — its bottom must equal the viewport height.
      // Before the fix (absolute inset-0 relative to the grid div) the overlay
      // extended to gridSize.height which can exceed the viewport by ~36–80 px.
      const overlayBottom = await page.evaluate(() => {
        const nav = document.querySelector('nav')!;
        // Walk up to the fixed overlay div (nav → wrapper div → fixed div)
        const overlay = nav.closest<HTMLElement>('[class*="fixed"]');
        if (!overlay) return null;
        return overlay.getBoundingClientRect().bottom;
      });

      expect(overlayBottom).not.toBeNull();
      expect(overlayBottom!).toBeCloseTo(vp.height, 1);
    });

    test('buzz overlay starts at the top of the viewport', async ({ page }) => {
      await page.goto('/theBuzz/about');
      await page.locator('nav').waitFor({ state: 'visible' });

      const overlayTop = await page.evaluate(() => {
        const nav = document.querySelector('nav')!;
        const overlay = nav.closest<HTMLElement>('[class*="fixed"]');
        if (!overlay) return null;
        return overlay.getBoundingClientRect().top;
      });

      expect(overlayTop).not.toBeNull();
      expect(overlayTop!).toBeCloseTo(0, 1);
    });

    // ── Toolbox scroll coverage ───────────────────────────────────────────────

    test('toolbox: AI section heading is reachable by scrolling', async ({ page }) => {
      await page.goto('/theBuzz/toolbox');
      await page.locator('nav').waitFor({ state: 'visible' });

      const aiHeading = page.getByRole('heading', { name: 'AI' });
      await aiHeading.scrollIntoViewIfNeeded();
      await expect(aiHeading).toBeInViewport();
    });

    test('toolbox: last tool items (Claude, Codex) are reachable by scrolling', async ({ page }) => {
      await page.goto('/theBuzz/toolbox');
      await page.locator('nav').waitFor({ state: 'visible' });

      for (const name of ['Claude', 'Codex']) {
        const item = page.getByText(name, { exact: true }).last();
        await item.scrollIntoViewIfNeeded();
        await expect(item).toBeInViewport();
      }
    });

    // ── Intro page overlay ────────────────────────────────────────────────────

    test('intro overlay does not extend below the viewport', async ({ page }) => {
      await page.goto('/');

      // Wait for the intro overlay to appear (rendered after the grid animation)
      const overlay = page.locator('.intro-overlay');
      await overlay.waitFor({ state: 'visible', timeout: 15000 });

      const box = await overlay.boundingBox();
      expect(box).not.toBeNull();

      // Before the fix the overlay height was set to gridSize.height which can
      // exceed the viewport.  After the fix it is fixed inset-0 = viewport height.
      expect(box!.y).toBeCloseTo(0, 1);
      expect(box!.y + box!.height).toBeCloseTo(vp.height, 1);
    });
  });
}
