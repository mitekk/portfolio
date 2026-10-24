import { useCallback, useMemo } from "react";

const SESSION_KEY = "intro-played";

function hasPlayedThisSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Whether the intro animation should be skipped: the visitor asked for reduced motion,
 * or they have already seen it in this session.
 *
 * `markPlayed` is deliberately not called while deciding — StrictMode double-invokes
 * render, so a write from the factory would be read back by its own second pass. The
 * caller writes it from an effect once the drop has actually finished, which also means
 * a reload part-way through the entry still gets the entry.
 */
export function useSkipIntro() {
  const skip = useMemo(
    () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      hasPlayedThisSession(),
    [],
  );

  const markPlayed = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Private mode or blocked storage: the entry simply plays again.
    }
  }, []);

  return { skip, markPlayed };
}
