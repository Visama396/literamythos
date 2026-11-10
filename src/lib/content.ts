import {
  collectionSchema,
  textFileSchema,
  workSchema,
  type Collection,
  type TextEntry,
  type TextVersion,
  type Work,
} from "@/content/schemas";
import { languageName } from "@/lib/language";

export { kindLabel, languageName } from "@/lib/language";

const workModules = import.meta.glob("../content/works/*/work.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

const collectionModules = import.meta.glob("../content/works/*/collections/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

const textModules = import.meta.glob("../content/works/*/texts/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

function parseFile<T>(schema: { parse: (value: unknown) => T }, path: string, value: unknown): T {
  try {
    return schema.parse(value);
  } catch (error) {
    throw new Error(`Contenido inválido en ${path}: ${(error as Error).message}`);
  }
}

export const works: Work[] = Object.entries(workModules)
  .map(([path, value]) => parseFile(workSchema, path, value))
  .sort((a, b) => a.title.localeCompare(b.title, "es"));

export const collections: Collection[] = Object.entries(collectionModules)
  .map(([path, value]) => parseFile(collectionSchema, path, value))
  .sort((a, b) => a.sortOrder - b.sortOrder);

const textFiles = Object.entries(textModules).map(([path, value]) =>
  parseFile(textFileSchema, path, value),
);

const workById = new Map(works.map((work) => [work.id, work]));
const workBySlug = new Map(works.map((work) => [work.slug, work]));
const collectionById = new Map(collections.map((collection) => [collection.id, collection]));

export type TextWithContext = {
  text: TextEntry;
  versions: TextVersion[];
  collection: Collection;
  work: Work;
};

export const texts: TextWithContext[] = textFiles
  .map((file) => {
    const { versions, ...entry } = file;
    const collection = collectionById.get(entry.collectionId);
    if (!collection) {
      throw new Error(`El texto "${entry.id}" apunta a una colección inexistente.`);
    }
    const work = workById.get(collection.workId);
    if (!work) {
      throw new Error(`La colección "${collection.id}" apunta a una obra inexistente.`);
    }
    const normalizedVersions = versions.map((version) => ({
      ...version,
      textEntryId: entry.id,
    }));
    return { text: entry, versions: normalizedVersions, collection, work };
  })
  .sort((a, b) => (a.text.volume ?? 0) - (b.text.volume ?? 0) || a.text.title.localeCompare(b.text.title, "es"));

const textsByCollection = new Map<string, TextWithContext[]>();
for (const item of texts) {
  const bucket = textsByCollection.get(item.collection.id) ?? [];
  bucket.push(item);
  textsByCollection.set(item.collection.id, bucket);
}

export function getWork(slug: string): Work | undefined {
  return workBySlug.get(slug);
}

export function getWorkById(id: string): Work | undefined {
  return workById.get(id);
}

export function getCollectionsForWork(workId: string): Collection[] {
  return collections
    .filter((collection) => collection.workId === workId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCollection(workSlug: string, collectionSlug: string): Collection | undefined {
  const work = getWork(workSlug);
  if (!work) return undefined;
  return collections.find(
    (collection) => collection.workId === work.id && collection.slug === collectionSlug,
  );
}

export function getTextsForCollection(collectionId: string): TextWithContext[] {
  return textsByCollection.get(collectionId) ?? [];
}

export function getText(
  workSlug: string,
  collectionSlug: string,
  textSlug: string,
): TextWithContext | undefined {
  const collection = getCollection(workSlug, collectionSlug);
  if (!collection) return undefined;
  return getTextsForCollection(collection.id).find((item) => item.text.slug === textSlug);
}

export function getWorkLanguages(workId: string): string[] {
  const codes = new Set<string>();
  for (const collection of getCollectionsForWork(workId)) {
    for (const item of getTextsForCollection(collection.id)) {
      for (const version of item.versions) codes.add(version.language);
    }
  }
  return [...codes].sort();
}

export function getLanguageIndex(): { code: string; name: string; count: number; texts: TextWithContext[] }[] {
  const index = new Map<string, TextWithContext[]>();
  for (const item of texts) {
    const codes = new Set(item.versions.map((version) => version.language));
    for (const code of codes) {
      const bucket = index.get(code) ?? [];
      bucket.push(item);
      index.set(code, bucket);
    }
  }
  return [...index.entries()]
    .map(([code, items]) => ({
      code,
      name: languageName(code),
      count: items.length,
      texts: items,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "es"));
}

export function excerpt(value: string, maxLength = 150): string {
  const singleLine = value.replace(/\s+/g, " ").trim();
  if (singleLine.length <= maxLength) return singleLine;
  return `${singleLine.slice(0, maxLength).trimEnd()}…`;
}

export type SearchRecord = {
  id: string;
  title: string;
  subtitle?: string;
  workTitle: string;
  workSlug: string;
  collectionTitle: string;
  collectionSlug: string;
  textSlug: string;
  character?: string;
  characterTransliteration?: string;
  volume?: number;
  tags: string[];
  languages: string[];
  excerpt: string;
};

export function getSearchIndex(): SearchRecord[] {
  return texts.map((item) => {
    const original = item.versions.find((version) => version.kind === "original") ?? item.versions[0];
    return {
      id: item.text.id,
      title: item.text.title,
      subtitle: item.text.subtitle,
      workTitle: item.work.title,
      workSlug: item.work.slug,
      collectionTitle: item.collection.title,
      collectionSlug: item.collection.slug,
      textSlug: item.text.slug,
      character: item.text.character,
      characterTransliteration: item.text.characterTransliteration,
      volume: item.text.volume,
      tags: item.text.tags,
      languages: [...new Set(item.versions.map((version) => version.language))],
      excerpt: excerpt(original.content),
    };
  });
}
