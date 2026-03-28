import { test, expect } from "@playwright/test";

/**
 * These tests guard against the layout clipping regression where the background
 * tile grid's height exceeds the viewport (due to Math.ceil(rows/4)*4 rounding),
 * causing the content overlay to be cut off by `overflow:hidden` on <main>.
 *
 * Fix: both overlays are expected to stay bounded to the viewport, independent
 * of the exact DOM hierarchy or whether positioning uses `fixed` or `absolute`.
 */

const viewports = [
  { label: "small desktop", width: 1280, height: 720 },
  { label: "standard desktop", width: 1440, height: 900 },
  { label: "large desktop", width: 1920, height: 1080 },
];

for (const vp of viewports) {
  test.describe(`layout clipping — ${vp.label} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    // ── BuzzPage overlay ──────────────────────────────────────────────────────

    test("buzz overlay does not extend below the viewport", async ({
      page,
    }) => {
      await page.goto("/theBuzz/about");
      await page.locator("nav").waitFor({ state: "visible" });

      // Select the largest ancestor around nav inside <main>; this tracks the
      // page overlay even if class names or intermediate wrappers change.
      const overlayBounds = await page.evaluate(() => {
        const nav = document.querySelector("nav");
        if (!nav) return null;

        const main = nav.closest("main");
        if (!main) return null;

        let current: HTMLElement | null = nav.parentElement;
        let best: { top: number; bottom: number; area: number } | null = null;

        while (current && current !== main) {
          const rect = current.getBoundingClientRect();
          const area = rect.width * rect.height;
          if (!best || area > best.area) {
            best = { top: rect.top, bottom: rect.bottom, area };
          }
          current = current.parentElement;
        }

        if (!best) return null;
        return { top: best.top, bottom: best.bottom };
      });

      expect(overlayBounds).not.toBeNull();
      expect(overlayBounds!.bottom).toBeCloseTo(vp.height, 1);
    });

    test("buzz overlay starts at the top of the viewport", async ({ page }) => {
      await page.goto("/theBuzz/about");
      await page.locator("nav").waitFor({ state: "visible" });

      const overlayBounds = await page.evaluate(() => {
        const nav = document.querySelector("nav");
        if (!nav) return null;

        const main = nav.closest("main");
        if (!main) return null;

        let current: HTMLElement | null = nav.parentElement;
        let best: { top: number; bottom: number; area: number } | null = null;

        while (current && current !== main) {
          const rect = current.getBoundingClientRect();
          const area = rect.width * rect.height;
          if (!best || area > best.area) {
            best = { top: rect.top, bottom: rect.bottom, area };
          }
          current = current.parentElement;
        }

        if (!best) return null;
        return { top: best.top, bottom: best.bottom };
      });

      expect(overlayBounds).not.toBeNull();
      expect(overlayBounds!.top).toBeCloseTo(0, 1);
    });

    // ── Toolbox scroll coverage ───────────────────────────────────────────────

    test("toolbox: AI section heading is reachable by scrolling", async ({
      page,
    }) => {
      await page.goto("/theBuzz/toolbox");
      await page.locator("nav").waitFor({ state: "visible" });

      const aiHeading = page.getByRole("heading", { name: "AI" });
      await aiHeading.scrollIntoViewIfNeeded();
      await expect(aiHeading).toBeInViewport();
    });

    test("toolbox: last tool items (Claude, Codex) are reachable by scrolling", async ({
      page,
    }) => {
      await page.goto("/theBuzz/toolbox");
      await page.locator("nav").waitFor({ state: "visible" });

      for (const name of ["Claude", "Codex"]) {
        const item = page.getByText(name, { exact: true }).last();
        await item.scrollIntoViewIfNeeded();
        await expect(item).toBeInViewport();
      }
    });

    // ── Intro page overlay ────────────────────────────────────────────────────

    test("intro overlay does not extend below the viewport", async ({
      page,
    }) => {
      await page.goto("/");

      // Wait for the intro overlay to appear (rendered after the grid animation)
      const overlay = page.locator(".intro-overlay");
      await overlay.waitFor({ state: "visible", timeout: 15000 });

      const box = await overlay.boundingBox();
      expect(box).not.toBeNull();

      // Overlay must stay bounded to viewport height.
      expect(box!.y).toBeCloseTo(0, 1);
      expect(box!.y + box!.height).toBeCloseTo(vp.height, 1);
    });
  });
}
