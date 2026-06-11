# Mitya Kurs — Portfolio & CV

![Mitya Kurs, Senior Engineering Leader & Hands-On Builder](public/og-image.png)

My personal portfolio and CV site, live at **[profile.mitya.dev](https://profile.mitya.dev/)**.

It's a small, fast site that introduces who I am, walks through my experience and
toolbox, and lets you read or download my CV. Every route is prerendered to static
HTML, so it loads instantly and shares cleanly on LinkedIn and in search results.

## What's inside

- An animated landing page (grid backgrounds with a typing intro)
- About, Experience, and Toolbox sections
- A dedicated `/cv` page with an inline PDF preview, download, and a branded share card
- Built for performance, accessibility, and SEO. Checked in CI with Lighthouse.

## Tech stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- React Router 7
- react-helmet-async for per-route meta
- Prerendered to static HTML with react-snap
- Vitest (unit) and Playwright (end-to-end) for tests

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check, build, and prerender routes to static HTML |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run test:unit` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run test` | Run unit and e2e tests |
| `npm run lhci` | Build and run Lighthouse CI |

## Project structure

- `src/pages` — intro, theBuzz (about / experience / toolbox), cv, notFound
- `src/components` — UI, animated grid backgrounds, navbar, SEO head
- `src/seo` — single-source SEO config and structured data
- `scripts/prerender.cjs` — static HTML prerender step (runs after build)
- `nginx.conf`, `Dockerfile` — production serving

## Deployment

`npm run build` outputs static HTML to `dist/` (routes prerendered via react-snap).
The site is served by Nginx (`nginx.conf`) and packaged with Docker.

## License

Released under the MIT License. See [LICENSE](LICENSE).
