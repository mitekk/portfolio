# Responsive UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the intro page and theBuzz page fully responsive across small, medium, and large screen sizes.

**Architecture:** Pure CSS/Tailwind changes plus small component modifications. No new runtime dependencies. The theBuzz navbar is split via a shared `navData.ts` module so mobile bars in `BuzzPage` and the desktop `Navbar` both reference the same data without coupling.

**Tech Stack:** React, TypeScript, Tailwind CSS (v4 via Vite), React Router

---

## File Map

| Action | File | What changes |
|--------|------|-------------|
| Create | `src/components/navbar/navData.ts` | Exports `sections` and `links` arrays (moved from `navbar.tsx`) |
| Modify | `src/components/navbar/navbar.tsx` | Import from `navData.ts`; fix `flex-1` on nav wrapper; fix `ul` centering; social links `mt-auto` |
| Modify | `src/pages/theBuzz/buzzPage.tsx` | Add mobile header + footer; wrap desktop Navbar in `hidden md:flex` |
| Modify | `src/pages/intro/introPage.tsx` | Responsive avatar sizes + layout breakpoints |
| Modify | `src/components/prompter/prompter.css` | Add `md` breakpoint font size |
| Modify | `src/components/UI/button.tsx` | Center text; responsive size classes |
| Modify | `src/components/tile/roadTrip.tile.tsx` | Scale emoji `fontSize` by `tileSize` |

---

## Task 1: Shared nav data module

**Files:**
- Create: `src/components/navbar/navData.ts`
- Modify: `src/components/navbar/navbar.tsx`

- [ ] **Step 1: Create `navData.ts`**

```ts
// src/components/navbar/navData.ts
import { cvIcon, emailIcon, githubIcon, linkedinIcon } from "../../assets/links";

const emailUrl = "mitekk@gmail.com";
const linkedinUrl = "https://www.linkedin.com/in/mitya-kurs-8b058452/";
const githubUrl = "https://github.com/mitekk";

export const sections = ["about", "experience", "toolbox"];

export const links = [
  {
    action: () =>
      (window.location.href = `mailto:${emailUrl}?subject=Hi%20Mitya&body=How%20are%20you%3F`),
    imgSrc: emailIcon,
    alt: "email",
    title: emailUrl,
  },
  {
    action: () => window.open(linkedinUrl, "_blank"),
    imgSrc: linkedinIcon,
    alt: "linkedin",
    title: "linkedin",
  },
  {
    action: () => window.open(githubUrl, "_blank"),
    imgSrc: githubIcon,
    alt: "github",
    title: "github",
  },
  {
    action: () => window.open("/Mitya_Kurs.pdf", "_blank"),
    imgSrc: cvIcon,
    alt: "CV",
    title: "download CV",
  },
];
```

Note: the icon imports use a relative path from `navData.ts`'s location (`src/components/navbar/`) — adjust the import path to `../../assets/links` to match the directory depth.

- [ ] **Step 2: Update `navbar.tsx` to import from `navData.ts`**

Remove the `emailUrl`, `linkedinUrl`, `githubUrl` consts and both `sections` / `links` arrays from `navbar.tsx`. Replace with:

```ts
import { sections, links } from "./navData";
```

The rest of `navbar.tsx` is unchanged for this step.

- [ ] **Step 3: Run build to verify no import errors**

```bash
npm run build
```

Expected: build succeeds, no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/navbar/navData.ts src/components/navbar/navbar.tsx
git commit -m "refactor: extract navbar data to shared navData module"
```

---

## Task 2: Desktop Navbar — layout fixes (tasks 5 & 6)

**Files:**
- Modify: `src/components/navbar/navbar.tsx`

- [ ] **Step 1: Fix nav links wrapper and `<ul>` centering**

In `navbar.tsx`, find the nav links section (currently `<div className="md:flex-4 md:py-2">`).

Replace it with:
```tsx
{/* Nav links */}
<div className="flex-1 py-2">
  <ul className="nav-links flex flex-row md:flex-col gap-4 md:gap-0 md:h-full md:justify-center">
    {sections.map((section) => (
      <li key={section}>
        <div className="flex flex-row items-center gap-1 cursor-pointer">
          <div className="hidden md:flex flex-row justify-center w-5">
            {activeLink === section && (
              <div className="pt-1 text-xs">➜</div>
            )}
          </div>
          <Link
            to={section}
            className={`nav-link${activeLink === section ? " active" : ""}`}
          >
            {section}
          </Link>
        </div>
      </li>
    ))}
  </ul>
</div>
```

Key changes: `md:flex-4` → `flex-1`; `md:justify-around` → `md:justify-center` on `<ul>`.

- [ ] **Step 2: Fix social links to use `mt-auto`**

Find the social links section. Replace the outer div's className:

Before:
```tsx
<div className="flex flex-row md:flex-col items-center md:justify-end md:h-full md:py-2 gap-3 md:gap-1">
```

After:
```tsx
<div className="flex flex-row md:flex-col items-center md:py-2 gap-3 md:gap-1 md:mt-auto">
```

Removes `md:justify-end md:h-full` (no longer needed since `mt-auto` handles bottom pinning), adds `md:mt-auto`.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/navbar/navbar.tsx
git commit -m "fix: restore vertical centering and bottom-pin social links in desktop navbar"
```

---

## Task 3: BuzzPage — mobile header + footer split (task 4)

**Files:**
- Modify: `src/pages/theBuzz/buzzPage.tsx`

- [ ] **Step 1: Rewrite the layout inside `{gridLoaded && (...)}`**

Replace the entire `{gridLoaded && (...)}` block with:

```tsx
{gridLoaded && (
  <div className="absolute inset-0 flex flex-col md:flex-row">
    {/* Mobile-only top header: section links, no identity */}
    <header className="flex md:hidden justify-around items-center px-4 py-2 bg-zinc-700 text-[#fafafa]">
      {sections.map((section) => (
        <Link
          key={section}
          to={`/theBuzz/${section}`}
          className={`nav-link${activeLink === section ? " active" : ""}`}
        >
          {section}
        </Link>
      ))}
    </header>

    {/* Desktop-only sidebar with slide-in animation */}
    <div
      className={`hidden md:flex transition-all duration-700 ease-out md:h-full ${
        navbarVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-20 opacity-0"
      }`}
    >
      <Navbar />
    </div>

    {/* Content */}
    <div
      key={location.pathname}
      className="flex-1 min-h-0 transition-opacity duration-700 opacity-0 animate-fadein mx-2 md:mx-5 overflow-auto"
    >
      <Outlet />
    </div>

    {/* Mobile-only footer: icons only */}
    <footer className="flex md:hidden justify-around items-center px-4 py-2 bg-zinc-700">
      {links.map((link) => (
        <div
          key={link.alt}
          className="cursor-pointer hover:opacity-70 transition-opacity"
          onClick={link.action}
          title={link.title}
        >
          <img
            className="w-5 h-5"
            src={link.imgSrc}
            alt={link.alt}
            draggable={false}
          />
        </div>
      ))}
    </footer>
  </div>
)}
```

- [ ] **Step 2: Add required imports to `buzzPage.tsx`**

Add at the top:
```tsx
import { Link, Outlet } from "react-router-dom";
import { sections, links } from "../../components/navbar/navData";
```

Also add state for `activeLink` (needed by the mobile header):
```tsx
const [activeLink, setActiveLink] = useState<string>();
const { pathname } = useLocation();

useEffect(() => {
  setActiveLink(pathname.split("/")[2]);
}, [pathname]);
```

Note: `useLocation`, `Outlet`, and `useNavigate` are already imported in `buzzPage.tsx` — do not add duplicate imports. Extend the existing `react-router-dom` import line to add `Link` if it's not already there. Add `useState` and `useEffect` from `react`. Keep all existing imports.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/theBuzz/buzzPage.tsx
git commit -m "feat: split navbar into mobile header/footer and desktop sidebar"
```

---

## Task 4: Intro page — responsive avatar + layout (task 1)

**Files:**
- Modify: `src/pages/intro/introPage.tsx`
- Modify: `src/components/prompter/prompter.css`

- [ ] **Step 1: Update avatar sizes and container layout in `introPage.tsx`**

Find the overlay content div (line ~73, `className="flex flex-col md:flex-row items-center"`). It's already correct for layout — keep it.

Find the Avatar element (line ~78):

Before:
```tsx
<Avatar
  src={avatarImg}
  className="flex items-center flex-1 saturate-100 w-28 h-28 md:w-75 md:h-75"
/>
```

After:
```tsx
<Avatar
  src={avatarImg}
  className="flex items-center saturate-100 w-14 h-14 md:w-24 md:h-24 lg:w-44 lg:h-44"
/>
```

Removed `flex-1` (it was making the avatar flex-grow in a flex-col, causing unpredictable sizing).

- [ ] **Step 2: Update the spacer div**

Find the spacer div (line ~80):

Before:
```tsx
<div className="hidden md:block md:min-h-24"></div>
```

After:
```tsx
<div className="hidden md:block md:min-h-12 lg:min-h-24"></div>
```

- [ ] **Step 3: Add `md` font-size breakpoint to `prompter.css`**

In `prompter.css`, add a new `@media (min-width: 768px)` block between the existing `sm` and `lg` blocks:

```css
@media (min-width: 768px) {
  .prompt-text {
    font-size: 3.75rem;
    line-height: 5rem;
  }
}
```

The existing `@media (min-width: 640px)` block stays unchanged (3rem / 4rem). The existing `@media (min-width: 1024px)` block stays unchanged (5rem / 7rem).

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/pages/intro/introPage.tsx src/components/prompter/prompter.css
git commit -m "feat: responsive intro avatar sizing and text breakpoints"
```

---

## Task 5: Button — centering + responsive size (task 3)

**Files:**
- Modify: `src/components/UI/button.tsx`

- [ ] **Step 1: Update button classes**

In `button.tsx`, find the `<button>` element.

Before:
```tsx
<button
  style={style}
  className={`bg-stone-900 px-6 py-2 rounded-lg text-white shadow min-h-20 text-2xl font-semibold`}
  onClick={onClick}
>
```

After:
```tsx
<button
  style={style}
  className={`bg-stone-900 px-6 py-2 rounded-lg text-white shadow min-h-12 md:min-h-16 lg:min-h-20 text-base md:text-xl lg:text-2xl font-semibold flex items-center justify-center`}
  onClick={onClick}
>
```

Note: `notSupportedPage.tsx` passes `style={{ minHeight: "4rem", fontSize: "1rem" }}` which overrides via inline styles — do **not** change `notSupportedPage.tsx`.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/UI/button.tsx
git commit -m "fix: center button text and make size responsive"
```

---

## Task 6: Road trip tile — scale emoji to tile size (task 2)

**Files:**
- Modify: `src/components/tile/roadTrip.tile.tsx`

- [ ] **Step 1: Replace hardcoded emoji font size**

In `roadTrip.tile.tsx`, find all five emoji `<span>` elements. Each has `style={{ fontSize: 30, userSelect: "none" }}`.

Replace every `fontSize: 30` with `fontSize: Math.round(tileSize * 0.55)`:

```tsx
// tree
<span role="img" aria-label="tree" style={{ fontSize: Math.round(tileSize * 0.55), userSelect: "none" }}>
  🌲
</span>

// tree2
<span role="img" aria-label="tree" style={{ fontSize: Math.round(tileSize * 0.55), userSelect: "none" }}>
  🌳
</span>

// mountain
<span role="img" aria-label="mountain" style={{ fontSize: Math.round(tileSize * 0.55), userSelect: "none" }}>
  ⛰️
</span>

// house
<span role="img" aria-label="house" style={{ fontSize: Math.round(tileSize * 0.55), userSelect: "none" }}>
  🛖
</span>

// rhino
<span role="img" aria-label="rhino" style={{ fontSize: Math.round(tileSize * 0.55), userSelect: "none" }}>
  🦏
</span>
```

To avoid repeating the expression five times, compute it once at the top of the component:
```tsx
const emojiFontSize = Math.round(tileSize * 0.55);
```
Then use `fontSize: emojiFontSize` in each span.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/tile/roadTrip.tile.tsx
git commit -m "fix: scale road trip emoji size proportionally to tile size"
```

---

## Task 7: Final build verification

- [ ] **Step 1: Clean build**

```bash
npm run build
```

Expected: succeeds with no TypeScript errors. Ignore the `> 500kB chunk` warning — it's pre-existing.

- [ ] **Step 2: Smoke test in browser**

```bash
npm run dev
```

Check:
- Intro page at narrow viewport (~375px): avatar stacked above text, both centered, button text centred
- Intro page at medium viewport (~768px): avatar left, text right, appropriately sized
- Intro page at large viewport (~1400px): avatar large (11rem), text 5rem
- Road Trip mode: zoom browser to simulate small tiles — emoji should not overflow tile
- theBuzz at narrow viewport: top bar with 3 section links (no name/avatar), footer with 4 icons only
- theBuzz at wide viewport: full sidebar with identity + centred nav links + social links at bottom
