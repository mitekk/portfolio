# Dark / Light Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded colors with Tailwind v4 CSS variable tokens and add dark/light theme toggle that defaults to system preference and persists to localStorage.

**Architecture:** All colors live once in `src/index.css` via a Tailwind v4 `@theme` block (light) and a `[data-theme="dark"]` override block. A tiny `useTheme` hook sets `document.documentElement.dataset.theme` and writes to localStorage. A floating button calls `toggle`. Zero color definitions anywhere else in the codebase.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS v4 (`@tailwindcss/vite`), Vitest + Testing Library, Vite SPA (CSR only)

**Spec:** `docs/superpowers/specs/2026-03-29-tailwind-dark-light-theme-design.md`

---

## Task 1: CSS Token Foundation + FOUC Prevention

Establish the single source of truth before touching any component. All other tasks depend on these tokens existing.

**Files:**
- Modify: `src/index.css`
- Modify: `index.html`

- [ ] **Step 1: Add `@theme` block to `src/index.css`**

  Insert after `@import "tailwindcss";`, before `:root`:

  ```css
  @theme {
    /* Layout */
    --color-surface:         #f3f1e9;
    --color-surround:        #4c4b4c;
    --color-nav:             #3f3f46;
    --color-text:            #333332;
    --color-text-muted:      #bababa;
    --color-text-nav:        #fafafa;
    --color-text-nav-accent: #FAEBD7;
    --color-link:            #646cff;

    /* Panel / card surfaces */
    --color-panel-bg:        rgba(255, 255, 255, 0.55);
    --color-border:          #e4e4e7;

    /* Wave tiles */
    --color-wave:            #d9d3c0;

    /* Prompter */
    --color-prompt-text:     #111111;
    --color-cursor:          #6f2808;

    /* Tetris pieces */
    --color-piece-I:         #b2ebf2;
    --color-piece-O:         #fff9b0;
    --color-piece-T:         #d1b3ff;
    --color-piece-S:         #b6f5c9;
    --color-piece-Z:         #ffc1c1;
    --color-piece-J:         #b3d1ff;
    --color-piece-L:         #ffe0b3;
  }
  ```

- [ ] **Step 2: Add `[data-theme="dark"]` override block to `src/index.css`**

  Insert immediately after the `@theme` block:

  ```css
  [data-theme="dark"] {
    --color-surface:         #27272a;
    --color-surround:        #18181b;
    --color-nav:             #3f3f46;
    --color-text:            rgba(255, 255, 255, 0.87);
    --color-text-muted:      rgba(255, 255, 255, 0.45);
    --color-text-nav:        rgba(255, 255, 255, 0.87);
    --color-text-nav-accent: rgba(255, 255, 255, 0.55);
    --color-link:            #818cf8;
    --color-panel-bg:        rgba(255, 255, 255, 0.08);
    --color-border:          #52525b;
    --color-wave:            #3f3f46;
    --color-prompt-text:     rgba(255, 255, 255, 0.87);
    --color-cursor:          #f97316;
    --color-piece-I:         #2bb7c6;
    --color-piece-O:         #bba900;
    --color-piece-T:         #9256c9;
    --color-piece-S:         #2bb370;
    --color-piece-Z:         #de5858;
    --color-piece-J:         #568edb;
    --color-piece-L:         #e7a04e;
  }
  ```

- [ ] **Step 3: Update `:root`, `a`, and `button` rules in `src/index.css`**

  In `:root`: remove `color: rgba(255, 255, 255, 0.87)` and `background-color: #242424` (these are now handled by tokens applied via layout components and `[data-theme]`).

  Replace `a` colors:
  ```css
  a {
    font-weight: 500;
    color: var(--color-link);
    text-decoration: inherit;
  }
  a:hover {
    filter: brightness(0.9);
  }
  ```

  Replace `button:hover` border:
  ```css
  button:hover {
    border-color: var(--color-link);
  }
  ```

  In `@layer base` h1: replace `text-zinc-800` with `text-text`:
  ```css
  @layer base {
    h1 {
      @apply text-xl md:text-2xl font-semibold text-text;
    }
  }
  ```

- [ ] **Step 4: Add FOUC prevention script to `index.html`**

  In `index.html`, add inside `<head>` before the closing `</head>` tag (but before the `<script type="module">` bundle entry):

  ```html
  <script>
    (function () {
      var t = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.theme = t;
    })();
  </script>
  ```

- [ ] **Step 5: Verify build compiles**

  ```bash
  npm run build
  ```
  Expected: No TypeScript errors. CSS compiles cleanly.

- [ ] **Step 6: Commit**

  ```bash
  git add src/index.css index.html
  git commit -m "feat: add Tailwind v4 @theme tokens and dark mode overrides"
  ```

---

## Task 2: `useTheme` Hook

The only logic in this feature. Test it thoroughly before wiring it up.

**Files:**
- Create: `src/hooks/useTheme.ts`
- Create: `src/hooks/useTheme.test.ts`

- [ ] **Step 1: Write the failing tests**

  Create `src/hooks/useTheme.test.ts`:

  ```ts
  import { renderHook, act } from '@testing-library/react';
  import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
  import { useTheme } from './useTheme';

  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
    });
  };

  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false); // default: system is light
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  describe('useTheme', () => {
    test('defaults to light when no stored preference and system is light', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });

    test('defaults to dark when system prefers dark and no stored preference', () => {
      mockMatchMedia(true);
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('dark');
    });

    test('respects stored localStorage preference over system preference', () => {
      mockMatchMedia(true); // system dark
      localStorage.setItem('theme', 'light');
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });

    test('sets data-theme attribute on documentElement', () => {
      const { result } = renderHook(() => useTheme());
      expect(document.documentElement.dataset.theme).toBe(result.current.theme);
    });

    test('toggle switches from light to dark', () => {
      const { result } = renderHook(() => useTheme());
      act(() => { result.current.toggle(); });
      expect(result.current.theme).toBe('dark');
    });

    test('toggle switches from dark to light', () => {
      localStorage.setItem('theme', 'dark');
      const { result } = renderHook(() => useTheme());
      act(() => { result.current.toggle(); });
      expect(result.current.theme).toBe('light');
    });

    test('persists theme to localStorage on toggle', () => {
      const { result } = renderHook(() => useTheme());
      act(() => { result.current.toggle(); });
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    test('updates data-theme attribute on toggle', () => {
      const { result } = renderHook(() => useTheme());
      act(() => { result.current.toggle(); });
      expect(document.documentElement.dataset.theme).toBe('dark');
    });
  });
  ```

- [ ] **Step 2: Run tests — verify they fail**

  ```bash
  npm run test:unit -- --reporter=verbose src/hooks/useTheme.test.ts
  ```
  Expected: FAIL — `useTheme` not found.

- [ ] **Step 3: Implement `useTheme`**

  Create `src/hooks/useTheme.ts`:

  ```ts
  import { useEffect, useState } from 'react';

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

- [ ] **Step 4: Run tests — verify they pass**

  ```bash
  npm run test:unit -- --reporter=verbose src/hooks/useTheme.test.ts
  ```
  Expected: 8 tests pass.

- [ ] **Step 5: Commit**

  ```bash
  git add src/hooks/useTheme.ts src/hooks/useTheme.test.ts
  git commit -m "feat: add useTheme hook with localStorage and system preference support"
  ```

---

## Task 3: ThemeToggle Component

**Files:**
- Create: `src/components/UI/ThemeToggle.tsx`
- Create: `src/components/UI/ThemeToggle.test.tsx`

- [ ] **Step 1: Write the failing tests**

  Create `src/components/UI/ThemeToggle.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import { ThemeToggle } from './ThemeToggle';

  describe('ThemeToggle', () => {
    test('shows moon icon in light mode', () => {
      render(<ThemeToggle theme="light" toggle={() => {}} />);
      expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveTextContent('🌙');
    });

    test('shows lamp icon in dark mode', () => {
      render(<ThemeToggle theme="dark" toggle={() => {}} />);
      expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveTextContent('💡');
    });

    test('calls toggle on click', async () => {
      const user = userEvent.setup();
      const toggle = vi.fn();
      render(<ThemeToggle theme="light" toggle={toggle} />);
      await user.click(screen.getByRole('button', { name: 'Toggle theme' }));
      expect(toggle).toHaveBeenCalledTimes(1);
    });
  });
  ```

- [ ] **Step 2: Run tests — verify they fail**

  ```bash
  npm run test:unit -- --reporter=verbose src/components/UI/ThemeToggle.test.tsx
  ```
  Expected: FAIL — `ThemeToggle` not found.

- [ ] **Step 3: Implement `ThemeToggle`**

  Create `src/components/UI/ThemeToggle.tsx`:

  ```tsx
  interface ThemeToggleProps {
    theme: 'light' | 'dark';
    toggle: () => void;
  }

  export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggle }) => (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: 'var(--color-nav)',
        color: 'var(--color-text-nav)',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        fontSize: '18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {theme === 'light' ? '🌙' : '💡'}
    </button>
  );
  ```

- [ ] **Step 4: Run tests — verify they pass**

  ```bash
  npm run test:unit -- --reporter=verbose src/components/UI/ThemeToggle.test.tsx
  ```
  Expected: 3 tests pass.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/UI/ThemeToggle.tsx src/components/UI/ThemeToggle.test.tsx
  git commit -m "feat: add ThemeToggle floating button component"
  ```

---

## Task 4: Wire `useTheme` into Layout

Mount the hook and toggle button once at the root. After this task the toggle button is visible and functional in the browser.

**Files:**
- Modify: `src/layout/main.layout.tsx`

Current state of `main.layout.tsx` line 53:
```tsx
className="h-screen flex flex-col justify-center items-center bg-[#4c4b4c]"
```
And line 59:
```tsx
background: "#f3f1e9",
```

- [ ] **Step 1: Update `main.layout.tsx`**

  1. Add imports at top:
     ```tsx
     import { useTheme } from '../hooks/useTheme';
     import { ThemeToggle } from '../components/UI/ThemeToggle';
     ```

  2. Inside `MainLayout`, call the hook:
     ```tsx
     const { theme, toggle } = useTheme();
     ```

  3. Replace `bg-[#4c4b4c]` with `bg-surround` on the `<main>` element.

  4. Replace `background: "#f3f1e9"` with `background: "var(--color-surface)"` on the inner `<div>`.

  5. Add `<ThemeToggle theme={theme} toggle={toggle} />` as a **direct child of `<main>`**, after (not inside) the `{gridSize && ...}` block. The button uses `position: fixed`, but placing it inside the conditional would hide it on narrow viewports where `gridSize` is undefined.

- [ ] **Step 2: Add toggle button test to `main.layout.test.tsx`**

  Open `src/layout/main.layout.test.tsx` and add a test that verifies the toggle renders inside the layout. Add whatever mocks the existing tests use for `window.matchMedia` and `localStorage` (look at the existing test setup in that file). Add:

  ```tsx
  test('renders ThemeToggle button', () => {
    render(<MainLayout><div /></MainLayout>);
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
  });
  ```

- [ ] **Step 3: Run layout tests**

  ```bash
  npm run test:unit -- --reporter=verbose src/layout/main.layout.test.tsx
  ```
  Expected: All existing tests pass, plus the new toggle button test.

- [ ] **Step 4: Verify build**

  ```bash
  npm run build
  ```
  Expected: No errors.

- [ ] **Step 5: Commit**

  ```bash
  git add src/layout/main.layout.tsx src/layout/main.layout.test.tsx
  git commit -m "feat: wire useTheme and ThemeToggle into main layout"
  ```

---

## Task 5: Migrate Tetromino Tile

Remove the `COLORS` dependency. After this task pieces will change color when theme toggles.

**Files:**
- Modify: `src/components/tile/tetromino.tile.tsx`

Current line 4: `import { COLORS } from "../../constants";`
Current line 21: `` ${COLORS[shape]} ``

- [ ] **Step 1: Update `tetromino.tile.tsx`**

  Remove the `COLORS` import (line 4).

  Find the last line of the `background` template literal — it currently reads `${COLORS[shape]}`. Replace **only that line** with `var(--color-piece-${shape})`. The four `linear-gradient(...)` lines above it are untouched.

  After the edit, the last two lines of the background value should look like:
  ```ts
    linear-gradient(to top, rgba(0,0,0,0.10), rgba(0,0,0,0)) no-repeat right / 10px 100%,
    var(--color-piece-${shape})
  `,
  ```

- [ ] **Step 2: Verify build (TypeScript catches unused import)**

  ```bash
  npm run build
  ```
  Expected: No errors. Strict TypeScript will catch any lingering `COLORS` references.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/tile/tetromino.tile.tsx
  git commit -m "feat: replace COLORS[shape] with CSS var token in tetromino tile"
  ```

---

## Task 6: Migrate Waves Grid

**Files:**
- Modify: `src/components/grid/waves.grid.tsx`

- [ ] **Step 1: Update `waves.grid.tsx`**

  Find the inline `background: "#f3f1e9"` on the grid container and replace with `background: "var(--color-surface)"`.

  Find the radial gradient string containing `#d9d3c0` and replace the hex with `var(--color-wave)`:
  ```ts
  background: `radial-gradient(circle, transparent 10%, var(--color-wave) 100%)`
  ```

- [ ] **Step 2: Verify build**

  ```bash
  npm run build
  ```
  Expected: No errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/grid/waves.grid.tsx
  git commit -m "feat: replace hardcoded wave grid colors with CSS tokens"
  ```

---

## Task 7: Migrate Navbar

**Files:**
- Modify: `src/components/navbar/navbar.tsx`
- Modify: `src/components/navbar/navbar.css`

- [ ] **Step 1: Update `navbar.tsx`**

  Line 38 — the nav card `className`:
  - Replace `bg-zinc-700` → `bg-nav`
  - Replace `text-[#fafafa]` → `text-text-nav`

  Line 88 — social links `<a>` hover class:
  - Replace `hover:text-[#bababa]` → `hover:text-text-muted`

  Line 102 — social link title `<span>`:
  - Replace `text-[#FAEBD7]` → `text-text-nav-accent`

- [ ] **Step 2: Update `navbar.css`**

  Line 13: `color: #fafafa;` → `color: var(--color-text-nav);`

  Line 25: `color: #bababa;` → `color: var(--color-text-muted);`

- [ ] **Step 3: Run navbar tests**

  ```bash
  npm run test:unit -- --reporter=verbose src/components/navbar/navbar.test.tsx
  ```
  Expected: All existing tests pass.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/navbar/navbar.tsx src/components/navbar/navbar.css
  git commit -m "feat: replace hardcoded navbar colors with CSS tokens"
  ```

---

## Task 8: Migrate UI Components

**Files:**
- Modify: `src/components/UI/contentPanel.tsx`
- Modify: `src/components/UI/button.tsx`
- Modify: `src/components/UI/dropdown.tsx`
- Modify: `src/components/UI/avatar.css`

- [ ] **Step 1: Update `contentPanel.tsx`**

  Line 14: `backgroundColor: "rgba(255,255,255,0.55)"` → `backgroundColor: "var(--color-panel-bg)"`

  Line 18: `color: "#333332"` → `color: "var(--color-text)"`

- [ ] **Step 2: Update `button.tsx`**

  Line 17 className: replace `bg-stone-900` → `bg-surround`, `text-white` → `text-text-nav`

- [ ] **Step 3: Update `dropdown.tsx`**

  Line 28: `bg-gray-700` → `bg-nav`

  Lines 32–33: `hover:bg-gray-600` → `hover:bg-surround`, `bg-gray-600` → `bg-surround`

- [ ] **Step 4: Update `avatar.css`**

  Line 7: `border: 2px solid lightgray` → `border: 2px solid var(--color-border)`

- [ ] **Step 5: Run UI component tests**

  ```bash
  npm run test:unit -- --reporter=verbose src/components/UI/button.test.tsx src/components/UI/avatar.test.tsx
  ```
  Expected: All existing tests pass.

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/UI/contentPanel.tsx src/components/UI/button.tsx src/components/UI/dropdown.tsx src/components/UI/avatar.css
  git commit -m "feat: replace hardcoded colors in UI components with CSS tokens"
  ```

---

## Task 9: Migrate Pages

**Files:**
- Modify: `src/pages/theBuzz/buzzPage.tsx`
- Modify: `src/pages/theBuzz/toolbox.tsx`
- Modify: `src/pages/notFound/notfoundPage.tsx`
- Modify: `src/components/prompter/prompter.css`

- [ ] **Step 1: Update `buzzPage.tsx`**

  Line 30 (mobile header): `bg-zinc-700` → `bg-nav`, `text-[#fafafa]` → `text-text-nav`

  Line 45 (separator span): `text-[#bababa]` → `text-text-muted`

  Line 80 (mobile footer): `bg-zinc-700` → `bg-nav`

- [ ] **Step 2: Update `toolbox.tsx`**

  There are two separate JSX elements to update. Search by className content rather than line number:

  **Section card** (contains `border-zinc-300 bg-white/40`):
  - `border-zinc-300` → `border-[--color-border]`
  - `bg-white/40` → `bg-[--color-panel-bg]`
  - `text-zinc-500` (section heading) → `text-text-muted`

  **Skill list item** (contains `border-zinc-200 bg-white/50 text-zinc-700`):
  - `border-zinc-200` → `border-[--color-border]`
  - `bg-white/50` → `bg-[--color-panel-bg]`
  - `text-zinc-700` → `text-text`

- [ ] **Step 3: Update `notfoundPage.tsx`**

  Find `text-gray-700` on the description paragraph and replace with `text-text`.

- [ ] **Step 4: Update `prompter.css`**

  In `.prompt-cursor`: `color: #6f2808;` → `color: var(--color-cursor);`

  In `.prompt-text`: `color: #111111;` → `color: var(--color-prompt-text);`

- [ ] **Step 5: Run page tests**

  ```bash
  npm run test:unit -- --reporter=verbose src/pages/theBuzz/buzzPage.test.tsx src/pages/theBuzz/toolbox.test.tsx
  ```
  Expected: All existing tests pass.

- [ ] **Step 6: Commit**

  ```bash
  git add src/pages/theBuzz/buzzPage.tsx src/pages/theBuzz/toolbox.tsx src/pages/notFound/notfoundPage.tsx src/components/prompter/prompter.css
  git commit -m "feat: replace hardcoded colors in pages with CSS tokens"
  ```

---

## Task 10: Remove Color Maps from `constants.ts`

Only safe after all consumers (tetromino.tile.tsx) have been migrated.

**Files:**
- Modify: `src/constants.ts`

- [ ] **Step 1: Remove all color map exports**

  Delete the following exports entirely from `src/constants.ts`:
  - `COLORS`
  - `SOFT_COLORS`
  - `DARK_COLORS`
  - `SOFT_DARK_COLORS`
  - `RICH_COLORS`
  - `SOFT_RICH_COLORS`

  Also remove the `ShapeKeyTetrominoes` import if it's only used by these maps (check if anything else in `constants.ts` uses it first).

- [ ] **Step 2: Verify build catches any missed consumers**

  ```bash
  npm run build
  ```
  Expected: No errors. If TypeScript reports "unused export" or "cannot find COLORS" anywhere, that file was missed in earlier tasks — fix it before continuing.

- [ ] **Step 3: Run full test suite**

  ```bash
  npm run test:unit
  ```
  Expected: All tests pass.

- [ ] **Step 4: Commit**

  ```bash
  git add src/constants.ts
  git commit -m "chore: remove legacy color map constants (replaced by CSS tokens)"
  ```

---

## Task 11: Final Verification

- [ ] **Step 1: Full test suite**

  ```bash
  npm run test:unit
  ```
  Expected: All tests pass, zero failures.

- [ ] **Step 2: Build**

  ```bash
  npm run build
  ```
  Expected: Clean TypeScript compilation, no errors.

- [ ] **Step 3: Grep for remaining hardcoded hex values**

  ```bash
  grep -rn '#[0-9a-fA-F]\{3,6\}' src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v "index.css"
  ```
  Expected: Zero results. Any matches are missed migrations.

- [ ] **Step 4: Grep for hardcoded Tailwind palette classes**

  ```bash
  grep -rn 'bg-zinc-\|bg-gray-\|bg-stone-\|bg-white/\|text-zinc-\|text-gray-\|border-zinc-' src/ --include="*.tsx" --include="*.ts"
  ```
  Expected: Zero results (or only results you deliberately chose to keep, explained in comments).

- [ ] **Step 5: Manual browser check — light mode**

  Run `npm run dev`. Open in browser. Verify:
  - Cream grid background visible
  - Charcoal outer surround
  - Pastel Tetris piece colors
  - Toggle button visible bottom-right (moon icon)

- [ ] **Step 6: Manual browser check — dark mode**

  Click the toggle. Verify:
  - Zinc-900 outer surround
  - Zinc-800 grid background
  - Saturated Tetris piece colors (teal, gold, purple etc.)
  - Toggle button shows lamp icon
  - Navbar, content panels, prompter text all correctly themed

- [ ] **Step 7: FOUC check**

  With dark mode active, hard-refresh the page (`Cmd+Shift+R`). Verify: no flash of light theme before dark mode applies.

- [ ] **Step 8: System preference check**

  Clear localStorage (`localStorage.clear()` in DevTools console), set OS to dark mode, reload. Verify: dark mode activates automatically without any toggle.

---

## File Summary

| File | Status |
|------|--------|
| `index.html` | Modified — FOUC script |
| `src/index.css` | Modified — `@theme`, dark overrides, token references |
| `src/hooks/useTheme.ts` | **New** |
| `src/hooks/useTheme.test.ts` | **New** |
| `src/components/UI/ThemeToggle.tsx` | **New** |
| `src/components/UI/ThemeToggle.test.tsx` | **New** |
| `src/layout/main.layout.tsx` | Modified |
| `src/components/tile/tetromino.tile.tsx` | Modified |
| `src/components/grid/waves.grid.tsx` | Modified |
| `src/components/navbar/navbar.tsx` | Modified |
| `src/components/navbar/navbar.css` | Modified |
| `src/components/UI/contentPanel.tsx` | Modified |
| `src/components/UI/button.tsx` | Modified |
| `src/components/UI/dropdown.tsx` | Modified |
| `src/components/UI/avatar.css` | Modified |
| `src/components/prompter/prompter.css` | Modified |
| `src/pages/theBuzz/buzzPage.tsx` | Modified |
| `src/pages/theBuzz/toolbox.tsx` | Modified |
| `src/pages/notFound/notfoundPage.tsx` | Modified |
| `src/constants.ts` | Modified — color maps removed |
