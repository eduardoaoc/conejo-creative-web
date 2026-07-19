# TECH-STACK — Tecnologías y motivos

Versiones instaladas: ver `package.json`. Resumen razonado de cada pieza:

## Next.js 16 (App Router)

- **Responsabilidad**: framework completo — enrutado, renderizado (SSG/SSR), metadata, imágenes, fuentes.
- **Motivo**: SEO multilingüe de primera clase (metadata API, sitemap/robots nativos), Server Components para minimizar JavaScript, y ecosistema maduro para desplegar en Vercel.
- **Ventajas**: páginas estáticas por defecto, Turbopack en dev y build, tipado de rutas, convenciones claras.
- **Limitaciones**: acoplamiento a convenciones propias; cambios de API entre majors (p. ej. `middleware.ts` → `proxy.ts`, desaparición de `next lint`).
- **Dónde se usa**: todo `src/app/`, `next.config.ts`, `src/proxy.ts`.
- **Alternativas rechazadas**: Astro (excelente para estático puro, pero peor encaje para la futura parte de aplicación e integraciones React), Remix/React Router (menos herramientas SEO out of the box), SPA con Vite (SEO y rendimiento inicial peores).

## ¿Por qué no Laravel (PHP)?

Laravel es un framework backend excelente, pero **este proyecto no tiene requisitos de backend todavía**: no hay base de datos, ni autenticación, ni panel. Todo el valor actual está en el frontend (contenido estático multilingüe + SEO + animaciones). Un stack Laravel habría implicado:

- servidor PHP siempre activo para servir contenido que puede ser estático (peor coste/rendimiento);
- plantillas Blade o un frontend acoplado (Inertia) menos adecuados para Server Components, Motion y GSAP;
- duplicar despliegue (backend + frontend) sin beneficio en esta etapa.

Cuando exista lógica de servidor real (envío de correo, futuros sistemas), los route handlers de Next.js cubren la primera fase; si el backend crece hasta necesitar un framework dedicado, se evaluará entonces con requisitos reales sobre la mesa.

## React 19

- **Responsabilidad**: modelo de componentes.
- **Motivo**: requerido por Next 16; Server Components estables.
- **Dónde**: todos los componentes.

## TypeScript (estricto)

- **Responsabilidad**: tipado estático de todo el código.
- **Motivo**: mantenibilidad y refactors seguros; `strict` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` detectan errores reales.
- **Limitaciones**: fricción inicial en integraciones con tipos complejos (p. ej. RHF + Zod input/output).
- **Alternativa rechazada**: JavaScript — descartado por requisito y por criterio.

## Tailwind CSS v4

- **Responsabilidad**: estilos utilitarios y tokens de diseño (`@theme` en `globals.css`).
- **Motivo**: velocidad de iteración, purga automática, tokens CSS-first en v4 (sin `tailwind.config`).
- **Ventajas**: CSS final mínimo; coherencia vía tokens (`--color-brand-*`).
- **Limitaciones**: clases largas en JSX; se mitiga con componentes pequeños.
- **Alternativas rechazadas**: CSS Modules (más ceremonia para un sistema de diseño en evolución), styled-components/emotion (coste en runtime, mal encaje con Server Components), librerías UI prontas (excluidas por requisito: la identidad visual será propia).

## next-intl 4

- **Responsabilidad**: i18n completa — enrutado por locale, mensajes, metadata traducida, navegación consciente del idioma.
- **Motivo**: es la librería de referencia para App Router; soporta renderizado estático (`setRequestLocale`), `hreflang` y proxy de redirección.
- **Limitaciones**: API con varias piezas (routing/request/navigation) que hay que conocer.
- **Alternativas rechazadas**: next-i18next (orientada a Pages Router), lingui/formatjs a mano (más cableado manual con App Router).

## Motion (v12)

- **Responsabilidad**: animaciones declarativas de componentes (entradas, hover, presencia).
- **Motivo**: API declarativa que encaja con React, `useReducedMotion` integrado, buen tree-shaking.
- **Dónde**: `components/motion/FadeIn.tsx` (y futuros componentes animados).
- **Limitaciones**: menos control fino que GSAP para timelines largas u orquestación por scroll.

## GSAP 3 + ScrollTrigger

- **Responsabilidad**: timelines complejas y animaciones vinculadas al scroll.
- **Motivo**: es el estándar para animación cinematográfica de alto rendimiento; ScrollTrigger no tiene equivalente serio.
- **Dónde**: `components/motion/ScrollReveal.tsx`. Solo se importa desde Client Components.
- **Limitaciones**: imperativo; exige disciplina de limpieza (`gsap.context` + `revert()`), ya encapsulada en el componente.
- **Reparto con Motion**: ver docs/ANIMATIONS.md — CSS para microinteracciones, Motion para componentes, GSAP para escenas.

## React Hook Form 7 + Zod 4

- **Responsabilidad**: estado del formulario (RHF) y validación/esquema (Zod), unidos por `@hookform/resolvers`.
- **Motivo**: RHF minimiza renders; Zod da una única fuente de verdad reutilizable en el futuro endpoint del servidor. Zod valida también las variables de entorno (`config/env.ts`).
- **Limitaciones**: tipos input/output de Zod requieren atención (documentado en `lib/contact-schema.ts`).
- **Alternativas rechazadas**: Formik (más renders, mantenimiento estancado), validación manual (duplicaría reglas cliente/servidor).

## ESLint 9 + Prettier

- **Responsabilidad**: calidad (ESLint, flat config con presets de Next) y formato (Prettier + plugin de orden de clases Tailwind).
- **Nota Next 16**: `next lint` fue retirado; el script `lint` invoca `eslint .` directamente.

## Playwright

- **Responsabilidad**: tests end-to-end reales en navegador, en tres viewports (390×844, 768×1024, 1440×900).
- **Motivo**: prueba lo que importa en un sitio institucional (rutas, idiomas, formulario, consola limpia) contra el build de producción.
- **Alternativa rechazada**: Cypress (más lento, peor paralelización); unit tests aportarían poco con esta cantidad de lógica.
