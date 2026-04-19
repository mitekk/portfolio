const { run } = require("react-snap");
const { execSync } = require("child_process");

function findChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];

  for (const path of candidates) {
    try {
      execSync(`test -x "${path}"`, { stdio: "ignore" });
      return path;
    } catch (_) {}
  }

  return undefined;
}

const puppeteerExecutablePath = findChrome();

run({
  source: "dist",
  include: ["/", "/theBuzz/about", "/theBuzz/experience", "/theBuzz/toolbox"],
  waitFor: 2000,
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  ...(puppeteerExecutablePath ? { puppeteerExecutablePath } : {}),
}).catch(console.error);
