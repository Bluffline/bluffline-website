import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "18",
  devCommand:
    "node_modules/.bin/astro dev --port {PORT} --hostname 0.0.0.0",
  experimental: {
    ssg: {
      name: "Astro",
      logPatterns: {
        up: ["is ready", "astro"],
      },
      directRoutes: {
        "socket.io": "socket.io",
      },
      passthrough: ["/vite-hmr/**"],
    },
  },
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: [
        "src/content/updates",
        "src/content/press-releases",
        "src/content/press",
        "src/content/board-members",
        "src/content/documents",
        "src/content/testimonials",
        "src/content/timeline",
        "src/content/resources",
        "src/content/pages",
      ],
      models: [
        // ── Updates (Markdown with frontmatter) ──
        {
          name: "Update",
          type: "page",
          urlPath: "/progress/updates/{slug}",
          filePath: "src/content/updates/{slug}.md",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "pubDate", type: "date", required: true },
            { name: "description", type: "string", required: true },
            { name: "author", type: "string" },
            { name: "authorTitle", type: "string" },
            { name: "featuredImage", type: "image" },
            { name: "featuredImageAlt", type: "string" },
            {
              name: "tags",
              type: "list",
              items: { type: "string" },
            },
            {
              name: "status",
              type: "enum",
              options: [
                "planning",
                "funded",
                "engagement",
                "construction",
                "complete",
              ],
            },
            { name: "draft", type: "boolean", default: false },
            { name: "body", type: "markdown", required: false },
          ],
        },

        // ── Press Releases (Markdown with frontmatter) ──
        {
          name: "PressRelease",
          type: "page",
          urlPath: "/press/{slug}",
          filePath: "src/content/press-releases/{slug}.md",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "pubDate", type: "date", required: true },
            { name: "summary", type: "string", required: true },
            { name: "contactName", type: "string" },
            { name: "contactEmail", type: "string" },
            { name: "contactPhone", type: "string" },
            { name: "draft", type: "boolean", default: false },
            { name: "body", type: "markdown", required: false },
          ],
        },

        // ── Press Coverage (JSON data) ──
        {
          name: "Press",
          type: "data",
          filePath: "src/content/press/{slug}.json",
          fields: [
            { name: "outlet", type: "string", required: true },
            { name: "title", type: "string", required: true },
            { name: "date", type: "date", required: true },
            { name: "link", type: "url", required: true },
            {
              name: "mediaType",
              type: "enum",
              options: ["article", "radio", "tv", "podcast"],
              default: "article",
            },
          ],
        },

        // ── Board Members (JSON data) ──
        {
          name: "BoardMember",
          type: "data",
          filePath: "src/content/board-members/{slug}.json",
          fields: [
            { name: "name", type: "string", required: true },
            { name: "title", type: "string", required: true },
            {
              name: "role",
              type: "enum",
              options: [
                "chair",
                "vice-president",
                "treasurer",
                "secretary",
                "board-member",
                "staff",
                "emeritus",
              ],
              required: true,
            },
            { name: "bio", type: "text", required: true },
            { name: "photo", type: "image" },
            { name: "order", type: "number", required: true },
          ],
        },

        // ── Documents (JSON data) ──
        {
          name: "Document",
          type: "data",
          filePath: "src/content/documents/{slug}.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "agency", type: "string", required: true },
            { name: "year", type: "number", required: true },
            {
              name: "documentType",
              type: "enum",
              options: ["plan", "study", "policy", "report"],
              required: true,
            },
            { name: "file", type: "string" },
            { name: "link", type: "url" },
            {
              name: "level",
              type: "enum",
              options: [
                "federal",
                "state",
                "regional",
                "county",
                "city",
              ],
            },
            { name: "description", type: "text" },
          ],
        },

        // ── Testimonials (JSON data) ──
        {
          name: "Testimonial",
          type: "data",
          filePath: "src/content/testimonials/{slug}.json",
          fields: [
            { name: "quote", type: "text", required: true },
            { name: "author", type: "string", required: true },
            { name: "title", type: "string", required: true },
            { name: "organization", type: "string", required: true },
            { name: "date", type: "date" },
            { name: "pdfFile", type: "string", required: true },
            { name: "order", type: "number" },
          ],
        },

        // ── Timeline (JSON data) ──
        {
          name: "TimelineEntry",
          type: "data",
          filePath: "src/content/timeline/{slug}.json",
          fields: [
            { name: "date", type: "string", required: true },
            { name: "title", type: "string", required: true },
            { name: "description", type: "text", required: true },
            { name: "order", type: "number", required: true },
            {
              name: "images",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "src", type: "image", required: true },
                  { name: "alt", type: "string", required: true },
                  { name: "caption", type: "string" },
                  { name: "credit", type: "string" },
                ],
              },
            },
          ],
        },

        // ── Resources (JSON data) ──
        {
          name: "Resource",
          type: "data",
          filePath: "src/content/resources/{slug}.json",
          fields: [
            { name: "name", type: "string", required: true },
            { name: "description", type: "text", required: true },
            {
              name: "qualities",
              type: "list",
              items: {
                type: "enum",
                options: [
                  "Cultural",
                  "Historical",
                  "Archaeological",
                  "Recreational",
                  "Natural",
                  "Scenic",
                ],
              },
              required: true,
            },
            {
              name: "coordinates",
              type: "object",
              fields: [
                { name: "lat", type: "number", required: true },
                { name: "lng", type: "number", required: true },
              ],
            },
          ],
        },

        // ── Page Content (JSON data for static pages) ──

        // Homepage
        {
          name: "HomePage",
          type: "page",
          urlPath: "/",
          filePath: "src/content/pages/home.json",
          fields: [
            { name: "heroTitle", type: "string", required: true },
            { name: "heroSubtitle", type: "string", required: true },
            { name: "heroImage", type: "image" },
            { name: "heroImageAlt", type: "string" },
            { name: "heroPrimaryLabel", type: "string" },
            { name: "heroPrimaryHref", type: "string" },
            { name: "heroSecondaryLabel", type: "string" },
            { name: "heroSecondaryHref", type: "string" },
            { name: "aboutLabel", type: "string" },
            { name: "aboutHeading", type: "string", required: true },
            { name: "aboutBody", type: "text", required: true },
            { name: "aboutImage", type: "image" },
            { name: "aboutImageAlt", type: "string" },
            { name: "aboutLinkText", type: "string" },
            { name: "aboutLinkHref", type: "string" },
            { name: "challengeLabel", type: "string" },
            { name: "challengeHeading", type: "string", required: true },
            { name: "challengeBody", type: "text", required: true },
            { name: "challengeImage", type: "image" },
            { name: "challengeImageAlt", type: "string" },
            {
              name: "challengeStats",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "value", type: "string", required: true },
                  { name: "description", type: "string", required: true },
                ],
              },
            },
            { name: "challengeLinkText", type: "string" },
            { name: "challengeLinkHref", type: "string" },
            { name: "solutionLabel", type: "string" },
            { name: "solutionHeading", type: "string", required: true },
            { name: "solutionBody", type: "text", required: true },
            { name: "solutionMapImage", type: "image" },
            { name: "solutionMapImageAlt", type: "string" },
            {
              name: "solutionComponents",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "title", type: "string", required: true },
                  { name: "description", type: "text", required: true },
                  { name: "iconKey", type: "string" },
                ],
              },
            },
            { name: "solutionLinkText", type: "string" },
            { name: "solutionLinkHref", type: "string" },
            { name: "ctaHeading", type: "string", required: true },
            { name: "ctaBody", type: "text", required: true },
            { name: "ctaPrimaryLabel", type: "string" },
            { name: "ctaPrimaryHref", type: "string" },
          ],
        },

        // About Page
        {
          name: "AboutPage",
          type: "page",
          urlPath: "/about",
          filePath: "src/content/pages/about.json",
          fields: [
            { name: "heroLabel", type: "string" },
            { name: "heroTitle", type: "string", required: true },
            { name: "heroDescription", type: "text" },
            { name: "purposeStatement", type: "text", required: true },
            { name: "purposeBody", type: "text", required: true },
            { name: "historyHeading", type: "string", required: true },
            { name: "historyDescription", type: "text" },
            { name: "mergerHeading", type: "string", required: true },
            { name: "mergerBody", type: "text", required: true },
            { name: "mergerHighlightTitle", type: "string" },
            {
              name: "mergerStats",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "value", type: "string", required: true },
                  { name: "label", type: "string", required: true },
                ],
              },
            },
            { name: "valuesHeading", type: "string" },
            { name: "valuesDescription", type: "text" },
            { name: "leadershipHeading", type: "string" },
            { name: "leadershipDescription", type: "text" },
            { name: "emeritusHeading", type: "string" },
            { name: "emeritusDescription", type: "text" },
            { name: "documentsHeading", type: "string" },
            { name: "documentsDescription", type: "text" },
            { name: "ctaTitle", type: "string" },
            { name: "ctaDescription", type: "text" },
            { name: "ctaPrimaryLabel", type: "string" },
            { name: "ctaPrimaryHref", type: "string" },
          ],
        },

        // Progress Page
        {
          name: "ProgressPage",
          type: "page",
          urlPath: "/progress",
          filePath: "src/content/pages/progress.json",
          fields: [
            { name: "heroLabel", type: "string" },
            { name: "heroTitle", type: "string", required: true },
            { name: "heroDescription", type: "text" },
            { name: "grantHeading", type: "string", required: true },
            { name: "grantBody", type: "text", required: true },
            { name: "grantAmount", type: "string" },
            { name: "grantAmountLabel", type: "string" },
            { name: "milestonesHeading", type: "string" },
            { name: "updatesHeading", type: "string" },
            { name: "ctaTitle", type: "string" },
            { name: "ctaDescription", type: "text" },
            { name: "ctaPrimaryLabel", type: "string" },
          ],
        },

        // Support Page
        {
          name: "SupportPage",
          type: "page",
          urlPath: "/support",
          filePath: "src/content/pages/support.json",
          fields: [
            { name: "heroLabel", type: "string" },
            { name: "heroTitle", type: "string", required: true },
            { name: "heroDescription", type: "text" },
            { name: "membershipHeading", type: "string", required: true },
            { name: "membershipDescription", type: "text" },
            { name: "taxNote", type: "string" },
            { name: "memberPortalText", type: "string" },
            { name: "memberPortalLinkText", type: "string" },
            { name: "memberPortalHref", type: "string" },
            { name: "otherWaysHeading", type: "string" },
            { name: "otherWaysDescription", type: "text" },
          ],
        },

        // Planning Page
        {
          name: "PlanningPage",
          type: "page",
          urlPath: "/progress/planning",
          filePath: "src/content/pages/planning.json",
          fields: [
            { name: "heroLabel", type: "string" },
            { name: "heroTitle", type: "string", required: true },
            { name: "heroDescription", type: "text" },
            { name: "introBody", type: "text", required: true },
            { name: "plansHeading", type: "string" },
            { name: "ctaTitle", type: "string" },
            { name: "ctaDescription", type: "text" },
            { name: "ctaPrimaryLabel", type: "string" },
            { name: "ctaPrimaryHref", type: "string" },
          ],
        },

        // Press Page
        {
          name: "PressPage",
          type: "page",
          urlPath: "/press",
          filePath: "src/content/pages/press.json",
          fields: [
            { name: "heroLabel", type: "string" },
            { name: "heroTitle", type: "string", required: true },
            { name: "heroDescription", type: "text" },
            { name: "boilerplate", type: "text", required: true },
            { name: "mediaContactEmail", type: "string" },
            { name: "ctaTitle", type: "string" },
            { name: "ctaDescription", type: "text" },
            { name: "ctaPrimaryLabel", type: "string" },
            { name: "ctaPrimaryHref", type: "string" },
          ],
        },

        // Community Support Page
        {
          name: "CommunitySupportPage",
          type: "page",
          urlPath: "/about/community-support",
          filePath: "src/content/pages/community-support.json",
          fields: [
            { name: "heroLabel", type: "string" },
            { name: "heroTitle", type: "string", required: true },
            { name: "heroDescription", type: "text" },
            { name: "testimonialsHeading", type: "string" },
            { name: "testimonialsDescription", type: "text" },
            { name: "ctaTitle", type: "string" },
            { name: "ctaDescription", type: "text" },
            { name: "ctaPrimaryLabel", type: "string" },
            { name: "ctaPrimaryHref", type: "string" },
          ],
        },

        // Corridor Page
        {
          name: "CorridorPage",
          type: "page",
          urlPath: "/about/corridor",
          filePath: "src/content/pages/corridor.json",
          fields: [
            { name: "heroLabel", type: "string" },
            { name: "heroTitle", type: "string", required: true },
            { name: "heroDescription", type: "text" },
            { name: "overviewHeading", type: "string", required: true },
            { name: "overviewBody", type: "text", required: true },
            { name: "sidebarTitle", type: "string" },
            {
              name: "sidebarStats",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "label", type: "string", required: true },
                  { name: "value", type: "string", required: true },
                ],
              },
            },
            { name: "greenwayHeading", type: "string", required: true },
            { name: "greenwayBody", type: "text", required: true },
            { name: "resourcesHeading", type: "string" },
            { name: "resourcesDescription", type: "text" },
            { name: "ctaTitle", type: "string" },
            { name: "ctaDescription", type: "text" },
            { name: "ctaPrimaryLabel", type: "string" },
            { name: "ctaPrimaryHref", type: "string" },
          ],
        },

        // Impact Page
        {
          name: "ImpactPage",
          type: "page",
          urlPath: "/about/impact",
          filePath: "src/content/pages/impact.json",
          fields: [
            { name: "heroLabel", type: "string" },
            { name: "heroTitle", type: "string", required: true },
            { name: "heroDescription", type: "text" },
            { name: "safetyLabel", type: "string" },
            { name: "safetyHeading", type: "string", required: true },
            { name: "safetyBody", type: "text", required: true },
            {
              name: "safetyStats",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "value", type: "string", required: true },
                  { name: "description", type: "string", required: true },
                  { name: "sourceUrl", type: "url" },
                  { name: "sourceLabel", type: "string" },
                ],
              },
            },
            { name: "mapCaption", type: "text" },
            { name: "mapSourceText", type: "string" },
            { name: "mapSourceUrl", type: "url" },
            { name: "mapSourceAgency", type: "string" },
            { name: "contextProblemHeading", type: "string" },
            { name: "contextProblemBody", type: "text" },
            { name: "contextSolutionHeading", type: "string" },
            { name: "contextSolutionBody", type: "text" },
            { name: "economicLabel", type: "string" },
            { name: "economicHeading", type: "string", required: true },
            { name: "economicBody", type: "text", required: true },
            {
              name: "researchHighlights",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "value", type: "string", required: true },
                  { name: "description", type: "string", required: true },
                  { name: "sourceUrl", type: "url" },
                  { name: "sourceLabel", type: "string" },
                ],
              },
            },
            {
              name: "pillarCards",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "title", type: "string", required: true },
                  { name: "description", type: "text", required: true },
                  { name: "iconKey", type: "string" },
                  { name: "detail", type: "text" },
                  {
                    name: "stats",
                    type: "list",
                    items: {
                      type: "object",
                      fields: [
                        { name: "value", type: "string", required: true },
                        { name: "label", type: "string", required: true },
                        { name: "sourceUrl", type: "url" },
                        { name: "sourceLabel", type: "string" },
                      ],
                    },
                  },
                ],
              },
            },
            { name: "evidenceHeading", type: "string" },
            { name: "evidenceBody", type: "text" },
            {
              name: "evidenceCards",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "title", type: "string", required: true },
                  { name: "location", type: "string", required: true },
                  { name: "sourceUrl", type: "url" },
                  { name: "sourceLabel", type: "string" },
                  {
                    name: "stats",
                    type: "list",
                    items: {
                      type: "object",
                      fields: [
                        { name: "value", type: "string", required: true },
                        { name: "description", type: "string", required: true },
                      ],
                    },
                  },
                ],
              },
            },
            { name: "qualityLabel", type: "string" },
            { name: "qualityHeading", type: "string" },
            { name: "qualityBody", type: "text" },
            {
              name: "qualityCards",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "title", type: "string", required: true },
                  { name: "description", type: "text", required: true },
                  { name: "iconKey", type: "string" },
                  { name: "sourceUrl", type: "url" },
                  { name: "sourceLabel", type: "string" },
                ],
              },
            },
            { name: "ctaTitle", type: "string" },
            { name: "ctaDescription", type: "text" },
            { name: "ctaPrimaryLabel", type: "string" },
            { name: "ctaPrimaryHref", type: "string" },
            { name: "ctaSecondaryLabel", type: "string" },
            { name: "ctaSecondaryHref", type: "string" },
          ],
        },
      ],
      assetsConfig: {
        referenceType: "static",
        staticDir: "public",
        uploadDir: "images",
        publicPath: "/",
      },
    }),
  ],
});
