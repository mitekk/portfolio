# Performance Baseline

**Date:** 2026-03-27
**Tool:** Lighthouse CI (`@lhci/cli` v0.15.1)
**Runs per URL:** 3 (median reported)

## Scores

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 78 | 87 | 100 | 75 |
| `/theBuzz/about` | 100 | 100 | 100 | 83 |
| `/theBuzz/toolbox` | 100 | 100 | 100 | 83 |
| `/theBuzz/experience` | 100 | 100 | 100 | 83 |

## Key Issues (from HTML reports)

**`/` (Intro page) — Performance 78:**
- Single JS bundle is 636 kB (117 kB gzipped) — no code splitting
- Render-blocking resources (Google Analytics, fonts)
- Avatar image (373 kB PNG) served without compression/modern format

**`/` — Accessibility 87:**
- Profile image missing `alt` attribute

**All routes — SEO 75–83:**
- No `<meta name="description">` tag
- No valid `robots.txt`

## Next Steps

When moving to CI enforcement:
1. Update `lighthouserc.json` thresholds to real scores (or slightly below for variance):
   - Performance: `0.75` on `/`, `0.98` on `/theBuzz/*`
   - Accessibility: `0.85` on `/`, `0.98` on `/theBuzz/*`
   - Best Practices: `0.98` (all routes)
   - SEO: `0.73` on `/`, `0.81` on `/theBuzz/*`
2. Change `"warn"` → `"error"` for categories you want to gate on
3. Add Lighthouse CI steps to `.github/workflows/deploy.yml` (see spec)

## Quick Wins for Improvement

| Issue | Impact | Fix |
|---|---|---|
| No meta description | SEO +17 on all routes | Add `<meta name="description">` to `index.html` |
| No `robots.txt` | SEO | Add `public/robots.txt` |
| Image missing `alt` | Accessibility +13 on `/` | Add `alt` to avatar `<img>` |
| Huge JS bundle (636 kB) | Performance | Lazy-load game components with `React.lazy()` |
| Avatar PNG (373 kB) | Performance | Convert to WebP, add explicit dimensions |
| Google Analytics blocking | Performance | Already `async` — consider `partytown` for further isolation |
