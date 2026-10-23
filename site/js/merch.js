/* ==========================================================================
   MarkeWeed · Mesa de merchandising: filtros, recolor, tilt, drag y visor
   ========================================================================== */
(function () {
  "use strict";
  window.MW = window.MW || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  function t(k, p) { return MW.i18n.t(k, p); }

  var SWATCHES = {
    navy:   { main: "#001F3F", acc: "#CC5500", ink: "#FFFFFF", soft: "#0A3157", paper: "#FFFFFF", text: "#001F3F", edge: "transparent", edgeW: 0 },
    teal:   { main: "#008080", acc: "#001F3F", ink: "#FFFFFF", soft: "#3FB0B0", paper: "#FFFFFF", text: "#001F3F", edge: "transparent", edgeW: 0 },
    orange: { main: "#CC5500", acc: "#001F3F", ink: "#FFFFFF", soft: "#F08A3C", paper: "#FFFFFF", text: "#001F3F", edge: "transparent", edgeW: 0 },
    white:  { main: "#FFFFFF", acc: "#CC5500", ink: "#001F3F", soft: "#F4F1EA", paper: "#001F3F", text: "#FFFFFF", edge: "rgba(0,31,63,.22)", edgeW: 2 }
  };

  var board, items, viewer, stage, current = -1;

  function applySwatch(name) {
    var s = SWATCHES[name] || SWATCHES.navy;
    var st = document.documentElement.style;
    st.setProperty("--m-main", s.main);
    st.setProperty("--m-acc", s.acc);
    st.setProperty("--m-ink", s.ink);
    st.setProperty("--m-soft", s.soft);
    st.setProperty("--m-paper", s.paper);
    st.setProperty("--m-text", s.text);
    st.setProperty("--m-edge", s.edge);
    st.setProperty("--m-edge-w", s.edgeW);
  }

  /* ---------- Filtros ---------- */
  function initFilters() {
    var group = document.querySelector(".merch .filters");
    if (!group) return;
    group.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]");
      if (!b) return;
      var f = b.getAttribute("data-filter");
      group.querySelectorAll("[data-filter]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      items.forEach(function (li) {
        var match = f === "all" || li.getAttribute("data-cat") === f;
        if (!match && !li.hidden) {
          li.classList.add("is-hiding");
          window.setTimeout(function () { if (li.classList.contains("is-hiding")) { li.hidden = true; li.classList.remove("is-hiding"); } }, reduce.matches ? 0 : 380);
        } else if (match) {
          li.classList.remove("is-hiding");
          if (li.hidden) {
            li.hidden = false;
            li.classList.remove("is-showing");
            void li.offsetWidth;
            li.classList.add("is-showing");
          }
        }
      });
    });
  }

  /* ---------- Swatches (radiogroup) ---------- */
  function initSwatches() {
    var group = document.querySelector(".swatches__opts");
    if (!group) return;
    var btns = Array.prototype.slice.call(group.querySelectorAll("[data-swatch]"));
    function select(b, focus) {
      btns.forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); x.tabIndex = x === b ? 0 : -1; });
      if (focus) b.focus();
      applySwatch(b.getAttribute("data-swatch"));
    }
    group.addEventListener("click", function (e) {
      var b = e.target.closest("[data-swatch]");
      if (b) select(b, false);
    });
    group.addEventListener("keydown", function (e) {
      var i = btns.indexOf(document.activeElement);
      if (i === -1) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select(btns[(i + 1) % btns.length], true); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select(btns[(i - 1 + btns.length) % btns.length], true); }
    });
    select(btns[0], false);
  }

  /* ---------- Tilt + drag ---------- */
  function initPieces() {
    var zTop = 1;
    items.forEach(function (li) {
      var piece = li.querySelector(".piece");
      var state = { tx: 0, ty: 0, drag: null, moved: false };
      piece._state = state;

      function setT() {
        piece.style.setProperty("--tx", state.tx + "px");
        piece.style.setProperty("--ty", state.ty + "px");
      }

      piece.addEventListener("pointermove", function (e) {
        if (state.drag) {
          var dx = e.clientX - state.drag.x, dy = e.clientY - state.drag.y;
          if (!state.moved && Math.hypot(dx, dy) > 6) {
            state.moved = true;
            piece.classList.add("is-dragging");
            piece.style.setProperty("--rx", "0deg");
            piece.style.setProperty("--ry", "0deg");
            li.classList.add("is-top");
            li.style.zIndex = String(++zTop + 10);
            try { piece.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ }
          }
          if (state.moved) {
            var br = board.getBoundingClientRect(), pr = state.drag.rect;
            var nx = state.drag.tx + dx, ny = state.drag.ty + dy;
            // Mantener la pieza dentro de la mesa
            var minX = br.left - pr.left + state.drag.tx - pr.width * 0.3;
            var maxX = br.right - pr.right + state.drag.tx + pr.width * 0.3;
            var minY = br.top - pr.top + state.drag.ty - pr.height * 0.3;
            var maxY = br.bottom - pr.bottom + state.drag.ty + pr.height * 0.3;
            state.tx = Math.max(minX, Math.min(maxX, nx));
            state.ty = Math.max(minY, Math.min(maxY, ny));
            setT();
          }
          return;
        }
        if (e.pointerType !== "mouse" || reduce.matches) return;
        var r = piece.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        piece.classList.add("is-tilting");
        piece.style.setProperty("--rx", (-py * 16).toFixed(2) + "deg");
        piece.style.setProperty("--ry", (px * 18).toFixed(2) + "deg");
      });

      piece.addEventListener("pointerleave", function () {
        if (state.drag) return;
        piece.classList.remove("is-tilting");
        piece.style.setProperty("--rx", "0deg");
        piece.style.setProperty("--ry", "0deg");
      });

      piece.addEventListener("pointerdown", function (e) {
        if (e.button !== 0) return;
        state.moved = false;
        state.drag = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty, rect: piece.getBoundingClientRect() };
      });

      function end() {
        if (!state.drag) return;
        state.drag = null;
        piece.classList.remove("is-dragging");
        if (state.moved) {
          piece._justDragged = true;
          window.setTimeout(function () { piece._justDragged = false; }, 50);
        }
      }
      piece.addEventListener("pointerup", end);
      piece.addEventListener("pointercancel", function () { state.moved = false; end(); });

      piece.addEventListener("click", function (e) {
        if (piece._justDragged) { e.preventDefault(); return; }
        openViewer(visibleItems().indexOf(li), piece);
      });
    });

    var reset = document.querySelector("[data-merch-reset]");
    if (reset) reset.addEventListener("click", function () {
      items.forEach(function (li) {
        var p = li.querySelector(".piece");
        p._state.tx = 0; p._state.ty = 0;
        p.style.setProperty("--tx", "0px");
        p.style.setProperty("--ty", "0px");
        li.classList.remove("is-top");
        li.style.zIndex = "";
      });
    });
  }

  function visibleItems() {
    return items.filter(function (li) { return !li.hidden && !li.classList.contains("is-hiding"); });
  }

  /* ---------- Visor ---------- */
  function cloneArt(li) {
    var svg = li.querySelector(".piece__art svg").cloneNode(true);
    var ids = [];
    svg.querySelectorAll("[id]").forEach(function (el) { ids.push(el.id); el.id = el.id + "-v"; });
    if (ids.length) {
      svg.querySelectorAll("*").forEach(function (el) {
        ["clip-path", "href", "fill", "mask", "filter"].forEach(function (attr) {
          var v = el.getAttribute(attr);
          if (!v) return;
          ids.forEach(function (id) {
            v = v.replace("url(#" + id + ")", "url(#" + id + "-v)");
            if (v === "#" + id) v = "#" + id + "-v";
          });
          el.setAttribute(attr, v);
        });
      });
    }
    svg.setAttribute("role", "img");
    svg.removeAttribute("aria-hidden");
    svg.setAttribute("aria-label", nameOf(li));
    return svg;
  }

  function nameOf(li) { return li.querySelector(".piece__name").textContent.trim(); }

  function renderViewer() {
    var list = visibleItems();
    if (current < 0 || current >= list.length) return;
    var li = list[current];
    stage.innerHTML = "";
    stage.appendChild(cloneArt(li));
    document.getElementById("viewer-title").textContent = nameOf(li);
    document.getElementById("viewer-cat").textContent = t("merch.cat." + li.getAttribute("data-cat"));
    document.getElementById("viewer-detail").textContent = li.querySelector(".piece__detail").textContent;
    document.getElementById("viewer-count").textContent = (current + 1) + " / " + list.length;
  }

  function openViewer(i, trigger) {
    if (i < 0) return;
    current = i;
    renderViewer();
    if (!MW.overlay.isOpen(viewer)) {
      MW.overlay.open(viewer, { returnFocus: trigger, onClose: function () { current = -1; } });
    }
  }

  function step(d) {
    var n = visibleItems().length;
    current = (current + d + n) % n;
    renderViewer();
  }

  function initViewer() {
    viewer = document.getElementById("merch-viewer");
    stage = document.getElementById("viewer-stage");
    if (!viewer) return;
    viewer.addEventListener("click", function (e) {
      var b = e.target.closest("[data-viewer]");
      if (b) step(b.getAttribute("data-viewer") === "next" ? 1 : -1);
    });
    viewer.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    });
    // Swipe en el visor
    var sx = null;
    stage.addEventListener("pointerdown", function (e) { sx = e.clientX; });
    stage.addEventListener("pointerup", function (e) {
      if (sx == null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });
    document.addEventListener("mw:lang", function () {
      if (MW.overlay.isOpen(viewer)) renderViewer();
    });
  }

  function init() {
    board = document.getElementById("merch-board");
    if (!board) return;
    items = Array.prototype.slice.call(board.querySelectorAll(".merch-item"));
    items.forEach(function (li) {
      var p = li.querySelector(".piece");
      p.setAttribute("aria-haspopup", "dialog");
    });
    initFilters();
    initSwatches();
    initPieces();
    initViewer();
  }

  MW.merch = {
    init: init,
    currentItem: function () {
      return current < 0 ? null : visibleItems()[current] || null;
    }
  };
})();
