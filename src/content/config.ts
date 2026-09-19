import { defineCollection, z } from 'astro:content';

// Services: dane, hypotéka, životné poistenie, general consulting.
const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    keywords: z.array(z.string()),
    order: z.number().default(0),
  }),
});

// Towns for service × town local landing pages (central Slovakia).
const towns = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),      // e.g. "Banská Bystrica"
    region: z.string(),    // e.g. "Banskobystrický kraj"
    local: z.string(),     // genuinely local content — NOT a name-swap template
  }),
});

// Blog: seasonal, local, opinionated posts (tax season, mortgage rates, year-end reviews).
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    author: z.string(),    // real, named author (E-E-A-T)
  }),
});

// Blog content collection (public-facing, with draft/tag/service metadata).
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    service: z.enum(['dane', 'hypoteky', 'poistenie', 'financie', 'uctovnictvo', 'vseobecne']).optional(),
  }),
});

export const collections = { services, towns, posts, blog };
