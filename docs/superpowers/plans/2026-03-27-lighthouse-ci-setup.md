# Lighthouse CI Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install and configure Lighthouse CI to audit all 4 site routes locally, producing HTML reports and a performance baseline.

**Architecture:** Install `@lhci/cli` as a devDependency. One `lighthouserc.json` config file at the project root drives LHCI — it starts `vite preview`, audits all routes, and writes HTML reports to `.lighthouseci/`. A single `npm run lhci` script orchestrates build → audit → report. The same config will be used for CI enforcement later with no changes.

**Tech Stack:** `@lhci/cli`, Vite preview server, React Router (history API), GitHub Actions (future CI step documented in spec)

---

### Task 1: Install `@lhci/cli`

**Files:**
- Modify: `package.json` (devDependencies — npm will update this automatically)

- [ ] **Step 1: Install the package**

```bash
npm install --save-dev @lhci/cli
```

- [ ] **Step 2: Verify it installed**

```bash
npx lhci --version
```

Expected: prints a version string like `0.14.x` (no error)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @lhci/cli for performance auditing"
```

---

### Task 2: Create `lighthouserc.json`

**Files:**
- Create: `lighthouserc.json` (project root, next to `vite.config.ts`)

- [ ] **Step 1: Create the config file**

Create `/Users/mitya/Documents/poc/Curriculum-Vitae/lighthouserc.json` with this exact content:

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

**Why each setting:**
- `startServerCommand: "npm run preview"` — uses Vite's preview server, which handles React Router's history API correctly. A plain static file server would 404 on sub-routes like `/theBuzz/about`.
- `startServerReadyPattern: "http://localhost:4173"` — matches the URL line Vite prints on startup. Stable across Vite versions.
- `numberOfRuns: 3` — averages 3 runs per URL to smooth out noise. Full audit takes 10–15 minutes.
- `chromeFlags: "--no-sandbox"` — required on Linux CI runners, safely ignored on macOS.
- `preset: "lighthouse:no-pwa"` — skips PWA checks (irrelevant for this site). The explicit `categories:*` entries override the preset's defaults for those 4 categories.
- All thresholds use `"warn"` not `"error"` — nothing fails during measurement phase; reports are always generated.

- [ ] **Step 2: Commit**

```bash
git add lighthouserc.json
git commit -m "chore: add lighthouserc.json for Lighthouse CI configuration"
```

---

### Task 3: Add `lhci` npm script and gitignore reports

**Files:**
- Modify: `package.json` (scripts section)
- Modify: `.gitignore`

- [ ] **Step 1: Add the script to `package.json`**

In the `"scripts"` block of `package.json`, add after the existing `"preview"` entry:

```json
"lhci": "npm run build && lhci autorun"
```

The full scripts block should look like:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "lhci": "npm run build && lhci autorun"
}
```

- [ ] **Step 2: Add `.lighthouseci/` to `.gitignore`**

Append to `.gitignore`:

```
# Lighthouse CI reports (generated locally)
.lighthouseci/
```

- [ ] **Step 3: Commit**

```bash
git add package.json .gitignore
git commit -m "chore: add lhci npm script and gitignore lighthouse reports"
```

---

### Task 4: Run and verify

- [ ] **Step 1: Ensure Chrome is installed**

Open Chrome or run:

```bash
google-chrome --version
# or on macOS:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --version
```

Expected: prints a version string. If Chrome is missing, download it from google.com/chrome before continuing.

- [ ] **Step 2: Run the audit**

```bash
npm run lhci
```

Watch the terminal. You should see:
1. TypeScript compile + Vite build output
2. `Starting server...` then `Server is ready`
3. Lines like `Running Lighthouse 1/3 on http://localhost:4173/` for each URL
4. A summary table of scores per category per URL
5. `Done!` at the end

This takes 10–15 minutes. Do not interrupt it.

- [ ] **Step 3: Verify reports were generated**

```bash
ls .lighthouseci/
```

Expected: a mix of `.json` and `.html` files (one set per URL per run, plus a manifest)

- [ ] **Step 4: Open a report**

Open any `.html` file from `.lighthouseci/` in your browser. You should see the full Lighthouse report UI with scores, diagnostics, and opportunities for one of the 4 routes.

---

### Task 5: Record baseline scores

**Files:**
- Create: `docs/performance-baseline.md`

- [ ] **Step 1: Note the scores from the terminal output**

The LHCI terminal summary shows median scores per URL across the 3 runs. Note these down.

- [ ] **Step 2: Create the baseline document**

Create `docs/performance-baseline.md` with the actual scores you observed. Template:

```markdown
# Performance Baseline

**Date:** 2026-03-27
**Tool:** Lighthouse CI (`@lhci/cli`)
**Runs per URL:** 3 (median reported)

## Scores

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | ?? | ?? | ?? | ?? |
| `/theBuzz/about` | ?? | ?? | ?? | ?? |
| `/theBuzz/toolbox` | ?? | ?? | ?? | ?? |
| `/theBuzz/experience` | ?? | ?? | ?? | ?? |

## Notes

- Scores are 0–100 (Lighthouse scale)
- Replace `??` with actual median scores from the run
- Use these numbers to calibrate `lighthouserc.json` thresholds before CI enforcement
- When moving to CI enforcement: set `minScore` to ~5 points below your baseline per category
```

Fill in the `??` values with your actual results.

- [ ] **Step 3: Commit**

```bash
git add docs/performance-baseline.md
git commit -m "docs: record initial Lighthouse performance baseline"
```

---

## Future: CI Enforcement

When ready to enforce scores in GitHub Actions (separate task, not part of this plan):

1. In `lighthouserc.json`, change `"warn"` → `"error"` for the categories you want to gate on. Adjust `minScore` values to match your baseline (slightly below to allow natural variance).
2. In `.github/workflows/deploy.yml`, inside the `build` job after `npm run build` and before `Upload artifact`, add:

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

No changes to `lighthouserc.json` are needed — `chromeFlags: "--no-sandbox"` already handles the Linux runner requirement.
