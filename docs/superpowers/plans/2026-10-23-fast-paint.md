# Make the portfolio paint fast without touching the signature entry

## Context

The site is a Vite 6 + React 19 SPA (not Next.js) prerendered by `react-snap` and served
as static files by nginx. It already serves 100% static files, so the slowness is not the
hosting model — it is that the client code throws the prerendered HTML away and blocks
first paint on JS.

Three verified facts drive this plan:

1. **Nothing paints until React mounts.** `index.html` sets `data-loading="1"`;
   `src/index.css:6` hides `#root` until `src/layout/main.layout.tsx:52` removes the
   attribute on mount. There is also **no `background-color` on `html` or `body`
   anywhere** — the only page background is `.bg-surround` on `<main>`
   (`main.layout.tsx:66`), inside the hidden `#root`. So every visitor sees a **white
   viewport for ~1.8s**, and dark-mode visitors get a white flash.
2. **The prerendered decorative layer is wrong for almost everyone.** react-snap's
   default viewport is 480×850 (`node_modules/react-snap/index.js:43-45`, not overridden),
   so tiles are baked at 25px. A 1440×900 visitor computes 58px. `dist/index.html` is
   363KB raw, of which **325KB is 965 inline `style` attributes** on tiles that are the
   wrong size and get discarded.
3. **The grid can never hydrate.** `src/services/grid/tiling.ts:120` picks each chunk's
   template with `Math.random()`, and `lastIndexBySize` (`:110`) is module state never
   reset. Prerender and client produce different tilings.

Goal: the correct themed surface paints immediately, the entry animation starts as soon as
JS boots instead of after a blank wait, and the choreography keeps its character. The user
explicitly rejected baking a settled grid into the HTML (flash/replay unacceptable).

## Approach

**No `hydrateRoot`.** Keep `createRoot`. Fact 3 makes hydration impossible for the grid,
and the hero is animation-gated by design, so first client render can never equal the
react-snap capture. `createRoot` into a prerendered container is a supported, warning-free
path in React 19: the container is cleared with a single `textContent = ""` in the
before-mutation commit phase, synchronously in the same task as the insert, so there is no
blank frame.

**Strip the decorative grids from the prerendered HTML on every route.** This is the
keystone. It removes the only mis-sized, re-animating part of the output, which is what
makes removing the paint gate safe, and it keeps the real text, headings, nav, `<h1>` and
JSON-LD for crawlers. Verified placement: both `ld+json` blocks and the `<h1>` are **inside
`#root`**, not `<head>` — so emptying `#root` (an earlier idea) would have deleted all
structured data while `seo.spec.ts` stayed green, because it asserts post-mount.

## Steps

Each step is one commit, independently revertable, suite green after each.

### Step 0 — e2e coverage of the prerendered build
Today `playwright.config.ts:21` runs `npm run dev`, so **none of the 58 e2e cases ever
touch `dist/`**. Everything below would ship blind.

Add a **second project** rather than switching the webServer (switching would make 58
untouched tests re-resolve locators against baked DOM that then detaches, producing
"element is not attached" flakes against a target not yet made stable). `playwright.config.ts`
accepts an array of `webServer` entries: add `name: "prerendered"`,
`baseURL: http://localhost:4173`, `testMatch: "tests/prerender/*.spec.ts"`,
`webServer.command: "npm run build && npm run preview"`.

Seed with 3 cases: `/` HTML under a byte threshold; `document.body` computed
`background-color` matches the themed surface before any `#root` child exists;
`/does-not-exist` returns HTTP 404.

**Verify:** `npx playwright test` → 58 + 3 green.

### Step 1 — prerender post-process (the keystone)
- Add `data-grid="decorative"` **and** `aria-hidden="true"` to both grid containers:
  `src/components/grid/tetrominoes.grid.tsx:76-83` (the `gridRef` div) and
  `src/components/grid/waves.grid.tsx:38-45`. The attribute is an explicit source-level
  contract, so the script never guesses at generated class names.
- In `scripts/prerender.cjs`, after `run()` resolves, walk the emitted files
  (`dist/index.html`, `dist/404.html`, `dist/**/index.html` per `include`), parse with
  `jsdom` (already a devDependency, CJS, present in the Docker builder), and
  `querySelectorAll('[data-grid="decorative"]').forEach(el => el.remove())`, then
  `dom.serialize()`.
  Use `el.remove()`, **not** `textContent = ""` — the waves container carries
  `backgroundColor: var(--color-surface)` plus `animate-fadein`, so an emptied-but-present
  container would paint a mis-sized block and fade it in.
- Guards, failing the build on violation: total removals across all files ≥ 1 (per-route
  would be wrong — `/cv` and `/404.html` legitimately have zero); `dist/index.html` < 20,000
  bytes; every rewritten file still has a non-empty `<title>` and a `#root`.
- **Fix a real bug while here:** `scripts/prerender.cjs:43` is `.catch(console.error)`, so
  **prerender failure currently exits 0** and ships green through CI's `build` job. Make it
  `.catch(e => { console.error(e); process.exit(1); })`.

**Verify:** `npm run build`; `dist/index.html` ≤ 20KB (expect ~6KB, down from 363KB);
JSON-LD count still 2; `<h1>` count still 1; full suite green.

### Step 2 — remove the paint gate
Delete `dataset.loading = "1"` (`index.html`), `html[data-loading] #root { visibility: hidden }`
(`src/index.css:6`), and `delete document.documentElement.dataset.loading`
(`main.layout.tsx:52`) — **keeping the resize-listener registration in that same
`useLayoutEffect`**. Add `html, body { background: var(--color-surround) }`.

Keep the `data-theme` half of the inline script: it runs during `<head>` parse, before the
stylesheet applies, so the theme is correct at first style resolution. No test references
`data-loading` (grep-verified), so this is a clean ~4-line change.

**Verify:** the Step-0 background case; `/` and `/theBuzz/about` by eye in both themes;
full suite.

**Honest caveat:** a background-colour-only paint does **not** trigger Lighthouse FCP, so
FCP on `/` will barely move. What moves is *perceived* first paint (no white flash) — what
was asked for — plus real FCP on `/theBuzz/*`, where text now paints at ~0.4s instead of
~1.8s. Do not expect an FCP number on `/` from this step.

### Step 3 — re-pacing
Current `/` at 1440×900: `dropFinished` at ~1910ms, CTA interactive at ~3480ms. **Worse on
mobile** — the stagger is `(shapes.length - idx) * 0.01`, and 480×850 yields ~160 shapes
→ 1.6s of cascade vs 0.96s on desktop. The smallest devices get the slowest entry.

| # | file | from | to |
|---|---|---|---|
| 1 | `tetrominoes.grid.tsx:117` | `(shapes.length - idx) * 0.01` | `((shapes.length - idx) / shapes.length) * DROP_STAGGER_S`, `DROP_STAGGER_S = 0.45` |
| 2 | `tetrominoes.grid.tsx:117` | `0.75s cubic-bezier(0.25,0.1,0.25,1)` | `0.55s cubic-bezier(0.34,0.9,0.3,1)` |
| 3 | `tetrominoes.grid.tsx:28-31` | `setTimeout(…, 50)` | double `requestAnimationFrame` |
| 4 | `tetrominoes.grid.tsx:50` | `150` | `80` |
| 5 | `prompter.tsx:35` | `90` | `55` (named `CHAR_DELAY_MS`) |

Change 1 is the important one and it is a **character** fix, not just a speedup: it makes
the cascade a fixed 0.45s window so the gesture reads identically on every screen.
Change 2 is the one to eyeball before committing — the current curve is essentially `ease`
(slow in *and* out); a falling tile should land crisply, so 0.55s on a crisper curve feels
like *more* drop than 0.75s does now.

Put `DROP_STAGGER_S`, `DROP_DURATION_S`, `SETTLE_MS`, `CHAR_DELAY_MS` in `src/constants.ts`
beside `TILE_GAP` — not for configurability, but because Step 4 needs to zero them.

Result: `dropFinished` ~1100ms, CTA ~2075ms. **−40% to interactive, cascade and typewriter
intact.** Deliberately *not* overlapping the prompter with the drop: "tiles land, then the
hero" is the signature beat.

**Verify:** full suite; eyeball `/` at 1440×900 and 390×844; `intro-flow.spec.ts` wall time.

### Step 4 — reduced-motion and once-per-session skips
Decision lives in `IntroPage`, not `MainLayout` (`App.tsx:18-20` nests `BrowserRouter`
*inside* `MainLayout`, so it cannot know the route) and not the grid (it does not own the
hero gate).

New `src/hooks/useSkipIntro.ts` returning `{ skip, markPlayed }`: `skip` is true when
`prefers-reduced-motion: reduce` matches or a `sessionStorage` key is present (wrapped in
try/catch). **Do not write the flag inside the `useMemo` factory** — `StrictMode`
(`main.tsx:11`) double-invokes render, the second pass would see its own write. Write it
from an effect when `dropFinished` first flips true, which is also better behaviour: a
reload mid-drop still gets the entry.

Thread it: `useState(skip)` for `dropFinished` (`introPage.tsx:21`) so **the existing gate
stays the single gate** — no new gate, no churn in the 6 e2e cases that wait on
`.intro-overlay`. Pass `skipAnimation` to the grid (`useState(skipAnimation)` for
`animated` so tiles start at `translateY(0)` on the *first* render, not after an effect,
else they still jump) and `instant` to the `Prompter`. Use `skip ? 0 : dims.cols * dims.cols * 2`
for the exit delay at `:103`. Add the standard
`@media (prefers-reduced-motion: reduce)` block disabling `.animate-fadein`/`.animate-fadeout`.

Playwright gives each test a fresh context, so `sessionStorage` is empty and all 58
existing cases keep exercising the animated path. Add **one** new case with
`test.use({ reducedMotion: "reduce" })`.

**Verify:** full suite; the new reduced-motion case; reload `/` twice.

### Step 5 — grid runtime
- Move `shapes.sort()` (`tetrominoes.grid.tsx:84`) **inside** the `useMemo` — it currently
  mutates the memoized array during render.
- rAF-throttle the global `mousemove` (`:62-73`), which today calls `setMouseGrid` on every
  event and re-renders the whole grid.
- Extract a **memoized per-shape component** taking primitives (`shape`, `finalTop`,
  `finalLeft`, `translateY`, `delay`, `isHovered`, `tileSize`). `React.memo` on
  `TetrominoTile` alone would be ceremony — `:144-148` builds a fresh `style` object per
  tile per render, so a shallow compare always misses. With the per-shape boundary, only
  the ~20 shapes near the cursor re-render.
- Move the four-layer gradient to `.tetromino-grid .tile` + `.tile-I..L` setting a
  `--piece` custom property. **Scope it** — `.tile`, `.tiled-shape` and `.shape-group`
  currently have zero CSS rules but are shared by both grids, so a bare `.tile` rule would
  hit the waves too. Judge this on runtime (it kills ~400 template-literal gradient strings
  per render), not bytes: after Step 1 the tiles are no longer in the HTML.

**Verify:** full suite; Chrome performance profile of mousemove on `/` before and after —
this is the only step whose win needs a profile rather than a claim.

### Step 6 — deterministic wave opacity
Replace `Math.random()` at `waves.grid.tsx:66` with a cheap hash of `(x, y)`. Keep it
**local to this file** — `shuffle.test.ts:22-31` requires ≥2 distinct orderings in 50
shuffles and `tiling.test.ts:59-68` requires 5×5/4×6 to throw, so a global `Math.random`
stub would break both.

**Verify:** `npm run test:unit`; two consecutive builds produce byte-identical
`dist/theBuzz/about/index.html`.

### Step 7 — infra hygiene
- **`.dockerignore` (correctness, not size).** `Dockerfile:5-6` runs `npm ci` then
  `COPY . .`, so the host `node_modules` **overwrites the `npm ci` layer** — macOS-built
  binaries landing in `node:22-alpine`. It only works today because the deps are pure JS.
  Ignore `node_modules`, `dist`, `coverage`, `.git`, `test-results`, `playwright-report`,
  `.lighthouseci`, `.worktrees`, `*.log`, `.DS_Store`.
- **nginx `Cache-Control`.** `location = /index.html` never fires for real pages:
  `try_files $uri $uri/index.html /index.html` serves them as *file* matches inside
  `location /`, which sets no header at all. Confirmed by curl against the real config —
  `/theBuzz/toolbox` comes back with no `Cache-Control`. Move the header into `location /`,
  and use a single `add_header` per location instead of `expires` + `add_header` (which
  emits two conflicting `Cache-Control` headers).
- **Real 404s.** `/nope` currently returns 200 with the home page. Use
  `try_files $uri $uri/index.html =404` plus `error_page 404 /404.html`. **`dist/theBuzz/index.html`
  does not exist** (verified — `src/routes.tsx:38` handles `/theBuzz` client-side via
  `<Navigate to="about">`), so add `location = /theBuzz { return 301 /theBuzz/about; }`.
  Add a cross-reference comment in both `src/routes.tsx` and `scripts/prerender.cjs`: the
  strict `=404` means any route added to one and not the other 404s in production. That is
  the real maintenance cost of this change and it should be written down.

**Verify:** `docker build` then `curl -I` on `/`, `/assets/…`, `/theBuzz/about`, `/theBuzz`,
`/nope` — exactly one `Cache-Control` each, 301 on `/theBuzz`, 404 on `/nope`;
`routing-flow.spec.ts` green (`dist/404.html` contains the expected heading).

### Step 8 — `manualChunks`
`vite.config.ts:9` declares `react-vendor: ["react","react-dom","react-router-dom"]`, but
the object form matches the bare specifier `react-dom` → `react-dom/index.js`.
`main.tsx:2` imports `react-dom/client`, a different module, so it and `scheduler` stay in
the 183KB entry chunk (verified: `unstable_scheduleCallback` appears only there).
Switch to the function form matching `/node_modules\/(react|react-dom|scheduler)\//`.

**File this as hygiene, not perf** — total bytes are identical and both chunks are already
modulepreloaded. The win is cache granularity: today any app edit invalidates a chunk
containing React.

**Verify:** `npm run build`; `grep -l unstable_scheduleCallback dist/assets/*.js` returns
only the vendor chunk.

### Step 9 — `lhci` in CI (last)
`npm run lhci` exists but `.github/workflows/deploy.yml` never runs it. Add a sixth sibling
job (the five existing jobs have no `needs` chain except `test-report`) with
`PUPPETEER_EXECUTABLE_PATH: /usr/bin/google-chrome-stable`, as the `build` job already does.

**Last, deliberately.** `lighthouserc.json` already asserts `performance ≥ 0.6` for `/`,
which is marginal, and CI runners are noisier than a laptop — wiring it in first would
likely go red on arrival. Run it twice on a PR, then set thresholds from the *lower*
observed value.

## Explicitly not doing

- **`hydrateRoot`** — impossible here (Context fact 3). This reverses my initial review.
- **Removing the `gridSize &&` gate** in `main.layout.tsx:69`. It is a provable no-op:
  `calculateDims` floors at `{cols:4, rows:4}` for any viewport ≥1px (verified), so
  `gridSize` is never `undefined`. Mentioned, not touched.
- **Deferring or slimming the template JSON.** `16x16.json` is 143KB and the grid cannot
  draw until it parses, so dynamic-importing it would reintroduce the delay being removed.
  Vite already emits compact JS. Revisit only if the Step 5 profile says so.
- **Pre-existing dead code — mention, never delete** (CLAUDE.md §3):
  `src/assets/templates/32x32.json` (575KB, unimported), `src/services/shuffle.ts` (no
  production callers), `src/components/UI/dropdown.tsx` (unexported, unused),
  `TiledShape`'s `onTransitionEnd` (`shape.tsx:30-34` — listens for `propertyName === "top"`
  but the tetromino path animates `transform` on a wrapper, so it never fires; note React
  delegates `transitionend` at the root so this costs no per-node listener),
  `src/context/page.tsx` (empty context, no consumers).
- **Pre-existing bugs — mention, leave alone:** `useTheme.ts:17` writes `localStorage` on
  mount, freezing a first-time visitor's preference so later `prefers-color-scheme` changes
  are ignored forever. `prompter.tsx:35` slices mid-surrogate on `👋`, rendering a
  replacement glyph for one frame. `introPage.tsx:103` delays navigation by
  `dims.cols * dims.cols * 2`ms with no stated derivation. `prompter.css:29`
  `margin-bottom: "0.5rem"` is quoted and ignored; `:31` `var(--font-family)` is undefined.
  `navbar.css:1` has an unscoped global `ul { list-style: none }`.

## End-to-end verification

1. `npm run lint && npm run format:check`
2. `npm run test:unit` — 62 cases green
3. `npx playwright test` — 58 existing + 4 new (3 prerender, 1 reduced-motion)
4. `npm run build` — then assert on `dist/`: `index.html` ≤ 20KB, 2 JSON-LD blocks, 1 `<h1>`,
   zero `[data-grid="decorative"]` elements, and byte-identical output across two builds
5. `npm run lhci` locally before and after, same machine, 3 runs each — compare FCP/LCP/TBT
   per route. Expect the real gain on `/theBuzz/*`; see the Step 2 caveat about `/`
6. `docker build` + the `curl -I` matrix from Step 7
7. Eyeball `/` at 1440×900 and 390×844, light and dark, plus one reload to confirm the
   session skip, and one run with reduced-motion forced
