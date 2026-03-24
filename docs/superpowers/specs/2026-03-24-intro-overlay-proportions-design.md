# Intro Overlay — Proportions Redesign

**Date:** 2026-03-24
**Status:** Draft

---

## Problem

The intro overlay (first thing visitors see) has disproportional elements:

1. **Avatar too small** — at `lg`, avatar is 176px but the text block it sits beside is ~212px tall, making them feel mismatched
2. **Fixed gap** — `mr-5` (20px) between avatar and text is hardcoded and far too small at large viewports
3. **No visual hierarchy** — button font size matches the heading font size (`5rem` each at `lg`), so both elements compete equally for attention
4. **Mobile avatar undersized** — 56px avatar next to 32px text feels like an afterthought

---

## Design Decision

**Layout B1 + Hierarchy (H):** Side-by-side layout where avatar height equals the full text block height (heading + gap + button), with the button clearly smaller than the heading.

Visual flow: **face → greeting → action**

---

## Approved Sizing

### Avatar (`w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-52 lg:h-52`)

Text block height = heading line-height + `mt-5` (20px) + button min-height.

| Breakpoint | Old avatar | New avatar | Heading line-height | mt-5 | Button min-h | Text block |
|------------|-----------|-----------|---------------------|------|--------------|------------|
| mobile (<640px) | 56px | 112px | 2.75rem (44px) | 20px | min-h-12 (48px) | ~112px ✓ |
| sm (640px+) | 56px | 128px | 4rem (64px) | 20px | min-h-12 (48px) | ~132px ≈ ✓ |
| md (768px+) | 96px | 160px | 5rem (80px) | 20px | min-h-16 (64px) | ~164px ✓ |
| lg (1024px+) | 176px | 208px | 7rem (112px) | 20px | min-h-20 (80px) | ~212px ✓ |

Note: at `lg`, `w-52 h-52` = 208px vs text block ~212px — 4px difference is imperceptible. "Get to know me" at `text-3xl` with `px-6 py-2` does not wrap on a 1024px+ viewport.

### Gap between avatar and text (responsive flex gap)

Remove fixed `mr-5` from Avatar by passing `!mr-0` in the className (using Tailwind's `!important` modifier to safely override the Avatar component's built-in `mr-5` regardless of CSS generation order). Add `gap-6 sm:gap-8 md:gap-10 lg:gap-16` to the flex wrapper.

| Breakpoint | Old | New |
|------------|-----|-----|
| mobile     | 20px | 24px |
| sm         | 20px | 32px |
| md         | 20px | 40px |
| lg         | 20px | 64px |

### Button font size (`text-lg sm:text-xl md:text-2xl lg:text-3xl`)

| Breakpoint | Old class | Old font-size | New class | New font-size |
|------------|-----------|---------------|-----------|---------------|
| mobile     | `text-[2rem]` | 32px | `text-lg` | 18px |
| sm         | `sm:text-5xl` | 30px (3rem) | `sm:text-xl` | 20px |
| md         | `md:text-6xl` | 37.5px (3.75rem) | `md:text-2xl` | 24px |
| lg         | `lg:text-[5rem]` | 80px | `lg:text-3xl` | 30px |

Heading font-size remains unchanged — the contrast creates the hierarchy.

---

## Files Changed

### `src/pages/intro/introPage.tsx`

**Change 1 — Avatar className** (update size classes; add `!mr-0` to override the Avatar component's built-in `mr-5`):
```
Old: "flex items-center saturate-100 w-14 h-14 md:w-24 md:h-24 lg:w-44 lg:h-44"
New: "flex items-center saturate-100 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 !mr-0"
```

**Change 2 — Flex wrapper** (add responsive gap):
```
Old: "flex flex-col md:flex-row items-center"
New: "flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-16"
```

**Change 3 — Avatar wrapper div** (remove `h-full` and the spacer div beneath it; both were needed only when the spacer was driving vertical alignment):
```jsx
// Old
<div className="flex flex-col h-full avatar-animate-in">
  <Avatar ... />
  <div className="hidden md:block md:min-h-12 lg:min-h-24"></div>
</div>

// New
<div className="avatar-animate-in">
  <Avatar ... />
</div>
```

**Change 4 — Button className** (update font size):
```
Old: "text-[2rem] sm:text-5xl md:text-6xl lg:text-[5rem]"
New: "text-lg sm:text-xl md:text-2xl lg:text-3xl"
```

No changes to CSS files, animation logic, or other components.

---

## Verification

1. Run `npm run dev` and open the app
2. Observe the intro overlay on first load — avatar, greeting, and button animate in sequentially
3. At **desktop (lg)**: avatar and text block appear roughly equal in height, generous gap between them, button clearly smaller than heading
4. At **tablet (md)**: same proportional balance at smaller scale
5. At **mobile**: avatar ~112px, stacked above centered text, visibly larger than before (was 56px)
6. Click "Get to know me" — exit animation plays correctly, navigates to `/theBuzz`
7. Inspect avatar in DevTools — verify computed margin-right is 0 (not 20px)
