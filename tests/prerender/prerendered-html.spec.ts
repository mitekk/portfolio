import { expect, test } from "@playwright/test";

/**
 * These cases assert on the raw bytes of the react-snap output in `dist/`, served by
 * `vite preview`. They deliberately use `request.get` rather than `page.goto`: once the
 * client bundle boots it replaces `#root` and react-helmet-async rewrites `<head>`, so
 * anything read off a rendered page says nothing about what a crawler or a first paint
 * actually receives.
 */
test.describe("prerendered home page", () => {
  test("ships crawlable markup: a title, a #root and both JSON-LD blocks", async ({
    request,
  }) => {
    const response = await request.get("/");
    expect(response.status()).toBe(200);

    const html = await response.text();

    const title = html.match(/<title>([^<]*)<\/title>/);
    expect(title?.[1]?.trim()).toBeTruthy();

    expect(html).toContain('id="root"');
    expect(html.match(/application\/ld\+json/g) ?? []).toHaveLength(2);
    expect(html.match(/<h1[\s>]/g) ?? []).toHaveLength(1);
  });

  test("is small, because the decorative grid is not baked into it", async ({
    request,
  }) => {
    const html = await (await request.get("/")).text();

    expect(html).not.toContain('data-grid="decorative"');
    expect(Buffer.byteLength(html, "utf8")).toBeLessThan(20_000);
  });
});

// Trailing slashes are load-bearing: `vite preview` answers `/theBuzz/about` with the SPA
// fallback (the home page) and only serves `dist/theBuzz/about/index.html` for
// `/theBuzz/about/`. nginx resolves either via `try_files $uri $uri/index.html`, so this
// is a quirk of the preview server, not of production — but without the slash these cases
// assert against the wrong file. Each one pins the title it expects for that reason.
const PRERENDERED_ROUTES = [
  { path: "/", title: /Senior Full-Stack Developer & Team Lead/ },
  { path: "/cv/", title: /CV|Resume|Mitya Kurs/ },
  { path: "/theBuzz/about/", title: /About Mitya Kurs/ },
  { path: "/theBuzz/experience/", title: /Experience/ },
  { path: "/theBuzz/toolbox/", title: /Toolbox/ },
  { path: "/404.html", title: /404/ },
];

for (const route of PRERENDERED_ROUTES) {
  test(`${route.path} ships its own page and no decorative grid`, async ({
    request,
  }) => {
    const response = await request.get(route.path);
    expect(response.status()).toBe(200);

    const html = await response.text();
    expect(html.match(/<title>([^<]*)<\/title>/)?.[1]).toMatch(route.title);
    expect(html).not.toContain('data-grid="decorative"');
  });
}
