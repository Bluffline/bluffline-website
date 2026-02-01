import { z, defineCollection } from 'astro:content';

const updatesCollection = defineCollection({
  type: 'content',
  schema: z.object({
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
    outlet: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    link: z.string().url(),
    type: z.enum(['article', 'radio', 'tv', 'podcast']).default('article'),
  }),
});

const documentsCollection = defineCollection({
  type: 'data',
  schema: z.object({
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

export const collections = {
  'updates': updatesCollection,
  'press': pressCollection,
  'documents': documentsCollection,
};
