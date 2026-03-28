# Dark / Light Theme Design

**Date:** 2026-03-29
**Status:** Approved

---

## Context

The portfolio currently uses hardcoded hex color values scattered across `constants.ts`, inline styles, and Tailwind arbitrary values. Colors for Tetris pieces, grid backgrounds, and layout chrome are defined in multiple places with no shared abstraction. This makes theming impractical.

The goal is to introduce a Tailwind v4 CSS-variable token system as a single source of truth, then layer a dark mode on top of it — covering all layout surfaces, wave tiles, and Tetris piece colors. A floating toggle button lets users switch themes, defaulting to their system preference and persisting their choice.

---

## Decision: CSS Variables as Single Source of Truth

All colors are defined once in `src/index.css` using Tailwind v4's `@theme` block. Dark mode overrides those same variables under `[data-theme="dark"]`. Inline styles in React components reference `var(--color-piece-I)` etc. directly. No color definitions exist anywhere else.

This eliminates:
- The `COLORS`, `SOFT_COLORS`, `DARK_COLORS`, `SOFT_DARK_COLORS`, `RICH_COLORS`, `SOFT_RICH_COLORS` maps in `constants.ts`
- All hardcoded hex values in component files
- Any duplication between JS color constants and CSS

---

## Token Definitions

### `src/index.css` — `@theme` block (light theme / defaults)

```css
@theme {
  /* Layout */
  --color-surface:        #f3f1e9;   /* grid / page background */
  --color-surround:       #4c4b4c;   /* outer chrome */
  --color-nav:            #3f3f46;   /* navbar background (zinc-700) */
  --color-text:           #333332;   /* body text */
  --color-text-muted:     #bababa;   /* nav hover, secondary text */
  --color-text-nav:       #fafafa;   /* nav link text */
  --color-text-nav-accent:#FAEBD7;   /* nav social link labels */
  --color-link:           #646cff;   /* anchor / button accent */

  /* Panel / card surfaces */
  --color-panel-bg:       rgba(255, 255, 255, 0.55);
  --color-border:         #e4e4e7;   /* zinc-200 — card/avatar borders */

  /* Wave tiles */
  --color-wave:           #d9d3c0;

  /* Prompter */
  --color-prompt-text:    #111111;
  --color-cursor:         #6f2808;

  /* Tetris pieces — current COLORS values */
  --color-piece-I:        #b2ebf2;
  --color-piece-O:        #fff9b0;
  --color-piece-T:        #d1b3ff;
  --color-piece-S:        #b6f5c9;
  --color-piece-Z:        #ffc1c1;
  --color-piece-J:        #b3d1ff;
  --color-piece-L:        #ffe0b3;
}
```

### Dark mode overrides — `[data-theme="dark"]`

```css
[data-theme="dark"] {
  --color-surface:        #27272a;              /* zinc-800 */
  --color-surround:       #18181b;              /* zinc-900 */
  --color-nav:            #3f3f46;              /* zinc-700 — slightly lighter than surface to maintain navbar card visibility */
  --color-text:           rgba(255, 255, 255, 0.87);
  --color-text-muted:     rgba(255, 255, 255, 0.45);
  --color-text-nav:       rgba(255, 255, 255, 0.87);
  --color-text-nav-accent:rgba(255, 255, 255, 0.55);
  --color-link:           #818cf8;              /* lighter indigo readable on dark */

  --color-panel-bg:       rgba(255, 255, 255, 0.08);
  --color-border:         #52525b;   /* zinc-600 — visible border on dark surfaces */

  --color-wave:           #3f3f46;              /* zinc-700 */

  --color-prompt-text:    rgba(255, 255, 255, 0.87);
  --color-cursor:         #f97316;              /* orange-500 — visible on dark */

  /* DARK_COLORS values from existing constants.ts */
  --color-piece-I:        #2bb7c6;
  --color-piece-O:        #bba900;
  --color-piece-T:        #9256c9;
  --color-piece-S:        #2bb370;
  --color-piece-Z:        #de5858;
  --color-piece-J:        #568edb;
  --color-piece-L:        #e7a04e;
}
```

---

## FOUC Prevention

The `useTheme` hook initializes inside React, which runs after the browser's first paint. Without intervention, users with a stored `dark` preference would see a flash of the light theme on load.

**Fix:** Add a blocking inline `<script>` inside `<head>` in `index.html`, before any module scripts. It reads `localStorage` synchronously and sets `data-theme` on `<html>` before the page is painted.

```html
<!-- index.html — inside <head>, before other scripts -->
<script>
  (function () {
    var t = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = t;
  })();
</script>
```

This is CSR-only code. This project is a Vite SPA with no SSR, so `localStorage` and `window.matchMedia` are safe to call here.

---

## Theme Switching

### `src/hooks/useTheme.ts` (new file)

- Reads initial theme from `localStorage.getItem('theme')`, falling back to `window.matchMedia('(prefers-color-scheme: dark)')`.
- On every change: sets `document.documentElement.dataset.theme` and persists to `localStorage`.
- Exports `{ theme, toggle }`.
- No React context needed — called once at root, `toggle` passed down to the toggle button.

```ts
type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return { theme, toggle };
}
```

---

## Toggle Button

### `src/components/UI/ThemeToggle.tsx` (new file)

- Fixed position: bottom-right, `bottom: 24px`, `right: 24px`.
- 40×40px circle, `z-index: 100`.
- Background: `var(--color-nav)` — adapts automatically to theme.
- Icon: `🌙` in light mode, `💡` in dark mode.
- `aria-label="Toggle theme"` for accessibility.

Called once from `main.layout.tsx`, receives `{ theme, toggle }` from `useTheme`.

```tsx
<button
  onClick={toggle}
  aria-label="Toggle theme"
  style={{
    position: 'fixed', bottom: '24px', right: '24px',
    background: 'var(--color-nav)',
    color: 'var(--color-text-nav)',
    border: 'none', borderRadius: '50%',
    width: '40px', height: '40px',
    cursor: 'pointer', fontSize: '18px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    zIndex: 100,
  }}
>
  {theme === 'light' ? '🌙' : '💡'}
</button>
```

---

## Component Changes

### `index.html`
- Add FOUC-prevention inline script in `<head>` (see above).

### `src/index.css`
- Add `@theme` block with all tokens above.
- Add `[data-theme="dark"]` override block.
- Remove `background-color: #242424` and `color: rgba(255,255,255,0.87)` from `:root` — these are now token-driven.
- Replace `a { color: #646cff }` and `a:hover { color: #535bf2 }` with `color: var(--color-link)` / `filter: brightness(0.9)`.
- Replace `button:hover { border-color: #646cff }` with `border-color: var(--color-link)`.
- Update `@layer base` h1: replace `text-zinc-800` with `text-text` (Tailwind v4 generates `text-text` from `--color-text` in `@theme`).

### `src/constants.ts`
- Remove: `COLORS`, `SOFT_COLORS`, `DARK_COLORS`, `SOFT_DARK_COLORS`, `RICH_COLORS`, `SOFT_RICH_COLORS`.
- Retain: all non-color constants (grid dimensions, tile size, gap, timing, etc.).

### `src/layout/main.layout.tsx`
- Replace inline `#4c4b4c` with `var(--color-surround)`.
- Replace inline `#f3f1e9` with `var(--color-surface)`.
- Add `useTheme()` call; render `<ThemeToggle theme={theme} toggle={toggle} />`.

### `src/components/tile/tetromino.tile.tsx`
- Replace `COLORS[shape]` import and interpolation with `var(--color-piece-${shape})` in the gradient `background` string:
  ```ts
  // before
  background: `...linear-gradient(...), ${COLORS[shape]}`
  // after
  background: `...linear-gradient(...), var(--color-piece-${shape})`
  ```
- The existing bevel gradients (rgba white/black overlays) are already theme-neutral — no changes needed there.

### `src/components/grid/waves.grid.tsx`
- Replace inline `#f3f1e9` background with `var(--color-surface)`.
- Replace the radial gradient string — change `#d9d3c0` to `var(--color-wave)`:
  ```ts
  // before
  background: `radial-gradient(circle, transparent 10%, #d9d3c0 100%)`
  // after
  background: `radial-gradient(circle, transparent 10%, var(--color-wave) 100%)`
  ```

### `src/components/navbar/navbar.tsx`
- Replace `bg-zinc-700` with `bg-nav` (Tailwind v4 generates `bg-nav` from `--color-nav`).
- Replace `text-[#fafafa]` with `text-text-nav`.
- Replace `text-[#FAEBD7]` with `text-text-nav-accent`.
- Replace `hover:text-[#bababa]` with `hover:text-text-muted`.

### `src/components/navbar/navbar.css`
- Replace `color: #fafafa` with `color: var(--color-text-nav)`.
- Replace `color: #bababa` (hover) with `color: var(--color-text-muted)`.

### `src/pages/theBuzz/buzzPage.tsx`
- Replace `bg-zinc-700` with `bg-nav` on both header and footer elements.
- Replace `text-[#fafafa]` with `text-text-nav`.
- Replace `text-[#bababa]` (separator pipe span) with `text-text-muted`.

### `src/components/UI/contentPanel.tsx`
- Replace `backgroundColor: "rgba(255,255,255,0.55)"` with `backgroundColor: "var(--color-panel-bg)"`.
- Replace `color: "#333332"` with `color: "var(--color-text)"`.

### `src/components/prompter/prompter.css`
- Replace `color: #111111` in `.prompt-text` with `color: var(--color-prompt-text)`.
- Replace `color: #6f2808` in `.prompt-cursor` with `color: var(--color-cursor)`.

### `src/pages/theBuzz/toolbox.tsx`
Skill card elements use hardcoded Tailwind zinc and white utility classes that won't respond to the theme toggle:
- Replace `border-zinc-200` with `border-[--color-border]` (or `border-border` once `--color-border` is in `@theme`).
- Replace `bg-white/40` and `bg-white/50` with `bg-[--color-panel-bg]` (reuses the same translucent surface token as `ContentPanel`).
- Replace `text-zinc-700` with `text-text`.
- Replace `text-zinc-500` with `text-text-muted`.
- Replace `border-zinc-300` with `border-[--color-border]`.

### `src/components/UI/avatar.css`
- Replace `border: 2px solid lightgray` with `border: 2px solid var(--color-border)`.

### `src/components/UI/dropdown.tsx`
The dropdown popup uses hardcoded gray utilities that won't respond to the toggle:
- Replace `bg-gray-700` (popup background) with `bg-nav`.
- Replace `hover:bg-gray-600` and `bg-gray-600` (hover / selected state) with `hover:bg-surround` and `bg-surround`.
This keeps the dropdown consistently dark-on-dark in both themes, matching the navbar aesthetic.

### `src/pages/notFound/notfoundPage.tsx`
- Replace `text-gray-700` (description paragraph) with `text-text`. (`text-red-500` on the 404 heading is intentional branding — leave as-is.)

### `src/components/UI/button.tsx`
The `Button` component uses `bg-stone-900 text-white` — a deliberate dark CTA. Replace with token-based equivalents that maintain the same dark-button intent:
- Replace `bg-stone-900` with `bg-surround`.
- Replace `text-white` with `text-text-nav`.
In light mode this renders as the same charcoal (#4c4b4c); in dark mode it deepens to zinc-900 (#18181b), remaining clearly a button against the zinc-800 surface.

---

## File Inventory

| File | Action |
|------|--------|
| `index.html` | Add FOUC-prevention inline script in `<head>` |
| `src/index.css` | Add `@theme` + `[data-theme="dark"]` blocks; replace hardcoded `:root`, `a`, `button` colors; fix h1 class to `text-text` |
| `src/hooks/useTheme.ts` | **New** — theme state, localStorage, system preference |
| `src/components/UI/ThemeToggle.tsx` | **New** — floating toggle button |
| `src/constants.ts` | Remove all color map exports |
| `src/layout/main.layout.tsx` | Replace hardcoded hex; mount `useTheme` and `ThemeToggle` |
| `src/components/tile/tetromino.tile.tsx` | Replace `COLORS[shape]` with `var(--color-piece-${shape})` |
| `src/components/grid/waves.grid.tsx` | Replace hardcoded background and wave gradient colors |
| `src/components/navbar/navbar.tsx` | Replace `bg-zinc-700`, `text-[#fafafa]`, `text-[#FAEBD7]` with tokens |
| `src/components/navbar/navbar.css` | Replace `#fafafa` and `#bababa` with CSS vars |
| `src/pages/theBuzz/buzzPage.tsx` | Replace `bg-zinc-700` and `text-[#fafafa]` with tokens |
| `src/components/UI/contentPanel.tsx` | Replace hardcoded background and text color with CSS vars |
| `src/components/prompter/prompter.css` | Replace `#111111` and `#6f2808` with CSS vars |
| `src/pages/theBuzz/toolbox.tsx` | Replace `border-zinc-*`, `bg-white/*`, `text-zinc-*` with token-based utilities |
| `src/components/UI/avatar.css` | Replace `lightgray` border with `var(--color-border)` |
| `src/components/UI/button.tsx` | Replace `bg-stone-900` → `bg-surround`, `text-white` → `text-text-nav` |
| `src/components/UI/dropdown.tsx` | Replace `bg-gray-700`, `bg-gray-600` with `bg-nav` / `bg-surround` |
| `src/pages/notFound/notfoundPage.tsx` | Replace `text-gray-700` with `text-text` |

---

## Verification

1. **Light mode** — default load shows cream grid (`#f3f1e9`), charcoal surround, pastel Tetris pieces.
2. **Dark mode toggle** — clicking the button switches to zinc-900 surround, zinc-800 grid, saturated piece colors. Transition is instant (CSS cascade, no re-render).
3. **No FOUC** — refresh after toggling dark mode; dark mode is applied before first paint (inline script runs synchronously in `<head>`).
4. **System preference** — clear `localStorage`, set OS to dark mode, reload; defaults to dark.
5. **No duplicate color definitions** — `grep -r '#[0-9a-fA-F]\{3,6\}' src/` returns zero results outside the `@theme` / `[data-theme="dark"]` blocks in `index.css`.
6. **Tailwind utilities work** — `bg-surface`, `bg-surround`, `bg-nav`, `text-text`, `text-text-muted` are usable as utility classes in any component.
7. **All UI surfaces themed** — navbar, grid, tiles, waves, content panels, prompter, and links all respond to toggle.
