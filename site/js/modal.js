/* ==========================================================================
   MarkeWeed · Overlays (gestor genérico) + modal de contacto
   - Focus trap, Esc, clic fuera, aria-modal, devuelve el foco al cerrar.
   - Mientras hay un overlay abierto, el resto de la página queda `inert`.
   ========================================================================== */
(function () {
  "use strict";
  window.MW = window.MW || {};

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
  var stack = [];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && getComputedStyle(el).visibility !== "hidden";
  }

  function focusablesIn(containers) {
    var list = [];
    containers.forEach(function (c) {
      c.querySelectorAll(FOCUSABLE).forEach(function (el) {
        if (!el.closest("[hidden]") && !el.closest("[inert]") && isVisible(el)) list.push(el);
      });
    });
    return list;
  }

  function updateInert() {
    var top = stack[stack.length - 1];
    Array.prototype.forEach.call(document.body.children, function (child) {
      if (child.tagName === "SCRIPT" || child.classList.contains("sprite")) return;
      var active = !top || child === top.el || child.contains(top.el) ||
        (top.opts.alsoActive || []).some(function (a) { return child === a || child.contains(a); });
      if (active) child.removeAttribute("inert");
      else child.setAttribute("inert", "");
    });
    document.documentElement.classList.toggle("is-locked", stack.length > 0);
  }

  function open(el, opts) {
    opts = opts || {};
    if (isOpen(el)) return;
    var entry = { el: el, opts: opts, ret: opts.returnFocus || document.activeElement };
    stack.push(entry);
    el.hidden = false;
    el.classList.remove("is-closing");
    updateInert();
    document.dispatchEvent(new CustomEvent("mw:overlay", { detail: { open: true, el: el } }));
    var target = opts.initialFocus || el.querySelector("[data-autofocus]") || focusablesIn([el])[0];
    if (target) {
      requestAnimationFrame(function () { target.focus({ preventScroll: true }); });
    }
  }

  function close(el, opts) {
    opts = opts || {};
    var i = -1;
    stack.forEach(function (e, k) { if (e.el === el) i = k; });
    if (i === -1) return null;
    var entry = stack.splice(i, 1)[0];
    var delay = reduce.matches ? 0 : (entry.opts.closeDelay != null ? entry.opts.closeDelay : 300);
    el.classList.add("is-closing");
    window.setTimeout(function () {
      if (!isOpen(el)) { el.hidden = true; el.classList.remove("is-closing"); }
    }, delay);
    updateInert();
    if (entry.opts.onClose) entry.opts.onClose();
    if (!opts.noReturn && entry.ret && document.contains(entry.ret) && typeof entry.ret.focus === "function") {
      entry.ret.focus({ preventScroll: true });
    }
    if (!stack.length) document.dispatchEvent(new CustomEvent("mw:overlay", { detail: { open: false, el: el } }));
    return entry;
  }

  function isOpen(el) {
    return stack.some(function (e) { return e.el === el; });
  }

  function top() { return stack[stack.length - 1] || null; }

  document.addEventListener("keydown", function (e) {
    var t = top();
    if (!t) return;
    if (e.key === "Escape" && !t.opts.noEsc) {
      e.preventDefault();
      close(t.el);
      return;
    }
    if (e.key === "Tab") {
      var containers = [t.el].concat(t.opts.alsoActive || []);
      var f = focusablesIn(containers);
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      var idx = f.indexOf(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || idx === -1)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || idx === -1)) { e.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener("click", function (e) {
    var c = e.target.closest("[data-close]");
    if (!c) return;
    var host = c.closest(".sheet, .viewer, .modal");
    if (host && isOpen(host)) close(host);
  });

  MW.overlay = { open: open, close: close, isOpen: isOpen, top: top, focusablesIn: focusablesIn };

  /* ------------------------------------------------------------------ */
  /* Modal de contacto                                                   */
  /* ------------------------------------------------------------------ */
  var modal, interestEl, summaryEl, copyBtn, copyLabel, copyLive;
  var getInterest = null;
  var copyTimer = null;

  function t(k, p) { return MW.i18n.t(k, p); }

  function resolveInterest(spec) {
    if (typeof spec === "function") return spec;
    spec = spec || "general";
    var parts = spec.split(":");
    var kind = parts[0], val = parts[1];
    // La pieza del visor se captura ahora: el visor se cierra antes de abrir el modal
    var item = kind === "merch" && MW.merch && MW.merch.currentItem ? MW.merch.currentItem() : null;
    return function () {
      if (kind === "plan") return t("interest.plan." + val);
      if (kind === "service") return t("interest.service." + val);
      if (kind === "stories") {
        var n = MW.storiesPack || 22;
        return n >= 60 ? t("interest.storiesPlus") : t("interest.stories", { n: n });
      }
      if (kind === "merch") {
        return item ? t("interest.merchPiece", { piece: item.querySelector(".piece__name").textContent.trim() }) : t("interest.merch");
      }
      if (kind === "config" && MW.configurator) return MW.configurator.interest();
      return t("interest.general");
    };
  }

  function render() {
    if (!getInterest) return;
    var interest = getInterest();
    interestEl.textContent = interest;
    summaryEl.textContent = t("summary", { x: interest });
  }

  function resetCopy() {
    window.clearTimeout(copyTimer);
    copyBtn.classList.remove("is-copied");
    copyLabel.textContent = t("modal.copy");
  }

  function openContact(spec, trigger) {
    getInterest = resolveInterest(spec);
    // Si el CTA está dentro de otro overlay (panel de servicio, visor), se cierra primero
    var ret = trigger || document.activeElement;
    var host = trigger && trigger.closest && trigger.closest(".sheet, .viewer");
    if (host && isOpen(host)) {
      var entry = close(host, { noReturn: true });
      if (entry && entry.ret) ret = entry.ret;
    }
    resetCopy();
    render();
    open(modal, { returnFocus: ret, initialFocus: copyBtn });
  }

  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    modal.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    modal.removeChild(ta);
    return ok;
  }

  function copied(ok) {
    if (ok) {
      copyBtn.classList.add("is-copied");
      copyLabel.textContent = t("modal.copied");
      copyLive.textContent = t("modal.copiedLive");
      copyTimer = window.setTimeout(resetCopy, 2400);
    } else {
      copyLive.textContent = t("modal.copyFail");
      var range = document.createRange();
      range.selectNodeContents(summaryEl);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function copySummary() {
    var text = summaryEl.textContent;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { copied(true); }, function () { copied(legacyCopy(text)); });
    } else {
      copied(legacyCopy(text));
    }
  }

  function init() {
    modal = document.getElementById("contact-modal");
    if (!modal) return;
    interestEl = document.getElementById("modal-interest");
    summaryEl = document.getElementById("modal-summary");
    copyBtn = document.getElementById("copy-summary");
    copyLabel = document.getElementById("copy-label");
    copyLive = document.getElementById("copy-live");

    copyBtn.addEventListener("click", copySummary);

    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-contact]");
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      openContact(b.getAttribute("data-contact"), b);
    });

    document.addEventListener("mw:lang", function () {
      if (isOpen(modal)) { render(); resetCopy(); }
    });
  }

  MW.contact = { open: openContact, init: init };
})();
