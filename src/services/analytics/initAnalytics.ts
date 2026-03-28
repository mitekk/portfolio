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

  let didSchedule = false;
  let fallbackTimeoutId: number | undefined;

  const intentEvents: Array<keyof WindowEventMap> = [
    "pointerdown",
    "keydown",
    "touchstart",
    "scroll",
  ];

  const cleanupIntentListeners = () => {
    intentEvents.forEach((eventName) => {
      window.removeEventListener(eventName, onUserIntent);
    });
  };

  const start = () => {
    if (didSchedule) {
      return;
    }
    didSchedule = true;

    if (fallbackTimeoutId) {
      window.clearTimeout(fallbackTimeoutId);
      fallbackTimeoutId = undefined;
    }

    cleanupIntentListeners();
    void startAnalytics();
  };

  const onUserIntent = () => {
    start();
  };

  const attachIntentListeners = () => {
    intentEvents.forEach((eventName) => {
      window.addEventListener(eventName, onUserIntent, {
        passive: true,
        once: true,
      });
    });
  };

  const scheduleAfterLoad = () => {
    attachIntentListeners();
    fallbackTimeoutId = window.setTimeout(() => {
      start();
    }, 4500);
  };

  if (document.readyState === "complete") {
    scheduleAfterLoad();
    return;
  }

  window.addEventListener("load", scheduleAfterLoad, { once: true });
}
