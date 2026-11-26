# MarkeWeed · Web — Notas

## Estado actual: "Estamos de reforma" (noviembre 2026)

Por decisión de MarkeWeed, la web completa se ha sustituido por una única página de aviso:

> **Estamos de reforma** (y aún no sabemos si terminaremos… Hablamos por Instagram)

- Se añade el usuario **@markeweed.es** como texto (sin enlace: `CLAUDE.md` prohíbe enlaces externos) y una línea en inglés para cumplir la regla de idiomas.
- Sin JavaScript. La CSP de `_headers` ya no permite scripts.
- Se mantienen `noindex, nofollow` en la meta, en la cabecera `X-Robots-Tag` y en `robots.txt`.
- Se han borrado los logos PNG, `og-image.png` y `tools/csp-hash.py`, que solo usaba la web anterior.

## Qué hay en `site/`
| Archivo | Para qué |
|---|---|
| `index.html` | Página de reforma: HTML + CSS en línea y logo SVG inline (`currentColor`). |
| `_headers` | `noindex` y CSP estricta. |
| `robots.txt` | `Disallow: /`. |
| `fonts/` | WOFF2 autoalojadas y licencias OFL. |
| `img/` | Favicon y apple-touch-icon. |

## Recuperar la web anterior
Sigue en el historial de git: el último commit con la web completa es `249633d`.
```bash
git checkout 249633d -- site tools
```
