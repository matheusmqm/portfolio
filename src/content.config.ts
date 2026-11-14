import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const bi = z.object({ pt: z.string(), en: z.string() });
const tag = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'hashtag em minúsculas, sem espaços');

// Tudo opcional, exceto name e year. O build falha se um campo estiver inválido.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/projects' }),
  schema: z.object({
    name: z.string(),
    year: z.number().int(),
    status: bi.optional(),
    summary: bi.optional(),
    context: bi.optional(),
    did: z.array(bi).optional(),
    tags: z.array(tag).default([]),
    links: z.object({ repo: z.string().url().optional(), demo: z.string().url().optional() }).default({}),
    images: z.array(z.object({ src: z.string(), alt: bi, caption: bi.optional() })).default([]),
  }),
});

export const collections = { projects };
