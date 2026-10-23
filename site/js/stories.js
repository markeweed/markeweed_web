/* ==========================================================================
   MarkeWeed · Stories navegables + selector de cantidad (calendario)
   ========================================================================== */
(function () {
  "use strict";
  window.MW = window.MW || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function t(k, p) { return MW.i18n.t(k, p); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ------------------------------------------------------------------ */
  /* Reproductor                                                         */
  /* ------------------------------------------------------------------ */
  function initPlayer() {
    var root = document.getElementById("stories-player");
    if (!root) return;
    var wrap = root.closest(".phone-wrap");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".story"));
    var bars = Array.prototype.slice.call(root.querySelectorAll(".stories__bars i"));
    var live = document.getElementById("stories-live");
    var toggleBtn = wrap.querySelector('[data-story="toggle"]');
    var D = (MW.config && MW.config.STORY_DURATION) || 5000;

    var idx = 0, elapsed = 0, last = null, raf = null;
    var userPlaying = !reduce.matches;
    var holding = false, visible = false, overlayOpen = false;
    var press = null;

    function paused() { return !userPlaying || holding || !visible || overlayOpen || document.hidden; }

    function syncPausedUI() {
      var p = !userPlaying || holding;
      root.classList.toggle("is-paused", p);
      wrap.classList.toggle("is-story-paused", !userPlaying);
      toggleBtn.setAttribute("aria-label", t(userPlaying ? "stories.pause" : "stories.play"));
    }

    function label(i) {
      var f = slides[i].querySelector(".story__format span:last-child");
      return f ? f.textContent : "";
    }

    function show(i, announce) {
      var n = slides.length;
      idx = (i + n) % n;
      slides.forEach(function (s, k) {
        var on = k === idx;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", String(!on));
        s.querySelectorAll("button").forEach(function (b) { b.tabIndex = on ? 0 : -1; });
      });
      root.classList.toggle("is-light", slides[idx].hasAttribute("data-light"));
      bars.forEach(function (b, k) { b.style.setProperty("--p", k < idx ? 1 : 0); });
      elapsed = 0;
      if (announce && live) live.textContent = t("stories.live", { n: idx + 1, total: n, label: label(idx) });
    }

    function next(announce) { show(idx + 1, announce); }
    function prev(announce) {
      if (elapsed > 1200 && !announce) { show(idx, announce); return; }
      show(idx - 1, announce);
    }

    function tick(ts) {
      if (last == null) last = ts;
      var dt = Math.min(ts - last, 100);
      last = ts;
      if (!paused()) {
        elapsed += dt;
        if (elapsed >= D) next(false);
      }
      if (bars[idx]) bars[idx].style.setProperty("--p", Math.min(elapsed / D, 1));
      raf = visible ? requestAnimationFrame(tick) : null;
    }

    function start() {
      if (raf == null) { last = null; raf = requestAnimationFrame(tick); }
    }

    // Visibilidad (solo corre cuando está en pantalla)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start();
      }, { threshold: 0.35 }).observe(root);
    } else {
      visible = true; start();
    }

    document.addEventListener("mw:overlay", function (e) { overlayOpen = !!(MW.overlay && MW.overlay.top()); });

    // Puntero: tocar izq/dcha, mantener para pausar, swipe
    root.addEventListener("pointerdown", function (e) {
      if (e.target.closest("[data-interactive]")) return;
      if (e.button != null && e.button !== 0) return;
      press = { x: e.clientX, y: e.clientY, t: Date.now(), held: false };
      press.timer = window.setTimeout(function () {
        if (press) { press.held = true; holding = true; syncPausedUI(); }
      }, 220);
    });
    function endPress(e, cancelled) {
      if (!press) return;
      window.clearTimeout(press.timer);
      var p = press;
      press = null;
      if (holding) { holding = false; syncPausedUI(); }
      if (cancelled || p.held) return;
      var dx = e.clientX - p.x, dy = e.clientY - p.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next(true); else prev(true);
        return;
      }
      if (Math.abs(dx) > 12 || Math.abs(dy) > 12) return;
      var r = root.getBoundingClientRect();
      if (e.clientX - r.left < r.width * 0.35) prev(true); else next(true);
    }
    root.addEventListener("pointerup", function (e) { endPress(e, false); });
    root.addEventListener("pointercancel", function (e) { endPress(e, true); });
    root.addEventListener("pointerleave", function (e) { if (press && press.held) endPress(e, true); });
    root.addEventListener("contextmenu", function (e) { if (holding) e.preventDefault(); });

    // Teclado
    root.addEventListener("keydown", function (e) {
      if (e.target !== root) return;
      if (e.key === "ArrowRight") { e.preventDefault(); next(true); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(true); }
      else if (e.key === " " || e.key === "k") { e.preventDefault(); userPlaying = !userPlaying; syncPausedUI(); }
    });

    // Controles visibles
    wrap.addEventListener("click", function (e) {
      var b = e.target.closest("[data-story]");
      if (!b) return;
      var a = b.getAttribute("data-story");
      if (a === "next") next(true);
      else if (a === "prev") show(idx - 1, true);
      else { userPlaying = !userPlaying; syncPausedUI(); }
    });

    // Encuesta
    root.querySelectorAll(".poll").forEach(function (poll) {
      poll.addEventListener("click", function (e) {
        var opt = e.target.closest(".poll__opt");
        if (!opt || poll.classList.contains("is-voted")) return;
        opt.classList.add("is-chosen");
        poll.classList.add("is-voted");
      });
    });

    // Recordatorio
    root.querySelectorAll(".remind").forEach(function (b) {
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
      });
    });

    // Cuenta atrás al próximo viernes 21:00 y timecodes "REC"
    var cd = root.querySelector("[data-countdown]");
    var timecodes = document.querySelectorAll("[data-timecode]");
    var started = Date.now();
    function target() {
      var d = new Date();
      var tgt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 21, 0, 0);
      var add = (5 - d.getDay() + 7) % 7;
      tgt.setDate(tgt.getDate() + add);
      if (tgt <= d) tgt.setDate(tgt.getDate() + 7);
      return tgt;
    }
    var tgt = target();
    function clock() {
      var now = Date.now();
      if (cd) {
        var diff = Math.max(0, Math.floor((tgt - now) / 1000));
        if (!diff) tgt = target();
        cd.querySelector('[data-cd="d"]').textContent = pad(Math.floor(diff / 86400));
        cd.querySelector('[data-cd="h"]').textContent = pad(Math.floor(diff / 3600) % 24);
        cd.querySelector('[data-cd="m"]').textContent = pad(Math.floor(diff / 60) % 60);
        cd.querySelector('[data-cd="s"]').textContent = pad(diff % 60);
      }
      var s = 7 + Math.floor((now - started) / 1000) % 53;
      timecodes.forEach(function (el) { el.textContent = "00:00:" + pad(s); });
    }
    clock();
    window.setInterval(clock, 1000);

    document.addEventListener("mw:lang", syncPausedUI);
    document.addEventListener("visibilitychange", function () { last = null; });

    show(0, false);
    syncPausedUI();
  }

  /* ------------------------------------------------------------------ */
  /* Selector de cantidad de stories + calendario mensual                */
  /* ------------------------------------------------------------------ */
  function initPack() {
    var opts = document.querySelector(".spack__opts");
    var cal = document.getElementById("spack-cal");
    var cap = document.getElementById("spack-caption");
    if (!opts || !cal) return;
    var buttons = Array.prototype.slice.call(opts.querySelectorAll("[data-stories]"));
    MW.storiesPack = 22;

    function render(n) {
      var now = new Date();
      var y = now.getFullYear(), m = now.getMonth();
      var days = new Date(y, m + 1, 0).getDate();
      var offset = (new Date(y, m, 1).getDay() + 6) % 7; // lunes = 0
      var dow = t("spack.dow").split(",");
      var html = "";
      dow.forEach(function (d) { html += '<span class="spack__dow">' + d + "</span>"; });
      for (var i = 0; i < offset; i++) html += '<span class="spack__day is-empty"></span>';
      var base = Math.floor(n / days), rem = n % days, k = 0;
      for (var d = 0; d < days; d++) {
        var count = base + (Math.floor((d + 1) * rem / days) > Math.floor(d * rem / days) ? 1 : 0);
        var dots = "";
        for (var c = 0; c < Math.min(count, 3); c++) dots += '<i style="--k:' + (k++) + '"></i>';
        html += '<span class="spack__day"><b>' + (d + 1) + "</b>" + dots + "</span>";
      }
      cal.innerHTML = html;
      cap.setAttribute("data-i18n", "spack.c" + n);
      cap.textContent = t("spack.c" + n);
    }

    function select(btn, focus) {
      buttons.forEach(function (b) {
        var on = b === btn;
        b.setAttribute("aria-checked", String(on));
        b.tabIndex = on ? 0 : -1;
      });
      if (focus) btn.focus();
      var n = parseInt(btn.getAttribute("data-stories"), 10);
      MW.storiesPack = n;
      render(n);
    }

    opts.addEventListener("click", function (e) {
      var b = e.target.closest("[data-stories]");
      if (b) select(b, false);
    });
    opts.addEventListener("keydown", function (e) {
      var i = buttons.indexOf(document.activeElement);
      if (i === -1) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select(buttons[(i + 1) % buttons.length], true); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select(buttons[(i - 1 + buttons.length) % buttons.length], true); }
    });
    document.addEventListener("mw:lang", function () { render(MW.storiesPack); });

    select(buttons.filter(function (b) { return b.getAttribute("aria-checked") === "true"; })[0] || buttons[1], false);
  }

  MW.stories = {
    init: function () { initPlayer(); initPack(); }
  };
})();
