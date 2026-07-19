# SEO — Base técnica

URL canónica temporal: `https://conejocreative.com` (configurable vía `NEXT_PUBLIC_SITE_URL`).

## Metadata

- **Global** (`app/[locale]/layout.tsx` → `generateMetadata`): `metadataBase`, título por defecto y **plantilla de títulos** `%s | ConejoCreative`, descripción por idioma (`meta.default` en los mensajes).
- **Por página e idioma**: cada página implementa `generateMetadata` delegando en `createPageMetadata()` (`src/lib/metadata.ts`), que centraliza todo:
  - `title` y `description` traducidos (namespace `meta.<página>` de `messages/*.json`);
  - `alternates.canonical` — URL absoluta de la página en su idioma;
  - `alternates.languages` — **hreflang**: `es`, `pt-BR`, `en` y `x-default` (apunta al español, idioma principal);
  - **Open Graph**: título, descripción, `url`, `siteName`, `locale` (`es_ES` / `pt_BR` / `en_US`), `type: website`;
  - **Twitter Card**: `summary` (pasará a `summary_large_image` cuando exista imagen OG).

Para añadir una página nueva con SEO completo basta con:

```ts
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, namespace: 'meta.nueva', path: '/nueva' });
}
```

…y añadir `'/nueva'` al array `paths` de `src/app/sitemap.ts`.

## Sitemap multilingüe

`src/app/sitemap.ts` genera `/sitemap.xml` con una entrada por página **y por idioma** (15 URLs), cada una con sus `alternates.languages` (hreflang también en el sitemap, formato soportado por Google).

## Robots

`src/app/robots.ts` genera `/robots.txt`: permite todo y referencia el sitemap.

## Favicon

`src/app/icon.svg` — marca provisional servida por la convención de metadata de Next. Sustituir por el icono definitivo (mismo nombre de fichero) cuando exista identidad visual.

## `<html lang>`

Definido en el layout por locale con etiquetas BCP 47 correctas (`es`, `pt-BR`, `en`) desde `localeLangTags` (`src/config/site.ts`).

## Comprobado en build

`/robots.txt`, `/sitemap.xml` y las 15 páginas se generan estáticamente (ver salida de `next build`).

## Datos estructurados (futuro)

Pendiente para próximas etapas, en este orden de valor:

1. `Organization` (JSON-LD en el layout) — nombre, logo, URL, redes.
2. `WebSite` con `inLanguage` por locale.
3. `Service` para cada servicio de `/servicios`.
4. `BreadcrumbList` cuando haya páginas anidadas reales.

Implementación prevista: componente Server que serialice JSON-LD en un `<script type="application/ld+json">`, con los textos salidos de los mismos ficheros de mensajes.

## Pendiente conocido

- Imagen Open Graph (una por idioma o plantilla dinámica con `next/og`).
- Verificación en Google Search Console al desplegar.
