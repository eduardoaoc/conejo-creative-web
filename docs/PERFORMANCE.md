# PERFORMANCE — Estrategia de rendimiento

Objetivo: **Core Web Vitals en verde** (LCP < 2,5 s, CLS < 0,1, INP < 200 ms) en móvil real.

## Lo que ya garantiza la base

- **SSG**: las 15 páginas se sirven como HTML estático pre-renderizado; TTFB mínimo.
- **Server Components por defecto**: solo se hidratan cinco islas de cliente (menú móvil, selector de idioma, formulario y dos envoltorios de animación). Nada más envía JavaScript.
- **Fuentes con `next/font`**: Inter se descarga en build y se **autohospeda** (cero peticiones a Google en runtime), con `display: swap` y variable CSS (`--font-inter`) — sin FOIT ni CLS de fuente.
- **CSS mínimo**: Tailwind v4 emite solo las clases usadas.
- **Animaciones sin layout shift**: solo `opacity`/`transform` (ver docs/ANIMATIONS.md).

## Imágenes (cuando lleguen)

- Usar **siempre** `next/image` — nunca `<img>` directo.
- Dimensiones explícitas (`width`/`height` o `fill` con contenedor dimensionado) para evitar CLS.
- La imagen LCP (hero) con `priority`; el resto lazy por defecto.
- `sizes` correcto en imágenes responsivas; formatos AVIF/WebP los negocia Next.
- Los originales viven en `public/assets/images/` (o CDN futura); nada de placeholders externos.

## Vídeos (cuando lleguen)

- MP4 (H.264/H.265) comprimido + `poster` obligatorio.
- Vídeos decorativos: `autoplay muted loop playsinline preload="none"` y carga condicionada a viewport.
- Valorar `<video>` solo visible en desktop si el peso móvil no compensa.
- Ubicación: `public/assets/videos/` o streaming externo autoalojado si superan unos pocos MB.

## JavaScript

- La frontera `"use client"` se mantiene lo más abajo posible del árbol.
- GSAP y Motion solo se cargan en páginas que usan sus componentes (import estático dentro del Client Component; el code splitting por ruta hace el resto).
- Futuras escenas pesadas: `next/dynamic` con `ssr: false` si no aportan al HTML inicial.
- Antes de añadir una dependencia: comprobar peso (bundlephobia) y si ya hay algo en el stack que lo resuelva.

## Lazy loading y división de código

- Por ruta: automática (App Router).
- Por componente: `next/dynamic` reservado para piezas pesadas no críticas; hoy no hay ninguna que lo justifique (no añadimos abstracciones sin uso).

## Cómo medir

- `npm run build` — vigilar el tamaño de los bundles por ruta.
- Lighthouse (DevTools) contra `npm run start`, **no** contra el dev server.
- PageSpeed Insights tras el despliegue (datos de campo CrUX con el tiempo).
- Los tests e2e ya vigilan una regresión básica: sin overflow horizontal y sin errores de consola.

## Presupuesto orientativo

| Métrica               | Objetivo      |
| --------------------- | ------------- |
| JS inicial por página | < 150 kB gzip |
| LCP móvil             | < 2,5 s       |
| CLS                   | < 0,1         |
| Imagen hero           | < 200 kB      |
