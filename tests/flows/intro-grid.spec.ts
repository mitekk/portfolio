import { expect, test } from "@playwright/test";

/**
 * Characterisation of what the tetromino grid paints and how it reacts to the cursor.
 * The piece gradients and the hover response are the two things a rendering change to
 * the grid can quietly break, and neither is covered elsewhere.
 */
test.describe("tetromino grid", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".tile").first()).toBeAttached({
      timeout: 30000,
    });
  });

  test("every tile is a four-layer gradient over its piece colour", async ({
    page,
  }) => {
    const painted = await page
      .locator('[data-grid="decorative"] .tile')
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const styles = getComputedStyle(node);
          return {
            layers: (styles.backgroundImage.match(/linear-gradient/g) ?? [])
              .length,
            color: styles.backgroundColor,
          };
        }),
      );

    expect(painted.length).toBeGreaterThan(40);
    expect([...new Set(painted.map((tile) => tile.layers))]).toEqual([4]);
    expect(new Set(painted.map((tile) => tile.color)).size).toBeGreaterThan(3);
  });

  test("the shapes under the cursor are highlighted", async ({ page }) => {
    await expect(page.locator(".shape-group.hovered")).toHaveCount(0);

    await page.mouse.move(720, 450);

    const hovered = page.locator(".shape-group.hovered");
    await expect(hovered.first()).toBeAttached({ timeout: 5000 });
    expect(await hovered.count()).toBeLessThan(40);

    // The scale is read mid-transition, so compare against the resting 1.0 rather than
    // the 1.2 target.
    await expect
      .poll(async () =>
        hovered
          .first()
          .evaluate(
            (node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).a,
          ),
      )
      .toBeGreaterThan(1.1);
  });
});
