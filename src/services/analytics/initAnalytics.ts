const GA_MEASUREMENT_ID = "G-48K8VBVJL7";
const GA_SCRIPT_ID = "mk-gtag-script";

let isInitialized = false;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function loadGtagScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(GA_SCRIPT_ID)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Analytics"));

    document.head.appendChild(script);
  });
}

async function startAnalytics(): Promise<void> {
  if (isInitialized) {
    return;
  }

  isInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };

  try {
    await loadGtagScript();
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(error);
    }
  }
}

export function initAnalytics(): void {
  if (!import.meta.env.PROD) {
    return;
  }

  const scheduleAnalytics = () => {
    const idleScheduler = window as Window & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
    };

    if (typeof idleScheduler.requestIdleCallback === "function") {
      idleScheduler.requestIdleCallback(
        () => {
          void startAnalytics();
        },
        { timeout: 2500 },
      );
      return;
    }

    window.setTimeout(() => {
      void startAnalytics();
    }, 1200);
  };

  if (document.readyState === "complete") {
    scheduleAnalytics();
    return;
  }

  window.addEventListener("load", scheduleAnalytics, { once: true });
}
