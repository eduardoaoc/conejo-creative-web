# ConejoCreative — Sitio institucional

> **Tu salto hacia el éxito.**

Sitio web institucional de **ConejoCreative**, empresa de transformación digital especializada en desarrollo web, software a medida, automatización, integraciones y soluciones digitales para empresas.

Este repositorio contiene la **base técnica** del sitio: arquitectura, internacionalización, SEO, componentes iniciales, formulario de contacto y tests. El diseño visual definitivo se desarrollará en una fase posterior.

## Stack

| Tecnología            | Uso                                       |
| --------------------- | ----------------------------------------- |
| Next.js 16            | Framework (App Router, Server Components) |
| React 19              | UI                                        |
| TypeScript            | Tipado estricto en todo el proyecto       |
| Tailwind CSS v4       | Estilos utilitarios y tokens de tema      |
| next-intl 4           | Internacionalización (es / pt / en)       |
| Motion                | Animaciones de componentes                |
| GSAP + ScrollTrigger  | Timelines y animaciones ligadas al scroll |
| React Hook Form + Zod | Formulario de contacto y validación       |
| Playwright            | Tests end-to-end                          |
| ESLint + Prettier     | Calidad y formato de código               |

Detalle completo en [docs/TECH-STACK.md](docs/TECH-STACK.md).

## Requisitos

- Node.js 20.9 o superior (desarrollado con Node 24)
- npm 10 o superior

## Instalación

```bash
npm install
cp .env.example .env.local   # opcional en local: hay valores por defecto seguros
npx playwright install chromium   # solo para ejecutar los tests e2e
```

## Comandos

| Comando                | Descripción                                       |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo en `http://localhost:3000` |
| `npm run build`        | Build de producción                               |
| `npm run start`        | Sirve el build de producción                      |
| `npm run lint`         | ESLint (en Next 16 `next lint` ya no existe)      |
| `npm run typecheck`    | Comprobación de tipos sin emitir                  |
| `npm run format`       | Formatea con Prettier                             |
| `npm run format:check` | Comprueba el formato sin escribir                 |
| `npm run test:e2e`     | Tests Playwright (compila y sirve el build solo)  |

## Idiomas

| Locale | Idioma                       | URL                         |
| ------ | ---------------------------- | --------------------------- |
| `es`   | Español (España) — principal | `/es` (y `/` redirige aquí) |
| `pt`   | Portugués (Brasil)           | `/pt`                       |
| `en`   | Inglés internacional         | `/en`                       |

Los textos viven en `messages/{es,pt,en}.json`. Guía completa en [docs/I18N.md](docs/I18N.md).

## Estructura

```text
messages/            Traducciones (una por idioma)
e2e/                 Tests Playwright
docs/                Documentación técnica
public/assets/       Imágenes, vídeos, iconos, logos y fuentes
src/
├── app/             App Router (rutas, robots, sitemap, css global)
│   └── [locale]/    Layout y páginas por idioma
├── components/      layout / navigation / sections / ui / motion / forms
├── config/          Configuración central (sitio, navegación, entorno)
├── hooks/           Hooks de cliente reutilizables
├── i18n/            routing, navigation y request de next-intl
├── lib/             Utilidades (metadata, esquema de contacto, cn)
├── types/           Tipos compartidos
└── proxy.ts         Proxy de next-intl (redirecciones de idioma)
```

## Variables de entorno

Copia `.env.example` y ajusta según el entorno. Solo `NEXT_PUBLIC_SITE_URL` se usa hoy (tiene valor por defecto `https://conejocreative.com`); el resto son integraciones futuras ya documentadas. Ver [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).

## Documentación

| Documento                                    | Contenido                                        |
| -------------------------------------------- | ------------------------------------------------ |
| [docs/PROJECT.md](docs/PROJECT.md)           | Contexto, objetivos y alcance                    |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura y flujo de renderizado              |
| [docs/TECH-STACK.md](docs/TECH-STACK.md)     | Cada tecnología y por qué                        |
| [docs/I18N.md](docs/I18N.md)                 | Internacionalización                             |
| [docs/ANIMATIONS.md](docs/ANIMATIONS.md)     | Cuándo usar CSS, Motion o GSAP                   |
| [docs/SEO.md](docs/SEO.md)                   | Metadata, sitemap, hreflang, canonical           |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md)   | Estrategia de rendimiento                        |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)   | Flujo de desarrollo y convenciones               |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)     | Despliegue futuro (GitHub → Vercel → Cloudflare) |
| [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)   | Variables de entorno                             |
| [docs/TESTING.md](docs/TESTING.md)           | Estrategia y ejecución de tests                  |
| [docs/DECISIONS.md](docs/DECISIONS.md)       | Registro de decisiones técnicas                  |
