// MarkeWeed · Genera el paquete de 8 stories de Instagram (1080 × 1920, JPEG) en ES y EN.
// Uso: node stories-ig/render.mjs   (requiere Playwright con Chromium; si es global: NODE_PATH=$(npm root -g))
// Salida: stories-ig/jpg/<idioma>/NN-nombre.jpg  +  stories-ig/preview-<idioma>.html

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

// require() respeta NODE_PATH, así sirve también un Playwright instalado globalmente.
const { chromium } = createRequire(import.meta.url)("playwright");

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// Sprite de la web (logo, monograma e iconos) para no duplicar trazados.
const indexHtml = readFileSync(join(root, "site/index.html"), "utf8");
const sprite = indexHtml.match(/<svg class="sprite"[\s\S]*?\n<\/svg>/)[0];

const T = {
  es: {
    counter: "Story",
    s1: {
      chip: "Gestión comercial para clubs",
      title: 'Más socios para tu club. <span class="accent">Con contenido que cumple.</span>',
      lead: "Redes sociales, Google, foto, vídeo y diseño. Todo dentro del margen de la ley.",
      tags: ["Redes", "Google", "Foto", "Vídeo", "Diseño"],
    },
    s2: {
      chip: "Qué hacemos",
      title: 'Tres frentes, <span class="accent">un objetivo.</span>',
      blocks: [
        ["Redes y Google", "Captamos nuevos socios a través de redes sociales y/o Google."],
        ["Contenido: foto y vídeo", "Contenido sobre tu club, estructura para tus redes y producción audiovisual."],
        ["Diseño y merchandising", "Stories, posts, carteles de eventos, tickets y todo tipo de merchandising."],
      ],
      marquee: "Redes <span>·</span> Google <span>·</span> Foto <span>·</span> Vídeo <span>·</span> Diseño <span>·</span> Merch <span>·</span> Redes <span>·</span>",
    },
    s3: {
      chip: "Servicios individuales",
      title: 'Lo que <span class="accent">necesites</span>, cuando lo necesites.',
      cards: [
        ["Diseño", "Gráfica digital o física: flyers, carteles, tickets, portadas…"],
        ["Fotografía", "Del club, de un evento o de una reunión social privada."],
        ["Vídeo", "Producción puntual para redes sociales, Google o web."],
        ["Pack de Stories", "De 8 a +60 stories para todo el mes."],
      ],
      note: "Se presupuestan aparte. Con plan mensual, condiciones preferentes.",
    },
    s4: {
      chip: "Paquete de Stories",
      big: "8 → +60",
      small: "stories al mes",
      lead: "Ajustadas a la información de tu club o asociación y siempre dentro del margen de la ley.",
      cal: "Tu mes", calCount: "22 stories",
    },
    s5: {
      chip: "Diseño y merch",
      title: 'Tu marca, <span class="accent">en todas partes.</span>',
      list: ["Camisetas", "Tazas", "Tickets", "Carteles", "Pegatinas", "Tarjetas de socio"],
      ticket: "Entrada", member: "Socio/a",
    },
    s6: {
      chip: "Packs mensuales",
      title: 'Elige tu <span class="accent">ritmo.</span>',
      units: ["stories", "vídeos", "posts"],
      web: "+ Web a medida con solicitud de invitación",
      badge: "Más completo",
      note: "Servicio mensual: se activa a principios de cada mes y se publica durante todo el mes. Las condiciones te las explicamos por mensaje.",
    },
    s7: {
      chip: "Cómo trabajamos",
      title: 'Cinco pasos, <span class="accent">cero líos.</span>',
      steps: [
        ["Hablamos", "Nos cuentas cómo es tu club y qué necesitas."],
        ["Elegimos el plan", "Pack mensual o servicios individuales."],
        ["Acceso y contenido", "Acceso a Instagram e información del club."],
        ["Producimos", "Stories, posts, vídeo y foto a tu medida."],
        ["Publicamos todo el mes", "Desde principios de mes, todo el mes."],
      ],
    },
    s8: {
      chip: "Siguiente paso",
      title: "¿Hablamos?",
      lead: "Cuéntanos cómo es tu club y te proponemos el plan que mejor encaja.",
      dm: "Escríbenos por DM",
      legal: ["Dentro del margen de la ley", "Dirigido a mayores de edad", "Sin ofertas ni promociones"],
    },
  },
  en: {
    counter: "Story",
    s1: {
      chip: "Commercial management for clubs",
      title: 'More members for your club. <span class="accent">With content that complies.</span>',
      lead: "Social media, Google, photo, video and design. All within the legal margin.",
      tags: ["Social", "Google", "Photo", "Video", "Design"],
    },
    s2: {
      chip: "What we do",
      title: 'Three fronts, <span class="accent">one goal.</span>',
      blocks: [
        ["Social media & Google", "We bring in new members through social media and/or Google."],
        ["Content: photo & video", "Content about your club, structure for your profiles and audiovisual production."],
        ["Design & merchandising", "Stories, posts, event posters, tickets and all kinds of merchandising."],
      ],
      marquee: "Social <span>·</span> Google <span>·</span> Photo <span>·</span> Video <span>·</span> Design <span>·</span> Merch <span>·</span> Social <span>·</span>",
    },
    s3: {
      chip: "Individual services",
      title: 'Whatever <span class="accent">you need</span>, whenever you need it.',
      cards: [
        ["Design", "Digital or physical graphics: flyers, posters, tickets, covers…"],
        ["Photography", "Of the club, an event or a private social gathering."],
        ["Video", "One-off production for social media, Google or web."],
        ["Stories pack", "From 8 to 60+ stories for the whole month."],
      ],
      note: "Quoted separately. Monthly plan clients get preferential terms.",
    },
    s4: {
      chip: "Stories pack",
      big: "8 → 60+",
      small: "stories a month",
      lead: "Tailored to your club or association's information and always within the legal margin.",
      cal: "Your month", calCount: "22 stories",
    },
    s5: {
      chip: "Design & merch",
      title: 'Your brand, <span class="accent">everywhere.</span>',
      list: ["T-shirts", "Mugs", "Tickets", "Posters", "Stickers", "Member cards"],
      ticket: "Ticket", member: "Member",
    },
    s6: {
      chip: "Monthly packs",
      title: 'Pick your <span class="accent">pace.</span>',
      units: ["stories", "videos", "posts"],
      web: "+ Custom website with invitation requests",
      badge: "Most complete",
      note: "Monthly service: it starts at the beginning of each month and publishes all month long. We'll explain the terms by message.",
    },
    s7: {
      chip: "How we work",
      title: 'Five steps, <span class="accent">zero hassle.</span>',
      steps: [
        ["We talk", "Tell us what your club is like and what you need."],
        ["We pick the plan", "Monthly pack or individual services."],
        ["Access & content", "Instagram access and club information."],
        ["We produce", "Stories, posts, video and photo, made for you."],
        ["We publish all month", "From the start of the month, all month long."],
      ],
    },
    s8: {
      chip: "Next step",
      title: "Shall we talk?",
      lead: "Tell us about your club and we'll suggest the plan that fits best.",
      dm: "Send us a DM",
      legal: ["Within the legal margin", "Aimed at adults only", "No offers or promotions"],
    },
  },
};

const ico = (id) => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;
const logo = (cls = "") => `<svg class="${cls}" viewBox="0 0 816 159"><use href="#logo"/></svg>`;
const counter = (t, n) => `<div class="counter"><span>${t.counter} ${String(n).padStart(2, "0")} / 08</span>${logo()}</div>`;

// Calendario: 31 días con 22 stories repartidas de forma uniforme (las 8 primeras en naranja).
function calendar() {
  const on = new Set(Array.from({ length: 22 }, (_, i) => Math.floor((i * 31) / 22)));
  const hot = new Set(Array.from({ length: 8 }, (_, i) => Math.floor((i * 31) / 8)));
  return Array.from({ length: 35 }, (_, d) => {
    if (d >= 31) return `<i style="visibility:hidden"></i>`;
    const cls = hot.has(d) ? "hot" : on.has(d) ? "on" : "";
    return `<i class="${cls}">${d + 1}</i>`;
  }).join("");
}

// Ilustraciones del merch (SVG propio, colores de marca, sin producto).
function merchBoard(t) {
  const mono = (x, y, w, h, fill) => `<use href="#mono" x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
  return `
  <svg viewBox="0 0 420 420" style="left:0;top:20px;width:470px;transform:rotate(-6deg)">
    <path d="M140 40l-110 52 36 86 34-14v226h220V164l34 14 36-86-110-52c-8 30-34 50-70 50s-62-20-70-50z" fill="#001F3F" stroke="#3FB0B0" stroke-width="5" stroke-linejoin="round"/>
    ${mono(178, 170, 64, 86, "#F08A3C")}
    <rect x="150" y="280" width="120" height="10" rx="5" fill="#3FB0B0"/>
  </svg>
  <svg viewBox="0 0 300 260" style="right:-10px;top:0;width:380px;transform:rotate(5deg)">
    <path d="M40 30h170v170a30 30 0 0 1-30 30H70a30 30 0 0 1-30-30z" fill="#F4F1EA"/>
    <path d="M210 70h22a38 38 0 0 1 0 76h-22" fill="none" stroke="#F4F1EA" stroke-width="22"/>
    <rect x="40" y="30" width="170" height="26" fill="#CC5500"/>
    ${mono(98, 92, 54, 72, "#001F3F")}
  </svg>
  <svg viewBox="0 0 520 220" style="left:150px;top:400px;width:600px;transform:rotate(-3deg)">
    <path d="M20 20h480v62a28 28 0 0 0 0 56v62H20v-62a28 28 0 0 0 0-56z" fill="#CC5500"/>
    <path d="M360 30v160" stroke="#fff" stroke-width="4" stroke-dasharray="10 10" opacity=".7"/>
    <text x="54" y="96" font-family="Unbounded" font-weight="800" font-size="30" letter-spacing="4" fill="#fff">${t.ticket.toUpperCase()}</text>
    <text x="54" y="150" font-family="Rubik Mono One" font-size="44" fill="#fff">TU CLUB</text>
    ${mono(400, 66, 66, 88, "#fff")}
  </svg>
  <svg viewBox="0 0 340 220" style="left:-10px;top:560px;width:330px;transform:rotate(8deg)">
    <rect x="10" y="10" width="320" height="200" rx="24" fill="#008080"/>
    <rect x="34" y="34" width="70" height="70" rx="16" fill="#001F3F"/>
    ${mono(52, 44, 34, 50, "#fff")}
    <text x="34" y="160" font-family="Unbounded" font-weight="700" font-size="24" letter-spacing="3" fill="#fff">${t.member.toUpperCase()}</text>
    <rect x="34" y="176" width="150" height="10" rx="5" fill="#fff" opacity=".5"/>
  </svg>
  <svg viewBox="0 0 200 200" style="right:20px;top:600px;width:210px;transform:rotate(-12deg)">
    <circle cx="100" cy="100" r="92" fill="#F08A3C"/>
    <circle cx="100" cy="100" r="74" fill="none" stroke="#001F3F" stroke-width="5" stroke-dasharray="4 10" stroke-linecap="round"/>
    ${mono(76, 66, 48, 66, "#001F3F")}
  </svg>`;
}

function page(lang) {
  const t = T[lang];
  const p = t.s6;
  const plan = (name, nums, cls = "", extra = "", badge = "") => `
    <div class="plan ${cls}">
      <p class="plan__name"><span>${name}</span>${badge ? `<span class="plan__badge">${badge}</span>` : ""}</p>
      <div class="plan__nums">${nums.map((n, i) => `<div><b>${n}</b><small>${p.units[i]}</small></div>`).join("")}</div>
      ${extra ? `<p class="plan__extra">${ico("i-globe")}<span>${extra}</span></p>` : ""}
    </div>`;

  const stories = [
    ["bienvenida", `<section class="st s1">
      <span class="blob blob--a"></span><span class="blob blob--b"></span>
      <span class="chip chip--teal">${t.s1.chip}</span>
      ${logo("logo")}
      <h1 class="display">${t.s1.title}</h1>
      <p class="lead">${t.s1.lead}</p>
      <p class="tags">${t.s1.tags.map((x) => `<span>${x}</span>`).join("")}</p>
      ${counter(t, 1)}</section>`],

    ["que-hacemos", `<section class="st st--paper s2">
      <span class="chip chip--navy">${t.s2.chip}</span>
      <h2 class="display">${t.s2.title}</h2>
      <div class="blocks">${t.s2.blocks.map(([h, d], i) => `<div class="block">${ico(["i-megaphone", "i-camera", "i-palette"][i])}<div><h3>${h}</h3><p>${d}</p></div></div>`).join("")}</div>
      <p class="marquee">${t.s2.marquee}</p>
      ${counter(t, 2)}</section>`],

    ["servicios", `<section class="st s3">
      <span class="blob blob--a"></span>
      <span class="chip chip--teal">${t.s3.chip}</span>
      <h2 class="display">${t.s3.title}</h2>
      <div class="grid">${t.s3.cards.map(([h, d], i) => `<div class="card ${i === 3 ? "card--hl" : ""}">${ico(["i-pen", "i-camera", "i-video", "i-stories"][i])}<h3>${h}</h3><p>${d}</p></div>`).join("")}</div>
      <p class="detail note">${t.s3.note}</p>
      ${counter(t, 3)}</section>`],

    ["paquete-stories", `<section class="st st--paper s4">
      <span class="chip chip--navy">${t.s4.chip}</span>
      <p class="display big">${t.s4.big}<small class="accent">${t.s4.small}</small></p>
      <p class="lead">${t.s4.lead}</p>
      <div class="cal"><p class="cal__head"><span>${t.s4.cal}</span><b>${t.s4.calCount}</b></p><div class="cal__grid">${calendar()}</div></div>
      <p class="steps"><span>8</span><span class="on">22</span><span>32</span><span>${lang === "es" ? "+60" : "60+"}</span></p>
      ${counter(t, 4)}</section>`],

    ["merchandising", `<section class="st s5">
      <span class="blob blob--a"></span>
      <span class="chip chip--teal">${t.s5.chip}</span>
      <h2 class="display">${t.s5.title}</h2>
      <div class="board">${merchBoard(t.s5)}</div>
      <p class="list">${t.s5.list.map((x) => `<span>${x}</span>`).join("")}</p>
      ${counter(t, 5)}</section>`],

    ["packs-mensuales", `<section class="st st--paper s6">
      <span class="chip chip--navy">${p.chip}</span>
      <h2 class="display">${p.title}</h2>
      <div class="plans">
        ${plan("Plan Inicio", [22, 4, 6])}
        ${plan("Plan Clubsy", [22, 4, 6], "plan--navy", p.web)}
        ${plan("Pack WeAreClub", [32, 6, 8], "plan--teal", "", p.badge)}
      </div>
      <p class="detail note">${p.note}</p>
      ${counter(t, 6)}</section>`],

    ["como-trabajamos", `<section class="st s7">
      <span class="blob blob--a"></span>
      <span class="chip chip--teal">${t.s7.chip}</span>
      <h2 class="display">${t.s7.title}</h2>
      <div class="tl">${t.s7.steps.map(([h, d], i) => `<div class="step"><b>0${i + 1}</b><div><h3>${h}</h3><p>${d}</p></div></div>`).join("")}</div>
      ${counter(t, 7)}</section>`],

    ["hablamos", `<section class="st st--orange s8">
      <span class="blob blob--a"></span><span class="blob blob--b"></span>
      <span class="chip">${t.s8.chip}</span>
      <h2 class="display">${t.s8.title}</h2>
      <p class="lead">${t.s8.lead}</p>
      <p class="dm">${ico("i-send")}<span>${t.s8.dm}</span></p>
      <div class="spacer"></div>
      <ul class="legal">${t.s8.legal.map((x, i) => `<li>${ico(["i-scale", "i-18", "i-ban"][i])}<span>${x}</span></li>`).join("")}</ul>
      ${counter(t, 8)}</section>`],
  ];

  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<meta name="robots" content="noindex, nofollow"><title>MarkeWeed · Stories ${lang.toUpperCase()}</title>
<link rel="stylesheet" href="stories.css"></head><body>
${sprite}
${stories.map(([, s]) => s).join("\n")}
</body></html>`;
  return { html, names: stories.map(([n]) => n) };
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
for (const lang of Object.keys(T)) {
  const { html, names } = page(lang);
  const file = join(here, `preview-${lang}.html`);
  writeFileSync(file, html);
  const out = join(here, "jpg", lang);
  mkdirSync(out, { recursive: true });
  const pg = await ctx.newPage();
  await pg.goto(pathToFileURL(file).href);
  await pg.evaluate(() => document.fonts.ready);
  const sections = await pg.$$("section.st");
  for (let i = 0; i < sections.length; i++) {
    const path = join(out, `${String(i + 1).padStart(2, "0")}-${names[i]}.jpg`);
    await sections[i].screenshot({ path, type: "jpeg", quality: 92 });
    console.log(path.replace(root + "/", ""));
  }
  await pg.close();
}
await browser.close();
