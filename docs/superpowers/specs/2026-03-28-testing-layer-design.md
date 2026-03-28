# Testing Layer Design

**Date:** 2026-03-28
**Project:** Curriculum Vitae / Portfolio (`profile.mitya.dev`)
**Status:** Approved

---

## Context

The project currently has 2 Playwright specs covering grid/layout rendering and Lighthouse CI for performance scores. There are no unit tests, no component tests, and no flow tests. The animated grid services, context providers, routing logic, and critical user flows are entirely untested.

The goal is to build a layered test suite that makes the application bulletproof — not just increasing coverage numbers, but verifying correctness of pure logic, component behavior, full user flows, cross-viewport layout, and critical edge cases. Tests should serve as a living specification and catch regressions before they reach production.

---

## Approach: Layered Testing Pyramid

Three distinct layers, each owning what it can verify most cheaply:

1. **Unit** (Vitest) — pure logic, no DOM
2. **Component/Integration** (Vitest + React Testing Library) — rendered components and context
3. **E2E** (Playwright) — full browser, real flows, cross-viewport

---

## New Dependencies

```
vitest                          — Vite-native test runner
@vitest/coverage-v8             — coverage reporting
@testing-library/react          — component rendering
@testing-library/user-event     — realistic user interaction simulation
@testing-library/jest-dom       — DOM assertion matchers
jsdom                           — lightweight DOM for Vitest
```

---

## Vitest Configuration

`vitest.config.ts` at project root:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
```

Note: The Tailwind CSS plugin (`@tailwindcss/vite`) from `vite.config.ts` is intentionally omitted here — CSS processing is irrelevant in jsdom tests. Vitest's jsdom environment ignores CSS imports from components by default; no additional CSS transform configuration is needed.

`src/test-setup.ts`:
```ts
import '@testing-library/jest-dom'
```

`tsconfig.app.json` — add to `compilerOptions`:
```json
"types": ["vitest/globals"]
```

---

## npm Scripts

```json
"test:unit":          "vitest run",
"test:unit:watch":    "vitest",
"test:unit:coverage": "vitest run --coverage",
"test:e2e":           "playwright test",
"test":               "vitest run && playwright test"
```

Note: `playwright.config.ts` already defines a `webServer` block that starts the dev server automatically for E2E runs. The combined `test` script runs Vitest first (no server needed), then Playwright which spins up its own server.

---

## File Structure

```
src/
  services/
    grid/
      gameOfLife.test.ts
      tiling.test.ts
      path.test.ts
      wave.test.ts
    shuffle.test.ts
  context/
    layout.test.tsx      ← placeholder; LayoutContext behavior covered via main.layout.test.tsx
    page.test.tsx        ← placeholder; PageContext behavior covered via introPage.test.tsx
  components/
    prompter/prompter.test.tsx
    navbar/navbar.test.tsx
    UI/button.test.tsx
    UI/avatar.test.tsx
  pages/
    intro/introPage.test.tsx
    theBuzz/buzzPage.test.tsx
    theBuzz/about.test.tsx
    theBuzz/experience.test.tsx
    theBuzz/toolbox.test.tsx
  routes.test.tsx
  layout/
    main.layout.test.tsx
  test-setup.ts

tests/                              ← Playwright E2E (existing + expanded)
  grid-coverage.spec.ts             (existing — keep in place)
  layout-clipping.spec.ts           (existing — keep in place)
  flows/
    intro-flow.spec.ts
    navigation-flow.spec.ts
    routing-flow.spec.ts
  layout/
    responsive-layout.spec.ts
  content/
    content-presence.spec.ts
    seo.spec.ts
  accessibility/
    keyboard-nav.spec.ts
```

---

## Layer 1: Unit Tests (Vitest — no DOM)

### `gameOfLife.test.ts`

Tests operate on full grid fixtures (not individual cells). The key function is `createNextGenerationGrid(grid)`.

**Note on IDs:** `generateGameOfLifeGrid` increments `id` once per row (in the outer loop), meaning every cell in the same row shares the same `id`. IDs are NOT unique per cell — they are unique per row.

- Dead cell with exactly 3 alive neighbors → becomes alive in next generation
- Alive cell with 2 neighbors → stays alive
- Alive cell with 3 neighbors → stays alive
- Alive cell with 1 neighbor → dies (underpopulation)
- Alive cell with 4 neighbors → dies (overpopulation)
- Corner cell with 3 alive neighbors doesn't throw and evolves correctly
- `generateGameOfLifeShapes(grid)` returns exactly `rows * cols` shapes, one per cell
- Each shape's `key` is either `"alive"` or `"dead"` (no other values)
- All shapes in the same row share the same `id` (per-row IDs, not per-cell)
- `generateGameOfLifeGrid(dims)` returns grid of correct dimensions with only "alive"/"dead" shapes

### `tiling.test.ts`

Tests operate on `generateTiledGrid(rows, cols)`. The function fills a `rows × cols` grid with Tetromino shapes using 16×16, 8×8, and 4×4 chunk templates.

- `generateTiledGrid(16, 16)` — all `rows * cols` cells are covered (no nulls)
- Each returned shape has a valid `key` (one of the ShapeKeyTetrominoes values)
- Each shape's points stay within grid bounds (`0 ≤ x < rows`, `0 ≤ y < cols`)
- Shape IDs are unique and start from 1 on each call (module resets `nextShapeId`)
- Calling `generateTiledGrid` twice resets shape IDs (no bleed between calls)
- Throws `"Unable to place chunk at..."` when a residual unfilled region is too small for any chunk (minimum 4×4). This occurs whenever either dimension is not a multiple of 4, because after filling complete 4×4 blocks a leftover strip too narrow for any chunk remains. Test with `generateTiledGrid(5, 5)` (5 mod 4 = 1 leaves a 1-wide strip) and `generateTiledGrid(4, 6)` (6 mod 4 = 2 leaves a 2-wide strip). Note: the throw is raised mid-execution when the residual cell cannot be placed, not immediately on the outer function call.

### `path.test.ts`

Two testable functions: `generatePath(dims)` and `generateShapes(dims, path)` and `getPathData(pathPoints, tileSize)`.

**`generatePath`:**
- Returned path starts at `{x:0, y:0}` (first element)
- Returned path ends at `{x: rows-1, y: cols-1}` (last element)
- Every consecutive pair of points in the path is adjacent (Manhattan distance = 1)
- All points stay within grid bounds
- No duplicate points in the path
- Non-deterministic — do NOT test for fixed output; test structural properties only

**`generateShapes`:**
- Returns exactly `rows * cols` shapes
- Cells on the path have `key: "path"`
- Non-path cells have key from the set: `mountain | tree | tree2 | rhino | house | empty`
- Shape IDs are sequential starting from 1

**`getPathData`:**
- Returns `""` for input with fewer than 2 points
- Returns a string starting with `"M "` for valid path points
- Exactly 2-point path: returns a string with one `"C "` cubic bezier segment; `p0` falls back to `points[0]` (the `?? points[i]` branch at index 0)
- Contains `"C "` cubic bezier segments for paths with 3+ points

### `wave.test.ts`

Tests on `generateWavesShapes({ rows, cols })`.

- Returns exactly `rows * cols` shapes
- All shapes have `key: "wave"`
- IDs are sequential starting from 1
- Each shape has exactly one point
- Points cover every `(x, y)` position in the grid (no gaps, no duplicates)

### `shuffle.test.ts`

- Output contains exactly the same elements as input (same count, same values)
- Empty array → empty array
- Single-element array → same single-element array
- Statistical check: shuffle a 10-element array 50 times; at least 2 distinct orderings must appear (guards against identity return)

### `main.layout.test.tsx` — tile size calculation (pure logic extracted for unit testing)

The `handleResize` function inside `MainLayout` contains pure arithmetic. Test the tile-size formula directly by invoking `handleResize` logic or by extracting it:

- At `width = 320`: tileSize = `MOBILE_MIN_TILE` (20)
- At `width = 760` (interpolation region): tileSize is between 20 and 50
- At `width = 1200`: tileSize = exactly 50 (interpolation reaches MIN_TILE)
- At `width = 1201`: tileSize > 50 (scale-up region begins)
- At `width = 1800`: tileSize = `MAX_TILE` (70)
- At `width > 1800`: tileSize = `MAX_TILE` (capped)
- Computed `cols` and `rows` are always multiples of 4

---

## Layer 2: Component & Integration Tests (Vitest + RTL)

All component tests use `MemoryRouter` when navigation is involved.

### `prompter.test.tsx`
- Starts with empty/partial text; characters appear progressively using fake timers (`vi.useFakeTimers`)
- `onComplete` callback fires after the last character renders
- Full text is present in the DOM after all timers are fast-forwarded

### `navbar.test.tsx`
- Renders all 3 section links: About, Experience, Toolbox
- Active link receives the active indicator class / `➜` marker
- Render `Navbar` with `MemoryRouter` with initial entry `/theBuzz/about` so that `pathname.split("/")[2]` correctly resolves to `"about"` for active link detection
- ArrowDown keypress navigates to next section: assert the resulting URL path changes to the next section
- ArrowUp keypress navigates to previous section; wraps from About back to Toolbox
- Social links (email, LinkedIn, GitHub, CV) are present with correct `href` values
- Avatar click navigates to `/`

### `button.test.tsx`
- Renders with the correct label text
- `onClick` handler fires on click
- (No `disabled` prop exists on this component — do not test disabled behavior)

### `avatar.test.tsx`
- Renders `<img>` with correct `src`
- `loading="lazy"` attribute is present
- `alt` attribute present for accessibility

### `introPage.test.tsx`
- Game mode toggle renders "Tetris" and "Trip" buttons
- Clicking "Trip" updates `PageContext` value to "Trip" (verify by reading context in a wrapper consumer or checking downstream DOM effect)
- Clicking "Tetris" updates `PageContext` value to "Tetris"
- CTA button is present after prompter completes (fast-forward fake timers with `vi.runAllTimers()`)
- CTA click requires `vi.runAllTimers()` after the click before asserting navigation — the `navigate('/theBuzz')` call is wrapped in a `setTimeout` whose delay is mode- and cols-dependent
- CTA click navigates to `/theBuzz` (the index route `<Navigate to="about">` handles the final redirect to `/theBuzz/about`)
- Game mode toggle is rendered by the `Header` component inside IntroPage's render tree; click the "Trip" / "Tetris" buttons within `Header` to trigger the toggle

### `buzzPage.test.tsx`
- **Setup:** Stub `WavesGrid` so that `onAnimationFinish` is called synchronously. Mock the barrel module (matching what `buzzPage.tsx` imports): `vi.mock('../../components/grid', () => ({ WavesGrid: ({ onAnimationFinish }: { onAnimationFinish?: () => void }) => { onAnimationFinish?.(); return null; } }))`. Without this, `gridLoaded` stays `false` and no layout-responsive content renders in jsdom.
- `<Outlet>` content renders for nested routes
- At viewport ≥ 768px (desktop): sidebar `nav` is visible, mobile header/footer hidden
- At viewport < 768px (mobile): mobile header visible, sidebar hidden
- Use `window.innerWidth` mock to test each breakpoint

### `toolbox.test.tsx`
- All 7 category headings render
- Each category section contains at least one icon tile
- No duplicate category headings in the DOM

### `experience.test.tsx`
- 7 job entries render
- Each entry has a company name, a date range, and a tech stack section
- Entries are in reverse-chronological order (most recent at top)

### `about.test.tsx`
- 4 content paragraphs are present in the DOM
- None are empty strings

### `routes.test.tsx`
- `/` renders IntroPage
- `/theBuzz` redirects to `/theBuzz/about`
- `/theBuzz/about` renders About content
- Unknown path renders NotFoundPage
- If `sessionStorage.redirect` is set to `/theBuzz/experience` before mount, navigates to `/theBuzz/experience` and clears the sessionStorage key

### `main.layout.test.tsx` — rendering gate (component integration)
- When `gridSize` is not yet computed (initial render), children are not visible
- Once `handleResize` fires and `gridSize` is set, children appear
- `LayoutContext` value (`dims`, `tileSize`, `gridSize`) is accessible to children

---

## Layer 3: E2E Tests (Playwright)

### Viewports

| Label | Dimensions | Notes |
|---|---|---|
| Desktop large | 1440×900 | Primary desktop |
| Desktop small | 1280×720 | Above nav breakpoint |
| Tablet | 900×700 | Below nav breakpoint (768px), no auto-redirect |
| Mobile | 375×812 | Small screen, no auto-redirect |

**Important:** The site does NOT auto-redirect small viewports to any alternate route. All viewport sizes render the full site with smaller tiles.

Flow and content specs run on Desktop large + Desktop small.
Responsive and accessibility specs also run on Tablet + Mobile.

---

### `intro-flow.spec.ts` (Desktop large + Desktop small)
- Prompter text fully appears before CTA button is shown
- CTA click triggers grid exit animation, then navigates to `/theBuzz/about`
- Game mode toggle switches from "Tetris" to "Trip" — grid re-renders with road tiles
- Intro overlay is removed from DOM after navigation completes
- Avatar is visible and correctly sized

### `navigation-flow.spec.ts` (Desktop large + Desktop small)
- Clicking each nav link (About / Experience / Toolbox) renders correct section content
- ArrowDown cycles About → Experience → Toolbox, then wraps back to About
- ArrowUp cycles in reverse
- Avatar click from `/theBuzz/about` navigates back to `/`
- Active nav indicator updates on each section change
- Browser back/forward buttons work correctly between sections

### `routing-flow.spec.ts` (Desktop large)
- CV download link returns HTTP 200 (`/Mitya_Kurs.pdf`)
- Navigating to an unknown path (`/does-not-exist`) renders the 404 page
- sessionStorage redirect: set `sessionStorage.redirect = '/theBuzz/experience'`, navigate to `/`, assert redirect to `/theBuzz/experience` and sessionStorage key is removed

### `responsive-layout.spec.ts` (all 4 viewports)
- Use `waitForSelector('[data-testid="sidebar"]')` or equivalent before asserting visibility — the sidebar and mobile header are gated on the `WavesGrid` animation completing (`gridLoaded`); Playwright runs real animations so the element will eventually appear, but an explicit wait avoids flakiness
- At 1440px: sidebar nav is visible, mobile header/footer hidden; social link labels visible
- At 1280px: same as above
- At 900px (below 768px nav breakpoint): mobile header visible, sidebar hidden; footer shows icon-only social links
- At 375px: same mobile nav behavior

### `content-presence.spec.ts` (Desktop large + Desktop small)
- `/theBuzz/about` — 4 paragraphs present, none empty
- `/theBuzz/experience` — 7 job entries with company names and date ranges visible
- `/theBuzz/toolbox` — all 7 category headings visible; no broken images (check `img.naturalWidth > 0`)

### `seo.spec.ts` (Desktop large)
- Use `waitForSelector('title')` or `page.waitForFunction` to ensure react-helmet has injected tags before asserting (react-helmet injects asynchronously; children don't render until `gridSize` is computed)
- Each page (`/`, `/theBuzz/about`, `/theBuzz/experience`, `/theBuzz/toolbox`) has a non-empty `<title>`
- Each page has a `description` meta tag with content
- JSON-LD structured data present on home page (`script[type="application/ld+json"]`)
- Canonical URL meta present on each page
- OG tags present on each page

### `keyboard-nav.spec.ts` (Desktop large + Desktop small)
- From `/theBuzz/about`, pressing ArrowDown navigates to Experience, then Toolbox
- Pressing ArrowUp from Toolbox navigates to Experience, then About
- Tab key cycles through interactive elements without trapping focus
- Enter key on a focused nav link navigates to that section

---

## Verification

1. `npm run test:unit` — all unit and component tests pass
2. `npm run test:unit:coverage` — coverage report generated in `/coverage`
3. `npm run dev` (one terminal) + `npm run test:e2e` (another) — all Playwright specs pass across all configured viewports
4. `npm run test` — full suite green (Vitest then Playwright with its own webServer)
5. CI: add `npm run test:unit` step in `.github/workflows/deploy.yml` before the existing `lhci` step
