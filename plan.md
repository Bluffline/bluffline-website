# Progress Overview & Project Detail Redesign Plan

## Current State

The progress page (`src/pages/progress/index.astro`) currently has:
- **Section 3 (Map + Projects):** Two-column grid at desktop — map on left (`1fr`), cards on right (`min(50%, 680px)`). Project cards are **stacked vertically** in the right column. Hovering a card highlights that project's segments on the map.
- **Section 4 (Project Detail):** An inline detail section below the map/cards area. It shows info for the *first* active/pending project only — title, funder, program, amount, milestones, and outputs. There are **no individual project pages** (`/progress/projects/[slug]`). Clicking a project card just scrolls to this static section.

---

## Part 1: Map + Projects Two-Column Layout

**Goal:** 50/50 split on desktop — sticky map on the left, horizontally-scrollable project carousel on the right, with arrow indicators.

### Changes to `src/pages/progress/index.astro`

1. **Grid layout** — Change the desktop grid from `1fr min(50%, 680px)` to an even `1fr 1fr` split so each column takes exactly half the viewport.

2. **Horizontal project carousel** — Replace the vertical `.project-cards-stack` grid with a horizontal scroll container:
   - `display: flex; overflow-x: auto; scroll-snap-type: x mandatory;` on the container
   - Each `ProjectCard` gets `min-width` sizing (~320px) and `scroll-snap-align: start`
   - Hide the default scrollbar with `-webkit-scrollbar: none` / `scrollbar-width: none`

3. **Scroll arrow indicators** — Add left/right arrow buttons flanking the carousel:
   - Semi-transparent circular buttons with chevron SVGs, absolutely positioned at the vertical center of the carousel
   - Left arrow hidden when scrolled to start; right arrow hidden when scrolled to end
   - JS click handler scrolls the container by one card width using `scrollBy({ left: ..., behavior: 'smooth' })`
   - Update arrow visibility on `scroll` event

4. **Map column** — Keep the existing sticky behavior. Ensure `height: 100%` / `min-height` works well against the new right-column height (which will be shorter since cards are horizontal).

### Changes to `src/components/content/ProjectCard.astro`

5. **Card sizing for carousel** — Add a flex-friendly width constraint so cards look good side-by-side. No other structural changes.

---

## Part 2: Project Detail Page Redesign

**Goal:** Replace the inline detail section with proper individual project pages, and design them well.

### New file: `src/pages/progress/projects/[slug].astro`

6. **Dynamic route** — Create a `[slug].astro` page that generates one page per project using `getStaticPaths()` from the `projects` collection. The slug is derived from the collection entry id (e.g., `rcp-reconnecting-communities`).

7. **Page layout** — Clean, structured layout:
   - **Hero area** — Project title, status badge, funder/program/amount metadata displayed as a compact header bar (not a full-bleed hero — keep it tight). Colored left border or top accent using the project's `color` field.
   - **Two-column body** (desktop):
     - **Left/main column (~60%):**
       - Project description (full text, not truncated)
       - Milestone timeline using the existing `MilestoneList` component (already well-designed)
     - **Right sidebar (~40%):**
       - "What This Project Produces" outputs list (if present)
       - Node/geography pills showing which corridor nodes this project covers
       - Mini corridor map showing only this project's segments (reuse `CorridorMap` with filtered `allProjectSegments`)
       - Related links section (the schema already has `relatedLinks`)
   - **Bottom CTA** — "Back to all projects" link + general "Subscribe for updates" CTA

8. **Pursuing state variant** — For projects with `status: 'pursuing'`, show the pursuing notice instead of milestones (same logic currently in the inline detail section).

### Update `src/pages/progress/index.astro`

9. **Link project cards to detail pages** — Replace the current click-to-scroll behavior with actual navigation links. Each `ProjectCard` wraps in / links to `/progress/projects/{slug}`.

10. **Remove inline detail section** — Delete Section 4 (the `.project-detail-section`) entirely since individual project pages replace it.

### Update `src/components/content/ProjectCard.astro`

11. **Add `href` prop** — Accept an optional `href` prop so the card can link to the project detail page. Wrap the card content in an `<a>` tag when `href` is provided.

---

## File Summary

| File | Action |
|------|--------|
| `src/pages/progress/index.astro` | Edit: new grid layout, horizontal carousel + arrows, remove inline detail section, link cards to detail pages |
| `src/components/content/ProjectCard.astro` | Edit: add `href` prop, adjust sizing for horizontal carousel |
| `src/pages/progress/projects/[slug].astro` | **Create**: individual project detail page |

## Implementation Order

1. Create the project detail page (`[slug].astro`) — this is the largest new piece
2. Update `ProjectCard` — add href prop + carousel sizing
3. Update `progress/index.astro` — carousel layout, arrows, remove inline detail, wire up links
