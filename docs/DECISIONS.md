# DECISIONS — Registro de decisiones técnicas

Formato: Decisión / Contexto / Elección / Motivo / Alternativas / Consecuencias / Fecha.

---

## 1. Next.js 16 con App Router como framework

- **Contexto**: sitio institucional multilingüe con SEO exigente, animaciones y futura lógica de servidor ligera.
- **Elección**: Next.js 16, App Router, Server Components, SSG.
- **Motivo**: metadata/sitemap/robots nativos, i18n de primera clase vía next-intl, HTML estático con JavaScript mínimo, camino natural hacia route handlers.
- **Alternativas**: Astro (descartado: peor encaje para la evolución hacia aplicación React), Remix (menos utillaje SEO integrado), SPA Vite (SEO deficiente).
- **Consecuencias**: acoplamiento a convenciones Next (p. ej. `proxy.ts` en v16, `next lint` retirado); despliegue óptimo en Vercel.
- **Fecha**: 2026-07-15

## 2. Sin Laravel / PHP en esta etapa

- **Contexto**: se planteó un stack con backend Laravel.
- **Elección**: sin backend dedicado; frontend Next.js con route handlers cuando haga falta.
- **Motivo**: no existe todavía ningún requisito de backend (ni BD, ni auth, ni panel). Un servidor PHP para servir contenido estatificable encarece y complica sin aportar. Detalle en docs/TECH-STACK.md.
- **Alternativas**: Laravel + Inertia, Laravel API + Next front (dos despliegues).
- **Consecuencias**: el envío del formulario se implementará como route handler; si el backend crece de verdad, se reevaluará con requisitos reales.
- **Fecha**: 2026-07-15

## 3. next-intl para internacionalización

- **Contexto**: tres idiomas (es principal, pt-BR, en) con SEO internacional completo.
- **Elección**: next-intl 4 con `localePrefix: 'always'` y **`localeDetection: false`**.
- **Motivo**: única librería i18n con soporte de primera clase para App Router y SSG (`setRequestLocale`); la detección se desactiva porque el requisito es que `/` redirija SIEMPRE a `/es` (predecible para usuarios y crawlers).
- **Alternativas**: next-i18next (Pages Router), formatjs manual (más cableado).
- **Consecuencias**: los textos viven en `messages/*.json`; navegación siempre vía `@/i18n/navigation`; añadir un idioma es barato (docs/I18N.md).
- **Fecha**: 2026-07-15

## 4. Server Components por defecto

- **Contexto**: el rendimiento (Core Web Vitals) es requisito no funcional prioritario.
- **Elección**: todo es Server Component salvo cinco islas de cliente justificadas (menú móvil, selector, formulario, dos envoltorios de animación).
- **Motivo**: menos JavaScript enviado e hidratado; la frontera `"use client"` se mantiene en las hojas del árbol.
- **Alternativas**: `"use client"` generoso por comodidad (descartado: coste permanente de bundle).
- **Consecuencias**: disciplina al crear componentes (¿necesita estado/eventos/browser API? si no, servidor); los envoltorios de animación reciben `children` para no arrastrar contenido al cliente.
- **Fecha**: 2026-07-15

## 5. Motion y GSAP con responsabilidades separadas

- **Contexto**: el sitio tendrá animación profesional; instalar dos librerías de animación exige delimitar su uso.
- **Elección**: CSS para microinteracciones → Motion para animaciones de componentes → GSAP + ScrollTrigger para timelines y scroll (jerarquía de docs/ANIMATIONS.md).
- **Motivo**: cada herramienta en su punto fuerte; evita reimplementar ScrollTrigger en Motion o escribir microinteracciones imperativas en GSAP.
- **Alternativas**: solo Motion (insuficiente para escenas cinematográficas futuras), solo GSAP (peor DX para animación declarativa de componentes React).
- **Consecuencias**: dos dependencias de animación en el bundle — mitigado porque solo cargan en Client Components concretos; patrón obligatorio `gsap.context` + `revert()`.
- **Fecha**: 2026-07-15

## 6. Sin base de datos inicial

- **Contexto**: el contenido es editorial y estable; el formulario aún no envía.
- **Elección**: contenido en ficheros de mensajes; ninguna persistencia.
- **Motivo**: una BD hoy solo añadiría infraestructura, coste y superficie de fallo; el SSG puro es más rápido y más barato.
- **Alternativas**: CMS headless (prematuro sin diseño final), SQLite/Postgres (sin datos que guardar).
- **Consecuencias**: los mensajes del formulario se enviarán por correo (Resend), no se almacenan; si `/proyectos` crece, se evaluará MDX o CMS.
- **Fecha**: 2026-07-15

## 7. Envío del formulario simulado en esta etapa

- **Contexto**: el formulario completo (UI + validación) forma parte de la base, el envío real no.
- **Elección**: RHF + Zod validando en cliente; submit con retardo simulado y estado de éxito; sin endpoint.
- **Motivo**: separa la entrega de la base de las credenciales de terceros (Resend/Turnstile) que aún no existen.
- **Alternativas**: mailto (mala UX), integrar Resend ya (bloqueado por credenciales y por alcance).
- **Consecuencias**: la ruta de integración está documentada (docs/ARCHITECTURE.md) y el esquema Zod se reutilizará tal cual en el servidor.
- **Fecha**: 2026-07-15

## 8. Segmentos de URL en español para los tres idiomas

- **Contexto**: next-intl permite traducir rutas (`pathnames`).
- **Elección**: mantener `/servicios`, `/nosotros`… también en `/pt` y `/en` por ahora.
- **Motivo**: requisito explícito de esta etapa: evitar complejidad innecesaria; hreflang y canonical ya resuelven el SEO.
- **Alternativas**: `pathnames` de next-intl (se evaluará más adelante; el cambio es localizado en `routing.ts`).
- **Consecuencias**: URLs menos "nativas" en pt/en temporalmente; migrar después implicará redirecciones 301.
- **Fecha**: 2026-07-15

## 9. Tests e2e contra build de producción, sin unit tests

- **Contexto**: base con poca lógica pura; lo crítico es el comportamiento visible (idiomas, rutas, formulario).
- **Elección**: Playwright contra `next build && next start`, tres viewports, selectores accesibles.
- **Motivo**: máxima señal por test; el build de producción evita falsos positivos del dev server; los selectores por rol vigilan accesibilidad de rebote.
- **Alternativas**: Vitest + Testing Library (se añadirá cuando haya lógica de negocio que lo amerite), Cypress.
- **Consecuencias**: suite algo más lenta (~30 s + build); 78 tests cubren los requisitos de la etapa.
- **Fecha**: 2026-07-15
