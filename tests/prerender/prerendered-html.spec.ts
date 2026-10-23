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
});
