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

/**
 * The hero's own entrance — the portrait sliding in, the prompt and the CTA rising —
 * is the same gesture as the cascade, so reduced motion has to reach it too.
 */
function heroAnimations(page: Page) {
  return page
    .locator(
      ".intro-overlay .avatar-animate-in, .intro-overlay .prompt-animate-in, .intro-overlay .button-animate-in",
    )
    .evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).animationName),
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

    test("gets the hero without its own entrance animations either", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");

      await expect(
        page.getByRole("button", { name: "Get to know me" }),
      ).toBeVisible({ timeout: 30000 });

      const animations = await heroAnimations(page);
      expect(animations).toHaveLength(3);
      expect([...new Set(animations)]).toEqual(["none"]);
    });
  });

  // Guards the case above against passing because the classes stopped being applied.
  test("the hero animates its own entrance when motion is welcome", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Get to know me" }),
    ).toBeVisible({ timeout: 30000 });

    expect(await heroAnimations(page)).toEqual([
      "avatarSlideIn",
      "promptSlideToCenter",
      "buttonSlideIn",
    ]);
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
