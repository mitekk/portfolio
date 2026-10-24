import { expect, test, type Page } from "@playwright/test";

/**
 * The prerendered HTML paints the real page immediately. React then mounts into the
 * same container, and if the route's component is not ready on that first render the
 * `Suspense fallback={null}` commits — which both blanks the page and starts React's
 * ~300ms fallback-reveal throttle, so the content does not come back for about a
 * third of a second. The page looks static, then flickers.
 *
 * These tests assert the absence of that empty window structurally rather than by
 * wall time, so they stay honest on a loaded CI runner.
 */
const SAMPLER = `
window.__samples = [];
const read = () => {
  const r = document.getElementById("root");
  window.__samples.push(r ? (r.textContent || "").trim().length : -1);
};
const iv = setInterval(read, 4);
setTimeout(() => clearInterval(iv), 10000);
read();
`;

// Enough to tell "the page" from "an empty shell plus the theme toggle", which is
// two characters of emoji.
const MEANINGFUL = 200;

function assertNeverBlanked(samples: number[], label: string) {
  const first = samples.findIndex((n) => n >= MEANINGFUL);
  expect(first, `${label}: never rendered any content`).toBeGreaterThanOrEqual(
    0,
  );

  const after = samples.slice(first);
  const low = Math.min(...after);
  expect(
    low,
    `${label}: #root emptied to ${low} chars after first showing content`,
  ).toBeGreaterThanOrEqual(MEANINGFUL);
}

const ROUTES = ["/theBuzz/about/", "/theBuzz/experience/", "/theBuzz/toolbox/"];

for (const route of ROUTES) {
  test(`${route} never blanks between the prerendered markup and React`, async ({
    page,
  }) => {
    await page.addInitScript(SAMPLER);
    await page.goto(route);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.waitForTimeout(600);

    const samples = await page.evaluate(() => window.__samples as number[]);
    assertNeverBlanked(samples, route);
  });
}

test("arriving from the intro, the sections still never blank", async ({
  page,
}: {
  page: Page;
}) => {
  await page.addInitScript(SAMPLER);
  await page.goto("/");
  const cta = page.getByRole("button", { name: "Get to know me" });
  await cta.waitFor({ timeout: 30000 });
  await cta.click();
  await page.getByRole("heading", { level: 1, name: "About" }).waitFor();

  // The visitor who came this way must not be the one who pays for the chunk.
  await page.getByRole("link", { name: "experience" }).click();
  await page
    .getByRole("heading", { level: 1, name: "Experience" })
    .waitFor({ timeout: 5000 });
  await page.waitForTimeout(300);

  const samples = await page.evaluate(() => window.__samples as number[]);

  // Measured only from the moment the section layout is up. Leaving the intro is a
  // real page change — the entry tears its grid and overlay down before the section
  // mounts — and passes through ~24ms with only the nav on screen. That is the
  // transition working, not a painted page going blank, which is what the rest of
  // this file is about.
  const inSections = samples.slice(samples.findIndex((n) => n >= 2000));
  assertNeverBlanked(inSections, "intro -> about -> experience");
});

test("navigating between the sections never blanks the page", async ({
  page,
}: {
  page: Page;
}) => {
  await page.addInitScript(SAMPLER);
  await page.goto("/theBuzz/about/");
  await page.getByRole("heading", { level: 1, name: "About" }).waitFor();

  // Each of these is a first visit, so each one has to load its chunk.
  for (const [link, heading] of [
    ["experience", "Experience"],
    ["toolbox", "Toolbox"],
  ]) {
    await page.getByRole("link", { name: link }).click();
    await page.getByRole("heading", { level: 1, name: heading }).waitFor();
  }
  await page.waitForTimeout(300);

  const samples = await page.evaluate(() => window.__samples as number[]);
  assertNeverBlanked(samples, "navigation");
});
