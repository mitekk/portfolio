import { expect, type Page, test } from "@playwright/test";

/**
 * The entry animation is a first-impression gesture, not content. It is skipped for
 * anyone who asked for reduced motion, and after it has played once in a session —
 * `dropFinished` starts true, so the hero is there on arrival.
 *
 * "Skipped" is asserted structurally rather than on wall time: the tiles carry no
 * transition at all, so they are settled on their first render instead of dropping into
 * place. A time budget here would measure the dev server's page load, not the entry.
 */
async function tileTransitions(page: Page) {
  const tiles = page.locator('[data-grid="decorative"] > div');
  await expect(tiles.first()).toBeAttached({ timeout: 30000 });
  return tiles.evaluateAll((nodes) =>
    nodes.map((node) => getComputedStyle(node).transitionProperty),
  );
}

test.describe("intro skip", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.describe("with reduced motion", () => {
    test("gets the hero without the cascade", async ({ page }) => {
      // `emulateMedia`, not the `reducedMotion` context option: the context option does
      // not reach the page with the Chromium build available here, and silently leaves
      // the query false — which would make this case pass against the animated path.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");

      await expect(
        page.getByRole("button", { name: "Get to know me" }),
      ).toBeVisible({ timeout: 30000 });

      const transitions = await tileTransitions(page);
      expect(transitions.length).toBeGreaterThan(20);
      expect([...new Set(transitions)]).toEqual(["none"]);
    });
  });

  test("the first visit animates and the second one in the session does not", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Get to know me" }),
    ).toBeVisible({ timeout: 30000 });
    expect([...new Set(await tileTransitions(page))]).toEqual(["transform"]);

    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Get to know me" }),
    ).toBeVisible({ timeout: 30000 });
    expect([...new Set(await tileTransitions(page))]).toEqual(["none"]);
  });
});
