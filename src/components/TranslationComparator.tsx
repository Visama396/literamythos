import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { kindLabel, languageName } from "@/lib/language";

export type ComparatorVersion = {
  id: string;
  language: string;
  label?: string;
  content: string;
  kind: "original" | "official_translation" | "own_translation";
  translator?: string;
  source?: string;
  transliteration?: string;
  notes?: string;
};

interface Props {
  versions: ComparatorVersion[];
}

export default function TranslationComparator({ versions }: Props) {
  const [selected, setSelected] = useState<string[]>(() =>
    versions.slice(0, 2).map((version) => version.id),
  );
  const [showTransliteration, setShowTransliteration] = useState(true);

  const selectedVersions = versions.filter((version) => selected.includes(version.id));

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) {
        if (current.length === 1) return current;
        return current.filter((versionId) => versionId !== id);
      }
      return [...current, id];
    });
  }

  return (
    <section className="space-y-5" aria-labelledby="comparator-title">
      <div className="rounded-lg border border-bronze/70 bg-surface/60 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="eyebrow">Comparador</p>
            <h2 id="comparator-title" className="font-display text-2xl text-parchment">
              Comparar traducciones
            </h2>
            <p className="text-sm text-warm-muted">
              Selecciona las versiones que quieres leer en paralelo. En móvil se apilan.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-bronze text-parchment hover:bg-surface-raised"
            onClick={() => setShowTransliteration((value) => !value)}
            aria-pressed={showTransliteration}
          >
            {showTransliteration ? "Ocultar transliteración" : "Mostrar transliteración"}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {versions.map((version) => {
            const isSelected = selected.includes(version.id);
            const isLastSelected = isSelected && selected.length === 1;
            return (
              <Button
                key={version.id}
                type="button"
                size="sm"
                variant={isSelected ? "default" : "outline"}
                className={
                  isSelected
                    ? "bg-gold text-ink hover:bg-gold/90"
                    : "border-bronze/80 text-warm-muted hover:border-gold/50 hover:text-gold"
                }
                onClick={() => toggle(version.id)}
                aria-pressed={isSelected}
                disabled={isLastSelected}
                title={isLastSelected ? "Debe quedar al menos una versión seleccionada" : undefined}
              >
                {languageName(version.language)}
                {version.kind !== "original" && (
                  <span className="text-[0.65rem] uppercase tracking-[0.12em] opacity-70">
                    {version.kind === "own_translation" ? "propia" : "publicada"}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {selectedVersions.map((version) => (
          <article
            key={version.id}
            className="flex flex-col rounded-lg border border-bronze/70 bg-surface/50 p-5"
          >
            <header className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-gold/50 text-gold">
                {languageName(version.language)}
              </Badge>
              <Badge variant="secondary" className="bg-surface-raised text-warm-muted">
                {kindLabel(version.kind)}
              </Badge>
              {version.translator && (
                <span className="text-xs text-warm-muted">Trad. {version.translator}</span>
              )}
            </header>

            <div
              lang={version.language}
              className={
                version.language.startsWith("ja")
                  ? "font-jp text-lg leading-loose whitespace-pre-line text-parchment/95"
                  : "text-lg leading-relaxed whitespace-pre-line text-parchment/95"
              }
            >
              {version.content || (
                <span className="text-base italic text-warm-muted/70">
                  Texto pendiente de transcripción.
                </span>
              )}
            </div>

            {showTransliteration && version.transliteration && (
              <p className="mt-4 rounded-md bg-ink/60 p-3 text-sm leading-relaxed whitespace-pre-line text-warm-muted">
                {version.transliteration}
              </p>
            )}

            {(version.notes || version.source) && (
              <footer className="mt-auto space-y-1 border-t border-bronze/40 pt-4 text-xs leading-relaxed text-warm-muted">
                {version.notes && <p>{version.notes}</p>}
                {version.source && <p className="text-warm-muted/80">Fuente: {version.source}</p>}
              </footer>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
