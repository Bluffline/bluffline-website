# The Bluffline Website

An Astro-powered website for The Bluffline, a 20-mile multimodal corridor connecting Pensacola neighborhoods to the waterfront.

## Tech Stack

- **Framework**: [Astro](https://astro.build) (Static-first)
- **Content**: Markdown/MDX with Astro Content Collections
- **Deployment**: [Netlify](https://netlify.com)
- **Version Control**: GitHub

## Project Structure

```
src/
├── components/
│   ├── layout/          # Base layouts
│   ├── nav/             # Header, Footer, navigation
│   ├── ui/              # Reusable UI components (Button, PageHero, etc.)
│   └── content/         # Content-specific components (UpdateCard, PressCard)
├── content/
│   ├── updates/         # News and progress updates (Markdown)
│   ├── press/           # Press coverage (JSON)
│   └── documents/       # Planning documents (JSON)
├── layouts/
│   ├── BaseLayout.astro # Main site layout
│   └── PostLayout.astro # Article/update layout
├── pages/
│   ├── index.astro
│   ├── about/
│   ├── progress/
│   ├── press.astro
│   └── support.astro
├── styles/
│   └── global.css       # Global styles and CSS variables
public/
├── images/
└── pdfs/
```

## Content Collections

### Updates
News, announcements, and project milestones. Add Markdown files to `src/content/updates/`.

```yaml
---
title: "Update Title"
pubDate: 2025-01-15
description: "Brief description"
author: "Author Name"
authorTitle: "Author Title"
featuredImage: "https://..."
tags: ["grant", "funding"]
status: "funded"  # planning | funded | engagement | construction | complete
draft: false
---
```

### Press
Media coverage entries. Edit `src/content/press/coverage.json`.

### Documents
Planning documents and studies. Edit `src/content/documents/plans.json`.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Design Principles

1. **Support as Primary CTA**: "Get Involved" appears consistently across the site
2. **Narrative-first**: Stories lead; documentation supports
3. **Thin Pages**: Pages compose components; components render; collections supply data
4. **Static by Default**: JavaScript islands only where interaction is required

## Deployment

The site deploys automatically via Netlify when changes are pushed to `main`.

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

## Brand Colors

```css
--forest: #41521F;    /* Primary green */
--spring: #99CC63;    /* Accent green */
--navy: #2D3047;      /* Text color */
--mist: #EFF7FF;      /* Light blue */
--water: #C9FBFF;     /* Cyan accent */
--cream: #F8F6F0;     /* Background */
--warm-white: #FDFCFA; /* White */
```

## Adding Content

### New Update
1. Create `src/content/updates/your-slug.md`
2. Add frontmatter with required fields
3. Write content in Markdown
4. Commit and push

### New Press Coverage
1. Edit `src/content/press/coverage.json`
2. Add entry with outlet, title, date, link, type
3. Commit and push

## License

© 2025 Bluffline, Inc. All rights reserved.
