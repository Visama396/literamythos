# Litera Mythos --- MVP

> **Poemas y palabras que viven en otras historias.**\
> Una biblioteca digital multilingüe para descubrir, leer y comparar
> poemas, versos y textos literarios pertenecientes a universos de
> ficción.

-   **Estado:** propuesta de MVP
-   **Nombre provisional:** Litera Mythos
-   **Idioma inicial de la interfaz:** español
-   **Primeras colecciones:** *Bleach* y *El Señor de los Anillos*
-   **Enfoque:** web editorial, responsive y centrada en la lectura

------------------------------------------------------------------------

## 1. Visión y objetivo

Crear una biblioteca digital que permita consultar textos literarios
asociados a obras de ficción y explorar sus distintas versiones
lingüísticas.

El proyecto parte de dos ideas:

1.  Recopilar los poemas que Tite Kubo incluye al comienzo de los tomos
    de *Bleach*.
2.  Reunir las distintas versiones lingüísticas del poema del Anillo de
    *El Señor de los Anillos*.

La plataforma debe permitir:

-   Leer el texto en su idioma original.
-   Consultar traducciones disponibles.
-   Comparar varias traducciones simultáneamente.
-   Conocer el contexto del texto: obra, tomo, personaje, autoría y
    notas.
-   Descubrir cómo cambian el tono, el significado y los matices entre
    idiomas.

La web no pretende ser una wiki generalista ni una base de datos
exhaustiva de citas. Su foco es el texto literario y la experiencia de
leerlo.

## 2. Alcance del MVP

### Incluido

-   [ ] Página de inicio con obras y colecciones destacadas.
-   [ ] Catálogo de obras.
-   [ ] Página de una obra con sus colecciones.
-   [ ] Listado de textos de una colección.
-   [ ] Ficha individual de cada poema o texto.
-   [ ] Texto original y traducciones disponibles.
-   [ ] Comparador de traducciones.
-   [ ] Selector de idioma.
-   [ ] Diseño responsive para escritorio y móvil.
-   [ ] Búsqueda básica por título, obra, personaje o etiqueta.
-   [ ] Filtros básicos por idioma y colección.
-   [ ] Contenido gestionado inicialmente mediante archivos
    Markdown/JSON.

### Fuera del MVP

-   Cuentas de usuario.
-   Contribuciones públicas y edición comunitaria.
-   Comentarios, valoraciones y favoritos sincronizados.
-   API pública.
-   Panel de administración.
-   Traducción automática.
-   Sistema de votación de traducciones.
-   Búsqueda avanzada por idioma, métrica, tema o autor.

Estas funciones podrán añadirse cuando exista suficiente contenido y se
haya validado el interés por el proyecto.

## 3. Estructura de navegación

La navegación principal será deliberadamente sencilla:

-   **Inicio:** presentación del proyecto y obras destacadas.
-   **Obras:** catálogo de universos y obras disponibles.
-   **Colecciones:** agrupaciones de textos dentro de cada obra.
-   **Idiomas:** exploración de los idiomas disponibles.
-   **Acerca de:** propósito, criterios editoriales y créditos.

### Jerarquía de contenido

``` text
Obra
└── Colección
    └── Texto
        ├── Original
        ├── Traducciones
        ├── Información contextual
        └── Notas
```

Ejemplos:

``` text
Bleach
└── Poemas de apertura
    ├── Tomo 01
    ├── Tomo 02
    ├── Tomo 03
    └── ...

El Señor de los Anillos
└── Poema del Anillo
    ├── Versión original
    ├── Inglés
    ├── Español
    └── Otros idiomas disponibles
```

## 4. Páginas y funcionalidades

### 4.1. Inicio

Objetivo: explicar el concepto y permitir descubrir contenido
rápidamente.

Elementos:

-   Cabecera con logotipo y navegación.
-   Hero con una frase introductoria.
-   Acceso a las obras destacadas.
-   Colecciones añadidas recientemente.
-   Acceso directo a la búsqueda.
-   Breve explicación del proyecto.

### 4.2. Página de obra

Ejemplo: `/obras/bleach`

Elementos:

-   Nombre de la obra.
-   Imagen o ilustración representativa, si se dispone de derechos para
    utilizarla.
-   Descripción breve.
-   Autoría y datos bibliográficos.
-   Colecciones disponibles.
-   Idiomas presentes en el contenido.

### 4.3. Página de colección

Ejemplo: `/obras/bleach/poemas`

Elementos:

-   Título y descripción de la colección.
-   Número de textos disponibles.
-   Filtros por personaje, tomo e idioma.
-   Ordenación por tomo.
-   Listado de poemas con título, personaje y fragmento de presentación.

### 4.4. Ficha de texto

Ejemplo: `/obras/bleach/poemas/tomo-15`

Elementos:

-   Título del texto o referencia al tomo.
-   Obra y colección a la que pertenece.
-   Personaje asociado, cuando corresponda.
-   Autoría y fuente bibliográfica.
-   Texto original.
-   Transliteración, cuando sea útil (por ejemplo, japonés).
-   Traducciones disponibles.
-   Notas editoriales y aclaraciones lingüísticas.
-   Acceso al comparador.

La ficha debe priorizar la lectura: ancho de línea contenido, tipografía
cómoda y separación clara entre original, traducciones y notas.

### 4.5. Comparador de traducciones

Objetivo: facilitar la comparación de varias versiones de un mismo
texto.

Funciones:

-   Seleccionar los idiomas que se quieren comparar.
-   Vista en columnas en pantallas grandes.
-   Vista apilada en móvil.
-   Opción de mostrar u ocultar la transliteración.
-   Identificación clara del idioma y de la procedencia de cada versión.
-   Notas comparativas opcionales.

No se debe presentar una traducción como oficial si no se ha verificado
su procedencia. Las traducciones propias deben identificarse como tales.

### 4.6. Búsqueda

La búsqueda inicial puede ser sencilla y ejecutarse sobre el contenido
disponible.

Campos consultables:

-   Título.
-   Obra.
-   Colección.
-   Personaje.
-   Etiquetas.
-   Idiomas disponibles.

Los resultados deben enlazar directamente a la ficha del texto.

## 5. Modelo de contenido

El modelo debe ser independiente de una obra concreta. No conviene crear
campos exclusivos de *Bleach* en la estructura principal.

### Obra (`Work`)

  Campo           Tipo         Descripción
  --------------- ------------ ---------------------
  `id`            string       Identificador único
  `slug`          string       Ruta legible
  `title`         string       Nombre de la obra
  `description`   string       Descripción
  `creator`       string       Autor o creador
  `cover`         string?      Imagen de portada
  `tags`          string\[\]   Etiquetas

### Colección (`Collection`)

  Campo           Tipo     Descripción
  --------------- -------- -----------------------------------
  `id`            string   Identificador único
  `workId`        string   Obra a la que pertenece
  `slug`          string   Ruta legible
  `title`         string   Nombre de la colección
  `description`   string   Descripción
  `type`          string   poem, song, inscription, quote...
  `sortOrder`     number   Orden de presentación

### Texto (`TextEntry`)

  Campo               Tipo         Descripción
  ------------------- ------------ --------------------------------
  `id`                string       Identificador único
  `collectionId`      string       Colección a la que pertenece
  `slug`              string       Ruta legible
  `title`             string       Título o referencia
  `subtitle`          string?      Subtítulo
  `creator`           string?      Autor del texto, si se conoce
  `character`         string?      Personaje asociado
  `volume`            number?      Número de tomo, cuando proceda
  `source`            string?      Fuente bibliográfica
  `publicationDate`   string?      Fecha de publicación
  `tags`              string\[\]   Temas y etiquetas
  `notes`             string?      Contexto o notas editoriales

### Versión lingüística (`TextVersion`)

  Campo               Tipo      Descripción
  ------------------- --------- -------------------------------------------------
  `id`                string    Identificador único
  `textEntryId`       string    Texto al que pertenece
  `language`          string    Código BCP 47, por ejemplo `ja`, `es`, `en`
  `label`             string?   Etiqueta visible
  `content`           string    Texto de esta versión
  `kind`              string    original, official_translation, own_translation
  `translator`        string?   Traductor, si se conoce
  `source`            string?   Fuente de la versión
  `transliteration`   string?   Transliteración
  `notes`             string?   Notas específicas de esta versión

**Importante:** un texto puede tener varias versiones en el mismo idioma
si proceden de ediciones o traductores distintos. Por tanto, el idioma
no debe ser la clave única de una versión.

## 6. Organización de archivos

Para el MVP se recomienda empezar con contenido local y tipado. Astro
puede generar las páginas estáticas a partir de este contenido sin
necesitar una base de datos.

Una posible estructura:

``` text
src/
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── WorkCard.astro
│   ├── CollectionCard.astro
│   ├── TextCard.astro
│   ├── LanguageBadge.astro
│   ├── TextVersion.astro
│   └── TranslationComparator.tsx
├── content/
│   ├── works/
│   │   ├── bleach/
│   │   │   ├── work.json
│   │   │   ├── collections/
│   │   │   │   └── poems.json
│   │   │   └── texts/
│   │   │       ├── volume-01.json
│   │   │       └── volume-15.json
│   │   └── lord-of-the-rings/
│   │       ├── work.json
│   │       ├── collections/
│   │       └── texts/
│   └── schemas.ts
├── layouts/
│   ├── BaseLayout.astro
│   └── ReadingLayout.astro
├── pages/
│   ├── index.astro
│   ├── obras/
│   │   ├── index.astro
│   │   └── [work]/
│   │       ├── index.astro
│   │       └── [collection]/
│   │           ├── index.astro
│   │           └── [text].astro
│   ├── buscar.astro
│   └── acerca-de.astro
└── styles/
    └── global.css
```

La estructura definitiva de rutas puede ajustarse a las capacidades de
enrutamiento de Astro. Lo importante es mantener separados los datos de
las plantillas.

## 7. Stack tecnológico

  Tecnología        Responsabilidad
  ----------------- ----------------------------------------
  Astro             Páginas, routing y generación estática
  React             Comparador y componentes interactivos
  TypeScript        Tipado del modelo de contenido
  Tailwind CSS      Diseño y responsive
  Netlify           Despliegue y hosting
  Markdown / JSON   Contenido inicial

### ¿Por qué empezar sin Supabase?

El primer objetivo es publicar una biblioteca de lectura, no una
plataforma colaborativa. Gestionar el contenido mediante archivos
permite:

-   Mantener los datos versionados con Git.
-   Editar poemas y traducciones desde el editor.
-   Evitar complejidad de autenticación y permisos.
-   Generar páginas estáticas rápidas.
-   Migrar a Supabase más adelante si aparecen contribuciones o un panel
    de administración.

Supabase queda como posible evolución, no como requisito del MVP.

## 8. Dirección visual

### Concepto

Una biblioteca literaria de fantasía: oscura, sobria y elegante, con
referencias visuales a libros antiguos, archivos y manuscritos.

La interfaz debe transmitir que el contenido es lo importante. Los
adornos deben acompañar a la lectura, no competir con ella.

### Paleta inicial

  Uso                  Color            Hex
  -------------------- ---------------- -----------
  Fondo principal      Negro azulado    `#080B10`
  Superficie           Carbón           `#12161B`
  Superficie elevada   Gris oscuro      `#1B2128`
  Acento principal     Oro envejecido   `#D4AF57`
  Texto principal      Marfil           `#E8E2D6`
  Texto secundario     Gris cálido      `#A3A3A3`
  Bordes               Bronce oscuro    `#51432B`

### Tipografía

-   **Títulos:** Cinzel o Playfair Display.
-   **Texto de lectura:** Source Sans 3 o Inter.
-   **Texto original japonés:** una tipografía con buena cobertura
    japonesa, por ejemplo Noto Serif JP.
-   **Metadatos:** tipografía sans-serif discreta.

### Componentes visuales

-   Cabecera compacta.
-   Tarjetas de obras con imágenes y metadatos.
-   Separadores finos en dorado apagado.
-   Etiquetas pequeñas para idiomas y categorías.
-   Bloques de lectura con ancho máximo limitado.
-   Comparador con columnas claramente diferenciadas.
-   Iconografía lineal y discreta.

### Responsive

**Escritorio** - Navegación horizontal. - Listados con tarjetas o
filas. - Comparador en columnas. - Ficha de texto con contenido
principal y metadatos en una columna lateral.

**Móvil** - Navegación compacta. - Tarjetas apiladas. - Comparador en
bloques verticales. - Metadatos debajo del texto. - Tamaño de fuente y
espaciado optimizados para lectura.

## 9. Experiencia de usuario principal

``` mermaid
flowchart TD
    A[Inicio] --> B[Explorar obras]
    B --> C[Seleccionar una obra]
    C --> D[Ver colecciones]
    D --> E[Seleccionar un texto]
    E --> F[Leer original]
    F --> G[Consultar traducciones]
    G --> H[Comparar idiomas]
```

El recorrido debe ser corto: desde la página de inicio hasta un poema
concreto en un máximo de cuatro o cinco acciones.

## 10. Plan de implementación

### Fase 1 --- Base del proyecto

-   [ ] Crear proyecto Astro con TypeScript.
-   [ ] Configurar Tailwind CSS.
-   [ ] Definir tokens de diseño.
-   [ ] Crear layout general.
-   [ ] Definir esquemas de contenido y validación.

### Fase 2 --- Navegación y catálogo

-   [ ] Página de inicio.
-   [ ] Catálogo de obras.
-   [ ] Página de obra.
-   [ ] Página de colección.
-   [ ] Componentes de tarjetas y metadatos.

### Fase 3 --- Lectura y traducciones

-   [ ] Ficha de texto.
-   [ ] Presentación del original.
-   [ ] Selector de traducciones.
-   [ ] Transliteración opcional.
-   [ ] Comparador responsive.
-   [ ] Notas editoriales.

### Fase 4 --- Búsqueda y acabado

-   [ ] Búsqueda local.
-   [ ] Filtros básicos.
-   [ ] Estados vacíos y errores.
-   [ ] Accesibilidad y navegación por teclado.
-   [ ] Metadatos SEO y Open Graph.
-   [ ] Pruebas en escritorio y móvil.

### Fase 5 --- Publicación

-   [ ] Revisar fuentes y atribuciones.
-   [ ] Revisar permisos y derechos de publicación.
-   [ ] Configurar Netlify.
-   [ ] Configurar dominio.
-   [ ] Publicar una primera versión.

## 11. Contenido inicial

Para validar la estructura, no es necesario cargar todos los textos de
golpe.

### Colección 1: Bleach --- Poemas de apertura

-   Crear la ficha de la obra.
-   Crear la colección de poemas de apertura.
-   Introducir unos pocos registros de prueba con contenido cuya
    publicación esté autorizada.
-   Comprobar que el modelo admite tomos, personajes, japonés,
    transliteración y traducciones.
-   Ampliar el catálogo progresivamente.

### Colección 2: El Señor de los Anillos --- Poema del Anillo

-   Crear la ficha de la obra.
-   Crear una colección para el poema.
-   Añadir versiones lingüísticas con su procedencia.
-   Distinguir las traducciones publicadas de las traducciones propias.
-   Comprobar la comparación entre varios idiomas.

## 12. Derechos de autor y criterios editoriales

Este apartado es una condición del proyecto, no una tarea secundaria.

Los poemas de obras contemporáneas, sus traducciones y las ilustraciones
asociadas pueden estar protegidos por derechos de autor. Que una
traducción sea propia no implica automáticamente que se pueda publicar
el texto completo traducido.

Antes de publicar:

-   Comprobar los derechos aplicables en los territorios relevantes.
-   No asumir que una traducción encontrada en Internet puede
    reproducirse libremente.
-   Diferenciar claramente el texto original, traducciones oficiales y
    traducciones propias.
-   Atribuir autores, traductores, ediciones y fuentes cuando
    corresponda.
-   Utilizar imágenes propias, licenciadas o con permiso.
-   Si no se dispone de autorización, limitar la publicación a contenido
    que pueda compartirse legalmente, como análisis, referencias
    bibliográficas y fragmentos permitidos por la legislación aplicable.

La política editorial debe ser transparente y permitir corregir
atribuciones o retirar material cuando sea necesario.

## 13. Evolución posterior al MVP

Una vez validado el proyecto, se podrían estudiar estas mejoras:

-   Panel privado para gestionar obras, textos y traducciones.
-   Supabase como base de datos.
-   Sistema de contribuciones con revisión editorial.
-   Historial de cambios de las traducciones.
-   Favoritos y listas personales.
-   Más idiomas de interfaz.
-   Búsqueda avanzada.
-   Filtros por temas, personajes, autores y traductores.
-   API pública de metadatos.
-   Colecciones creadas por usuarios.
-   Comparación de traducciones por versos o segmentos.

## 14. Criterios de aceptación

El MVP estará listo cuando:

-   [ ] Se pueda navegar desde el inicio hasta una obra, colección y
    texto.
-   [ ] Los textos puedan tener varias versiones lingüísticas.
-   [ ] Se identifique la procedencia de cada versión.
-   [ ] Se pueda consultar original, traducciones y transliteración.
-   [ ] El comparador permita mostrar al menos dos versiones a la vez.
-   [ ] La experiencia funcione en escritorio y móvil.
-   [ ] La búsqueda encuentre textos por título y metadatos básicos.
-   [ ] El contenido pueda ampliarse añadiendo datos, sin modificar
    componentes.
-   [ ] Se hayan revisado los permisos de todo el material publicado.

------------------------------------------------------------------------

## Resumen

**Litera Mythos** será una biblioteca digital multilingüe centrada en
textos literarios de universos de ficción. El MVP se construirá con
Astro, React, TypeScript y Tailwind, utilizando archivos locales para
gestionar el contenido y Netlify para desplegarlo.

La primera versión validará dos casos de uso distintos: una colección de
poemas asociados a tomos y personajes (*Bleach*) y un mismo poema
disponible en varios idiomas (*El Señor de los Anillos*).

La prioridad es ofrecer una experiencia de lectura cuidada, un modelo de
contenido extensible y una comparación de traducciones clara.
