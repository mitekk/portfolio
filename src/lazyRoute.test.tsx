import { lazyRoute } from "./lazyRoute";

describe("lazyRoute", () => {
  test("a resolved preload is only loaded once", async () => {
    let attempts = 0;
    const Route = lazyRoute(async () => {
      attempts += 1;
      return () => <p>loaded</p>;
    });

    await Route.preload();
    await Route.preload();

    expect(attempts).toBe(1);
  });

  test("a failed preload is retried instead of cached forever", async () => {
    let attempts = 0;
    const Route = lazyRoute(async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("chunk 404");
      return () => <p>loaded</p>;
    });

    await expect(Route.preload()).rejects.toThrow("chunk 404");

    // Without clearing the memoised rejection, every later attempt — the next route
    // change, and `lazy()`'s own initialiser — replays this one failure, and a throw
    // out of `lazy()` with no error boundary unmounts the whole tree.
    await expect(Route.preload()).resolves.toBeTypeOf("function");
    expect(attempts).toBe(2);
  });
});
