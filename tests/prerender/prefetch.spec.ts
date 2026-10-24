import { expect, test, type Page } from "@playwright/test";

/**
 * Sections are prefetched on idle so that navigating to one never suspends. From
 * the intro that should reach only as far as the page the CTA actually lands on —
 * a visitor who bounces off `/` should not have paid for the toolbox, which is the
 * heaviest section by a wide margin.
 */
async function jsFetched(page: Page, path: string) {
  const seen: string[] = [];
  page.on("request", (r) => {
    const p = new URL(r.url()).pathname;
    if (p.startsWith("/assets/") && p.endsWith(".js"))
      seen.push(p.split("/").pop()!);
  });
  await page.goto(path);
  await page.getByRole("heading", { level: 1 }).waitFor();
  // Comfortably past requestIdleCallback on an unloaded page.
  await page.waitForTimeout(1500);
  return seen;
}

test("the intro prefetches the landing section but not the rest", async ({
  page,
}) => {
  const seen = await jsFetched(page, "/");

  expect(seen.filter((f) => /^buzzPage-/.test(f))).toHaveLength(1);
  expect(seen.filter((f) => /^about-/.test(f))).toHaveLength(1);
  expect(seen.filter((f) => /^toolbox-/.test(f))).toEqual([]);
  expect(seen.filter((f) => /^experience-/.test(f))).toEqual([]);
});

test("a section page prefetches its siblings", async ({ page }) => {
  const seen = await jsFetched(page, "/theBuzz/about/");

  expect(seen.filter((f) => /^toolbox-/.test(f))).toHaveLength(1);
  expect(seen.filter((f) => /^experience-/.test(f))).toHaveLength(1);
});
