# ANIMATIONS — Estrategia de animación

## Qué herramienta usar

| Herramienta            | Cuándo                                                                    | Ejemplo en el proyecto                                             |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **CSS (Tailwind)**     | Microinteracciones: hover, focus, transiciones de color/transform simples | `ui/Button.tsx` (elevación al hover), hamburguesa del `MobileMenu` |
| **Motion**             | Animaciones de componentes React: entradas, salidas, presencia, gestos    | `motion/FadeIn.tsx` (fade + desplazamiento del título)             |
| **GSAP**               | Timelines complejas, orquestación de varias piezas, control fino          | (futuras escenas cinematográficas)                                 |
| **GSAP ScrollTrigger** | Animaciones vinculadas a la posición de scroll                            | `motion/ScrollReveal.tsx` (stagger de tarjetas en la home)         |

Criterio de decisión: usa la herramienta **más simple** que resuelva el caso. CSS antes que Motion; Motion antes que GSAP. GSAP solo cuando haya timeline u orquestación de scroll real.

## Reglas del proyecto

1. **No animar todo.** La animación subraya jerarquía; la base debe funcionar sin ella.
2. **Sin layout shift**: animar `opacity` y `transform`, nunca propiedades que afecten al layout (`height`, `margin`, `top`…).
3. **`prefers-reduced-motion` se respeta en tres capas**:
   - CSS global (`globals.css`) anula transiciones y animaciones CSS;
   - `FadeIn` usa `useReducedMotion()` de Motion;
   - `ScrollReveal` usa `usePrefersReducedMotion()` (hook propio) y no registra ningún tween.
4. **Limpieza obligatoria**: todo GSAP vive dentro de `gsap.context(...)` y se limpia con `ctx.revert()` al desmontar (tweens + ScrollTriggers + listeners). Motion se limpia solo.
5. **GSAP solo en Client Components.** `gsap` y `ScrollTrigger` no deben importarse jamás desde Server Components: `registerPlugin` toca APIs del navegador.
6. **Móvil**: preferir animaciones `once: true` y cortas; nada de efectos continuos ligados a scroll en esta etapa. Si una escena futura es pesada, desactivarla por debajo de un breakpoint (`ScrollTrigger.matchMedia`).
7. **Servidor**: los envoltorios de animación aceptan `children`, así el contenido sigue siendo Server Component y solo el envoltorio se hidrata.

## Componentes disponibles

### `<FadeIn>` (Motion)

```tsx
<FadeIn delay={0.1} className="max-w-3xl">
  <h1>…</h1>
</FadeIn>
```

Fade + desplazamiento vertical al entrar en el viewport (una sola vez). Con movimiento reducido, muestra el contenido directamente.

### `<ScrollReveal>` (GSAP + ScrollTrigger)

```tsx
<ScrollReveal>
  <ul>
    <li data-reveal>…</li>
    <li data-reveal>…</li>
  </ul>
</ScrollReveal>
```

Revela con stagger los descendientes marcados con `data-reveal` cuando el contenedor entra en el viewport. Es el patrón de referencia para nuevo código GSAP: contexto acotado al contenedor, `once: true`, `revert()` en el cleanup.

## Qué NO hay todavía (a propósito)

Animaciones cinematográficas completas, parallax, pinning, scroll suave. Cuando lleguen: construirlas como Client Components aislados siguiendo el patrón de `ScrollReveal`, cargarlas con `next/dynamic` si pesan, y validarlas en móvil real antes de fusionar.
