import { expect, test } from "@playwright/test";

/**
 * What a visitor sees before the bundle has run. The app's JS is aborted at the network
 * level rather than disabled outright, so the inline theme script still runs (as it does
 * for real, during `<head>` parse) and `page.evaluate` is still available.
 */
test.describe("first paint before the bundle boots", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/assets/*.js", (route) => route.abort());
  });

  test("paints the themed surround and does not hide the prerendered markup", async ({
    page,
  }) => {
    await page.goto("/");

    const paint = await page.evaluate(() => {
      const root = document.getElementById("root")!;
      const styles = getComputedStyle(document.documentElement);
      return {
        bodyBackground: getComputedStyle(document.body).backgroundColor,
        surround: styles.getPropertyValue("--color-surround").trim(),
        rootVisibility: getComputedStyle(root).visibility,
        rootHasContent: root.childElementCount > 0,
      };
    });

    expect(paint.rootHasContent).toBe(true);
    expect(paint.rootVisibility).toBe("visible");
    expect(paint.bodyBackground).not.toBe("rgba(0, 0, 0, 0)");
    expect(paint.bodyBackground).toBe(hexToRgb(paint.surround));
  });
});

function hexToRgb(hex: string) {
  const [, r, g, b] = /^#(\w{2})(\w{2})(\w{2})$/.exec(hex) ?? [];
  expect(
    r,
    `expected --color-surround to be a 6-digit hex, got "${hex}"`,
  ).toBeTruthy();
  return `rgb(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)})`;
}
