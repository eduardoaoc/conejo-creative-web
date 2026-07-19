import { expect, test } from '@playwright/test';

const locales = ['es', 'pt', 'en'];
const paths = ['', '/servicios', '/proyectos', '/nosotros', '/contacto'];

for (const locale of locales) {
  for (const path of paths) {
    test(`/${locale}${path} loads without console errors or horizontal overflow`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') {
          errors.push(message.text());
        }
      });
      page.on('pageerror', (error) => {
        errors.push(error.message);
      });

      await page.goto(`/${locale}${path}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // Comprobación básica de responsividad: sin scroll horizontal.
      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );

      expect(hasHorizontalOverflow).toBe(false);
      expect(errors).toEqual([]);
    });
  }
}
