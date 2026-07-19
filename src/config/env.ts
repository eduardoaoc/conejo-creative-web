import { z } from 'zod';

// Convierte cadenas vacías del .env en `undefined` para que los campos opcionales no fallen.
const emptyAsUndefined = (value: string | undefined): string | undefined =>
  value && value.length > 0 ? value : undefined;

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .url()
    .default('https://conejocreative.com')
    .transform((url) => url.replace(/\/+$/, '')),
  // Integraciones futuras: se validan ya para que el fallo sea temprano cuando se activen.
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_EMAIL: z.email().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: emptyAsUndefined(process.env.NEXT_PUBLIC_SITE_URL),
  RESEND_API_KEY: emptyAsUndefined(process.env.RESEND_API_KEY),
  CONTACT_EMAIL: emptyAsUndefined(process.env.CONTACT_EMAIL),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: emptyAsUndefined(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
  TURNSTILE_SECRET_KEY: emptyAsUndefined(process.env.TURNSTILE_SECRET_KEY),
});
