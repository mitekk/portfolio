import { expect, test, type Page } from "@playwright/test";

/**
 * The avatar is a 500px source rendered at 32-100px in the nav and at most 208px in
 * the intro hero, so most slots never need the big file. These cases pin which
 * variant each slot actually pulls, at both pixel densities, and that no slot ever
 * pulls both — a `preload` whose srcset disagrees with the `<img>` fetches one of
 * each, which costs more than having no srcset at all.
 */
async function avatarRequests(page: Page, path: string) {
  const seen: string[] = [];
  page.on("request", (r) => {
    const file = new URL(r.url()).pathname.split("/").pop() ?? "";
    if (/^avatar.*\.webp$/.test(file)) seen.push(file);
  });
  await page.goto(path);
  await page.locator("img.avatar-image:visible").first().waitFor();
  await page.waitForTimeout(400);
  return seen;
}

test("a narrow phone fetches no avatar at all", async ({ browser }) => {
  // navbar.css hides .buzz-avatar under 450px, and the sidebar is md-only, so
  // nothing on /theBuzz/* shows a portrait on a small phone. Pinned because it is
  // a real saving that a future layout change could silently undo.
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const seen: string[] = [];
  page.on("request", (r) => {
    const file = new URL(r.url()).pathname.split("/").pop() ?? "";
    if (/^avatar.*\.webp$/.test(file)) seen.push(file);
  });
  await page.goto("/theBuzz/about/");
  await page.getByRole("heading", { level: 1, name: "About" }).waitFor();
  await page.waitForTimeout(600);

  expect(seen, `fetched ${seen.join(", ")}`).toEqual([]);
  await page.close();
});

// The nav slot is 100px at its largest, so 200px even on a retina screen.
test.describe("nav avatar", () => {
  for (const device of [
    { label: "small screen", width: 600, height: 900, deviceScaleFactor: 2 },
    { label: "desktop 1x", width: 1440, height: 900, deviceScaleFactor: 1 },
    { label: "desktop 2x", width: 1440, height: 900, deviceScaleFactor: 2 },
  ]) {
    test(`${device.label} takes the 256px file, once`, async ({ browser }) => {
      const page = await browser.newPage({
        viewport: { width: device.width, height: device.height },
        deviceScaleFactor: device.deviceScaleFactor,
      });
      const seen = await avatarRequests(page, "/theBuzz/about/");

      expect(seen.length, `fetched ${seen.join(", ")}`).toBe(1);
      expect(seen[0]).toMatch(/avatar-256/);
      await page.close();
    });
  }
});

test.describe("intro hero", () => {
  test("a 1x desktop takes the 256px file for its 208px slot", async ({
    browser,
  }) => {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const seen = await avatarRequests(page, "/");

    expect(seen.length, `fetched ${seen.join(", ")}`).toBe(1);
    expect(seen[0]).toMatch(/avatar-256/);
    await page.close();
  });

  test("a 2x desktop takes the full file, and only that one", async ({
    browser,
  }) => {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const seen = await avatarRequests(page, "/");

    // 208px at 2x needs 416px, so the 256px file would be visibly soft here.
    expect(seen.length, `fetched ${seen.join(", ")}`).toBe(1);
    expect(seen[0]).not.toMatch(/avatar-256/);
    await page.close();
  });
});
