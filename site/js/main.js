/* ==========================================================================
   MarkeWeed · Orquestación: idioma, intro +18, navegación, revelados,
   contadores, timeline, servicios, micro-interacciones.
   ========================================================================== */
(function () {
  "use strict";
  var MW = window.MW;
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(pointer: fine)");
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function t(k, p) { return MW.i18n.t(k, p); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } return null; }

  /* ---------- Idioma ---------- */
  function initLang() {
    MW.i18n.apply(doc.getAttribute("data-lang") || "es", { persist: false });
    document.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-lang]");
      if (b) MW.i18n.apply(b.getAttribute("data-lang"));
    });
  }

  /* ---------- Revelado línea a línea: índice por línea ---------- */
  MW.indexLines = function (el) {
    $$(".line", el).forEach(function (l, i) { l.style.setProperty("--i", i); });
  };

  /* ---------- Intro + verificación de edad ---------- */
  function initIntro(done) {
    var intro = $("#intro");
    if (!intro) { done(); return; }
    var gate = $("#gate");
    var skip = $("#intro-skip");
    var key = MW.config.AGE_KEY;
    var ageOk = store(key) === "1";
    var finished = false;
    intro.classList.add("is-managed");
    doc.classList.add("mw-boot");

    try {
      var len = document.getElementById("logo-path").getTotalLength();
      intro.style.setProperty("--len", Math.ceil(len));
    } catch (e) { /* sin medida: se usa el valor por defecto */ }

    function leave() {
      if (finished) return;
      finished = true;
      MW.overlay.close(intro, { noReturn: true });
      intro.classList.add("is-leaving");
      window.setTimeout(function () { intro.remove(); }, reduce.matches ? 0 : 900);
      done();
    }

    MW.overlay.open(intro, { noEsc: true, closeDelay: 900, initialFocus: ageOk ? skip : $('[data-gate="yes"]', intro) });

    if (!ageOk) {
      intro.classList.add(reduce.matches ? "is-static" : "is-drawing");
      if (reduce.matches) gate.style.setProperty("--gate-delay", "0s");
      gate.hidden = false;
      gate.addEventListener("click", function (e) {
        var b = e.target.closest("[data-gate]");
        if (!b) return;
        if (b.getAttribute("data-gate") === "yes") {
          store(key, "1");
          leave();
        } else {
          $("#gate-denied").hidden = false;
          $(".gate__actions", gate).hidden = true;
        }
      });
      return;
    }

    // Visitante ya verificado: intro corta (saltable) u omitida con movimiento reducido
    if (reduce.matches) { leave(); return; }
    intro.classList.add("is-drawing");
    gate.remove();
    skip.hidden = false;
    var timer = window.setTimeout(leave, 1750);
    function skipIt() { window.clearTimeout(timer); leave(); }
    skip.addEventListener("click", skipIt);
    intro.addEventListener("pointerdown", skipIt);
    document.addEventListener("keydown", function k(e) {
      if (finished) { document.removeEventListener("keydown", k); return; }
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); skipIt(); }
    });
  }

  /* ---------- Navegación ---------- */
  function initNav() {
    var nav = $("#nav");
    var bar = $(".nav__progress span", nav);
    var burger = $(".nav__burger", nav);
    var menu = $("#menu");
    var sections = $$("main > .section, .footer");
    var links = $$(".nav__links a");
    var lastY = window.scrollY;
    var ticking = false;

    function onScroll() {
      ticking = false;
      var y = window.scrollY;
      var h = doc.scrollHeight - window.innerHeight;
      bar.style.setProperty("--p", h > 0 ? (y / h).toFixed(4) : 0);
      nav.classList.toggle("is-scrolled", y > 20);
      var menuOpen = !menu.hidden;
      nav.classList.toggle("is-hidden", !menuOpen && y > 600 && y > lastY + 4);
      if (y < lastY - 4 || y < 600) nav.classList.remove("is-hidden");
      lastY = y;

      // Tema del menú según la sección bajo la barra
      var probe = 36;
      for (var i = 0; i < sections.length; i++) {
        var r = sections[i].getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          nav.setAttribute("data-theme", sections[i].getAttribute("data-theme") || "dark");
          var id = sections[i].id;
          links.forEach(function (a) { a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + id)); });
          break;
        }
      }
      updateTimeline();
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    // Menú móvil
    function closeMenu(noReturn) {
      if (menu.hidden) return;
      MW.overlay.close(menu, { noReturn: !!noReturn });
    }
    burger.addEventListener("click", function () {
      if (MW.overlay.isOpen(menu)) { closeMenu(); return; }
      menu.hidden = false;
      menu.classList.add("is-open");
      $$(".menu__list li", menu).forEach(function (li, i) { li.style.setProperty("--i", i); });
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", t("a11y.closeMenu"));
      burger.setAttribute("data-i18n-attr", "aria-label:a11y.closeMenu");
      nav.setAttribute("data-theme", "dark");
      MW.overlay.open(menu, {
        alsoActive: [nav],
        closeDelay: 0,
        returnFocus: burger,
        onClose: function () {
          menu.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
          burger.setAttribute("data-i18n-attr", "aria-label:a11y.openMenu");
          burger.setAttribute("aria-label", t("a11y.openMenu"));
          onScroll();
        }
      });
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a[href^='#']")) closeMenu(true);
    });
  }

  /* ---------- Revelados con IntersectionObserver ---------- */
  function initReveal() {
    var els = $$("[data-reveal]");
    // Escalonado entre hermanos
    els.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute("data-reveal"); });
      var i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty("--d", Math.min(i, 6) * 80 + "ms");
      if (el.getAttribute("data-reveal") === "lines") MW.indexLines(el);
    });
    if (!("IntersectionObserver" in window) || reduce.matches) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Contadores ---------- */
  function initCounters() {
    var els = $$("[data-count]");
    if (!("IntersectionObserver" in window) || reduce.matches) return;
    els.forEach(function (el) { el.textContent = "0"; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, end = +el.getAttribute("data-count"), t0 = null, dur = 1100;
        (function step(ts) {
          if (t0 == null) t0 = ts;
          var k = Math.min((ts - t0) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Timeline ---------- */
  var tl, tlFill, tlSteps;
  function initTimeline() {
    tl = $("#timeline");
    if (!tl) return;
    tlFill = $(".timeline__fill", tl);
    tlSteps = $$(".step", tl);
  }
  function updateTimeline() {
    if (!tl) return;
    var r = tl.getBoundingClientRect();
    var mid = window.innerHeight * 0.6;
    var p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
    tlFill.style.setProperty("--p", p.toFixed(4));
  }

  /* ---------- Panel de servicios ---------- */
  function initServices() {
    var sheet = $("#service-sheet");
    if (!sheet) return;
    $$(".sheet__item", sheet).forEach(function (item) {
      var h = $(".sheet__title", item);
      h.id = "sheet-title-" + item.getAttribute("data-service-detail");
    });
    document.addEventListener("click", function (e) {
      var card = e.target.closest("[data-service]");
      if (card) {
        var key = card.getAttribute("data-service");
        $$(".sheet__item", sheet).forEach(function (it) { it.hidden = it.getAttribute("data-service-detail") !== key; });
        sheet.setAttribute("aria-labelledby", "sheet-title-" + key);
        $(".sheet__panel", sheet).scrollTop = 0;
        MW.overlay.open(sheet, { returnFocus: card, initialFocus: $(".sheet__close", sheet) });
        return;
      }
      var nav = e.target.closest("[data-close-nav]");
      if (nav && MW.overlay.isOpen(sheet)) {
        e.preventDefault();
        MW.overlay.close(sheet, { noReturn: true });
        var target = $(nav.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth" });
          var player = $("#stories-player");
          if (player) window.setTimeout(function () { player.focus({ preventScroll: true }); }, 500);
        }
      }
    });
  }

  /* ---------- Tilt de tarjetas de servicio ---------- */
  function initTilt() {
    if (!finePointer.matches || reduce.matches) return;
    $$(".tilt").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform .12s linear, box-shadow .5s";
        card.style.transform = "rotateX(" + (-py * 10).toFixed(2) + "deg) rotateY(" + (px * 12).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transition = "";
        card.style.transform = "";
      });
    });
  }

  /* ---------- Botones magnéticos ---------- */
  function initMagnetic() {
    if (!finePointer.matches || reduce.matches) return;
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        b.style.transform = "translate(" + (x * 0.22).toFixed(1) + "px," + (y * 0.32).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------- Parallax ligero del hero ---------- */
  function initParallax() {
    if (reduce.matches) return;
    var hero = $(".hero");
    var blobs = $$("[data-parallax]");
    var stickers = $$("[data-float]");
    var mx = 0, my = 0, sy = 0, pending = false;
    function render() {
      pending = false;
      blobs.forEach(function (b) {
        var k = +b.getAttribute("data-parallax");
        b.style.transform = "translate3d(" + (mx * k * 60).toFixed(1) + "px," + (sy * k + my * k * 60).toFixed(1) + "px,0)";
      });
      stickers.forEach(function (s) {
        var k = +s.getAttribute("data-float");
        s.style.transform = "translate3d(" + (mx * k * 18).toFixed(1) + "px," + (my * k * 18 - sy * 0.15 * k).toFixed(1) + "px,0)";
      });
    }
    function req() { if (!pending) { pending = true; requestAnimationFrame(render); } }
    if (finePointer.matches) {
      hero.addEventListener("pointermove", function (e) {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
        req();
      });
    }
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      sy = y;
      req();
    }, { passive: true });
    $$(".sticker").forEach(function (s, i) { s.style.setProperty("--i", i); });
  }

  /* ---------- Cursor personalizado ---------- */
  function initCursor() {
    if (!finePointer.matches || reduce.matches) return;
    var c = $(".cursor");
    if (!c) return;
    doc.classList.add("has-cursor");
    var x = -100, y = -100, cx = -100, cy = -100, raf = null;
    function loop() {
      cx += (x - cx) * 0.25;
      cy += (y - cy) * 0.25;
      c.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : null;
    }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      c.classList.remove("is-hidden");
      var interactive = e.target.closest && e.target.closest("a, button, summary, label, input, [role='radio'], .stories, .piece");
      c.classList.toggle("is-hover", !!interactive);
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener("pointerdown", function () { c.classList.add("is-down"); });
    document.addEventListener("pointerup", function () { c.classList.remove("is-down"); });
    document.addEventListener("mouseleave", function () { c.classList.add("is-hidden"); });
  }

  /* ---------- FAQ: solo uno abierto a la vez ---------- */
  function initFaq() {
    var items = $$(".faq-item");
    items.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  /* ---------- Arranque ---------- */
  function safe(fn) {
    try { fn(); } catch (e) { if (window.console) console.error(e); }
  }

  function boot() {
    [initLang, MW.contact.init, MW.stories.init, MW.merch.init, MW.configurator.init,
      initNav, initTimeline, initServices, initTilt, initMagnetic, initCursor, initFaq,
      initParallax, initCounters].forEach(safe);
    safe(function () {
      initIntro(function () {
        doc.classList.add("mw-ready");
        safe(initReveal);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
