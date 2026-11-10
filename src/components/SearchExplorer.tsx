import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languageName } from "@/lib/language";

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

interface Props {
  records: SearchRecord[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function SearchExplorer({ records }: Props) {
  const [query, setQuery] = useState("");
  const [work, setWork] = useState("all");
  const [language, setLanguage] = useState("all");
  const [tag, setTag] = useState("all");

  const works = useMemo(
    () => [...new Map(records.map((record) => [record.workSlug, record.workTitle])).entries()],
    [records],
  );
  const languages = useMemo(
    () => [...new Set(records.flatMap((record) => record.languages))].sort(),
    [records],
  );
  const tags = useMemo(
    () => [...new Set(records.flatMap((record) => record.tags))].sort((a, b) => a.localeCompare(b, "es")),
    [records],
  );

  const filtered = useMemo(() => {
    const needle = normalize(query.trim());
    return records.filter((record) => {
      if (work !== "all" && record.workSlug !== work) return false;
      if (language !== "all" && !record.languages.includes(language)) return false;
      if (tag !== "all" && !record.tags.includes(tag)) return false;
      if (!needle) return true;
      const haystack = normalize(
        [
          record.title,
          record.subtitle ?? "",
          record.workTitle,
          record.collectionTitle,
          record.character ?? "",
          record.characterTransliteration ?? "",
          record.tags.join(" "),
          record.languages.map(languageName).join(" "),
        ].join(" "),
      );
      return haystack.includes(needle);
    });
  }, [records, query, work, language, tag]);

  const hasFilters = query !== "" || work !== "all" || language !== "all" || tag !== "all";

  function reset() {
    setQuery("");
    setWork("all");
    setLanguage("all");
    setTag("all");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-bronze/70 bg-surface/60 p-5">
        <label htmlFor="search-query" className="eyebrow">
          Buscar en la biblioteca
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Input
            id="search-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Título, personaje, obra, etiqueta…"
            className="border-bronze/80 bg-ink/60 text-parchment placeholder:text-warm-muted/70 focus-visible:border-gold focus-visible:ring-gold/30"
          />
          <Button
            type="button"
            variant="outline"
            className="border-bronze text-parchment hover:bg-surface-raised sm:w-auto"
            onClick={reset}
            disabled={!hasFilters}
          >
            Limpiar filtros
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <span className="text-xs text-warm-muted">Obra</span>
            <Select value={work} onValueChange={setWork}>
              <SelectTrigger className="w-full border-bronze/80 bg-ink/60 text-parchment">
                <SelectValue placeholder="Todas las obras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las obras</SelectItem>
                {works.map(([slug, title]) => (
                  <SelectItem key={slug} value={slug}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-warm-muted">Idioma</span>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full border-bronze/80 bg-ink/60 text-parchment">
                <SelectValue placeholder="Todos los idiomas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los idiomas</SelectItem>
                {languages.map((code) => (
                  <SelectItem key={code} value={code}>
                    {languageName(code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-warm-muted">Etiqueta</span>
            <Select value={tag} onValueChange={setTag}>
              <SelectTrigger className="w-full border-bronze/80 bg-ink/60 text-parchment">
                <SelectValue placeholder="Todas las etiquetas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las etiquetas</SelectItem>
                {tags.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <p className="text-sm text-warm-muted" aria-live="polite">
        {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
        {hasFilters ? " con los filtros aplicados" : " en la biblioteca"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-bronze/70 bg-surface/40 p-10 text-center">
          <p className="font-display text-xl text-parchment">Sin resultados</p>
          <p className="mt-2 text-sm text-warm-muted">
            Prueba con otro título, personaje o etiqueta, o limpia los filtros.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.map((record) => (
            <li key={record.id}>
              <a
                href={`/obras/${record.workSlug}/${record.collectionSlug}/${record.textSlug}`}
                className="group flex h-full flex-col rounded-lg border border-bronze/70 bg-surface/60 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-gold/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-warm-muted">
                  <span>
                    {record.workTitle} · {record.collectionTitle}
                  </span>
                  {typeof record.volume === "number" && (
                    <span className="rounded-full border border-gold/40 px-2 py-0.5 text-gold">
                      Tomo {record.volume}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-xl text-parchment transition-colors group-hover:text-gold">
                  {record.title}
                </h3>
                {record.subtitle && <p className="mt-0.5 text-sm text-warm-muted">{record.subtitle}</p>}
                {record.excerpt ? (
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-parchment/80">
                    {record.excerpt}
                  </p>
                ) : (
                  <p className="mt-3 flex-1 text-sm italic text-warm-muted/70">Texto pendiente de transcripción.</p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-bronze/50 pt-3">
                  {record.character && (
                    <span className="text-xs text-warm-muted">
                      {record.character}
                      {record.characterTransliteration && (
                        <span className="ml-1.5 text-warm-muted/70">{record.characterTransliteration}</span>
                      )}
                    </span>
                  )}
                  <span className="ml-auto flex flex-wrap gap-1.5">
                    {record.languages.map((code) => (
                      <Badge key={code} variant="secondary" className="bg-surface-raised text-warm-muted">
                        {languageName(code)}
                      </Badge>
                    ))}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
