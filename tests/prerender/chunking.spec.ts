import { expect, test, type Page } from "@playwright/test";

/**
 * The tetromino tiling templates are ~65KB of embedded JSON, used only by the intro
 * grid. Rollup had grouped them with shared UI code, so every section page
 * downloaded and parsed them in order to draw a waves grid that never calls the
 * tiler.
 *
 * Asserted on the bytes the page actually fetches rather than on a chunk name, so
 * the test keeps its meaning if the chunk is renamed or regrouped.
 */
const BIG_JSON = 20000;

async function biggestEmbeddedJson(page: Page, path: string) {
  const urls = new Set<string>();
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.pathname.startsWith("/assets/") && u.pathname.endsWith(".js"))
      urls.add(u.pathname);
  });
  await page.goto(path);
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.waitForTimeout(800);

  let worst = { file: "(none)", size: 0 };
  for (const u of urls) {
    const body = await (await page.request.get(u)).text();
    for (const m of body.matchAll(/JSON\.parse\(/g)) {
      const quote = body[m.index! + 11];
      const end = body.indexOf(quote, m.index! + 12);
      const size = end - (m.index! + 12);
      if (size > worst.size) worst = { file: u.split("/").pop()!, size };
    }
  }
  return worst;
}

test("a section page downloads no bulk JSON payload", async ({ page }) => {
  const worst = await biggestEmbeddedJson(page, "/theBuzz/about/");

  expect(
    worst.size,
    `${worst.file} embeds a ${worst.size}-char JSON literal`,
  ).toBeLessThan(BIG_JSON);
});

test("the intro still gets the templates it draws the grid from", async ({
  page,
}) => {
  const worst = await biggestEmbeddedJson(page, "/");

  expect(worst.size).toBeGreaterThan(BIG_JSON);
});
