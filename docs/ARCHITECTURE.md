# ARCHITECTURE — Arquitectura del proyecto

## Visión general

Aplicación **Next.js 16 con App Router**, renderizada de forma **estática** en build (SSG): las cinco páginas existen pre-renderizadas para cada uno de los tres idiomas (20 documentos HTML incluyendo `not-found`). No hay base de datos ni backend propio en esta etapa.

```text
Petición → Proxy (next-intl) → Ruta /[locale]/... → HTML estático + hidratación selectiva
```

- `/` se redirige a `/es` en el proxy (`src/proxy.ts`).
- Un locale desconocido (`/fr`) devuelve 404 mediante `notFound()` en el layout.

> Nota Next 16: el fichero `middleware.ts` pasó a llamarse `proxy.ts`. Cumple la misma función.

## Server Components por defecto

Todo componente es **Server Component** salvo que necesite estado, eventos o APIs del navegador. Los Client Components actuales son exactamente estos, y la frontera está lo más abajo posible del árbol:

| Client Component                           | Motivo                                      |
| ------------------------------------------ | ------------------------------------------- |
| `components/navigation/MobileMenu.tsx`     | Estado abierto/cerrado, teclado (Escape)    |
| `components/navigation/LocaleSwitcher.tsx` | Evento `change` + `useRouter`/`usePathname` |
| `components/forms/ContactForm.tsx`         | React Hook Form (estado del formulario)     |
| `components/motion/FadeIn.tsx`             | Motion (animación en cliente)               |
| `components/motion/ScrollReveal.tsx`       | GSAP + ScrollTrigger (DOM, scroll)          |
| `hooks/usePrefersReducedMotion.ts`         | `window.matchMedia`                         |

Los layouts y páginas **no** llevan `"use client"`. `Header` es Server Component y compone islas de cliente pequeñas (menú móvil, selector).

## Flujo de renderizado

1. **Build**: `generateStaticParams` en `app/[locale]/layout.tsx` genera es/pt/en; `setRequestLocale` habilita el renderizado estático con next-intl.
2. **Metadata**: cada página implementa `generateMetadata` apoyándose en `lib/metadata.ts` (título, descripción, canonical, hreflang, Open Graph por idioma).
3. **Runtime**: el HTML llega completo; solo se hidratan las islas de cliente listadas arriba.

## Organización de carpetas

```text
src/
├── app/                  Rutas. Solo composición: nada de lógica de negocio.
│   ├── [locale]/         layout (html/body, Header/Footer) + 5 páginas
│   ├── globals.css       Tailwind v4 + tokens de tema + reduced motion
│   ├── icon.svg          Favicon provisional
│   ├── robots.ts         robots.txt generado
│   └── sitemap.ts        Sitemap multilingüe generado
├── components/
│   ├── layout/           Header, Footer
│   ├── navigation/       DesktopNav, MobileMenu, LocaleSwitcher
│   ├── sections/         Secciones de página (Hero, ServicesPreview)
│   ├── ui/               Primitivas (Container, Section, Button, PageTitle)
│   ├── motion/           Envoltorios de animación (FadeIn, ScrollReveal)
│   └── forms/            ContactForm
├── config/               env (validado con Zod), site, navigation
├── hooks/                usePrefersReducedMotion
├── i18n/                 routing, navigation, request (next-intl)
├── lib/                  metadata, contact-schema, cn
├── types/                Tipos compartidos (Locale)
└── proxy.ts              Redirecciones de idioma
```

Ajustes deliberados sobre la estructura sugerida (ver docs/DECISIONS.md):

- No existe `src/app/api/` todavía: no hay endpoints reales y no creamos carpetas vacías.
- No existe `src/styles/`: el único CSS global vive en `src/app/globals.css`.

## Separación de responsabilidades

- **`app/`** compone; **`components/`** presenta; **`lib/`** calcula; **`config/`** declara.
- Los textos visibles viven **solo** en `messages/*.json`.
- Los valores dependientes del entorno pasan por `config/env.ts` (validación Zod temprana).

## Estrategia para APIs futuras

El primer endpoint será el del formulario de contacto:

1. Crear `src/app/api/contact/route.ts` (route handler `POST`).
2. Reutilizar `createContactSchema` de `lib/contact-schema.ts` para validar en servidor (misma fuente de verdad que el cliente).
3. Verificar el token de Turnstile con `TURNSTILE_SECRET_KEY`.
4. Enviar el correo con Resend (`RESEND_API_KEY` → `CONTACT_EMAIL`).
5. En `ContactForm.onSubmit`, sustituir la simulación por `fetch('/api/contact')`.

El matcher del proxy ya excluye `/api`, por lo que los endpoints no pasarán por la lógica de idiomas.
