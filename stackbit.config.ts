import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "18",
  devCommand:
    "node_modules/.bin/astro dev --port {PORT} --hostname 127.0.0.1",
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
