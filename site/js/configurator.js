/* ==========================================================================
   MarkeWeed · Configurador / comparador de packs (SIN precios)
   Lógica de recomendación (PROYECTO.md 6.4), en este orden:
     1. Web activada → Clubsy (o "Clubsy + extras" si supera 22/4/6).
     2. Sin web, ≤ 22/4/6 y con volumen mensual → Inicio.
     3. Sin web, ≤ 32/6/8 → WeAreClub.
     4. Por encima → Plan a medida.
     5. Sin volumen mensual (valores muy bajos o todo a 0) → Servicios individuales.
        "Volumen mensual" = al menos 8 stories, 2 vídeos o 3 posts. Se evalúa
        antes del paso 2 para que el caso puntual sea alcanzable.
     6. Merch/diseño extra → nota "se presupuesta aparte; condiciones preferentes".
   ========================================================================== */
(function () {
  "use strict";
  window.MW = window.MW || {};
  function t(k, p) { return MW.i18n.t(k, p); }

  var el = {};
  var state = { s: 22, v: 4, p: 6, web: false, merch: false, reco: "inicio" };

  function recommend(s, v, p, web) {
    var overInicio = s > 22 || v > 4 || p > 6;
    if (web) return overInicio ? "clubsyPlus" : "clubsy";
    var monthly = s >= 8 || v >= 2 || p >= 3;
    if (!monthly) return "individual";
    if (!overInicio) return "inicio";
    if (s <= 32 && v <= 6 && p <= 8) return "weareclub";
    return "custom";
  }

  var RECO_COL = { inicio: "inicio", clubsy: "clubsy", clubsyPlus: "clubsy", weareclub: "weareclub" };

  function storiesLabel(s) { return s >= 60 ? t("cfg.storiesPlus") : String(s); }

  function selection() {
    var sel = t("cfg.sel", { s: storiesLabel(state.s), v: state.v, p: state.p });
    if (state.web) sel += t("cfg.sel.web");
    if (state.merch) sel += t("cfg.sel.merch");
    return sel;
  }

  function setFill(input) {
    var min = +input.min, max = +input.max;
    input.style.setProperty("--fill", ((input.value - min) / (max - min) * 100) + "%");
  }

  function buildBars() {
    el.table.querySelectorAll("tbody tr").forEach(function (tr) {
      if (tr.getAttribute("data-row") === "web") return;
      tr.querySelectorAll("td").forEach(function (td) {
        var bar = document.createElement("span");
        bar.className = "bar";
        bar.setAttribute("aria-hidden", "true");
        bar.appendChild(document.createElement("i"));
        td.appendChild(bar);
      });
    });
  }

  function updateTable() {
    var P = MW.config.PLANS;
    var user = { stories: state.s, videos: state.v, posts: state.p };
    ["stories", "videos", "posts"].forEach(function (row) {
      var tr = el.table.querySelector('tr[data-row="' + row + '"]');
      var max = Math.max(P.weareclub[row], user[row], 1);
      var you = tr.querySelector("td.is-you");
      you.querySelector("b").textContent = row === "stories" ? storiesLabel(user[row]) : user[row];
      you.querySelector(".bar i").style.setProperty("--v", user[row] / max);
      ["inicio", "clubsy", "weareclub"].forEach(function (k) {
        var td = tr.querySelector('td[data-col="' + k + '"]');
        var val = P[k][row];
        td.querySelector(".bar i").style.setProperty("--v", val / max);
        td.classList.toggle("is-covered", val >= user[row]);
        td.classList.toggle("is-short", val < user[row]);
      });
    });
    var webYou = el.table.querySelector('tr[data-row="web"] td.is-you b');
    webYou.setAttribute("data-i18n", state.web ? "cfg.yes" : "cfg.no");
    webYou.textContent = t(state.web ? "cfg.yes" : "cfg.no");

    var col = RECO_COL[state.reco];
    el.table.querySelectorAll("[data-col]").forEach(function (c) {
      c.classList.toggle("is-reco", c.getAttribute("data-col") === col);
    });
  }

  function updateReco(animate) {
    var r = state.reco;
    el.name.textContent = t("cfg.n." + r);
    el.text.setAttribute("data-i18n", "cfg.r." + r);
    el.text.textContent = t("cfg.r." + r);
    el.reco.classList.toggle("reco--teal", r === "custom" || r === "clubsyPlus");
    el.reco.classList.toggle("reco--paper", r === "individual");
    if (state.merch) {
      var note = t("cfg.note.merch");
      if (MW.config.SHOW_DISCOUNT_PERCENT && MW.config.DISCOUNT_PERCENT) note += " (" + MW.config.DISCOUNT_PERCENT + "%)";
      el.note.textContent = note;
      el.note.hidden = false;
    } else {
      el.note.hidden = true;
    }
    if (animate) {
      el.reco.classList.remove("is-changed");
      void el.reco.offsetWidth;
      el.reco.classList.add("is-changed");
    }
  }

  function read() {
    state.s = +el.s.value;
    state.v = +el.v.value;
    state.p = +el.p.value;
    state.web = el.web.checked;
    state.merch = el.merch.checked;
  }

  function update() {
    read();
    var prev = state.reco;
    state.reco = recommend(state.s, state.v, state.p, state.web);
    el.outS.textContent = storiesLabel(state.s);
    el.outV.textContent = state.v;
    el.outP.textContent = state.p;
    [el.s, el.v, el.p].forEach(setFill);
    el.s.setAttribute("aria-valuetext", storiesLabel(state.s));
    el.ticks.forEach(function (b) { b.classList.toggle("is-on", +b.getAttribute("data-value") === state.s); });
    updateReco(prev !== state.reco);
    updateTable();
  }

  function init() {
    var form = document.getElementById("config-form");
    if (!form) return;
    el = {
      form: form,
      s: document.getElementById("cfg-stories"),
      v: document.getElementById("cfg-videos"),
      p: document.getElementById("cfg-posts"),
      web: document.getElementById("cfg-web"),
      merch: document.getElementById("cfg-merch"),
      outS: document.getElementById("out-stories"),
      outV: document.getElementById("out-videos"),
      outP: document.getElementById("out-posts"),
      reco: document.getElementById("reco"),
      name: document.getElementById("reco-name"),
      text: document.getElementById("reco-text"),
      note: document.getElementById("reco-note"),
      table: document.getElementById("compare"),
      cta: document.getElementById("config-cta"),
      ticks: Array.prototype.slice.call(form.querySelectorAll("[data-set]"))
    };
    buildBars();
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    el.ticks.forEach(function (b) {
      b.addEventListener("click", function () {
        var input = document.getElementById(b.getAttribute("data-set"));
        input.value = b.getAttribute("data-value");
        update();
      });
    });
    el.cta.addEventListener("click", function () { MW.contact.open("config", el.cta); });
    document.addEventListener("mw:lang", function () { update(); });
    update();
  }

  MW.configurator = {
    init: init,
    recommend: recommend,
    interest: function () {
      return t("interest.config", { name: t("cfg.n." + state.reco), sel: selection() });
    }
  };
})();
