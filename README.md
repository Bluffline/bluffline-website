# The Bluffline Website

The digital home for [The Bluffline](https://bluffline.org), a 20-mile multimodal corridor connecting Pensacola neighborhoods to the waterfront. The site serves as the primary public hub for project news, planning documents, community support, and civic engagement.

## Tech Stack

- **Framework**: [Astro 4](https://astro.build) — static-first with JavaScript islands where interaction is needed
- **Content**: Astro Content Collections with Zod schema validation (Markdown + JSON)
- **Maps**: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) — interactive corridor mapping
- **Images**: [Sharp](https://sharp.pixelplumbing.com/) — build-time image optimization
- **Deployment**: [Netlify](https://netlify.com) — automatic deploys from `main`
- **Email**: [ConvertKit](https://kit.com) — newsletter signup integration
- **Typography**: [Fraunces](https://fonts.google.com/specimen/Fraunces) (headings) + [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) (body) via Google Fonts

## Project Structure

```
src/
├── components/
│   ├── content/         # Data-driven cards (UpdateCard, PressCard, PressReleaseCard,
│   │                    #   BoardMemberCard, DocumentCard, TimelineItem,
│   │                    #   TestimonialCard, EmptyStateCard, IconCard)
│   ├── nav/             # Header (fixed, with dropdowns) and Footer
│   ├── ui/              # Reusable primitives (Button, Logo, PageHero, CallToAction,
│   │                    #   PhaseTracker, MediaLightbox, AnnouncementBanner, Tabs)
│   └── report/          # Annual report components (ReportHero, StatCard, StatGrid,
│                        #   MilestoneCard, PhotoGallery, AwardFeature, BigQuote,
│                        #   EventHighlight, PartnerCard, ProjectSpotlight)
│
├── content/             # Content collections (schemas in config.ts)
│   ├── updates/         # News & milestones (Markdown with frontmatter)
│   ├── press/           # Media coverage (JSON)
│   ├── press-releases/  # Official press releases (Markdown)
│   ├── board-members/   # Board directory (JSON)
│   ├── documents/       # Planning docs & studies (JSON)
│   ├── testimonials/    # Community quotes (JSON)
│   ├── timeline/        # Project history milestones (JSON)
│   ├── resources/       # Corridor landmarks & attractions (JSON)
│   └── pages/           # Editable page content (JSON)
│
├── data/                # Static data files for maps and visualizations
│   ├── crash-incidents.json
│   ├── planning-corridor.json
│   └── scenic-highway.json
│
├── layouts/
│   ├── BaseLayout.astro # Master layout (header, footer, meta, fonts)
│   └── PostLayout.astro # Article/update layout with author and date
│
├── pages/               # File-based routing
│   ├── index.astro                        # Homepage
│   ├── support.astro                      # Get Involved CTA
│   ├── thank-you.astro                    # Post-signup confirmation
│   ├── about/
│   │   ├── index.astro                    # Mission, values, board, timeline
│   │   ├── corridor.astro                 # The corridor itself
│   │   ├── impact.astro                   # Community impact
│   │   └── community-support.astro        # Letters of support
│   ├── progress/
│   │   ├── index.astro                    # Phase overview with tracker
│   │   ├── planning.astro                 # Planning documents
│   │   └── updates/
│   │       ├── index.astro                # Updates listing
│   │       └── [slug].astro               # Individual update
│   ├── press/
│   │   ├── index.astro                    # Press coverage listing
│   │   └── [slug].astro                   # Individual press release
│   └── documents/
│       └── annual-reports/
│           ├── index.astro                # Reports listing
│           └── 2025.astro                 # 2025 annual report
│
├── styles/
│   └── global.css       # CSS variables, typography, utilities, component styles
│
└── utils/
    └── media-metadata.ts # EXIF/media helpers

public/
├── images/              # Site images
├── documents/
│   └── letters/         # PDF support letters
└── media-kit/           # Press/media assets
```

## Content Collections

All collection schemas are defined with Zod validation in `src/content/config.ts`.

### Updates

News, announcements, and project milestones. Add Markdown files to `src/content/updates/`.

```yaml
---
title: "Update Title"
pubDate: 2025-01-15
description: "Brief description"
author: "Author Name"           # optional
authorTitle: "Author Title"     # optional
featuredImage: "https://..."    # optional
featuredImageAlt: "Alt text"    # optional
tags: ["grant", "funding"]
status: "funded"                # planning | funded | engagement | construction | complete
draft: false
---

Article body in Markdown.
```

### Press Coverage

Media coverage entries. Edit `src/content/press/coverage.json`.

```json
{
  "outlet": "Pensacola News Journal",
  "title": "Article title",
  "date": "2025-01-15",
  "link": "https://...",
  "mediaType": "article"
}
```

`mediaType` options: `article`, `radio`, `tv`, `podcast`

### Press Releases

Official releases authored by the organization. Add Markdown files to `src/content/press-releases/`.

### Documents

Planning documents and studies. Edit `src/content/documents/plans.json`.

```json
{
  "title": "Plan name",
  "agency": "Agency name",
  "year": 2024,
  "documentType": "plan",
  "level": "city",
  "file": "/documents/plan.pdf",
  "link": "https://...",
  "description": "Optional description"
}
```

- `documentType`: `plan`, `study`, `policy`, `report`
- `level`: `federal`, `state`, `regional`, `county`, `city`

### Board Members

Board directory. Edit `src/content/board-members/`.

```json
{
  "name": "Person Name",
  "title": "Position Title",
  "role": "chair",
  "bio": "Biography text",
  "photo": "/images/board/person.jpg",
  "order": 1
}
```

`role` options: `chair`, `vice-president`, `treasurer`, `secretary`, `board-member`, `staff`, `emeritus`

### Testimonials

Community quotes. Edit `src/content/testimonials/`.

### Timeline

Project history milestones. Edit `src/content/timeline/`.

### Resources

Corridor landmarks and attractions with map coordinates. Edit `src/content/resources/`.

```json
{
  "name": "Landmark Name",
  "description": "Description text",
  "qualities": ["Cultural", "Historical", "Recreational"],
  "coordinates": { "lat": 30.123, "lng": -87.456 }
}
```

`qualities` options: `Cultural`, `Historical`, `Archaeological`, `Recreational`, `Natural`, `Scenic`

## Site Architecture

### Navigation

- **Desktop**: Fixed header with dropdown menus for About and Progress sections
- **Mobile**: Hamburger toggle with slide-out menu
- **Primary CTA**: "Get Involved" button appears in the header and throughout the site

### Page Hierarchy

| Path | Purpose |
|---|---|
| `/` | Homepage — hero, challenge, solution, CTA |
| `/about` | Mission, values, board, timeline |
| `/about/corridor` | The corridor route and vision |
| `/about/impact` | Community impact data |
| `/about/community-support` | Letters of support |
| `/progress` | Phase tracker and project overview |
| `/progress/planning` | Planning documents by government level |
| `/progress/updates` | News listing |
| `/press` | Media coverage aggregation |
| `/documents/annual-reports` | Annual reports |
| `/support` | Get Involved — email signup (ConvertKit) |

## Design System

### Brand Colors

```css
--forest: #41521F;     /* Primary green — buttons, headers */
--spring: #99CC63;     /* Accent green — highlights, icons */
--navy: #2D3047;       /* Dark text */
--mist: #EFF7FF;       /* Light blue backgrounds */
--water: #C9FBFF;      /* Cyan accent — gradients */
--cream: #F8F6F0;      /* Warm background */
--warm-white: #FDFCFA; /* Near-white background */
```

### Typography

- **Headings**: Fraunces (serif), weights 300–600, line-height 1.2
- **Body**: Source Sans 3 (sans-serif), weights 300–600, line-height 1.7

### Key CSS Utilities

- `.section` / `.section-inner` — standard page sections with max-width 1400px
- `.btn` / `.btn-outline` / `.btn-small` — button variants
- `.page-hero` — page header with gradient background
- Responsive breakpoints at 768px, 900px, and 1024px (mobile-first)

## Key Design Principles

1. **Support as Primary CTA** — "Get Involved" appears consistently across the site
2. **Narrative-first** — stories lead; documentation supports
3. **Thin pages** — pages compose components; components render; collections supply data
4. **Static by default** — JavaScript islands only where interaction is required
5. **Accessibility** — semantic HTML, ARIA labels, skip-to-content link, focus management

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production (includes TypeScript checking)
npm run build

# Preview production build
npm run preview
```

Requires Node 18+.

### Path Aliases

TypeScript path aliases are configured for clean imports:

```
@components/* → src/components/*
@layouts/*    → src/layouts/*
@content/*    → src/content/*
```

## Deployment

The site deploys automatically via Netlify when changes are pushed to `main`.

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Security headers**: X-Content-Type-Options and Referrer-Policy are configured in `netlify.toml`
- **Custom 404**: Unmatched routes redirect to a 404 page

## License

All rights reserved, Bluffline, Inc.
