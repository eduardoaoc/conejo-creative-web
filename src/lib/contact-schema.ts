import { z } from 'zod';

export const contactServices = [
  'web',
  'software',
  'automation',
  'integrations',
  'ai',
  'other',
] as const;

export type ContactService = (typeof contactServices)[number];

export type ContactErrorKey =
  | 'errors.name'
  | 'errors.company'
  | 'errors.email'
  | 'errors.phone'
  | 'errors.service'
  | 'errors.message'
  | 'errors.consent';

// El esquema recibe un traductor para que los mensajes de error salgan
// siempre de los ficheros de mensajes y nunca queden fijos en el código.
export function createContactSchema(t: (key: ContactErrorKey) => string) {
  return z.object({
    name: z.string().min(2, t('errors.name')),
    company: z.string().min(2, t('errors.company')),
    email: z.email(t('errors.email')),
    phone: z.string().min(6, t('errors.phone')),
    service: z
      .union([z.enum(contactServices), z.literal('')])
      .refine((value) => value !== '', t('errors.service')),
    message: z.string().min(10, t('errors.message')),
    consent: z.boolean().refine((value) => value, t('errors.consent')),
  });
}

// El campo `service` admite '' mientras se rellena (input), pero nunca tras validar (output).
export type ContactFormInput = z.input<ReturnType<typeof createContactSchema>>;
export type ContactFormValues = z.output<ReturnType<typeof createContactSchema>>;
