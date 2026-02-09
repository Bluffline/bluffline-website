import { z, defineCollection } from 'astro:content';

const updatesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    type: z.string().optional(),
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string().optional(),
    authorTitle: z.string().optional(),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['planning', 'funded', 'engagement', 'construction', 'complete']).optional(),
    draft: z.boolean().default(false),
  }),
});

const pressCollection = defineCollection({
  type: 'data',
  schema: z.object({
    type: z.string().optional(),
    outlet: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    link: z.string().url(),
    mediaType: z.enum(['article', 'radio', 'tv', 'podcast']).default('article'),
  }),
});

const documentsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    type: z.string().optional(),
    title: z.string(),
    agency: z.string(),
    year: z.number(),
    documentType: z.enum(['plan', 'study', 'policy', 'report']),
    file: z.string().optional(),
    link: z.string().url().optional(),
    level: z.enum(['federal', 'state', 'regional', 'county', 'city']).optional(),
    description: z.string().optional(),
  }),
});

const resourcesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    type: z.string().optional(),
    name: z.string(),
    description: z.string(),
    qualities: z.array(z.enum(['Cultural', 'Historical', 'Archaeological', 'Recreational', 'Natural', 'Scenic'])),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
});

const pressReleasesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    type: z.string().optional(),
    title: z.string(),
    pubDate: z.date(),
    summary: z.string(),
    contactName: z.string().optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const boardMembersCollection = defineCollection({
  type: 'data',
  schema: z.object({
    type: z.string().optional(),
    name: z.string(),
    title: z.string(),
    role: z.enum(['chair', 'vice-president', 'treasurer', 'secretary', 'board-member', 'staff', 'emeritus']),
    bio: z.string(),
    photo: z.string().optional(),
    order: z.number(),
  }),
});

const timelineCollection = defineCollection({
  type: 'data',
  schema: z.object({
    type: z.string().optional(),
    date: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.number(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
      credit: z.string().optional(),
    })).optional(),
  }),
});

const testimonialsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    type: z.string().optional(),
    quote: z.string(),
    author: z.string(),
    title: z.string(),
    organization: z.string(),
    date: z.coerce.date().optional(),
    pdfFile: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  'updates': updatesCollection,
  'press': pressCollection,
  'documents': documentsCollection,
  'resources': resourcesCollection,
  'press-releases': pressReleasesCollection,
  'board-members': boardMembersCollection,
  'timeline': timelineCollection,
  'testimonials': testimonialsCollection,
};
