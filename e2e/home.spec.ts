import { expect, test } from '@playwright/test';

test('/ redirects to /es', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/es$/);
});

const homePages = [
  { locale: 'es', lang: 'es', heading: 'Tu salto hacia el éxito.' },
  { locale: 'pt', lang: 'pt-BR', heading: 'Seu salto rumo ao sucesso.' },
  { locale: 'en', lang: 'en', heading: 'Your leap to success.' },
];

for (const { locale, lang, heading } of homePages) {
  test(`/${locale} renders the localized home page`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
  });
}
