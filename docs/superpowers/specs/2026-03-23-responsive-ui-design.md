# Responsive UI Design Spec
**Date:** 2026-03-23
**Status:** Approved

---

## Overview

Six responsive UI improvements across the intro page and theBuzz page. No new dependencies. All changes are CSS / Tailwind / small component tweaks.

---

## 1. Intro Page — Avatar + Text Responsive Rebuild

**Files:** `src/pages/intro/introPage.tsx`, `src/components/prompter/prompter.css`

**Layout behaviour:**
- Small screens (`< md`): `flex-col items-center` — avatar stacked above text, both centered
- Medium+ (`md+`): `flex-row items-center` — avatar on left, text + button on right

**Avatar sizes (Tailwind on the Avatar className):**
- `w-14 h-14` on small (3.5rem)
- `md:w-24 md:h-24` on md (6rem)
- `lg:w-44 lg:h-44` on lg+ (11rem)

**Spacer div** beneath avatar (desktop alignment helper):
- `hidden md:block md:min-h-12 lg:min-h-24`

**Prompter font sizes** — add `md` breakpoint in `prompter.css`:
- default: `2rem / 2.75rem`
- `sm` (640px): `3rem / 4rem`
- `md` (768px): `3.75rem / 5rem`  ← new
- `lg` (1024px): `5rem / 7rem`

---

## 2. Road Trip Tile — Emoji Scaled to Tile Size

**File:** `src/components/tile/roadTrip.tile.tsx`

Replace hardcoded `fontSize: 30` with:
```ts
fontSize: Math.round(tileSize * 0.55)
```

This scales the emoji proportionally: ~11px at tileSize=20, ~27px at tileSize=50, ~38px at tileSize=70. The emoji never overflows its tile.

---

## 3. "Get to Know Me" Button — Centering + Responsive Size

**File:** `src/components/UI/button.tsx`

Changes to the `<button>` element:
- Add `flex items-center justify-center` so text is always vertically and horizontally centred
- Replace `text-2xl` with `text-base md:text-xl lg:text-2xl`
- Replace `min-h-20` with `min-h-12 md:min-h-16 lg:min-h-20`

---

## 4–6. TheBuzz — Navbar Split on Small Screens

**Files:** `src/pages/theBuzz/buzzPage.tsx`, `src/components/navbar/navbar.tsx`

### Structural approach

The `sections` and `links` arrays are moved to a shared module (or kept in navbar and re-exported) so both the mobile bars and the desktop sidebar can reference them without duplication.

### BuzzPage layout

```
<div class="absolute inset-0 flex flex-col md:flex-row">

  {/* Mobile-only top header: section links, no identity */}
  <header class="flex md:hidden bg-zinc-700 ...">
    [section links horizontal]
  </header>

  {/* Desktop-only sidebar */}
  <aside class="hidden md:flex w-80 h-full">
    <Navbar />
  </aside>

  {/* Content — always visible */}
  <main class="flex-1 min-h-0 overflow-auto ...">
    <Outlet />
  </main>

  {/* Mobile-only footer: link icons only, no labels */}
  <footer class="flex md:hidden bg-zinc-700 ...">
    [link icons, no text]
  </footer>

</div>
```

The slide-in animation (`translate-y-0 / -translate-y-20`) applies to the `<aside>` on desktop (unchanged behaviour). On mobile the header/footer appear without animation.

### Navbar (desktop sidebar only — task 5 & 6)

Inside the existing `<nav>` the three sections become:

| Section | Tailwind |
|---------|----------|
| Identity (avatar + name + description) | top of flex-col, unchanged |
| Nav `<ul>` | `flex flex-col justify-center flex-1` — restores vertical centering (task 6) |
| Social links | `flex flex-col mt-auto gap-1` — stays pinned to bottom (task 5) |

The existing `md:flex-4` on the nav-links wrapper is replaced with `flex-1` for clarity.

### Mobile top header (task 4)

- `flex justify-around items-center px-4 py-2 bg-zinc-700 text-[#fafafa]`
- Renders the same `sections` array as horizontal links
- Active section still underlined / highlighted
- **No** avatar, name, or description

### Mobile bottom footer (task 4)

- `flex justify-around items-center px-4 py-2 bg-zinc-700`
- Renders the same `links` array as icon-only buttons (`w-5 h-5` img, no `<span>`)
- Uses `cursor-pointer hover:opacity-70 transition-opacity`

---

## Out of Scope

- No changes to wave grid, tetromino grid, or game-of-life
- No changes to the NotSupportedPage redirect logic
- No new dependencies

