/*
 * ČistoMore — rano postavljanje načina (dark/light), teme i jezika.
 * Učitava se SINKRONO u <head> svake stranice (prije CSS-a), da nema bljeska krive boje.
 *   <script src="cm-boot.js"></script>
 * Dark = paleta A „Dubina“ (data-theme="dubina"), light = paleta D „Ocean“ (data-theme="ocean").
 */
(function () {
  var d = document.documentElement, m = null, l = null, t = null;
  try {
    m = localStorage.getItem("cm-mode") || localStorage.getItem("po-mode");
    l = localStorage.getItem("cm-lang");
    t = localStorage.getItem("cm-theme");
  } catch (e) {}
  if (m !== "light" && m !== "dark") {
    m = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  if (l !== "hr" && l !== "en") {
    var n = ((navigator.languages && navigator.languages[0]) || navigator.language || "hr").toLowerCase();
    l = /^(hr|bs|sr|sl|cnr)/.test(n) ? "hr" : "en";
  }
  // Posebna tema s Profila (deepsea, turquoise, midnight) ima prednost; inače tema prati način
  var custom = t && t !== "ocean" && t !== "dubina";
  d.setAttribute("data-mode", m);
  d.setAttribute("data-po-mode", m);
  d.setAttribute("data-theme", custom ? t : (m === "light" ? "ocean" : "dubina"));
  d.setAttribute("lang", l);
  d.className += (d.className ? " " : "") + "js";
})();
