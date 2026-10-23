# MarkeWeed · Portfolio — Notas

## Probar en local
```bash
npx serve site          # o: npx http-server site
```
También puedes abrir `site/index.html` directamente: todos los scripts son clásicos (`defer`) y funcionan sin servidor.

## Desplegar en Netlify
- Arrastra la carpeta `site/` a **Netlify Drop**, o
- `netlify deploy --dir=site --prod`, o conecta el repo (el `netlify.toml` de la raíz ya publica `site`).

`_headers` aplica `noindex`, CSP estricta (solo recursos propios, `connect-src 'none'`) y otras cabeceras de seguridad. `robots.txt` bloquea todo.

## Decisiones tomadas
| Tema | Decisión |
|---|---|
| Ejemplos | **Mezcla**: stories y posts con la marca **MarkeWeed** (cuenta `markeweed`, cada story etiquetada con su "Formato"); merchandising, carteles, tickets y flyers para el club ficticio **«Club Ejemplo»** (emblema propio en el sprite: `#emblem`). |
| Imágenes | Solo SVG/CSS dibujados a mano. Sin fotos, sin personas, sin plantas, humo ni producto. Sin vapor en la taza (podía leerse como humo). |
| +18 | **Pantalla bloqueante** al entrar ("¿Eres mayor de edad?"). "Sí" se recuerda en `localStorage` (`mw-age-ok`); "No" muestra un aviso y la web sigue bloqueada. Visitas posteriores: intro corta del logo (≤1,75 s, saltable con clic/Enter/Esc). Con `prefers-reduced-motion` no hay animación. |
| Descuento | Sin cifra. `js/config.js → SHOW_DISCOUNT_PERCENT = false`. Si se activa y se rellena `DISCOUNT_PERCENT`, aparece en la nota del configurador. |
| Configurador | "Volumen mensual" = al menos 8 stories, 2 vídeos o 3 posts. Si no se llega, se recomiendan **Servicios individuales** (se evalúa antes del Plan Inicio para que ese caso sea alcanzable). Casos comprobados: 22/4/6 → Inicio · 23/4/6 → WeAreClub · 32/6/8 → WeAreClub · 33/6/8 → A medida · web → Clubsy · web + 23 → Clubsy + extras · 0/0/0 → Individuales. |
| Merch | 16 piezas: Físico (bandeja, grinder, mechero, camiseta, taza, llavero, pegatinas), Papelería (ticket, flyer, cartel, packaging, tarjeta de socio), Digital (portada, destacados, post y story de evento). |
| Cuenta atrás | Story 7 cuenta hasta el próximo viernes a las 21:00 (hora local), siempre en el futuro. |
| Calendario de stories | Usa el mes actual del visitante y reparte las stories de forma uniforme. |
| Idioma | ES por defecto; EN si `navigator.language` no empieza por `es`. La elección se guarda en `localStorage` (`mw-lang`). |
| Fuentes | Convertidas a WOFF2 y reducidas a latín + español (≈134 KB las cuatro). Licencias OFL copiadas en `fonts/`. |

## Cómo editar
- **Textos en español**: directamente en `index.html` (cada texto lleva `data-i18n="clave"`). El JS los recoge al cargar como diccionario ES.
- **Textos en inglés**: `js/i18n.js → DICT.en`, misma clave. Los textos que genera el JS (configurador, modal, captions) están en `DICT.es` y `DICT.en`.
- **Títulos con revelado línea a línea** usan `data-i18n-html` con `<span class="line"><span>…</span></span>`: mantener esa estructura en ambos idiomas.
- **Planes** (cifras de contenido, nunca precios): `js/config.js → PLANS` (configurador) + tarjetas en `index.html` + textos `interest.plan.*`.
- **Colores del merch**: `js/merch.js → SWATCHES`. Las piezas usan clases `mk-main`, `mk-acc`, `mk-ink`, `mk-soft`, `mk-paper`, `mk-text`.
- **Nueva pieza de merch**: copia un `<li class="merch-item" data-cat="…">` y añade sus claves `merch.<pieza>.name/detail` en `DICT.en`.
- **Duración de cada story**: `js/config.js → STORY_DURATION`.

## Comprobado
- 0 errores de consola; solo se cargan recursos del propio origen.
- Sin precios/importes en ES ni EN (grep de €, euro, precio, price, %, /mes, /month, 1800, 299, 599, 230: solo falsos positivos de coordenadas SVG y posiciones CSS).
- Sin enlaces externos, `mailto:` ni `tel:`.
- Sin scroll horizontal a 360, 768 y 1440 px.
- Teclado: puerta +18 con Enter, foco atrapado en modales/panel/visor/menú, Esc cierra y devuelve el foco, flechas en stories, visor y radiogroups.
- `prefers-reduced-motion`: sin intro animada, sin parallax/cursor/tilt, stories en pausa hasta pulsar play.

## Pendiente de revisar por el cliente
- El texto del Marco legal es orientativo: conviene revisarlo con asesoría jurídica antes de enviar el portfolio.

## Paquete de 8 stories para Instagram (`stories-ig/`)
Fuera de `site/`, así que **no se publica** en Netlify. Para la cuenta B2B @markeweed.es (dueños de asociaciones, clubs y growshops de Madrid).
- Guion completo (objetivo, texto, visual e interactivo de cada story): `stories-ig/GUION.md`.
- JPEG 1080 × 1920 para subir en `stories-ig/jpg/`, con el hueco del sticker libre. La maqueta con los stickers dibujados está en `stories-ig/preview/`.
- Secuencia: presentación → problema → servicios → cómo trabajamos → cumplimiento → antes/después → web de invitaciones → CTA por DM.
- Regenerar: `NODE_PATH=$(npm root -g) node stories-ig/render.mjs` (Playwright + Chromium). Textos en `render.mjs` y estilos en `stories-ig/stories.css`.
- Línea de las stories: no usar "comercial" ni "captar/más socios" ni prometer visibilidad o alcance; solo los servicios de branding, perfiles, foto/vídeo/diseño, web con invitación y merch.
- Tipografía: el brief pedía una "bold condensada" para los titulares, pero ninguna de las 4 fuentes de marca es condensada, así que se usa Rubik Mono One (regla de no inventar tipografías).
- **Aviso:** la web (`site/`) todavía usa "gestión comercial" y "más socios", que según esta línea están prohibidos. Conviene revisarla.
