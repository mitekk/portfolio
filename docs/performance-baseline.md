# Performance Baseline

**Date:** 2026-03-27
**Tool:** Lighthouse CI (`@lhci/cli` v0.15.1)
**Runs per URL:** 3 (median reported)

## Scores

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 90 | 100 | 100 | 100 |
| `/theBuzz/about` | 90 | 100 | 100 | 100 |
| `/theBuzz/toolbox` | 89 | 100 | 100 | 100 |
| `/theBuzz/experience` | 90 | 100 | 100 | 100 |

## Implemented Improvements

- Route-level lazy loading in `src/routes.tsx` to split page bundles
- Deferred Google Analytics boot to post-load idle (`src/services/analytics/initAnalytics.ts`)
- Avatar converted from PNG to WebP (`373 kB` -> `18.8 kB`)
- Poppins imports narrowed to Latin subsets only (`400/500/700`)
- Added `meta description`, `robots` meta, `public/robots.txt`, and `public/sitemap.xml`
- Added explicit `alt` text contract for avatar usage
- Tuned heavy intro/tile assets so no non-vendor app chunk exceeds `300 kB`

## Current CI Gates (`error`)

- `/`: Performance `>= 0.89`, Accessibility `>= 0.98`, Best Practices `>= 1`, SEO `>= 0.98`
- `/theBuzz/about` + `/theBuzz/experience`: Performance `>= 0.89`, Accessibility `>= 0.98`, Best Practices `>= 1`, SEO `>= 0.98`
- `/theBuzz/toolbox`: Performance `>= 0.87`, Accessibility `>= 0.98`, Best Practices `>= 1`, SEO `>= 0.98`
