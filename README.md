# Litera Mythos

> **Poemas y palabras que viven en otras historias.**
> Una biblioteca digital multilingüe para descubrir, leer y comparar poemas, versos y textos literarios pertenecientes a universos de ficción.

Este repositorio contiene el MVP de **Litera Mythos**, construido con Astro, React, TypeScript, Tailwind CSS y shadcn/ui. El contenido inicial se gestiona con archivos JSON locales y el despliegue previsto es Netlify.

## Stack

| Tecnología | Responsabilidad |
| --- | --- |
| Astro | Páginas, routing y generación estática |
| React | Comparador, filtros y búsqueda interactiva |
| TypeScript | Tipado del modelo de contenido |
| Tailwind CSS | Diseño responsive y tokens visuales |
| shadcn/ui | Componentes de interfaz (botones, inputs, selects…) |
| Netlify | Despliegue y hosting |

## Comandos

```sh
bun install        # Instalar dependencias
bun dev            # Servidor de desarrollo en localhost:4321
bun run build      # Generar la versión de producción en dist/
bun run preview    # Previsualizar la build
bun run check      # Comprobar tipos y errores de Astro
bun run astro ...  # CLI de Astro (add, check, etc.)
```

El servidor de desarrollo también puede gestionarse en segundo plano:

```sh
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

## Estructura

```text
src/
├── components/          # Componentes Astro y React
│   └── ui/              # Componentes de shadcn/ui
├── content/
│   ├── schemas.ts       # Esquemas Zod del modelo de contenido
│   └── works/           # Contenido de cada obra
│       └── <obra>/
│           ├── work.json
│           ├── collections/*.json
│           └── texts/*.json
├── layouts/
│   ├── BaseLayout.astro
│   └── ReadingLayout.astro
├── lib/
│   ├── content.ts       # Carga, validación e índices del contenido
│   └── language.ts      # Nombres de idiomas y tipos de versión
├── pages/
│   ├── index.astro
│   ├── obras/…          # Catálogo, obra, colección y ficha de texto
│   ├── buscar.astro
│   ├── colecciones/
│   ├── idiomas/
│   └── acerca-de.astro
└── styles/global.css    # Tailwind, tokens de diseño y variables de shadcn
```

## Modelo de contenido

Cada texto se guarda en `src/content/works/<obra>/texts/<texto>.json` e incluye sus versiones lingüísticas:

- **Work** (`work.json`): `id`, `slug`, `title`, `description`, `creator`, `creatorTransliteration`, `tags`.
- **Collection** (`collections/*.json`): `id`, `workId`, `slug`, `title`, `description`, `type`, `sortOrder`.
- **TextEntry** (`texts/*.json`): `id`, `collectionId`, `slug`, `title`, `creator`, `creatorTransliteration`, `character`, `characterTransliteration`, `volume`, `tags`, `notes`…
- **TextVersion** (dentro de `texts/*.json`): `language`, `label`, `content`, `kind` (`original`, `official_translation`, `own_translation`), `translator`, `source`, `transliteration`, `notes`.

Los campos `creator` y `character` guardan el nombre en su escritura original (por ejemplo, japonés). `creatorTransliteration` y `characterTransliteration` son opcionales y contienen la transliteración o romanización que se muestra junto al nombre. `content` puede quedar vacío para dejar una versión pendiente de transcripción; la interfaz mostrará un aviso en su lugar.

El cargador (`src/lib/content.ts`) valida todos los archivos con Zod y genera las rutas estáticas, los índices de búsqueda y las listas de idiomas. Para añadir contenido basta con crear nuevos JSON; no hace falta modificar los componentes.

## Rutas principales

- `/` — Inicio con obras y textos destacados.
- `/obras` — Catálogo de obras.
- `/obras/<obra>` — Página de obra y sus colecciones.
- `/obras/<obra>/<colección>` — Listado con filtros por personaje, tomo, idioma y orden.
- `/obras/<obra>/<colección>/<texto>` — Ficha de lectura con original, traducciones, transliteración, notas y comparador.
- `/buscar` — Búsqueda local por título, obra, personaje, etiqueta e idioma.
- `/colecciones` — Todas las colecciones.
- `/idiomas` — Exploración por idioma.
- `/acerca-de` — Propósito, criterios editoriales y derechos.

## shadcn/ui

El proyecto usa Tailwind CSS v4, por lo que no hay `tailwind.config.js`. La configuración de shadcn está en `components.json` y los componentes generados viven en `src/components/ui`. Para añadir más:

```sh
bunx shadcn@latest add <componente>
```

La utilidad `cn()` procede del paquete `cn` de shadcn (sustituto compilado de `clsx` + `tailwind-merge`). Los alias `@/*` se resuelven desde `tsconfig.json` y las variables de tema de shadcn se definen en `src/styles/global.css`.

## Derechos de autor

Los textos incluidos son registros de demostración. Antes de publicar, revisa los derechos aplicables, la procedencia de cada traducción y las atribuciones correspondientes. Las traducciones propias se identifican como tales y nunca se presentan como oficiales.

## Despliegue en Netlify

`netlify.toml` define el comando de build (`bun run build`) y el directorio de publicación (`dist`). El adaptador `@astrojs/netlify` se encarga de generar las funciones y redirecciones necesarias.

```sh
bun run build
```

También puedes conectar el repositorio a Netlify y usar la configuración detectada automáticamente.
