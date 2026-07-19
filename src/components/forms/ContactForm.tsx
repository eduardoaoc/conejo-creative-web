'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import {
  contactServices,
  createContactSchema,
  type ContactFormInput,
  type ContactFormValues,
} from '@/lib/contact-schema';

const SIMULATED_SUBMIT_DELAY_MS = 800;

const inputClasses =
  'mt-2 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 aria-invalid:border-red-500';

const labelClasses = 'block text-sm font-medium text-zinc-900';

const errorClasses = 'mt-1 text-sm text-red-600';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const schema = useMemo(() => createContactSchema((key) => t(key)), [t]);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      service: '',
      message: '',
      consent: false,
    },
  });

  const onSubmit = async () => {
    // Envío simulado. La integración real (route handler + Resend + Turnstile)
    // está descrita en docs/ARCHITECTURE.md y docs/ENVIRONMENT.md.
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_SUBMIT_DELAY_MS));
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-lg font-semibold text-green-900">{t('success.title')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-green-800">{t('success.description')}</p>
        <Button variant="secondary" className="mt-6" onClick={() => setSubmitted(false)}>
          {t('success.again')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClasses}>
            {t('name')}
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={inputClasses}
            {...register('name')}
          />
          {errors.name ? (
            <p id="contact-name-error" className={errorClasses}>
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-company" className={labelClasses}>
            {t('company')}
          </label>
          <input
            id="contact-company"
            type="text"
            autoComplete="organization"
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={errors.company ? 'contact-company-error' : undefined}
            className={inputClasses}
            {...register('company')}
          />
          {errors.company ? (
            <p id="contact-company-error" className={errorClasses}>
              {errors.company.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClasses}>
            {t('email')}
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={inputClasses}
            {...register('email')}
          />
          {errors.email ? (
            <p id="contact-email-error" className={errorClasses}>
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClasses}>
            {t('phone')}
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            className={inputClasses}
            {...register('phone')}
          />
          {errors.phone ? (
            <p id="contact-phone-error" className={errorClasses}>
              {errors.phone.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="contact-service" className={labelClasses}>
          {t('service')}
        </label>
        <select
          id="contact-service"
          aria-invalid={errors.service ? true : undefined}
          aria-describedby={errors.service ? 'contact-service-error' : undefined}
          className={inputClasses}
          {...register('service')}
        >
          <option value="">{t('servicePlaceholder')}</option>
          {contactServices.map((service) => (
            <option key={service} value={service}>
              {t(`services.${service}`)}
            </option>
          ))}
        </select>
        {errors.service ? (
          <p id="contact-service-error" className={errorClasses}>
            {errors.service.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClasses}>
          {t('message')}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={inputClasses}
          {...register('message')}
        />
        {errors.message ? (
          <p id="contact-message-error" className={errorClasses}>
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="contact-consent"
            type="checkbox"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
            className="mt-1 h-4 w-4 rounded border-zinc-300"
            {...register('consent')}
          />
          <label htmlFor="contact-consent" className="text-sm leading-relaxed text-zinc-600">
            {t('consent')}
          </label>
        </div>
        {errors.consent ? (
          <p id="contact-consent-error" className={errorClasses}>
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
