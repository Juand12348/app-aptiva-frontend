# Design — Aptiva AI

Mundo visual: **álbum de láminas**. Cada examen es un álbum que se llena; responder «pega» la lámina en su casilla. Los tokens viven en `src/index.css` (`@theme`) y se usan como clases de Tailwind (`bg-navy`, `text-emerald-ink`, …).

## Color (60 / 30 / 10, fijado por el usuario)

| Rol | Token | Valor | Uso |
|---|---|---|---|
| Dominante 60 % | `paper` | `#EAF2FB` | Fondo de página |
| | `paper-deep` | `#D6E4F5` | Fondos internos de lámina; texto secundario sobre marino |
| Secundario 30 % | `navy` | `#0E2240` | Bandas, tipografía, contornos de lámina, foco |
| | `navy-soft` | `#1B3560` | Hover sobre marino |
| | `ink-muted` | `#3E5878` | Texto secundario sobre claro |
| | `slot` | `#6F89AD` | Bordes de campos y casillas vacías (≥3:1 sobre blanco) |
| Acento 10 % | `emerald` | `#10B981` | **Solo** estados vivos y acción principal: botón primario, pestaña activa, lámina pegada/seleccionada |
| | `emerald-ink` | `#047857` | Esmeralda como texto sobre claro |
| | `emerald-tint` | `#E3F8EF` | Fondo de alerta de éxito |
| Estado | `danger` / `danger-tint` | `#B42318` / `#FDECEA` | Errores |

Texto sobre esmeralda siempre en `navy` (6.3:1), nunca blanco.

## Tipografía

- Display: **Bricolage Grotesque** 700–800 (titulares, botones, números de lámina), tracking −0.02em.
- Cuerpo: **Figtree** 400–700.
- Ambas autoalojadas en `src/assets/fonts/` (OFL). Cifras con `tabular-nums` en datos.

## Lámina (componente base del mundo)

Tarjeta blanca con borde blanco grueso (`border-[5–6px] border-white`), contorno `ring-2 ring-navy` en tarjetas principales, `rounded-xl/2xl`, sombra neutra marina con offset. Vocabulario de estados fijo:

- Vacía: borde punteado `slot`.
- Pegada / seleccionada: fondo `emerald`, texto `navy`.
- Actual: contorno `navy` 2px.
- Números de casilla (navegador 1–30, historial): mínimo 11px; si la casilla no cabe, se agranda la casilla, no se encoge el número.

## Movimiento

- `animate-stick` (firma): la lámina cae girando y aterriza con rebote en su inclinación (`--tilt`).
- `animate-rise`: entrada de página y alertas (ease-out expo).
- `animate-float`: flotación lenta de láminas decorativas.
- `animate-nudge`: sacudida corta en campos con error.
- Todo se desactiva con `prefers-reduced-motion`.

## Superficies del navegador

Selección esmeralda con texto marino, caret marino, `accent-color` esmeralda, scrollbar `slot`/`paper`, foco `outline 2px navy` (sobre marino: `focus-visible:outline-emerald`).

## Prohibido

Eyebrows o kickers encima de títulos, sombras de brillo de color, bordes laterales de color en tarjetas o alertas, degradados de texto, esmeralda como decoración sin estado.
