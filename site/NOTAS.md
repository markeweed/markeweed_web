# MarkeWeed · Web — Notas

Rediseño completo (octubre 2026) según el encargo nuevo: web B2B de imagen y branding para asociaciones, clubs y growshops de Madrid. **Sustituye** al portfolio anterior (packs, stories, configurador): ver la nota al principio de `PROYECTO.md`.

## Qué hay en `site/`
| Archivo | Para qué |
|---|---|
| `index.html` | **La web entera**, autocontenida: HTML + CSS + JS en línea, fuentes WOFF2 incrustadas en base64, logo SVG en un `<symbol>`, favicon como data URI. |
| `_headers` | `noindex`, CSP estricta (scripts por hash), `form-action 'self'` para el formulario. |
| `robots.txt` | `Disallow: /`. |
| `img/og-image.png` | Previsualización al compartir el enlace (rehecha: ya no dice "más socios"). |
| `img/apple-touch-icon.png`, `img/favicon.svg` | Iconos. |
| `fonts/` | WOFF2 originales y licencias OFL (las fuentes ya van incrustadas en `index.html`; se guardan como fuente y por la licencia). |

## Probar y desplegar
```bash
npx http-server site     # o abrir site/index.html directamente (el formulario solo envía en Netlify)
```
Netlify: arrastrar `site/` a Netlify Drop o `netlify deploy --dir=site --prod` (el `netlify.toml` ya publica `site`).

## ⚠️ Tras editar cualquier `<script>` de `index.html`
La CSP permite solo los scripts en línea cuyo hash conoce. Después de cambiar el JS:
```bash
python3 tools/csp-hash.py
```
Si no, en Netlify el JS no se ejecutará (la web sigue legible: hay modo sin JS).

## Rellenar antes de publicar
- `[TITULAR]`, `[NIF]`, `[DOMICILIO]`, `[EMAIL]` y `[DATOS REGISTRALES…]` en **Aviso legal**, **Privacidad** y en la primera capa de información del formulario (`[TITULAR]`). Están en ES (HTML) y en EN (`legalNotice.body` y `privacy.body` del diccionario `EN` del script). Buscar `[` en el archivo.
- Revisar los textos legales con asesoría jurídica (son una base sólida, no asesoramiento).
- Netlify Forms: activar las notificaciones por email del formulario `contacto` en el panel de Netlify (Forms → Notifications).

## Decisiones tomadas (y por qué)
| Tema | Decisión |
|---|---|
| Un solo archivo | Pedido por el encargo. Las fuentes van en base64 (~180 KB): `index.html` pesa ~360 KB, ~190 KB comprimido. |
| Indexación | El encargo pide SEO, pero `CLAUDE.md` exige `noindex`. **Se mantiene `noindex`** y está todo el SEO preparado (title, description, keywords, Open Graph, JSON-LD `ProfessionalService`). Para indexar: quitar la meta `robots`, la línea `X-Robots-Tag` de `_headers` y el `Disallow` de `robots.txt`, y añadir `<link rel="canonical">` con la URL definitiva. |
| Instagram | `CLAUDE.md` prohíbe enlaces externos: **@markeweed.es aparece como texto** con botón "Copiar usuario" y pasos para escribir por DM. Si se quiere enlace, cambiar el botón por `<a href="https://instagram.com/markeweed.es" rel="noopener">`. |
| Formulario | **Netlify Forms** (envía al mismo origen, sin terceros en el navegador). Tras enviar, Netlify redirige a `/?enviado=1` y la web muestra el mensaje de éxito. Validación accesible en el cliente; honeypot antispam. Campos: nombre, negocio, email, teléfono (opcional), mensaje + casilla de privacidad (obligatoria, sin marcar) + casilla de comunicaciones comerciales (opcional, sin marcar). Campo oculto `idioma` para responder en el idioma de la persona. |
| Privacidad | Se menciona a Netlify como encargado del tratamiento (alojamiento y formularios) con su transferencia internacional, porque los envíos se guardan en Netlify. Plazo de conservación propuesto: 12 meses desde el último contacto si no hay relación. |
| Cookies | Solo almacenamiento técnico en `localStorage`: `mw-lang` (idioma) y `mw-consent` (elección, re-pregunta a los 12 meses). Banner con Aceptar / Rechazar / Configurar con **el mismo estilo exacto**. "Configurar" abre un panel con Técnicas (siempre activas) y Analíticas (no se usan). Si algún día se añade analítica, cargarla solo dentro de `applyConsent()` y añadirla a la tabla de la política. |
| Páginas legales | Diálogos `<dialog>` accesibles (foco, Esc, clic fuera, devuelven el foco), abribles por enlace (`#aviso-legal`, `#privacidad`, `#cookies`). Sin JS se muestran como secciones al final. |
| Idioma | ES por defecto **siempre** (la web va dirigida a Madrid y el SEO es en español); EN solo si se elige en el selector (se recuerda). Todo traducido, también los textos legales y los `aria-label`. |
| Aviso +18 | Sin puerta bloqueante: es una web B2B. Se indica "Servicios para profesionales · +18" en el pie. |
| Tipografía "bold condensada" | El kit de marca no tiene una condensada y `CLAUDE.md` no permite otras: titulares en **Rubik Mono One** en mayúsculas con tracking negativo. |
| Contraste del naranja | `#CC5500` con texto blanco da 4,3:1: los botones naranjas usan texto grande y en negrita (≥ 19 px / 700) para cumplir AA. Texto pequeño sobre navy en blanco, `--teal-300` u `--orange-300`. |
| Portfolio | Antes/después **ilustrados en SVG** con un club ficticio («Tu Club»): perfil, logo, web por invitación y merch. Comparador accesible (control deslizante, teclado). Los "antes" usan a propósito tipografías de sistema (Times, Arial, cursiva) para mostrar un diseño descuidado; es la única excepción a las fuentes de marca. |
| Léxico | Sin "comercial" en el discurso (solo el término legal "comunicaciones comerciales" y "nombre comercial"), sin "captar socios", "más socios", "llena tu club" ni promesas de visibilidad, alcance o posicionamiento (solo aparecen como "lo que no hacemos"). No se usa "cannábico". |
| Merch | Solo textil, tazas, bolsas, pegatinas, tarjetas de socio y packaging; sin bandejas, grinders ni mecheros. |

## Cómo editar
- **Textos ES**: en el HTML (cada texto lleva `data-i18n`, `data-i18n-html` o `data-i18n-attr`).
- **Textos EN**: objeto `EN` del script, misma clave. Mensajes generados por JS: `ES_JS` y `EN` (`js.*`).
- **Trabajos reales en el portfolio**: sustituir el SVG de `.ba-before` / `.ba-after` por `<img>` (en `img/`, con `alt`), solo con autorización escrita del cliente, y recortar o desenfocar cualquier producto visible.

## Comprobado (Chromium, 360 / 768 / 1280 px)
- 0 errores de consola con la CSP real aplicada; 0 peticiones a otros orígenes.
- Sin scroll horizontal.
- ES ⇄ EN completo (sin claves sin traducir).
- Teclado: pestañas con flechas, comparador con flechas, menú móvil con Esc, diálogos con foco y Esc.
- Formulario: errores por campo, foco al primer error, estado de éxito con `?enviado=1`.
- Cookies: banner al entrar, elección guardada, panel de configuración, enlace "Configurar cookies" en el pie.
- Sin JS: contenido, portfolio y textos legales visibles.
- `prefers-reduced-motion`: sin animaciones.
- Grep de reglas de oro: sin precios, sin `http`/`mailto:`/`tel:` en enlaces (solo el `xmlns` de los SVG y el `@context` del JSON-LD, que no hacen peticiones).
