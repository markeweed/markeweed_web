# MarkeWeed · Portfolio comercial interactivo — Especificación de proyecto

> **Actualización (octubre 2026):** la web se ha rediseñado según un encargo nuevo (estudio de imagen y branding: 5 servicios, proceso, antes/después, compromiso legal, FAQ, contacto por Instagram, todo en un único `site/index.html`). Ese encargo **sustituye** a las secciones 0, 4, 5 y 6 de este documento (packs, stories, configurador, modal sin datos). Siguen vigentes las reglas de marca de `CLAUDE.md`. Decisiones y diferencias en `site/NOTAS.md`.

> **Instrucción para Claude (ejecución futura):** lee este documento entero y construye TODO lo descrito en la carpeta `site/`. No hagas preguntas salvo bloqueo real; las decisiones ya están cerradas en la sección 1. Si algo no está especificado, elige lo más sensato, respeta las "Reglas de oro" (sección 2) y anótalo en `site/NOTAS.md`.

---

## 0. Qué es esto

Una web **portfolio comercial de una sola página**, única, creativa e interactiva, para presentar **MarkeWeed** a clubs y asociaciones cannábicas: qué servicios ofrecemos, qué packs mensuales hay y cómo trabajamos.

- Se aloja en **Netlify** (subdominio `*.netlify.app`, sin dominio propio).
- Se envía en privado a cada club por la persona de MarkeWeed responsable de ese contacto. **La web no contiene datos de contacto de nadie.**
- Todos los *call to action* invitan a **contactar con quien envió el portfolio**. Ningún botón ni enlace lleva fuera de la web.

### Qué es MarkeWeed
Pequeña gestión comercial para clubs y asociaciones cannábicas para **captar nuevos socios** a través de **redes sociales y/o Google**, cumpliendo la ley en la medida de lo posible y limitando servicios, publicaciones, textos y contenidos al margen legal.

Nos encargamos de: entregar contenido sobre el club, dar estructura a sus redes sociales y producir contenido (vídeo y fotografía). Diseñamos stories y posts, carteles de eventos, entradas/tickets (tipo merchandising), bandejas, grinders y todo tipo de merchandising para growshops y asociaciones/clubs.

---

## 1. Decisiones cerradas (respuestas del cliente)

| Tema | Decisión |
|---|---|
| Estructura | **Una página con scroll narrativo**, menú fijo con anclas. |
| Idioma | **Español + inglés** con selector ES/EN (todo el texto traducido). Por defecto ES (o EN si `navigator.language` no es `es*`). |
| CTAs | **Modal "Habla con quien te lo envió"** (ver 6.1). Sin datos, sin enlaces. |
| Material | **No hay material real.** Todo el contenido visual son **ejemplos ilustrados creados por Claude**: mockups CSS/SVG, diseños, piezas tipo motion/vídeo animado. |
| Tono visual | **Alterno claro/oscuro por secciones** (ritmo con el scroll). |
| Interactividad | (a) **Mockup de móvil con stories navegables**, (b) **Configurador/comparador de packs**, (c) **Galería de merchandising interactiva**. Además "Cómo trabajamos" como timeline (obligatorio por contenido, aunque se animará de forma sencilla). |
| Legal | **Sección propia "Marco legal"** + tono discreto en toda la web. |
| Stack | **HTML + CSS + JS vanilla**, sin build, carpeta lista para arrastrar a Netlify. |
| Precios | **NUNCA se muestran ni se mencionan precios, importes, tarifas, ni descuentos con cifra.** Siempre: *"Si te interesa este servicio / este plan, contacta con la persona que te envió este portfolio para continuar."* |
| Clubsy | Se detalla que el club asume **gastos aparte** del servicio (dominio, base de datos Supabase, envío de correos Resend, a nombre del club), **sin cifras**. |
| Prueba social | **Ninguna.** Ni clubs reales, ni testimonios, ni cifras de resultados. Por privacidad, **nunca** se usa contenido de otros clubs. |
| Identidad | Solo "MarkeWeed". El responsable es anónimo: "tu contacto de MarkeWeed". Sin nombre, sin URL parametrizada. |

---

## 2. Reglas de oro (no negociables)

1. **Cero precios.** Ni €, ni "desde", ni "gratis", ni "descuento del 20%". Revisar con grep antes de dar por terminado (`€`, `eur`, `precio`, `price`, `%`, números sospechosos).
   - Sobre el descuento a clientes de plan mensual en servicios extra: se comunica **sin cifra** ("condiciones preferentes en servicios extra para clientes con plan mensual"). Implementar con una constante `SHOW_DISCOUNT_PERCENT = false` en `js/config.js` por si el cliente decide mostrarla algún día.
2. **Cero enlaces externos y cero peticiones a terceros.** Ni `href="http…"`, ni `mailto:`, ni `tel:`, ni redes sociales, ni WhatsApp. Fuentes, imágenes, scripts: todo **autoalojado**. Sin analítica, sin CDN, sin Google Fonts, sin iframes. Comprobar en la pestaña Red del navegador que solo se cargan recursos del propio origen.
3. **Privacidad total:** no usar logos, nombres, fotos ni contenido de ningún club real. Los ejemplos usan un club ficticio genérico ("Tu Club", "Club Ejemplo", "Asociación Demo") con la identidad MarkeWeed.
4. **Contenido ilustrativo prudente (marco legal):** no mostrar plantas, humo, consumo, producto en mano, dispensación ni nada que parezca venta o promoción directa de consumo. Lenguaje neutro: *club, asociación, socios, comunidad, eventos*. Los objetos de merchandising (bandejas, grinders, mecheros) se muestran como **piezas de diseño gráfico sobre objeto**, sin producto.
5. **No indexable:** `noindex, nofollow` en meta y en cabecera HTTP (ver 9).
6. **Accesible y rápida:** contraste suficiente, navegación por teclado, `prefers-reduced-motion` respetado, funciona sin JS en lo esencial (el contenido ES visible aunque falle JS), móvil primero.

---

## 3. Identidad de marca

Material de partida en la carpeta raíz (no modificar, copiar a `site/`):
- `Brand/Logos/MarkeWeed Logos Sin Fondo/` — PNG transparentes: Navy (principal), Teal, Naranja, Negro, Blanco (1600×640).
- `Brand/Logos/MarkeWeed Logos Con Fondo/` — mismas versiones con fondo.
- `assets/markeweed-navy.svg` — logo vectorial (viewBox `0 0 816 159`, un único `<path>` con `fill="#001F3F"`). Úsalo **inline** con `fill="currentColor"` para recolorearlo según la sección (navy sobre claro, blanco/teal/naranja sobre oscuro) y para animar su trazado.
- `Brand/fonts/` — Syne, Rubik Mono One, Unbounded, Space Grotesk (TTF).

### 3.1 Paleta (extraída de los logos)
| Token | Hex | Uso |
|---|---|---|
| `--navy` | `#001F3F` | Color principal, fondos oscuros, texto sobre claro |
| `--teal` | `#008080` | Acento primario |
| `--orange` | `#CC5500` | Acento de acción / CTAs / énfasis |
| `--white` | `#FFFFFF` | Texto sobre oscuro |
| `--black` | `#000000` | Sombras/ruido puntual |

Tokens derivados permitidos (declararlos en `:root`): fondo claro cálido `--paper: #F4F1EA`, navy profundo `--navy-900: #00122A`, navy medio `--navy-700: #0A3157`, teal claro `--teal-300: #3FB0B0` (texto sobre navy), naranja claro `--orange-300: #F08A3C`, tintas con opacidad para bordes.

**Contraste:** teal y naranja sobre navy rondan 3,4:1 → solo para textos grandes/decoración/iconos; para texto pequeño sobre navy usar blanco o `--teal-300`/`--orange-300`. Sobre `--paper`, el texto pequeño va en navy.

### 3.2 Tipografías (roles)
| Rol | Fuente | Uso |
|---|---|---|
| Principal | **Syne** (400–800) | Párrafos y texto general, titulares secundarios |
| Título clave | **Rubik Mono One** | Títulos de sección y hero, siempre en mayúsculas, tamaño grande, con moderación |
| Etiqueta | **Unbounded** (500–700) | Chips, botones, tags, números de paso, etiquetas de pack — pequeño, mayúsculas, tracking amplio |
| Minititulo / detalle | **Space Grotesk** (400–600) | Subtítulos pequeños, textos de detalle, leyendas, microcopy |

Cargar con `@font-face` desde `site/fonts/` (copiar desde `Brand/fonts/`; si hay `fonttools`/`pyftsubset` disponible, convertir a WOFF2 y subsetear a latín + español para aligerar; si no, usar TTF) con `font-display: swap` y `preload` de las dos o tres críticas.

### 3.3 Dirección creativa
- Ritmo **claro / oscuro / claro / oscuro** con transiciones de color suaves al hacer scroll.
- Tipografía enorme (Rubik Mono One), recortes, solapamientos, bloques de color sólidos, marquees, números grandes. Carácter "estudio creativo underground con acabado cuidado", no corporativo.
- Grano sutil (SVG noise inline o CSS) y bordes redondeados generosos en tarjetas; el trazo irregular del logo inspira formas orgánicas (blobs SVG) como decoración.
- Cursor personalizado opcional solo en dispositivos con puntero fino (círculo que crece sobre elementos interactivos), desactivable con `prefers-reduced-motion`.
- Micro-interacciones: hover magnético en botones, revelado de texto línea a línea, parallax ligero, contadores.
- Todo performante: animar solo `transform`/`opacity`; `IntersectionObserver` para revelados; sin librerías pesadas.

---

## 4. Arquitectura de la página (orden de secciones)

Menú fijo (logo + anclas + selector ES/EN + botón CTA "Contactar"). En móvil: menú tipo overlay a pantalla completa. Indicador de progreso de scroll.

| # | Sección | Fondo | Contenido |
|---|---|---|---|
| 0 | **Intro** | Navy | Animación corta (≤1,8 s) del logo "dibujándose"/entrando, saltable y omitida con reduced-motion. |
| 1 | **Hero** | Navy | Logo grande, titular Rubik Mono One, subtítulo, 2 CTAs (ver packs / contactar) y indicador de scroll. Fondo con blobs/ruido animados. |
| 2 | **Qué hacemos** | Paper | Explicación de MarkeWeed en 3 bloques: *Redes y Google* · *Contenido (foto y vídeo)* · *Diseño y merchandising*. Marquee con palabras clave. |
| 3 | **Servicios individuales** | Navy | 4 tarjetas interactivas (Diseño, Fotografía, Vídeo, Pack de Stories). Al pulsar se abre un panel de detalle con ejemplo visual y CTA. |
| 4 | **Stories en acción** | Paper | **Mockup de móvil con stories navegables** (6.2) + texto del servicio "Paquete de Stories". |
| 5 | **Merchandising** | Navy | **Galería interactiva de merchandising** (6.3). |
| 6 | **Packs mensuales** | Paper | 3 tarjetas de plan + **configurador/comparador** (6.4) + condiciones comunes. |
| 7 | **Cómo trabajamos** | Navy | Timeline animada con el scroll (6.5). |
| 8 | **Marco legal** | Paper | Sección sobria sobre cumplimiento (6.6). |
| 9 | **Preguntas frecuentes** | Navy | Acordeón accesible (solo con información de este documento; lo no definido → "se concreta con tu contacto"). |
| 10 | **Siguiente paso (cierre)** | Orange/Navy | Titular + CTA grande que abre el modal. |
| 11 | **Footer** | Navy-900 | Logo, aviso +18 / uso profesional, "Portfolio comercial · uso privado", © MarkeWeed, selector de idioma. Sin enlaces externos. |

---

## 5. Contenido y textos (ES / EN)

Implementar i18n con un diccionario en `js/i18n.js` (`es` y `en`), atributos `data-i18n` / `data-i18n-html`, `<html lang>` dinámico, y persistencia de preferencia con `localStorage` dentro de `try/catch`. El HTML trae el ES por defecto. **Escribe tú todo el copy en ambos idiomas** siguiendo estos mensajes y el tono: cercano, directo, profesional, sin jerga legal ni referencias a consumo.

### 5.1 Hero
- ES: **"Más socios para tu club. Con contenido que cumple."** — *"Gestión comercial para clubs y asociaciones: redes sociales, Google, foto, vídeo y diseño. Todo dentro del margen de la ley."*
- EN: **"More members for your club. With content that complies."** — *"Commercial management for clubs and associations: social media, Google, photo, video and design. All within the legal margin."*
- CTAs: "Ver packs" (scroll) · "Contactar" (modal).

### 5.2 Qué hacemos
Tres bloques: (1) captación de nuevos socios vía redes sociales y/o Google; (2) entrega de contenido del club, estructura para redes y producción de foto/vídeo; (3) diseño de stories, posts, carteles de eventos, entradas/tickets, bandejas, grinders y todo tipo de merchandising para growshops y asociaciones/clubs.

### 5.3 Servicios individuales
- **Diseño** — Todo tipo de elementos gráficos digitales o físicos: bandejas, mecheros, camisetas, papel y cartón, tazas, llaveros, portadas, flyers, cartelería, tickets…
- **Fotografía** — Fotografía puntual del club, de un evento o de una reunión social privada, para redes sociales, Google o web.
- **Vídeo** — Producción audiovisual puntual del club, de un evento o de una reunión social privada, para redes sociales, Google o web.
- **Paquete de Stories para IG** — Desde 8 hasta +60 stories para publicar durante todo el mes, ajustadas a la información del club/asociación y al margen de la ley.
- Cierre común de cada ficha: *"¿Te interesa este servicio? Contacta con la persona que te envió este portfolio para continuar."*
- Nota (sin cifra): *"Los servicios individuales se presupuestan aparte según lo que necesites. Los clubs con plan mensual tienen condiciones preferentes."*

### 5.4 Packs mensuales (sin precios)
Todos los planes: **servicio mensual**; el club da **acceso a la cuenta de Instagram**; el pago y servicio funcionan a **principios de cada mes**; **el método de pago se confirma posteriormente**; se **publica durante todo el mes en curso**. Todos los planes incluyen **condiciones preferentes en servicios individuales** (merchandising, productos u otros servicios no incluidos se presupuestan aparte).

| Plan | Incluye (al mes) | Extra |
|---|---|---|
| **Plan Inicio** | 22 stories · 4 vídeos · 6 posts | — |
| **Plan Clubsy** | 22 stories · 4 vídeos · 6 posts | **Página web a medida** con **sistema de solicitud de invitación automática por correo**. Aviso: hay **gastos aparte a cargo del club**, a su nombre: dominio, base de datos (Supabase) y envío de correos (Resend). Sin cifras. |
| **Pack WeAreClub** | 32 stories · 6 vídeos · 8 posts | — |

- Etiquetas de plan en Unbounded; cifras de contenido en Rubik Mono One grande con contadores animados.
- Cada tarjeta: botón *"Me interesa este plan"* → abre el modal con el plan preseleccionado.
- **Prohibido** mostrar cualquier importe (ni "pago único web", ni "/mes"). Si hace falta aludir a la estructura de pago de Clubsy: *"Incluye la creación de la web y el servicio mensual; las condiciones te las explica tu contacto."*

### 5.5 Cómo trabajamos (timeline, 5 pasos)
1. **Hablamos** — Cuéntanos cómo es tu club/asociación y qué necesitas (a través de tu contacto de MarkeWeed).
2. **Elegimos el plan** — Pack mensual o servicios individuales, según tus objetivos.
3. **Acceso y contenido** — Nos das acceso a la cuenta de Instagram y la información del club; confirmamos el método de pago.
4. **Producimos** — Estructura de redes, stories, posts, vídeo y foto adaptados a tu club y al margen legal.
5. **Publicamos todo el mes** — El servicio funciona a principios de cada mes y se publica durante todo el mes en curso.

### 5.6 Microcopy de CTAs genéricos
- ES: "Contactar con mi responsable" · "Me interesa" · "Hablar con quien me lo envió".
- EN: "Contact my representative" · "I'm interested" · "Talk to the person who sent me this".

---

## 6. Componentes interactivos

### 6.1 Modal de contacto (CTA universal)
- Se abre desde **todos** los CTAs. Foco atrapado (focus trap), cierre con `Esc`/clic fuera, `aria-modal`, devuelve el foco al cerrar.
- Contenido: icono/ilustración, título **"Siguiente paso: habla con quien te envió este portfolio"**, texto: *"Por privacidad, aquí no hay datos de contacto. Escríbele por el mismo canal por el que recibiste este portfolio y dile qué te interesa."*
- Muestra **"Tu interés"**: el plan/servicio/selección del configurador que originó el clic (o "Información general").
- Botón **"Copiar resumen"**: copia al portapapeles un texto del tipo *"Hola, he visto el portfolio de MarkeWeed y me interesa: Plan Clubsy (22 stories, 4 vídeos, 6 posts + web)"* (con `navigator.clipboard` + fallback `execCommand`; feedback visual "¡Copiado!"). El texto se genera en el idioma activo y **sin precios**.
- Ningún enlace, ningún formulario, ninguna petición de red.

### 6.2 Mockup de móvil con stories navegables
- Marco de smartphone (CSS/SVG) con una "app de stories" **hecha a mano en HTML/CSS/JS**: barras de progreso arriba, avatar ficticio ("tu_club"), avance automático (~5 s), **tocar mitad derecha/izquierda** para siguiente/anterior, **mantener pulsado para pausar**, teclado (←/→), swipe táctil.
- **8 stories de ejemplo** coherentes con un club ficticio y el marco legal (sin producto ni consumo), cada una con estilo distinto y animación propia:
  1. Bienvenida / "Quiénes somos" (identidad del club)
  2. Evento de la semana (cartel animado)
  3. Cómo hacerse socio (pasos, sin incentivar consumo)
  4. Normas y cultura del club (comunidad y respeto)
  5. Agenda del mes (calendario)
  6. Encuesta/sticker simulado ("¿Qué actividad prefieres?")
  7. Cuenta atrás de evento
  8. Cierre con llamada a la acción ("Escríbenos")
- Una de ellas incluye una pieza **tipo motion/vídeo** animada con CSS/JS (loop), para ilustrar el servicio de vídeo.
- Al lado (o debajo en móvil): texto del servicio **Paquete de Stories (8 → +60)** con un selector visual (8 / 22 / 32 / +60) que resalta cuántas barras de progreso/columnas de un calendario mensual se llenan — sin precios.
- Todo dibujado con CSS/SVG propios (formas, gradientes con la paleta, tipografías de marca). **Sin imágenes externas ni fotos de personas.**

### 6.3 Galería de merchandising interactiva
- Piezas ilustradas en **SVG inline** con la identidad MarkeWeed y un club ficticio: **bandeja, grinder, mechero, camiseta, taza, llavero, ticket/entrada, flyer, cartel de evento, portada de redes, papel/cartón (packaging)**.
- Interacción: rejilla/"mesa de trabajo" con piezas que **se inclinan en 3D con el puntero** (tilt con `transform`), **se arrastran** (drag con pointer events) y **se amplían** en un visor al pulsar, con nombre de la pieza (Unbounded) y una línea de detalle (Space Grotesk).
- **Filtros por categoría** (Físico / Digital / Papelería) con animación.
- **Personalizador mini**: selector de color (navy / teal / naranja / blanco) que recolorea las piezas en vivo, mostrando que se diseña "a medida".
- CTA en el visor: *"¿Quieres diseñar el merchandising de tu club? Contacta con quien te envió este portfolio."* (abre modal con interés "Diseño de merchandising"). Sin precios.
- Accesible: cada pieza es un `<button>`; arrastrar es opcional (alternativa por teclado: abrir visor y navegar con flechas).

### 6.4 Configurador / comparador de packs (SIN precios)
- Controles: **stories** (slider 0–60+ con saltos 8/22/32/60), **vídeos** (0–8), **posts** (0–10), toggle **"Quiero web propia con solicitud de invitación"**, toggle **"Necesito merchandising / diseño extra"**.
- **Lógica de recomendación (ejecutar en este orden):**
  1. Si activa web → **Plan Clubsy**; si además supera 22/4/6 → *"Clubsy + extras: lo concretas con tu contacto"*.
  2. Si no hay web y stories ≤ 22, vídeos ≤ 4, posts ≤ 6 y alguno > 0 con volumen mensual → **Plan Inicio**.
  3. Si no hay web y stories ≤ 32, vídeos ≤ 6, posts ≤ 8 (y supera Inicio) → **Pack WeAreClub**.
  4. Si supera WeAreClub → *"Plan a medida: consúltalo con tu contacto"*.
  5. Si solo quiere algo puntual (valores bajos o solo foto/vídeo puntual/diseño) → **Servicios individuales**.
  6. Si activa merch/diseño extra → añadir nota "se presupuesta aparte; con plan mensual, condiciones preferentes".
- Salida: tarjeta de recomendación animada, **tabla comparativa** de los 3 planes (stories/vídeos/posts/web) donde se resalta el plan recomendado y se muestran visualmente las diferencias con barras. Sin importes.
- Botón **"Contactar con esta selección"** → modal con la selección resumida y copiable.
- Valores por defecto razonables (p. ej. 22/4/6) para que se vea vivo al cargar.

### 6.5 Timeline "Cómo trabajamos"
- Línea vertical (móvil) / horizontal con scroll pinning suave (escritorio, solo si no empeora la usabilidad) que se rellena con el scroll; cada paso aparece con su número grande en Unbounded y un icono SVG propio.

### 6.6 Marco legal
Sección sobria, tono tranquilizador, no jurídico. Mensajes (redactar en ES/EN):
- Trabajamos **dentro del margen de la ley** y limitamos servicios, publicaciones, textos y contenidos en consecuencia.
- Comunicación **dirigida a mayores de edad**; sin incitar al consumo; sin ofertas, precios ni promociones de producto.
- Lenguaje y contenidos **adaptados a cada plataforma y a la normativa vigente**; lo que no se puede publicar, no se publica.
- Contenido de ejemplo **ilustrativo y ficticio**.
- Pie breve: *"Esta información es orientativa y no constituye asesoramiento legal."*
- Presentarlo como 3–4 "principios" en tarjetas con icono, no como bloque de texto legal.

### 6.7 FAQ (acordeón)
Preguntas basadas solo en este documento: ¿Qué necesito para empezar? (acceso a Instagram + información del club) · ¿Cuándo funciona el servicio? (principios de cada mes; se publica todo el mes) · ¿Cómo se paga? (se confirma después con tu contacto) · ¿Los servicios sueltos están incluidos en los packs? (no; se presupuestan aparte con condiciones preferentes para clientes de plan) · ¿Qué incluye la web del Plan Clubsy? (web a medida con solicitud de invitación automática por correo; dominio, Supabase y Resend corren a cargo del club, a su nombre) · ¿Trabajáis con Google además de redes? (sí: redes sociales y/o Google) · ¿Y mi privacidad? (no mostramos contenido de otros clubs ni datos de contacto en este portfolio).

---

## 7. Estructura técnica de archivos

```
MarkeWeed/
├─ PROYECTO.md            ← este documento
├─ netlify.toml           ← publish = "site"
├─ Brand/  assets/        ← material fuente (no tocar)
└─ site/                  ← carpeta a publicar
   ├─ index.html
   ├─ _headers            ← cabeceras de seguridad/noindex (ver 9)
   ├─ robots.txt          ← Disallow: /
   ├─ NOTAS.md            ← decisiones tomadas / cómo editar textos y piezas
   ├─ css/  (tokens.css, base.css, sections.css, components.css)
   ├─ js/   (config.js, i18n.js, main.js, stories.js, merch.js, configurator.js, modal.js)
   ├─ fonts/              ← copiadas de Brand/fonts (WOFF2 si es posible)
   └─ img/                ← logos (copiados de Brand) + favicon + og-image SVG/PNG propios
```

- JS en módulos ES (`<script type="module">`) o scripts `defer`; **sin dependencias**.
- Favicon e icono generados a partir del logo (SVG). Sin `og:image` que apunte a URLs externas; si se incluye, relativo y sin datos sensibles (las previsualizaciones de enlace no deben exponer nada).
- `<title>`: "MarkeWeed · Portfolio" / meta description neutra sin términos de consumo.

---

## 8. Criterios de calidad / aceptación

Antes de dar por terminado, **verificar en el navegador integrado** (preview local) y marcar:

- [ ] Las 12 secciones existen, con alternancia claro/oscuro y transiciones fluidas.
- [ ] ES/EN completo: cambiar idioma traduce **todo** (incluido modal, configurador, FAQ, aria-labels, `<title>`).
- [ ] Ningún precio ni cifra monetaria en ningún idioma (grep de `€`, `euro`, `eur`, `precio`, `price`, `%`, `/mes`, `/month`, `1800`, `299`, `599`, `230`).
- [ ] Ningún enlace externo ni petición a otro origen (pestaña Red limpia; grep de `http`, `mailto:`, `tel:`).
- [ ] Todos los CTAs abren el modal con el contexto correcto; "Copiar resumen" funciona.
- [ ] Stories: avance automático, tap izq/dcha, pausa al mantener, teclado y swipe.
- [ ] Merch: tilt, drag, visor, filtros, recoloreado.
- [ ] Configurador: la lógica de 6.4 se cumple en todos los casos límite (22/4/6, 23/4/6, 32/6/8, 33/…, web activada).
- [ ] Responsive 360 / 768 / 1280 / 1920 sin scroll horizontal; objetivos táctiles ≥ 44 px.
- [ ] Accesibilidad: navegación por teclado completa, foco visible, `alt`/`aria` correctos, contraste revisado, `prefers-reduced-motion` desactiva animaciones fuertes.
- [ ] Rendimiento: peso total razonable (< ~1,5 MB sin fuentes), sin layout shift notable, 60 fps en animaciones.
- [ ] Sin imágenes de producto, plantas, humo ni consumo (regla de oro 4).
- [ ] `noindex` activo (meta + cabecera + robots.txt).

Entrega final: resumen breve de lo hecho, cómo probar en local (`npx serve site` o abrir `site/index.html`) y cómo desplegar en Netlify (arrastrar la carpeta `site` a *Netlify Drop*, o `netlify deploy --dir=site --prod`).

---

## 9. Netlify, privacidad y cabeceras

`netlify.toml`:
```toml
[build]
  publish = "site"
```

`site/_headers`:
```
/*
  X-Robots-Tag: noindex, nofollow, noarchive
  Referrer-Policy: no-referrer
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'
```
(Si algún estilo/script inline lo requiere, reducirlo a archivos externos antes que relajar la CSP.)

`site/robots.txt`: `User-agent: *` / `Disallow: /`

HTML: `<meta name="robots" content="noindex,nofollow,noarchive">`.

---

## 10. Plan de ejecución sugerido (para Claude)

1. Crear `site/`, copiar fuentes/logos, definir tokens, `@font-face`, base y layout, i18n y modal.
2. Construir secciones 1–3 y 7–11 (estructura + copy ES/EN).
3. Construir los tres componentes interactivos (stories, merch, configurador) con sus ilustraciones SVG/CSS.
4. Pulido: animaciones de scroll, cursor, intro, transiciones claro/oscuro, grano.
5. Verificación en navegador (viewports, idiomas, teclado, red, grep de reglas de oro).
6. Escribir `NOTAS.md` y el resumen final.

> **Pendiente de confirmar por el cliente (asumido por ahora):** (a) el descuento a clientes de plan se comunica sin cifra; (b) la web incluye un aviso +18 discreto no bloqueante; (c) el texto legal es orientativo y conviene revisarlo con asesoría jurídica antes de enviar el portfolio a clubs.
