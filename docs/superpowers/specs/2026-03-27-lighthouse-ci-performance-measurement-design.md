# Lighthouse CI Performance Measurement

**Date:** 2026-03-27
**Status:** Approved

## Context

The portfolio site (React 19 + Vite + TypeScript) has no performance tooling. It includes computationally heavy interactive components (Game of Life, Tetris, wave animations) and no existing baseline metrics. The goal is to establish a measurement tool using Lighthouse CI to audit all routes, set a performance baseline, and later enforce score stability in the CI/CD pipeline.

## Approach

Use `@lhci/cli` (Lighthouse CI) — the official Google tool designed for exactly this workflow: local measurement first, CI enforcement later. One config file drives both phases with no rework needed.

## Prerequisites

- **Chrome or Chromium must be installed locally.** Lighthouse drives a real browser — it does not use a bundled Chromium. On most developer machines this is already present. If `npm run lhci` fails with a Chrome-related error, install Chrome from https://google.com/chrome or set `CHROME_PATH` to your Chromium binary.

## Implementation

### 1. Install dependency

```bash
npm install --save-dev @lhci/cli
```

### 2. Create `lighthouserc.json` (project root)

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run preview",
      "startServerReadyPattern": "http://localhost:4173",
      "url": [
        "http://localhost:4173/",
        "http://localhost:4173/theBuzz/about",
        "http://localhost:4173/theBuzz/toolbox",
        "http://localhost:4173/theBuzz/experience"
      ],
      "numberOfRuns": 3,
      "chromeFlags": "--no-sandbox"
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:accessibility": ["warn", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": "./.lighthouseci"
    }
  }
}
```

**Key decisions:**
- `startServerCommand: "npm run preview"` — uses Vite's preview server instead of LHCI's built-in static server. Required because React Router's history API means sub-routes like `/theBuzz/about` would 404 from a plain static file server. Note: `vite.config.ts` has no `base` set, so preview serves at `http://localhost:4173/` (not a subpath).
- `startServerReadyPattern: "http://localhost:4173"` — matches the URL Vite prints when ready. More stable than matching the word "Local" which is a display string.
- `numberOfRuns: 3` — averages 3 runs per URL to reduce measurement noise. Expect the full run to take 10–15 minutes (4 routes × 3 runs × ~30–90s each). Don't interrupt it.
- `chromeFlags: "--no-sandbox"` — required on Linux (CI runners). Safely ignored on macOS locally.
- `preset: "lighthouse:no-pwa"` — skips PWA checks (not applicable to this site). The explicit `categories:*` assertions below override the preset's defaults for those categories.
- All assertions use `warn` (not `error`) during measurement phase — reports are generated and scores shown, but nothing fails. Flip to `error` when moving to CI enforcement.

### 3. Add npm script (`package.json`)

```json
"lhci": "npm run build && lhci autorun"
```

Builds the site first, then LHCI starts `vite preview`, audits all 4 routes, asserts scores, and writes HTML reports.

### 4. Gitignore reports

Add to `.gitignore`:

```
.lighthouseci/
```

### 5. View reports

After running `npm run lhci`, open any `.html` file from `.lighthouseci/` in the browser to see the full Lighthouse report per route.

## Routes Audited

| Route | Page |
|---|---|
| `http://localhost:4173/` | Intro / landing |
| `http://localhost:4173/theBuzz/about` | About |
| `http://localhost:4173/theBuzz/toolbox` | Toolbox |
| `http://localhost:4173/theBuzz/experience` | Experience |

## Score Thresholds (Measurement Phase)

| Category | Target | Level |
|---|---|---|
| Performance | 80 | warn |
| Accessibility | 90 | warn |
| Best Practices | 90 | warn |
| SEO | 90 | warn |

## CI Migration (Future)

When ready to enforce in GitHub Actions:

1. Change `"warn"` → `"error"` in `lighthouserc.json` assertions for categories you want to gate on.
2. Inside the existing `build` job in `.github/workflows/deploy.yml`, add these steps **after** `npm run build` and **before** the artifact upload:

```yaml
- name: Install Chromium
  run: sudo apt-get install -y chromium-browser

- name: Run Lighthouse CI
  run: npm run lhci
  env:
    CHROME_PATH: /usr/bin/chromium-browser

- name: Upload Lighthouse reports
  uses: actions/upload-artifact@v4
  with:
    name: lighthouse-reports
    path: .lighthouseci/
```

**Notes:**
- `ubuntu-latest` runners require `--no-sandbox` for headless Chrome. This is already handled by `chromeFlags: "--no-sandbox"` in `lighthouserc.json` — no extra env var needed.
- `CHROME_PATH` tells LHCI where to find Chromium on the runner.
- Without `upload-artifact`, the `.lighthouseci/` folder is lost when the runner shuts down. The upload step makes reports downloadable from the GitHub Actions run summary.
- No changes to `lighthouserc.json` are needed — same config works locally and in CI.

## Recording the Baseline

After the first successful run, record actual scores in `docs/performance-baseline.md` (create it). This is the reference used to calibrate the assertion thresholds before moving to CI enforcement. The initial 80/90/90/90 targets are placeholders — adjust them to your real scores (or slightly below) once you have data.

## Verification

1. Run `npm run lhci`
2. Confirm the build completes and `vite preview` starts
3. Confirm Lighthouse runs for all 4 URLs (watch terminal output)
4. Open `.lighthouseci/*.html` in browser — confirm full Lighthouse report per route
5. Check that scores are reported (warnings expected if below threshold, not failures)
6. Record actual scores in `docs/performance-baseline.md`
