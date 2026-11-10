import { z } from "astro/zod";

export const workSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  creator: z.string().min(1),
  creatorTransliteration: z.string().optional(),
  cover: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const collectionSchema = z.object({
  id: z.string().min(1),
  workId: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["poem", "song", "inscription", "quote"]),
  sortOrder: z.number().int().default(0),
});

export const textVersionSchema = z.object({
  id: z.string().min(1),
  textEntryId: z.string().min(1),
  language: z.string().min(2),
  label: z.string().optional(),
  content: z.string(),
  kind: z.enum(["original", "official_translation", "own_translation"]),
  translator: z.string().optional(),
  source: z.string().optional(),
  transliteration: z.string().optional(),
  notes: z.string().optional(),
});

export const textEntrySchema = z.object({
  id: z.string().min(1),
  collectionId: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  creator: z.string().optional(),
  creatorTransliteration: z.string().optional(),
  character: z.string().optional(),
  characterTransliteration: z.string().optional(),
  volume: z.number().int().optional(),
  source: z.string().optional(),
  publicationDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

/** A text file embeds its versions; textEntryId is inferred from the file. */
export const textFileSchema = textEntrySchema.extend({
  versions: z.array(textVersionSchema.omit({ textEntryId: true })).min(1),
});

export type Work = z.infer<typeof workSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type TextEntry = z.infer<typeof textEntrySchema>;
export type TextVersion = z.infer<typeof textVersionSchema>;
export type TextFile = z.infer<typeof textFileSchema>;
