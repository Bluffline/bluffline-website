# The Bluffline Website

The digital home for [The Bluffline](https://thebluffline.org), a 20-mile multimodal corridor connecting Pensacola neighborhoods to the waterfront. The site serves as the primary public hub for project news, planning documents, community support, and civic engagement.

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
│   │                    #   BoardMemberCard, AwardRecipientCard, ProjectCard,
│   │                    #   DocumentCard, TimelineItem, TestimonialCard,
│   │                    #   MilestoneList, MediaPhotoCard, MediaVideoCard,
│   │                    #   MediaAudioItem, EmptyStateCard, IconCard)
│   ├── nav/             # Header (fixed, with dropdowns) and Footer
│   ├── ui/              # Reusable primitives (Button, Logo, PageHero, CallToAction,
│   │                    #   PhaseTracker, MediaLightbox, AnnouncementBanner,
│   │                    #   CorridorMap, Tabs)
│   └── report/          # Annual report components (ReportHero, StatCard, StatGrid,
│                        #   MilestoneCard, PhotoGallery, AwardFeature, BigQuote,
│                        #   EventHighlight, PartnerCard, ProjectSpotlight)
│
├── content/             # Content collections (schemas in config.ts)
│   ├── updates/         # News & milestones (Markdown with frontmatter)
│   ├── press/           # Media coverage (JSON)
│   ├── press-releases/  # Official press releases (Markdown, supports media attachments)
│   ├── board-members/   # Board directory (JSON)
│   ├── defender-award-recipients/ # Bluffline Defender Award honorees (Markdown)
│   ├── documents/       # Planning docs & studies (JSON)
│   ├── testimonials/    # Community quotes (JSON)
│   ├── timeline/        # Project history milestones (JSON)
│   ├── resources/       # Corridor landmarks & attractions (JSON)
│   ├── projects/        # Individual project records with milestones (JSON)
│   └── pages/           # Editable page content (JSON)
│
├── data/                # Static data files for maps and visualizations
│   ├── brand-colors.json # Canonical color palette (drives Brand Kit Colors tab)
│   ├── crash-incidents.json
│   ├── planning-corridor.json
│   └── scenic-highway.json
│
├── layouts/
│   ├── BaseLayout.astro # Master layout (header, footer, meta, fonts, favicon)
│   └── PostLayout.astro # Article/update layout with author and date
│
├── pages/               # File-based routing
│   ├── index.astro                        # Homepage
│   ├── support.astro                      # Get Involved CTA
│   ├── thank-you.astro                    # Post-signup confirmation
│   ├── about/
│   │   ├── index.astro                    # Mission, values, board, timeline (hero image)
│   │   ├── corridor.astro                 # The corridor itself
│   │   ├── impact.astro                   # Community impact (hero image)
│   │   ├── community-support.astro        # Letters of support
│   │   ├── governance/
│   │   │   ├── index.astro                # Board, committees, transparency documents (hero image)
│   │   │   └── corridor-management.astro  # Corridor Management Committee detail
│   │   └── defender-award/
│   │       ├── index.astro                # Bluffline Defender Award recipients listing (hero image)
│   │       └── [slug].astro               # Individual recipient profile
│   ├── progress/
│   │   ├── index.astro                    # Phase overview with tracker (hero image)
│   │   ├── planning.astro                 # Planning documents (hero image)
│   │   ├── projects/
│   │   │   └── [slug].astro               # Individual project detail page
│   │   └── updates/
│   │       ├── index.astro                # Updates listing
│   │       └── [slug].astro               # Individual update
│   ├── press/
│   │   ├── index.astro                    # In the News (press coverage)
│   │   ├── releases.astro                 # Press releases list
│   │   ├── brand-kit.astro                # Brand Kit (logos, colors, type, icons, media)
│   │   └── [slug].astro                   # Individual press release (with media attachments)
│   ├── documents/
│   │   └── annual-reports/
│   │       ├── index.astro                # Reports listing
│   │       └── 2025.astro                 # 2025 annual report
│   └── legal.astro                        # Privacy policy & terms
│
├── styles/
│   └── global.css       # CSS variables, typography, utilities, component styles
│
└── utils/
    └── media-metadata.ts # EXIF/media helpers

public/
├── images/              # Central asset root
│   ├── hero/            # Hero/header images (placeholder until final photos provided)
│   ├── logos/           # Brand logos and favicons (placeholder until provided)
│   ├── photos/          # General photography
│   ├── press/           # Press-specific images
│   ├── video/           # Video assets
│   └── *.jpg/png        # Existing site images (legacy flat structure)
├── documents/
│   └── letters/         # PDF support letters
└── media-kit/           # Press/media downloadable assets
    ├── logos/
    ├── photos/
    ├── videos/
    └── audio/
```

### Asset Organization

Images and media follow a centralized structure under `public/images/` with clear subfolders:

- **`public/images/hero/`** — Hero/header photos for pages. Currently uses `placeholder.svg`; swap in final photos when available.
- **`public/images/logos/`** — Site operational assets: the header logo and favicon files used by `BaseLayout.astro`. Not for press download.
- **`public/images/photos/`** — General high-res photography.
- **`public/images/press/`** — Press release media attachments.
- **`public/images/video/`** — Video assets.
- **`public/media-kit/`** — Downloadable Brand Kit assets organized by type. Scanned at build time for the Brand Kit tab. Drop logo variants (color, reverse, etc.) in `logos/`; photos in `photos/`; icon SVGs in `icons/`; and so on. Keep separate from `public/images/` — these are curated for journalists, partners and designers, not site operations. Any media attached to press releases is also surfaced in the Brand Kit automatically.

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

Press releases support optional media attachments that are displayed on the release page and automatically propagated to the Brand Kit asset library:

```yaml
---
title: "Release Title"
pubDate: 2025-01-15
summary: "Brief summary"
contactName: "Media Relations"
contactEmail: press@thebluffline.org
contactPhone: "(850) 776-0436"
media:
  - src: "/images/press/photo.jpg"
    alt: "Description"
    caption: "Photo caption"
    credit: "Photographer name"
    type: image   # image | video
draft: false
---
```

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
  "firstName": "Person",
  "lastName": "Name",
  "suffix": "PE, PMP",
  "title": "Position Title",
  "role": "chair",
  "bio": "Biography text",
  "photo": "/images/board/person.jpg",
  "archived": false
}
```

`role` options: `chair`, `vice-president`, `treasurer`, `secretary`, `board-member`, `staff`, `emeritus`

The display name is `firstName` + `lastName`, with the optional `suffix` (credentials such as `PE, PMP` or `MD`) appended after a comma. Members are listed alphabetically by `lastName`, so put compound surnames (e.g. `Fisher Hobbs`) in `lastName` to control where a member files. Set `"archived": true` to hide a member from the directory.

### Defender Award Recipients

Annual honorees of the Bluffline Defender Award, established in 2025 to recognize individuals who have made exceptional contributions to the vision of a connected Pensacola waterfront. Add Markdown files to `src/content/defender-award-recipients/` (filename convention: `<year>-<name>.md`).

```yaml
---
name: "Recipient Name"
title: "Title / Affiliation"
year: 2025
photo: "/images/events/recipient-photo.jpg"   # optional
summary: "One-sentence summary used for the page's meta description."
awardObjectDescription: "Description of the physical award, if any."  # optional
draft: false
---

Full recipient story in Markdown, rendered on the individual profile page.
```

Recipients appear on `/about/defender-award` (full list, newest first) with individual pages at `/about/defender-award/[slug]`. The About page (`/about`) also features the 3 most recent recipients, with a "See all recipients" link that only appears once the full list grows beyond that.

### Projects

Individual infrastructure/planning projects with milestones, used for the Progress page and individual project detail pages. Edit `src/content/projects/`.

```json
{
  "title": "Project Title",
  "shortTitle": "Short Title",
  "status": "active",
  "funder": "Funder name or [\"Funder A\", \"Funder B\"]",
  "partners": ["Partner A", "Partner B"],
  "program": "Program name",
  "amount": "$1.2M",
  "awardDate": "2024-12-01",
  "description": "Full project description",
  "featuredImage": "/images/...",
  "milestones": [
    { "title": "Milestone", "description": "...", "date": "2025-01-01", "status": "complete" }
  ],
  "relatedLinks": [{ "label": "Link label", "href": "https://..." }],
  "draft": false
}
```

`status` options: `active`, `pending`, `complete`, `pursuing`. Each non-draft project gets a detail page at `/progress/projects/[slug]`.

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

## Brand Kit

The Press section is three pages sharing `src/layouts/PressLayout.astro` (hero, section links, call to action): `/press` for coverage, `/press/releases` for press releases, and `/press/brand-kit` for the Brand Kit. The section links in `src/components/press/PressNav.astro` are real links, so each section has its own URL, title and history entry. Old hash links (`/press#releases`, `/press#brand-kit`, `/press#media-kit`) redirect to the new pages.

The Brand Kit page holds the boilerplate, the media contact, and an asset library with the following tabs (in-page tabs; each writes a hash, so `/press/brand-kit#typography` deep-links and Back/Forward step through them):

| Tab | Content |
|---|---|
| Logos | Logo variants from `public/media-kit/logos/` (separate from site operational logos in `public/images/logos/`) plus clear-space, minimum-size and misuse rules |
| Colors | Brand color swatches with hex/RGB values and usage notes |
| Typography | Fraunces and Source Sans 3 samples, weights in use, the type scale, the Google Fonts embed snippet, and download links |
| Icons | The icon set from `public/media-kit/icons/` (Lucide, ISC) with per-icon SVG download and the stroke/size specification |
| Photos | Web-sized photos from `public/media-kit/photos/`, photos already used across the site (curated in `src/data/media-kit-photos.json`), and press release attachments |
| Videos | Video files from `public/media-kit/videos/` + press release video attachments |
| Audio | Audio files from `public/media-kit/audio/` |

The internal Brand Kit PDF (not published; kept in Drive) is the source for the usage rules shown on the Logos, Typography and Icons tabs. When it is revised, update those notes in `src/pages/press/brand-kit.astro`. Do not commit the PDF to `public/`.

### Colors

The Colors tab is driven by a single canonical data file at `src/data/brand-colors.json`. This file defines each brand color with its name, CSS variable, hex value, RGB value, and usage notes. The Brand Kit page reads this file at build time to render visible swatches. To update brand colors, edit `brand-colors.json` and the corresponding CSS variables in `src/styles/global.css`.

### Typography

Fonts load from Google Fonts in `src/layouts/BaseLayout.astro`. The Typography tab's samples use those same loaded fonts, and its embed snippet, weights and type scale are defined at the top of `src/pages/press/brand-kit.astro`; keep them in step with the layout and the guidelines PDF. Font files are not hosted here; the tab links to Google Fonts for download (SIL Open Font License).

### Icons

Every `.svg` in `public/media-kit/icons/` appears on the Icons tab with a download link, previewed inline. The files are unmodified Lucide icons (`LICENSE.txt` in the same folder). To add one, copy it from https://lucide.dev or the `lucide-static` npm package into the folder; the filename becomes its label.

### Photos

The Photos tab is assembled from three sources, deduplicated by path:

1. **`public/media-kit/photos/`** — every image file in the folder, with title/caption/credit/date read from embedded EXIF/IPTC at build time.
2. **Site photos** — photos already used on other pages (heroes, updates, the annual report) listed in `src/data/media-kit-photos.json`. Each entry names the `src` under `/images/` plus a `title`, `description`, `credit`, and optional `date`; dimensions, format and file size come from the file itself. Entries whose `src` is under `/media-kit/photos/` instead act as overrides for files in that folder, so captions can be fixed without re-encoding images.
3. **Press release attachments** (see Asset Propagation below).

#### Adding photos from a Drive folder

Originals stay in Google Drive (the source of truth). Only web-sized JPEGs are committed. Download a Drive folder locally, then run the import script, which resizes to a 2400px longest edge, re-encodes with mozjpeg, bakes in orientation, keeps the original EXIF (camera date, colour profile), and writes credit/caption/date into EXIF so the Brand Kit displays them:

```bash
npm run import:photos -- ~/Downloads/Knox\ White\ Event --prefix knox-white-event-2025 \
  --credit "Photographer Name" --date 2025-02-06 \
  --description "Mayor Knox White of Greenville, S.C., speaks at Bluffline's Greenways as Economic Catalysts event, Pensacola Opera Center."
```

Add `--dry-run` to preview output names and dimensions first, `--max`/`--quality` to change the target size (defaults 2400px / 85), and `--force` to overwrite. Files are numbered `<prefix>-01.jpg`, `<prefix>-02.jpg`, …; re-running on the same folder skips files that already exist, and `--append` continues the numbering when importing a second batch under the same prefix. Typical output is 300 KB–1 MB per photo versus 10–50 MB originals. Skip folders whose images Bluffline does not own (e.g. historical society photos) unless the credit line and usage terms are settled.

### Asset Propagation

Media files attached to press releases (via the `media` frontmatter field) are automatically included in the Brand Kit's Photos and Videos tabs. This ensures the asset library stays current without manual duplication.

## Site Architecture

### Navigation

- **Desktop**: Fixed header with dropdown menus for About and Progress sections
- **Mobile**: Hamburger toggle with slide-out menu
- **Primary CTA**: "Get Involved" button appears in the header and throughout the site

### Hero Images

Pages support optional hero images via the `PageHero` component's `heroImage` prop. Current pages with hero images (using placeholder until final photos are provided):

- About (`/about`)
- Impact (`/about/impact`)
- Governance (`/about/governance`)
- Bluffline Defender Award (`/about/defender-award`)
- Progress (`/progress`)
- Planning (`/progress/planning`)

To swap in final photos, replace `/images/hero/placeholder.svg` with the actual image files and update the `heroImage` prop on each page.

### Favicon

Favicon links are configured in `BaseLayout.astro` pointing to `public/images/logos/`. Drop in the following files when logo assets are provided:
- `favicon.svg` (currently a placeholder)
- `favicon-32x32.png`
- `favicon-16x16.png`
- `apple-touch-icon.png`

### Page Hierarchy

| Path | Purpose |
|---|---|
| `/` | Homepage — hero, challenge, solution, CTA |
| `/about` | Purpose, values, history, merger, governance, friends, recent Defender Award recipients |
| `/about/corridor` | The corridor route and vision |
| `/about/impact` | Community impact data |
| `/about/community-support` | Letters of support |
| `/about/governance` | Board, committees, organizational transparency documents |
| `/about/defender-award` | Full list of Bluffline Defender Award recipients |
| `/progress` | Phase tracker and project overview |
| `/progress/planning` | Planning documents by government level |
| `/progress/projects/[slug]` | Individual project detail pages |
| `/progress/updates` | News listing |
| `/press` | Media coverage, press releases, media kit (with color palette) |
| `/documents/annual-reports` | Annual reports |
| `/support` | Get Involved — email signup (ConvertKit) |
| `/legal` | Privacy policy and terms of use |

## Design System

### Brand Colors

Defined in `src/styles/global.css` and documented in `src/data/brand-colors.json`:

```css
--forest: #41521F;     /* Primary green — buttons, headers */
--spring: #99CC63;     /* Accent green — highlights, icons */
--navy: #2D3047;       /* Dark text */
--mist: #DFEAF6;       /* Light blue section background */
--water: #C9FBFF;      /* Cyan accent — gradients */
--cream: #F2ECDF;      /* Warm section background */
--warm-white: #FDFCFA; /* Page background */
```

`--mist` and `--cream` are deliberately a few shades deeper than near-white so that adjacent page sections stay visually distinct on low-contrast displays.

### Surface Rules

Every card component shares one surface, defined in `global.css` and consumed via `var(--card-bg)`, `var(--card-border)`, `var(--card-shadow)`, and `var(--card-shadow-hover)`. Tune card contrast there, not per component.

When sequencing sections on a page:

1. Alternate `--warm-white` with one of the two tints (or a dark `--navy`/`--forest` band). Never place two near-whites or two of the same tint side by side.
2. Card grids sit on a tinted section (`--mist` or `--cream`), never on `--warm-white` — the card's white fill is what provides the contrast, not its border.

`npm run audit:surfaces` checks every page against both rules and fails on violations; run it after adding or reordering sections.

### Typography

- **Headings**: Fraunces (serif), weights 300–600, line-height 1.2
- **Body**: Source Sans 3 (sans-serif), weights 300–600, line-height 1.7

### Key CSS Utilities

- `.section` / `.section-inner` — standard page sections with max-width 1400px
- `.btn` / `.btn-outline` / `.btn-small` — button variants
- `.page-hero` — page header with gradient background (supports optional hero image)
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
