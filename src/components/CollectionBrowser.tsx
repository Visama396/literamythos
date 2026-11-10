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

export type CollectionItem = {
  id: string;
  title: string;
  subtitle?: string;
  character?: string;
  characterTransliteration?: string;
  volume?: number;
  tags: string[];
  languages: string[];
  excerpt: string;
  href: string;
};

interface Props {
  items: CollectionItem[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function CollectionBrowser({ items }: Props) {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState("all");
  const [volume, setVolume] = useState("all");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("volume");

  const characters = useMemo(
    () => [...new Set(items.flatMap((item) => (item.character ? [item.character] : [])))].sort(),
    [items],
  );
  const volumes = useMemo(
    () =>
      [...new Set(items.flatMap((item) => (typeof item.volume === "number" ? [item.volume] : [])))].sort(
        (a, b) => a - b,
      ),
    [items],
  );
  const languages = useMemo(
    () => [...new Set(items.flatMap((item) => item.languages))].sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const needle = normalize(query.trim());
    const result = items.filter((item) => {
      if (character !== "all" && item.character !== character) return false;
      if (volume !== "all" && String(item.volume) !== volume) return false;
      if (language !== "all" && !item.languages.includes(language)) return false;
      if (!needle) return true;
      const haystack = normalize(
        [
          item.title,
          item.subtitle ?? "",
          item.character ?? "",
          item.characterTransliteration ?? "",
          item.tags.join(" "),
        ].join(" "),
      );
      return haystack.includes(needle);
    });

    return result.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title, "es");
      return (a.volume ?? 0) - (b.volume ?? 0) || a.title.localeCompare(b.title, "es");
    });
  }, [items, query, character, volume, language, sort]);

  const hasFilters = query !== "" || character !== "all" || volume !== "all" || language !== "all";

  function reset() {
    setQuery("");
    setCharacter("all");
    setVolume("all");
    setLanguage("all");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-bronze/70 bg-surface/60 p-5">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div className="space-y-1.5">
            <label htmlFor="collection-query" className="text-xs text-warm-muted">
              Buscar en la colección
            </label>
            <Input
              id="collection-query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Título, personaje, etiqueta…"
              className="border-bronze/80 bg-ink/60 text-parchment placeholder:text-warm-muted/70 focus-visible:border-gold focus-visible:ring-gold/30"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-warm-muted">Personaje</span>
            <Select value={character} onValueChange={setCharacter}>
              <SelectTrigger className="w-full border-bronze/80 bg-ink/60 text-parchment">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {characters.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-warm-muted">Tomo</span>
            <Select value={volume} onValueChange={setVolume}>
              <SelectTrigger className="w-full border-bronze/80 bg-ink/60 text-parchment">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {volumes.map((item) => (
                  <SelectItem key={item} value={String(item)}>
                    Tomo {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-warm-muted">Idioma</span>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full border-bronze/80 bg-ink/60 text-parchment">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {languages.map((code) => (
                  <SelectItem key={code} value={code}>
                    {languageName(code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-warm-muted">Orden</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full border-bronze/80 bg-ink/60 text-parchment">
                <SelectValue placeholder="Tomo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Por tomo</SelectItem>
                <SelectItem value="title">Por título</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-warm-muted" aria-live="polite">
            {filtered.length} texto{filtered.length === 1 ? "" : "s"} visible{filtered.length === 1 ? "" : "s"}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-bronze text-parchment hover:bg-surface-raised"
            onClick={reset}
            disabled={!hasFilters}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-bronze/70 bg-surface/40 p-10 text-center">
          <p className="font-display text-xl text-parchment">Ningún texto coincide</p>
          <p className="mt-2 text-sm text-warm-muted">Ajusta la búsqueda o limpia los filtros.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className="group flex flex-col gap-4 rounded-lg border border-bronze/70 bg-surface/60 p-5 transition duration-300 hover:border-gold/50 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg text-parchment transition-colors group-hover:text-gold">
                      {item.title}
                    </h3>
                    {typeof item.volume === "number" && (
                      <Badge variant="outline" className="border-gold/40 text-gold">
                        Tomo {item.volume}
                      </Badge>
                    )}
                  </div>
                  {item.subtitle && <p className="text-sm text-warm-muted">{item.subtitle}</p>}
                  {item.excerpt ? (
                    <p className="line-clamp-2 text-sm leading-relaxed text-parchment/75">{item.excerpt}</p>
                  ) : (
                    <p className="line-clamp-2 text-sm italic text-warm-muted/70">Texto pendiente de transcripción.</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:max-w-52 sm:justify-end">
                  {item.character && (
                    <span className="w-full text-xs text-warm-muted sm:text-right">
                      {item.character}
                      {item.characterTransliteration && (
                        <span className="ml-1.5 text-warm-muted/70">{item.characterTransliteration}</span>
                      )}
                    </span>
                  )}
                  {item.languages.map((code) => (
                    <Badge key={code} variant="secondary" className="bg-surface-raised text-warm-muted">
                      {languageName(code)}
                    </Badge>
                  ))}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
