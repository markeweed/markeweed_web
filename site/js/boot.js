/* MarkeWeed · arranque (se ejecuta antes de pintar): marca JS, idioma y bloqueo para la intro. */
(function () {
  var d = document.documentElement;
  d.classList.remove("no-js");
  d.classList.add("js", "is-locked");
  var lang = null;
  try { lang = localStorage.getItem("mw-lang"); } catch (e) { /* sin almacenamiento */ }
  if (lang !== "es" && lang !== "en") {
    var nav = (navigator.language || "es").toLowerCase();
    lang = nav.indexOf("es") === 0 ? "es" : "en";
  }
  d.setAttribute("data-lang", lang);
})();
