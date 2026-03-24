# Intro Overlay Proportions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix disproportional elements on the intro overlay so avatar height matches the text block, gaps are responsive, and the button is clearly secondary to the heading.

**Architecture:** All 4 changes are in a single file (`src/pages/intro/introPage.tsx`). No new files, no CSS changes, no new components. Pure Tailwind class updates.

**Tech Stack:** React + TypeScript + Tailwind CSS v3

---

## Files

| File | Change |
|------|--------|
| `src/pages/intro/introPage.tsx` | 4 targeted class string edits (lines 73, 75, 78, 80, 96) |

---

### Task 1: Fix the avatar wrapper div

**Files:**
- Modify: `src/pages/intro/introPage.tsx:75`

The current wrapper `<div className="flex flex-col h-full avatar-animate-in">` has `h-full` and contains a spacer div. Both were hacks to push the avatar upward. With the new approach the parent `items-center` handles alignment — `h-full` and the spacer are dead weight.

- [ ] **Step 1: Edit the avatar wrapper div**

In `src/pages/intro/introPage.tsx`, find line 75:
```tsx
<div className="flex flex-col h-full avatar-animate-in">
```
Change to:
```tsx
<div className="avatar-animate-in">
```

- [ ] **Step 2: Remove the spacer div**

Delete line 80 entirely:
```tsx
<div className="hidden md:block md:min-h-12 lg:min-h-24"></div>
```

After this step the avatar wrapper block should look like:
```tsx
{promptFinished && (
  <div className="avatar-animate-in">
    <Avatar
      src={avatarImg}
      className="flex items-center saturate-100 w-14 h-14 md:w-24 md:h-24 lg:w-44 lg:h-44"
    />
  </div>
)}
```

- [ ] **Step 3: Verify the app still renders**

Run: `npm run dev`
Open the app. The intro overlay should still appear after the grid animation — avatar + text side by side. Nothing should be broken yet.

---

### Task 2: Add responsive gap to the flex wrapper

**Files:**
- Modify: `src/pages/intro/introPage.tsx:73`

The current `"flex flex-col md:flex-row items-center"` wrapper has no gap — spacing between avatar and text comes only from `mr-5` on the Avatar component. Replace with a responsive gap that scales with viewport.

- [ ] **Step 1: Update the flex wrapper className**

On line 73, change:
```tsx
<div className="flex flex-col md:flex-row items-center">
```
To:
```tsx
<div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-16">
```

Gap values: 24px (mobile) → 32px (sm) → 40px (md) → 64px (lg).

---

### Task 3: Scale avatar to match text block height

**Files:**
- Modify: `src/pages/intro/introPage.tsx:78`

Old sizes `w-14 h-14 md:w-24 md:h-24 lg:w-44 lg:h-44` (56/96/176px) are too small relative to the text block at every breakpoint. New sizes match text block height at each breakpoint. `!mr-0` uses Tailwind's `!important` modifier to reliably override the `mr-5` that the Avatar component applies by default (Avatar does `className="avatar mr-5 ${className}"` — plain `mr-0` is not CSS-order-safe in Tailwind v3).

- [ ] **Step 1: Update the Avatar className**

Change:
```tsx
className="flex items-center saturate-100 w-14 h-14 md:w-24 md:h-24 lg:w-44 lg:h-44"
```
To:
```tsx
className="flex items-center saturate-100 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 !mr-0"
```

New avatar sizes: 112px (mobile) → 128px (sm) → 160px (md) → 208px (lg).

- [ ] **Step 2: Check in browser at multiple breakpoints**

Run: `npm run dev`

Resize the browser window through all breakpoints. At each size, the avatar circle and the text+button block should feel visually balanced — similar heights sitting side by side. On mobile they stack vertically with the avatar centered above text.

Expected visual: at desktop, avatar is a large prominent circle roughly equal in height to the "Hi, I'm Mitya 👋" heading + button stack.

---

### Task 4: Establish button hierarchy

**Files:**
- Modify: `src/pages/intro/introPage.tsx:96`

Currently the button font size matches the heading (`5rem` at lg). Both shout equally. The button should read as a secondary CTA — clearly smaller but still prominent.

- [ ] **Step 1: Update the Button className**

On line 96, change:
```tsx
className="text-[2rem] sm:text-5xl md:text-6xl lg:text-[5rem]"
```
To:
```tsx
className="text-lg sm:text-xl md:text-2xl lg:text-3xl"
```

New button font sizes: 18px → 20px → 24px → 30px (vs heading 32px → 48px → 60px → 80px).

- [ ] **Step 2: Full visual check**

Run: `npm run dev` and go through the full intro sequence:

1. Watch the grid animation play
2. Avatar slides in from the left
3. "Hi, I'm Mitya 👋" types out
4. Button fades in from above

At desktop: heading should be visually dominant (~80px), button clearly secondary (~30px) but still readable and clickable.

5. Click the button — overlay should exit (slide down, fade) and navigate to `/theBuzz`

- [ ] **Step 3: DevTools spot-check**

Open DevTools, inspect the avatar element and confirm `margin-right: 0px` (not 20px).

- [ ] **Step 4: Commit**

```bash
git add src/pages/intro/introPage.tsx
git commit -m "fix: rebalance intro overlay proportions — avatar, gap, button hierarchy"
```
