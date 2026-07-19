import { expect, test } from '@playwright/test';

test('main navigation reaches the services page', async ({ page }) => {
  await page.goto('/es');

  const header = page.locator('header');
  const menuButton = header.getByRole('button', { name: 'Abrir menú' });

  // En móvil la navegación vive detrás del botón hamburguesa.
  if (await menuButton.isVisible()) {
    await menuButton.click();
  }

  await header.getByRole('link', { name: 'Servicios' }).click();

  await expect(page).toHaveURL(/\/es\/servicios$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Servicios');
});

test('footer navigation reaches the about page', async ({ page }) => {
  await page.goto('/es');

  await page.locator('footer').getByRole('link', { name: 'Nosotros' }).click();

  await expect(page).toHaveURL(/\/es\/nosotros$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nosotros');
});
