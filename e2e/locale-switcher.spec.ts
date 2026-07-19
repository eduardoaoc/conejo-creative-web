import { expect, test } from '@playwright/test';

test('locale switcher preserves the current route', async ({ page }) => {
  await page.goto('/es/servicios');

  await page.getByRole('combobox', { name: 'Idioma' }).selectOption('pt');

  await expect(page).toHaveURL(/\/pt\/servicios$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Serviços');
});

test('locale switcher can go back to Spanish from English', async ({ page }) => {
  await page.goto('/en/contacto');

  await page.getByRole('combobox', { name: 'Language' }).selectOption('es');

  await expect(page).toHaveURL(/\/es\/contacto$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contacto');
});
