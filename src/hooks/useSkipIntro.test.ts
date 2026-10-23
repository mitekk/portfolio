import { act, renderHook } from "@testing-library/react";
import { useSkipIntro } from "./useSkipIntro";

const matchMedia = (reduced: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
};

describe("useSkipIntro", () => {
  test("does not skip on a first visit without a reduced-motion preference", () => {
    matchMedia(false);

    expect(renderHook(() => useSkipIntro()).result.current.skip).toBe(false);
  });

  test("skips when the visitor asked for reduced motion", () => {
    matchMedia(true);

    expect(renderHook(() => useSkipIntro()).result.current.skip).toBe(true);
  });

  test("skips once the intro has been marked played in this session", () => {
    matchMedia(false);

    const first = renderHook(() => useSkipIntro());
    expect(first.result.current.skip).toBe(false);
    act(() => first.result.current.markPlayed());

    expect(renderHook(() => useSkipIntro()).result.current.skip).toBe(true);
  });

  test("plays the intro again when sessionStorage is unavailable", () => {
    matchMedia(false);
    const sessionStorage = window.sessionStorage;
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      get() {
        throw new Error("blocked");
      },
    });

    try {
      const { result } = renderHook(() => useSkipIntro());
      expect(result.current.skip).toBe(false);
      expect(() => result.current.markPlayed()).not.toThrow();
    } finally {
      Object.defineProperty(window, "sessionStorage", {
        configurable: true,
        value: sessionStorage,
      });
    }
  });
});
