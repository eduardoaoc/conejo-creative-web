import { expect, test } from '@playwright/test';

test.describe('contact form', () => {
  test('is visible with all its fields', async ({ page }) => {
    await page.goto('/es/contacto');

    await expect(page.getByLabel('Nombre')).toBeVisible();
    await expect(page.getByLabel('Empresa')).toBeVisible();
    await expect(page.getByLabel('Correo electrónico')).toBeVisible();
    await expect(page.getByLabel('Teléfono')).toBeVisible();
    await expect(page.getByLabel('Servicio que te interesa')).toBeVisible();
    await expect(page.getByLabel('Mensaje')).toBeVisible();
    await expect(page.getByRole('checkbox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeVisible();
  });

  test('shows translated validation errors on empty submit', async ({ page }) => {
    await page.goto('/es/contacto');

    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    await expect(page.getByText('Introduce tu nombre (mínimo 2 caracteres).')).toBeVisible();
    await expect(page.getByText('Introduce un correo electrónico válido.')).toBeVisible();
    await expect(page.getByText('Selecciona un servicio.')).toBeVisible();
    await expect(page.getByText('Debes aceptar la política de privacidad.')).toBeVisible();
  });

  test('simulates a successful submission with valid data', async ({ page }) => {
    await page.goto('/es/contacto');

    await page.getByLabel('Nombre').fill('María García');
    await page.getByLabel('Empresa').fill('García e Hijos SL');
    await page.getByLabel('Correo electrónico').fill('maria@example.com');
    await page.getByLabel('Teléfono').fill('+34 600 000 000');
    await page.getByLabel('Servicio que te interesa').selectOption('web');
    await page
      .getByLabel('Mensaje')
      .fill('Necesitamos renovar la web corporativa de nuestra empresa.');
    await page.getByRole('checkbox').check();

    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    await expect(page.getByRole('status')).toContainText('¡Mensaje enviado!');
  });
});
