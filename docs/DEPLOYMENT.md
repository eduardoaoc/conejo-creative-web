# DEPLOYMENT — Despliegue (futuro)

> **Aún no se ha realizado ningún despliegue.** Este documento describe el plan.

## Cadena prevista

```text
GitHub → Vercel → Cloudflare
```

1. **GitHub** — repositorio remoto. Push a `main` dispara producción; cada PR genera un preview deploy.
2. **Vercel** — build (`next build`) y hosting. Es la plataforma nativa de Next.js: soporta el proxy de next-intl, SSG y los futuros route handlers sin configuración.
3. **Cloudflare** — DNS del dominio `conejocreative.com` y capa de seguridad. **Importante**: modo DNS-only (nube gris) o, si se activa el proxy naranja, SSL en modo _Full (Strict)_ para evitar bucles de redirección con Vercel. Turnstile (anti-spam del formulario) también es de Cloudflare.

## Pasos cuando toque

1. Crear repositorio GitHub y subir `main`.
2. Importar el proyecto en Vercel (framework autodetectado).
3. Configurar variables de entorno en Vercel (ver docs/ENVIRONMENT.md):
   - `NEXT_PUBLIC_SITE_URL=https://conejocreative.com` (producción);
   - en previews puede omitirse (hay valor por defecto) o apuntar a la URL del preview.
4. Apuntar el dominio en Cloudflare a Vercel (CNAME `cname.vercel-dns.com`).
5. Verificación post-deploy: `/` → `/es`, `/robots.txt`, `/sitemap.xml`, hreflang (rastreador de Search Console), Lighthouse.

## CI recomendada (previa al deploy)

GitHub Actions con cuatro jobs sobre cada PR: `lint`, `typecheck`, `build`, `test:e2e`. Vercel no debe ser quien descubra los errores.

## Notas

- No hay base de datos ni estado de servidor: rollback = redeploy del commit anterior en Vercel.
- Cuando exista el endpoint de contacto, `RESEND_API_KEY`, `CONTACT_EMAIL` y `TURNSTILE_SECRET_KEY` se configuran **solo** en Vercel (server-side), nunca expuestas al cliente.
