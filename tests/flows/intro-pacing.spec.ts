import { expect, test } from "@playwright/test";

/**
 * The cascade is a fixed-length gesture, not a per-tile accumulation: the stagger is
 * divided across however many shapes a viewport happens to produce, so the entry reads
 * identically on a phone and on a desktop. A per-tile stagger makes the smallest screens
 * — which generate the most shapes — wait the longest.
 */
const DROP_STAGGER_S = 0.45;
const DROP_DURATION_S = 0.55;

const viewports = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "phone", width: 390, height: 844 },
];

for (const viewport of viewports) {
  test.describe(`intro pacing (${viewport.label})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("the tile cascade fits one fixed window", async ({ page }) => {
      await page.goto("/");

      const tiles = page.locator('[data-grid="decorative"] > div');
      await expect(tiles.first()).toBeAttached({ timeout: 30000 });

      const timings = await tiles.evaluateAll((nodes) =>
        nodes.map((node) => {
          const styles = getComputedStyle(node);
          return {
            delay: parseFloat(styles.transitionDelay),
            duration: parseFloat(styles.transitionDuration),
          };
        }),
      );

      expect(timings.length).toBeGreaterThan(20);
      expect(Math.max(...timings.map((t) => t.duration))).toBeCloseTo(
        DROP_DURATION_S,
        2,
      );
      // Equal, not just within: the first shape's factor is 1.0, so the cascade fills
      // exactly the window. `<=` would also pass for a regression to a tiny per-tile step.
      expect(Math.max(...timings.map((t) => t.delay))).toBeCloseTo(
        DROP_STAGGER_S,
        2,
      );
    });
  });
}
