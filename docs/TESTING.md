# TESTING — Estrategia de tests

## Enfoque

Tests **end-to-end con Playwright** contra el **build de producción** (el `webServer` de `playwright.config.ts` ejecuta `next build && next start` en el puerto 3100 automáticamente). Se prueba lo que un visitante experimenta; con la poca lógica pura que hay hoy, los unit tests no aportarían valor proporcional.

## Ejecución

```bash
npx playwright install chromium   # una sola vez
npm run test:e2e                  # los 78 tests
npx playwright test e2e/home.spec.ts        # un fichero
npx playwright test --project=mobile        # un solo viewport
npx playwright show-report                  # informe HTML del último run
```

## Viewports

Cada test corre en tres proyectos (los tamaños exigidos por el proyecto):

| Proyecto  | Tamaño   |
| --------- | -------- |
| `mobile`  | 390×844  |
| `tablet`  | 768×1024 |
| `desktop` | 1440×900 |

## Cobertura actual (26 tests × 3 viewports = 78)

| Fichero                       | Qué verifica                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/home.spec.ts`            | `/` redirige a `/es`; la home carga en es/pt/en con `<html lang>` y `<h1>` traducidos                                                    |
| `e2e/navigation.spec.ts`      | Navegación principal (usa el menú hamburguesa cuando es visible) y navegación del footer                                                 |
| `e2e/locale-switcher.spec.ts` | El selector cambia de idioma **conservando la ruta actual** (es→pt y en→es)                                                              |
| `e2e/contact.spec.ts`         | Formulario visible con todos los campos; errores de validación traducidos al enviar vacío; envío simulado con éxito                      |
| `e2e/smoke.spec.ts`           | Las 15 páginas (5 rutas × 3 idiomas) cargan sin errores de consola, sin `pageerror` y **sin overflow horizontal** (responsividad básica) |

## Convenciones

- Selectores accesibles (`getByRole`, `getByLabel`) — si un test no encuentra algo por rol, probablemente el HTML tiene un problema de accesibilidad.
- Los tests dependen de los textos de `messages/*.json`: si cambia un texto usado como selector, actualizar el test es parte del cambio.
- Tests nuevos: un fichero por área funcional en `e2e/`; parametrizar por locale cuando aplique (patrón de `smoke.spec.ts`).

## Futuro

- Job de CI en GitHub Actions (ver docs/DEPLOYMENT.md).
- Tests de accesibilidad automatizados (`@axe-core/playwright`) cuando exista el diseño final.
- Comprobaciones de regresión visual si el diseño lo justifica.
