# MarkeWeed

Portfolio comercial de una sola página (HTML + CSS + JS vanilla, sin build) para presentar MarkeWeed a clubs y asociaciones. Se publica en Netlify desde `site/`.

La especificación completa está en `PROYECTO.md`: léela antes de construir o cambiar nada. Si algo no está especificado, elige lo más sensato, respeta las reglas de abajo y anótalo en `site/NOTAS.md`.

## Marca: usa siempre `Brand/` y `assets/`

No modifiques los originales. Cópialos a `site/` cuando se necesiten.

- Logos: `Brand/Logos/MarkeWeed Logos Sin Fondo/` (PNG transparentes) y `Brand/Logos/MarkeWeed Logos Con Fondo/`. Versiones: Navy (principal), Teal, Naranja, Negro y Blanco.
- Logo vectorial: `assets/markeweed-navy.svg` (viewBox `0 0 816 159`, un único `<path>`). Úsalo inline con `fill="currentColor"` para recolorearlo según la sección.
- Fuentes (TTF en `Brand/fonts/`), autoalojadas con `@font-face`:
  - **Syne**: texto general y titulares secundarios.
  - **Rubik Mono One**: títulos de sección y hero, en mayúsculas, con moderación.
  - **Unbounded**: chips, botones, tags y números de paso, pequeño, mayúsculas.
  - **Space Grotesk**: subtítulos pequeños, detalles y leyendas.
- Paleta: navy `#001F3F` (principal), teal `#008080`, naranja `#CC5500` (CTAs y énfasis), blanco `#FFFFFF`, negro `#000000`. Derivados permitidos: `--paper #F4F1EA`, `--navy-900 #00122A`, `--navy-700 #0A3157`, `--teal-300 #3FB0B0`, `--orange-300 #F08A3C`.
- Teal y naranja sobre navy tienen poco contraste: solo para texto grande, decoración e iconos. Para texto pequeño sobre navy usa blanco, `--teal-300` o `--orange-300`.
- No inventes colores ni tipografías fuera de estas.

## Reglas de oro (resumen de `PROYECTO.md` sección 2)

1. Cero precios, importes, tarifas ni descuentos con cifra, en ningún idioma.
2. Cero enlaces externos y cero peticiones a terceros: sin CDN, Google Fonts, analítica ni iframes. Todo autoalojado.
3. Nada de contenido de clubs reales; los ejemplos usan un club ficticio ("Tu Club").
4. Sin plantas, humo, consumo ni producto. Lenguaje neutro: club, asociación, socios, comunidad, eventos.
5. `noindex, nofollow` en meta, en cabecera HTTP y en `robots.txt`.
6. Español e inglés completos, accesible, móvil primero, respeta `prefers-reduced-motion`.

## Idioma de trabajo

Responde y comenta en español.
