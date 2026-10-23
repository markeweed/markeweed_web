// MarkeWeed · Genera las 8 stories de Instagram para @markeweed.es (1080 × 1920, JPEG).
// Uso: NODE_PATH=$(npm root -g) node stories-ig/render.mjs   (Playwright + Chromium)
// Salida:
//   stories-ig/jpg/NN-nombre.jpg      → para subir: zona del sticker vacía (el sticker real se pone en Instagram)
//   stories-ig/preview/NN-nombre.jpg  → maqueta con el sticker dibujado, solo para revisar
// El guion completo de cada story (objetivo, texto, visual, interactivo) está en stories-ig/GUION.md.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

// require() respeta NODE_PATH, así sirve también un Playwright instalado globalmente.
const { chromium } = createRequire(import.meta.url)("playwright");

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// Sprite de la web (monograma, emblema del club ficticio e iconos) para no duplicar trazados.
const indexHtml = readFileSync(join(root, "site/index.html"), "utf8");
const sprite = indexHtml.match(/<svg class="sprite"[\s\S]*?\n<\/svg>/)[0];

const ico = (id) => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;
const top = (n) => `<div class="top"><p class="mw">MW<i>.</i></p><p class="count">0${n} / 08</p></div>`;
const foot = `<div class="foot"><span>Imagen y branding para clubs</span><b>@markeweed.es</b></div>`;

// Stickers (maqueta). En los JPEG finales ocupan su sitio pero no se ven.
const poll = (q, opts) => `<div class="stk"><div class="stk__card"><p class="stk__q">${q}</p><p class="stk__opts ${opts.length === 2 ? "stk__opts--two" : opts.length === 4 ? "stk__opts--four" : ""}">${opts.map((o) => `<span>${o}</span>`).join("")}</p></div></div>`;
const question = (q) => `<div class="stk"><div class="stk__card"><p class="stk__q stk__head">${q}</p><p class="stk__input">Escribe algo…</p></div></div>`;
const slider = (q) => `<div class="stk"><div class="stk__card"><p class="stk__q">${q}</p><div class="stk__slider"></div></div></div>`;
const link = (t) => `<div class="stk"><p class="stk__link">${ico("i-send")}<span>${t}</span></p></div>`;

// Rejillas de perfil. "Antes": colores, logos y encuadres sin criterio. "Después": una línea gráfica.
const mono = (fill) => `<svg viewBox="0 0 112 150"><use href="#mono" fill="${fill}"/></svg>`;
const emblem = (color) => `<svg viewBox="0 0 200 200" style="color:${color}"><use href="#emblem"/></svg>`;
const warn = `<span style="position:absolute;right:8%;top:8%;width:24%;aspect-ratio:1;border-radius:50%;background:#CC5500;color:#fff;display:grid;place-items:center;font:800 1.6em/1 system-ui">!</span>`;
const before = [
  `<i style="background:#000">${mono("#3FB0B0")}</i>`,
  `<i style="background:#F08A3C;transform:rotate(6deg) scale(1.1)">${warn}</i>`,
  `<i style="background:#fff">${mono("#CC5500")}</i>`,
  `<i style="background:#0A3157;filter:blur(3px)">${warn}</i>`,
  `<i style="background:#3FB0B0">${mono("#000")}</i>`,
  `<i style="background:#F4F1EA;filter:blur(2px)">${emblem("#008080")}</i>`,
  `<i style="background:#CC5500">${warn}</i>`,
  `<i style="background:#000;opacity:.7">${mono("#fff")}</i>`,
  `<i style="background:#fff;filter:blur(3px)">${warn}</i>`,
];
const after = [
  `<i style="background:#001F3F">${emblem("#F4F1EA")}</i>`,
  `<i style="background:#CC5500">${mono("#F4F1EA")}</i>`,
  `<i style="background:#F4F1EA">${mono("#001F3F")}</i>`,
  `<i style="background:#F4F1EA">${emblem("#CC5500")}</i>`,
  `<i style="background:#001F3F">${mono("#F08A3C")}</i>`,
  `<i style="background:#008080">${emblem("#F4F1EA")}</i>`,
  `<i style="background:#CC5500">${emblem("#001F3F")}</i>`,
  `<i style="background:#F4F1EA">${mono("#008080")}</i>`,
  `<i style="background:#001F3F">${mono("#F4F1EA")}</i>`,
];
const feed = (tiles) => `<div class="feed">${tiles.join("")}</div>`;

// Forma orgánica (blob) en SVG.
const blob = (style, fill) => `<svg class="shape" style="${style}" viewBox="0 0 600 600"><path fill="${fill}" d="M421 63c62 38 118 108 121 183 3 76-47 156-112 207S281 529 207 507 61 431 41 356 37 190 88 129 196 33 270 26s89-1 151 37z"/></svg>`;

const stories = [
  ["presentacion", `<section class="st s1">
    <span class="circle" style="width:760px;height:760px;right:-260px;top:-180px;background:#CC5500;opacity:.9"></span>
    ${blob("width:820px;left:-360px;bottom:-200px", "#008080")}
    <svg class="big-m" viewBox="0 0 112 150"><use href="#mono"/></svg>
    ${top(1)}
    <p class="tag">Hola, somos MarkeWeed</p>
    <h1>Imagen y branding <em>para clubs</em></h1>
    <p class="sub">Diseñamos la identidad de asociaciones, clubs y growshops de Madrid. Con criterio y dentro de la ley.</p>
    <div class="grow"></div>
    ${poll("¿Tu club tiene una imagen definida?", ["Sí, del todo", "Estamos en ello"])}
    ${foot}</section>`],

  ["problema", `<section class="st st--paper s2">
    <span class="circle" style="width:620px;height:620px;right:-240px;top:120px;background:#3FB0B0;opacity:.35"></span>
    ${top(2)}
    <p class="tag">¿Te suena?</p>
    <h1>Un perfil descuidado <em>también habla de ti</em></h1>
    <div class="feed-wrap">
      ${feed(before)}
      <ul class="issues">
        <li>${ico("i-close")}<span>Un logo distinto en cada post</span></li>
        <li>${ico("i-close")}<span>Fotos que no deberían estar ahí</span></li>
        <li>${ico("i-close")}<span>Textos que rozan el límite</span></li>
        <li>${ico("i-close")}<span>Ninguna línea visual</span></li>
      </ul>
    </div>
    <div class="grow"></div>
    ${question("¿Qué es lo que más te preocupa de tu perfil?")}
    ${foot}</section>`],

  ["servicios", `<section class="st s3">
    <span class="circle" style="width:700px;height:700px;left:-320px;top:520px;background:#0A3157"></span>
    <span class="circle" style="width:300px;height:300px;right:-90px;top:300px;background:#CC5500;opacity:.85"></span>
    ${top(3)}
    <p class="tag">Servicios</p>
    <h1>Lo que <em>hacemos</em></h1>
    <ul class="list">
      <li>${ico("i-palette")}<span>Identidad visual y branding</span></li>
      <li>${ico("i-refresh")}<span>Limpieza y rediseño de perfiles</span></li>
      <li>${ico("i-camera")}<span>Foto, vídeo y diseño</span></li>
      <li>${ico("i-globe")}<span>Web a medida con invitación</span></li>
      <li>${ico("i-sparkle")}<span>Merchandising con tu marca</span></li>
    </ul>
    <p class="fine">No hacemos campañas, anuncios ni publicidad.</p>
    <div class="grow"></div>
    ${poll("¿Por dónde empezarías?", ["Branding", "Perfil", "Web", "Merch"])}
    ${foot}</section>`],

  ["como-trabajamos", `<section class="st st--paper s4">
    ${blob("width:760px;right:-340px;bottom:120px", "#F08A3C")}
    <span class="circle" style="width:260px;height:260px;left:-80px;top:560px;background:#008080;opacity:.25"></span>
    ${top(4)}
    <p class="tag">Método</p>
    <h1>Así <em>trabajamos</em></h1>
    <ol class="steps">
      <li><b>01</b><h3>Escuchamos</h3><p>Conocemos tu club, su gente y su esencia.</p></li>
      <li><b>02</b><h3>Revisamos</h3><p>Auditamos tu perfil: qué sobra y qué falta.</p></li>
      <li><b>03</b><h3>Diseñamos</h3><p>Identidad y línea gráfica coherentes.</p></li>
      <li><b>04</b><h3>Entregamos</h3><p>Todo listo, ordenado y explicado.</p></li>
    </ol>
    <div class="grow"></div>
    ${question("Pregúntanos lo que quieras sobre el proceso")}
    ${foot}</section>`],

  ["cumplimiento", `<section class="st st--teal s5">
    <span class="circle" style="width:820px;height:820px;right:-380px;top:-160px;background:#001F3F;opacity:.35"></span>
    ${blob("width:600px;left:-280px;bottom:80px", "#3FB0B0")}
    ${top(5)}
    <p class="tag">Contenido que cumple</p>
    <h1>Lo que no se puede enseñar, <em>no se enseña</em></h1>
    <ul class="checks">
      <li>${ico("i-check")}<span>Sin producto ni consumo</span></li>
      <li>${ico("i-check")}<span>Sin precios ni promociones</span></li>
      <li>${ico("i-check")}<span>Textos revisados uno a uno</span></li>
      <li>${ico("i-check")}<span>Pensado para mayores de edad</span></li>
    </ul>
    <div class="grow"></div>
    ${poll("¿Se pueden mostrar precios en el perfil de una asociación?", ["Sí", "No"])}
    ${foot}</section>`],

  ["antes-despues", `<section class="st st--paper s6">
    <span class="circle" style="width:900px;height:900px;left:-300px;top:1000px;background:#3FB0B0;opacity:.3"></span>
    ${top(6)}
    <p class="tag">Antes / después</p>
    <h1>Mismo club. <em>Otra imagen.</em></h1>
    <div class="ba">
      <figure><figcaption>Antes</figcaption>${feed(before)}</figure>
      <figure><figcaption>Después</figcaption>${feed(after)}</figure>
    </div>
    <p class="fine">Ejemplo ilustrativo con un club ficticio.</p>
    <div class="grow"></div>
    ${slider("¿Cuánto cambia la imagen?")}
    ${foot}</section>`],

  ["web-invitaciones", `<section class="st s7">
    <span class="circle" style="width:640px;height:640px;right:-260px;top:150px;background:#008080;opacity:.55"></span>
    ${blob("width:700px;left:-340px;bottom:120px", "#0A3157")}
    ${top(7)}
    <p class="tag">Web a medida</p>
    <h1>Una web <em>discreta y segura</em></h1>
    <div class="web">
      <div class="form">
        <p class="form__bar"><i></i><i></i><i></i></p>
        <h3>Solicitar invitación</h3>
        <p class="field"><b>Nombre</b>Tu nombre</p>
        <p class="field"><b>Email</b>tu@correo</p>
        <p class="field"><b>Socio que te avala</b>Nombre del socio</p>
        <p class="btn">Enviar solicitud</p>
      </div>
      <ol class="flow">
        <li><b>1</b><span>Se solicita desde la web</span></li>
        <li><b>2</b><span>Un socio da su aval</span></li>
        <li><b>3</b><span>La invitación llega por email</span></li>
      </ol>
    </div>
    <div class="grow"></div>
    ${poll("¿Te interesa una web así para tu club?", ["Sí, cuéntame", "Ahora no"])}
    ${foot}</section>`],

  ["cta-dm", `<section class="st st--orange s8">
    <span class="circle" style="width:900px;height:900px;left:-420px;top:-260px;background:#F08A3C"></span>
    ${blob("width:760px;right:-300px;bottom:40px", "#001F3F")}
    <svg class="emblem" viewBox="0 0 200 200"><use href="#mono" x="58" y="40" width="84" height="112"/></svg>
    ${top(8)}
    <p class="tag">Hablemos</p>
    <h1>¿Le damos forma <em>a tu club?</em></h1>
    <p class="sub">Escríbenos por DM y te contamos cómo trabajaríamos tu imagen. Sin compromiso.</p>
    <div class="grow"></div>
    ${link("Envíanos un DM")}
    ${foot}</section>`],
];

const html = (mock) => `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="robots" content="noindex, nofollow"><title>MarkeWeed · Stories IG</title>
<link rel="stylesheet" href="stories.css"></head><body class="${mock ? "mock" : ""}">
${sprite}
${stories.map(([, s]) => s).join("\n")}
</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
for (const [dir, mock] of [["jpg", false], ["preview", true]]) {
  const file = join(here, `${dir}.html`);
  writeFileSync(file, html(mock));
  const out = join(here, dir);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const pg = await ctx.newPage();
  await pg.goto(pathToFileURL(file).href);
  await pg.evaluate(() => document.fonts.ready);
  const sections = await pg.$$("section.st");
  for (let i = 0; i < sections.length; i++) {
    const path = join(out, `0${i + 1}-${stories[i][0]}.jpg`);
    await sections[i].screenshot({ path, type: "jpeg", quality: 92 });
    console.log(path.replace(root + "/", ""));
  }
  await pg.close();
  rmSync(file);
}
await browser.close();
