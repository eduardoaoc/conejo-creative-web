# DEVELOPMENT — Flujo de desarrollo

## Puesta en marcha

```bash
npm install
npm run dev          # http://localhost:3000 (redirige a /es)
```

Para los tests e2e, una única vez: `npx playwright install chromium`.

## Comandos

| Comando                           | Uso                                                     |
| --------------------------------- | ------------------------------------------------------- |
| `npm run dev`                     | Desarrollo (Turbopack)                                  |
| `npm run build`                   | Build de producción                                     |
| `npm run start`                   | Servir el build                                         |
| `npm run lint`                    | ESLint                                                  |
| `npm run typecheck`               | `tsc --noEmit`                                          |
| `npm run format` / `format:check` | Prettier                                                |
| `npm run test:e2e`                | Playwright (compila y levanta el build automáticamente) |

Antes de dar por buena cualquier tarea: `lint` + `typecheck` + `build` + `test:e2e` en verde.

## Convenciones

- **TypeScript estricto**: prohibido `any`; tipos explícitos en las fronteras públicas (props, retornos exportados).
- **Imports**: siempre con alias `@/` para código de `src/`.
- **Nombres**: componentes en `PascalCase.tsx`; utilidades y hooks en `camelCase.ts` (hooks con prefijo `use`).
- **Comentarios**: solo para explicar decisiones no evidentes; en español, como el resto del proyecto.
- **Strings visibles**: jamás en componentes — siempre en `messages/*.json` (ver docs/I18N.md).
- **`"use client"`**: solo en el componente hoja que lo necesita, nunca en páginas o layouts.

## Crear una página

1. Carpeta + `page.tsx` bajo `src/app/[locale]/<segmento>/`.
2. `generateMetadata` delegando en `createPageMetadata` con namespace `meta.<clave>` y `path`.
3. `setRequestLocale(locale)` al inicio del componente de página (mantiene el SSG).
4. Contenido con `Section`, `Container`, `PageTitle` y traducciones.
5. Añadir la ruta a: `messages/*.json` (meta + textos), `src/app/sitemap.ts`, `src/config/navigation.ts` (si va al menú) y `e2e/smoke.spec.ts`.

## Crear un componente

1. Carpeta según responsabilidad: `ui/` (primitiva), `sections/` (sección de página), `layout/`, `navigation/`, `forms/`, `motion/`.
2. Server Component salvo necesidad real de cliente.
3. Props tipadas con `type`, sin exportar tipos que nadie consume.

## Crear traducciones

Ver docs/I18N.md. Regla corta: primero `es.json`, replicar en `pt.json` y `en.json`, estructura idéntica en los tres.

## Commits

Formato **Conventional Commits** en imperativo:

```text
feat: añade página de servicios
fix: corrige hreflang del sitemap
docs: actualiza ARCHITECTURE.md
refactor|test|chore|style|perf: ...
```

Alcance opcional: `feat(contacto): ...`. Un cambio lógico por commit; el build debe pasar en cada commit.

## Ramas

```text
main        ← estable, desplegable siempre
└── feat/nombre-corto | fix/... | docs/...
```

Trabajo en ramas cortas desde `main`, merge vía Pull Request con checks en verde (lint, typecheck, build, e2e). Sin ramas de larga vida.
