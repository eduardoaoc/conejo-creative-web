# ENVIRONMENT — Variables de entorno

Plantilla: `.env.example` (copiar a `.env.local` para desarrollo; `.env*` está en `.gitignore`).

## Validación

Todas las variables pasan por `src/config/env.ts`, que las valida con **Zod al arrancar** (build o servidor): un valor inválido rompe pronto y con mensaje claro, no en producción a mitad de petición. Las cadenas vacías se normalizan a `undefined` para que los campos opcionales no fallen.

Para añadir una variable nueva: añadirla a `.env.example`, al esquema de `env.ts` y documentarla aquí.

## Variables

| Variable                         | Ámbito             | Estado     | Descripción                                                                                                                |
| -------------------------------- | ------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Cliente + servidor | **En uso** | URL pública sin barra final. Base de canonical, hreflang, sitemap y Open Graph. Por defecto: `https://conejocreative.com`. |
| `RESEND_API_KEY`                 | Solo servidor      | Futura     | API key de Resend para el envío del formulario de contacto.                                                                |
| `CONTACT_EMAIL`                  | Solo servidor      | Futura     | Buzón receptor de los mensajes del formulario.                                                                             |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cliente            | Futura     | Site key pública del widget Cloudflare Turnstile.                                                                          |
| `TURNSTILE_SECRET_KEY`           | Solo servidor      | Futura     | Secreto de verificación del token Turnstile.                                                                               |

## Reglas de seguridad

- Solo las variables con prefijo `NEXT_PUBLIC_` llegan al navegador (Next las inserta en build). **Nada sensible con ese prefijo, jamás.**
- `RESEND_API_KEY`, `CONTACT_EMAIL` y `TURNSTILE_SECRET_KEY` se consumirán únicamente desde route handlers (servidor).
- No hay credenciales reales en el repositorio: `.env.example` contiene solo placeholders vacíos.
- En Vercel, configurar las variables por entorno (Production / Preview / Development).
