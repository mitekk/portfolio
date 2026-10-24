const { run } = require("react-snap");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const DIST = path.join(__dirname, "..", "dist");
const INDEX_MAX_BYTES = 20000;
// No route's prerendered HTML is anywhere near this once the grids are gone (the largest,
// /theBuzz/toolbox, is ~76KB of real content; with its waves grid baked in it is ~168KB). A baked grid puts a route into the hundreds
// of KB, so this catches one grid losing the `data-grid` contract while the other keeps it
// — which the total-removals guard below cannot see.
const ROUTE_MAX_BYTES = 120000;

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

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
  });
}

/**
 * react-snap bakes the decorative grids at its own 480x850 viewport, so they are the
 * wrong tile size for essentially every real visitor and are thrown away the moment
 * React mounts — while accounting for most of the prerendered bytes. Strip them, keeping
 * the text, headings, nav, `<h1>` and JSON-LD that crawlers and first paint need.
 *
 * `el.remove()`, not `textContent = ""`: the waves container paints
 * `--color-surface` and carries `animate-fadein`, so an emptied-but-present container
 * would still fade a mis-sized block in.
 */
function stripDecorativeGrids() {
  let removed = 0;

  for (const file of htmlFiles(DIST)) {
    const html = fs.readFileSync(file, "utf8");
    if (!html.includes('data-grid="decorative"')) continue;

    const dom = new JSDOM(html);
    const { document } = dom.window;
    const grids = document.querySelectorAll('[data-grid="decorative"]');
    grids.forEach((el) => el.remove());
    removed += grids.length;

    const title = document.querySelector("title");
    if (!title || !title.textContent.trim()) {
      throw new Error(`${file}: lost its <title> while stripping grids`);
    }
    if (!document.getElementById("root")) {
      throw new Error(`${file}: lost its #root while stripping grids`);
    }

    fs.writeFileSync(file, dom.serialize());
    console.log(`prerender: stripped ${grids.length} grid(s) from ${file}`);
  }

  // A total, not a per-file count: /404.html legitimately has none. Zero overall means
  // the `data-grid="decorative"` contract in the grid components has been broken, which
  // would otherwise fail silently and ship a 363KB index.html again.
  if (removed === 0) {
    throw new Error(
      'prerender: found no [data-grid="decorative"] elements to strip — has the ' +
        "attribute been removed from tetrominoes.grid.tsx / waves.grid.tsx?",
    );
  }

  const indexBytes = fs.statSync(path.join(DIST, "index.html")).size;
  if (indexBytes >= INDEX_MAX_BYTES) {
    throw new Error(
      `prerender: dist/index.html is ${indexBytes} bytes, expected under ${INDEX_MAX_BYTES}`,
    );
  }

  // Every emitted route, not just the home page: dropping the attribute from
  // waves.grid.tsx alone leaves index.html small and the total above non-zero, so this
  // is the only guard that sees it.
  for (const file of htmlFiles(DIST)) {
    const bytes = fs.statSync(file).size;
    if (bytes >= ROUTE_MAX_BYTES) {
      throw new Error(
        `prerender: ${file} is ${bytes} bytes, expected under ${ROUTE_MAX_BYTES} — ` +
          "a decorative grid is probably still baked into it",
      );
    }
  }
}

run({
  source: "dist",
  // Keep in step with the routes in src/routes.tsx — see the comment there. nginx serves
  // only what this list emits and 404s the rest.
  include: [
    "/",
    "/cv",
    "/theBuzz/about",
    "/theBuzz/experience",
    "/theBuzz/toolbox",
  ],
  waitFor: 2000,
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  ...(puppeteerExecutablePath ? { puppeteerExecutablePath } : {}),
})
  .then(stripDecorativeGrids)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
