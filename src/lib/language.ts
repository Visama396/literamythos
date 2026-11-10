const languageNames: Record<string, string> = {
  ja: "Japonés",
  en: "Inglés",
  es: "Español",
  de: "Alemán",
  fr: "Francés",
  it: "Italiano",
  pt: "Portugués",
  qya: "Quenya",
};

export function languageName(code: string): string {
  return languageNames[code] ?? code.toUpperCase();
}

export type VersionKind = "original" | "official_translation" | "own_translation";

const kindLabels: Record<VersionKind, string> = {
  original: "Original",
  official_translation: "Traducción publicada",
  own_translation: "Traducción propia",
};

export function kindLabel(kind: VersionKind): string {
  return kindLabels[kind];
}
