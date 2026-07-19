# PROJECT — Contexto y alcance

## Contexto

ConejoCreative es una empresa de transformación digital especializada en desarrollo web, software a medida, automatización, integraciones y soluciones digitales para empresas. Su eslogan es **«Tu salto hacia el éxito.»**

Este proyecto es su sitio institucional: la carta de presentación pública de la empresa y el principal canal de captación de clientes.

## Objetivos

1. Presentar los servicios de la empresa con claridad.
2. Generar confianza (proyectos, forma de trabajar, valores).
3. Captar solicitudes cualificadas mediante el formulario de contacto.
4. Posicionar en buscadores en tres idiomas (SEO multilingüe).
5. Servir de base técnica sólida para evolucionar el producto sin reescrituras.

## Público objetivo

- Pymes y empresas medianas de España y Brasil que quieren digitalizarse.
- Empresas internacionales (inglés) que buscan un partner de desarrollo.
- Perfiles decisores no técnicos: el lenguaje del sitio evita la jerga.

## Páginas actuales

| Ruta                  | Contenido                                          |
| --------------------- | -------------------------------------------------- |
| `/[locale]`           | Hero con eslogan + avance de servicios             |
| `/[locale]/servicios` | Catálogo de los ocho servicios                     |
| `/[locale]/proyectos` | Aviso de casos en preparación + proceso de trabajo |
| `/[locale]/nosotros`  | Misión y valores                                   |
| `/[locale]/contacto`  | Formulario de contacto (envío simulado)            |

Los segmentos de URL se mantienen en español en los tres idiomas en esta etapa; la traducción de rutas (`pathnames` de next-intl) se evaluará más adelante.

## Funcionalidades actuales

- Internacionalización completa (es/pt/en) con selector de idioma que conserva la ruta.
- SEO técnico: metadata por página e idioma, hreflang, canonical, sitemap multilingüe, robots.
- Formulario de contacto validado (React Hook Form + Zod) con envío **simulado**.
- Animaciones de ejemplo (Motion, GSAP ScrollTrigger) con respeto a `prefers-reduced-motion`.
- Tests e2e (Playwright) en tres tamaños de pantalla.

## Funcionalidades futuras

- Envío real del formulario (route handler + Resend + Cloudflare Turnstile).
- Página de política de privacidad y aviso legal (requisito antes del lanzamiento).
- Casos de éxito reales en `/proyectos` (posible CMS o contenido en MDX).
- Datos estructurados (JSON-LD de organización y servicios).
- Imagen Open Graph por idioma.
- Diseño visual definitivo y animaciones cinematográficas.
- Analítica respetuosa con la privacidad.

## Requisitos no funcionales

- **Rendimiento**: Core Web Vitals en verde; páginas estáticas por defecto.
- **Accesibilidad**: HTML semántico, navegación por teclado, contraste AA, movimiento reducido.
- **SEO**: indexable en tres idiomas sin contenido duplicado.
- **Mantenibilidad**: TypeScript estricto, cero `any`, lint y format en CI futura.
- **Compatibilidad**: navegadores evergreen, móvil primero (390px como mínimo probado).
