import { expect, test } from "@playwright/test";

/**
 * A hashed chunk that 404s means the HTML in the visitor's cache is older than the
 * deploy it points at. `location /` serves HTML with max-age=3600, so a returning
 * visitor can be in that state for an hour after a release.
 *
 * Reloading is the whole fix: the fresh HTML names the chunks that are actually on
 * disk. The mount is gated on the route chunk, so without this the visitor keeps
 * looking at the prerendered snapshot with every control dead.
 */
test("a route chunk that 404s reloads once and recovers", async ({ page }) => {
  let documents = 0;
  page.on("request", (r) => {
    if (r.resourceType() === "document") documents += 1;
  });

  await page.route("**/assets/introPage-*.js", async (route) => {
    // Only the first document's chunks are missing; the reload stands in for
    // fetching HTML that names the files the deploy actually left on disk.
    if (documents < 2) return route.fulfill({ status: 404, body: "" });
    return route.continue();
  });

  await page.goto("/");

  await expect.poll(() => documents, { timeout: 10_000 }).toBe(2);
  // Mounted and interactive, not the dead prerendered snapshot.
  await expect(page.locator(".intro-overlay")).toBeVisible();
});

test("a chunk that 404s twice leaves the prerendered page up instead of reloading forever", async ({
  page,
}) => {
  await page.route("**/assets/introPage-*.js", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );

  let documents = 0;
  page.on("request", (r) => {
    if (r.resourceType() === "document") documents += 1;
  });

  await page.goto("/");
  await expect.poll(() => documents, { timeout: 10_000 }).toBe(2);
  await page.waitForTimeout(2000);

  // The second failure is not staleness, so it must not start a reload loop.
  expect(documents).toBe(2);
  // Readable content is a better degradation than the blank page mounting would give.
  await expect(page.locator("h1.intro-root")).toHaveCount(1);
});
