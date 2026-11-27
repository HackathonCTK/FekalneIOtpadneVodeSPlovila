/*
 * ČistoMore — Dio 4: „Plovi odgovorno“
 * Prikaz sadržaja (HR/EN), interakcije (uvala, vodič, provjera pravila, čepovi, kviz)
 * i GSAP scroll animacija uvoda. Tekstovi su u plovi-odgovorno-sadrzaj.js.
 * Bez GSAP-a ili uz „smanjeno kretanje“ stranica radi kao obična, sav sadržaj je vidljiv.
 */
(function () {
  "use strict";

  var C = window.PO_CONTENT;
  if (!C) return;

  var doc = document;
  var root = doc.documentElement;
  var LANG_KEY = "cm-lang";       // zajednički ključ: ostale grupe ga mogu čitati
  var BEST_KEY = "po-quiz-best";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function sget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function fmt(s, vars) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }

  /* ---------- Jezik ---------- */
  function detectLang() {
    var saved = sget(LANG_KEY);
    if (saved === "hr" || saved === "en") return saved;
    var nav = (navigator.language || "hr").toLowerCase();
    return /^(hr|bs|sr|sl|cnr)/.test(nav) ? "hr" : "en";
  }
  var lang = detectLang();
  function t(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, C[lang]);
  }

  /* ---------- Ikone ---------- */
  var ICON = {
    bacteria: '<rect x="4" y="8" width="16" height="8" rx="4" transform="rotate(-30 12 12)"/><path d="M8 5 7 3M16 19l1 2M5 14l-2 1M19 10l2-1"/>',
    algae: '<path d="M7 21c0-5 4-6 4-11S8 4 8 3"/><path d="M13 21c0-4 3-5 3-9s-2-5-2-6"/><path d="M18 21c0-3 2-4 2-7"/>',
    shell: '<path d="M12 4C7 4 3 8 3 13c0 2 1 4 3 5h12c2-1 3-3 3-5 0-5-4-9-9-9Z"/><path d="M12 4v14M8 5.5 9.5 18M16 5.5 14.5 18"/>',
    grass: '<path d="M6 21c0-6 2-10 1-16"/><path d="M10 21c0-5 3-8 2-13"/><path d="M14 21c0-6-2-9 0-15"/><path d="M18 21c0-4 1-7 0-10"/>',
    pin: '<path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'
  };
  function icon(name, size) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 22) + '" height="' + (size || 22) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + "</svg>";
  }

  /* =====================================================================
     Izgradnja strukture (jednom); tekst puni applyLang()
     ===================================================================== */
  var base = C.hr;

  function buildStatic() {
    $("#po-lines").innerHTML = base.intro.lines.map(function (_, i) {
      return '<li class="po-line"><span data-i18n="intro.lines.' + i + '"></span></li>';
    }).join("");

    $("#po-facts").innerHTML = base.intro.facts.map(function (_, i) {
      var k = "intro.facts." + i;
      return '<div class="po-fact"><div class="po-fact-num"><span data-i18n="' + k + '.n"></span><small data-i18n="' + k + '.u"></small></div><p data-i18n="' + k + '.t"></p></div>';
    }).join("");

    $("#po-impact-cards").innerHTML = base.impact.cards.map(function (c, i) {
      var k = "impact.cards." + i;
      return '<article class="po-impact"><div class="po-impact-icon">' + icon(c.icon) + '</div><h3 data-i18n="' + k + '.t"></h3><p data-i18n="' + k + '.d"></p></article>';
    }).join("");

    // Vodič: kartice (ARIA tabs)
    $("#po-tabs").innerHTML = base.guide.tabs.map(function (_, i) {
      return '<button type="button" class="po-tab" role="tab" id="po-tab-' + i + '" aria-controls="po-panel-' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-i18n="guide.tabs.' + i + '.t"></button>';
    }).join("");
    $("#po-tabpanels").innerHTML = base.guide.tabs.map(function (tab, i) {
      var k = "guide.tabs." + i;
      return '<div class="po-panel" role="tabpanel" id="po-panel-' + i + '" aria-labelledby="po-tab-' + i + '" tabindex="0"' + (i === 0 ? "" : " hidden") + ">" +
        '<h3 data-i18n="' + k + '.h"></h3><p data-i18n="' + k + '.p"></p><ul>' +
        tab.pts.map(function (_, j) { return '<li data-i18n="' + k + ".pts." + j + '"></li>'; }).join("") +
        "</ul></div>";
    }).join("");

    // Provjera pravila
    $("#po-where").innerHTML = base.guide.checker.where.map(function (_, i) {
      return '<label><input type="radio" name="po-where" id="po-where-' + i + '" value="' + i + '"' + (i === checker.where ? " checked" : "") + '><span data-i18n="guide.checker.where.' + i + '"></span></label>';
    }).join("");
    $("#po-sys").innerHTML = base.guide.checker.sys.map(function (_, i) {
      return '<label><input type="radio" name="po-sys" id="po-sys-' + i + '" value="' + i + '"' + (i === checker.sys ? " checked" : "") + '><span data-i18n="guide.checker.sys.' + i + '"></span></label>';
    }).join("");

    // Koraci na prihvatnoj stanici (redoslijed je stvaran)
    $("#po-steps").innerHTML = base.pump.steps.map(function (_, i) {
      var k = "pump.steps." + i;
      return '<li class="po-step' + (i === 2 ? " is-warn" : "") + '"><h3 data-i18n="' + k + '.t"></h3><p data-i18n="' + k + '.d"></p></li>';
    }).join("");

    // Čepovi na palubi
    $("#po-caps").innerHTML = base.pump.caps.labels.map(function (_, i) {
      return '<button type="button" class="po-cap" data-cap="' + i + '"><b data-i18n="pump.caps.labels.' + i + '"></b><small data-i18n="pump.caps.hints.' + i + '"></small></button>';
    }).join("");

    // Primjeri stanica (demo) — poveznica na kartu grupe 2
    $("#po-stations").innerHTML = base.pump.stations.items.map(function (_, i) {
      var k = "pump.stations.items." + i;
      return '<li class="po-station"><span class="po-station-pin">' + icon("pin", 18) + '</span><h4 data-i18n="' + k + '.n"></h4><p data-i18n="' + k + '.p"></p><p class="po-hours" data-i18n="' + k + '.h"></p><a href="map.html"><span data-i18n="pump.stations.onMap"></span> →</a></li>';
    }).join("");

    $("#po-sources").innerHTML = base.sources.items.map(function (s, i) {
      return '<li><a href="' + s.u + '" target="_blank" rel="noopener" data-i18n="sources.items.' + i + '.t"></a></li>';
    }).join("");
  }

  /* =====================================================================
     Uvala: ilustracija utjecaja
     ===================================================================== */
  var bay = { n: 20, mode: "dump", spots: [] };

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var r = Math.imul(a ^ (a >>> 15), 1 | a);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function buildBay() {
    var rnd = mulberry32(7);
    var spots = [], guard = 0;
    while (spots.length < 60 && guard++ < 5000) {
      // Unutrašnjost uvale: obala je približno parabola od (200,56) do (64,150) / (336,150)
      var x = 76 + rnd() * 248;
      var top = 56 + 94 * Math.pow((x - 200) / 136, 2) + 16;
      var y = top + rnd() * (204 - top);
      var ok = spots.every(function (p) { return (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y) > 15 * 15; });
      if (ok) spots.push({ x: x, y: y, r: Math.round(rnd() * 60 - 30) });
    }
    // Brodovi bliže unutrašnjosti uvale prvi (tamo se ljeti najprije sidri)
    spots.sort(function (a, b) { return a.y - b.y; });
    bay.spots = spots;

    var svg = $("#po-bay-svg");
    var ns = "http://www.w3.org/2000/svg";
    var defs = doc.createElementNS(ns, "defs");
    var clip = doc.createElementNS(ns, "clipPath");
    clip.setAttribute("id", "po-bay-clip");
    var cp = doc.createElementNS(ns, "path");
    cp.setAttribute("d", $("#po-bay-water").getAttribute("d"));
    clip.appendChild(cp); defs.appendChild(clip); svg.insertBefore(defs, svg.firstChild);
    $("#po-bay-murk").setAttribute("clip-path", "url(#po-bay-clip)");

    $("#po-bay-murk").innerHTML = spots.map(function (p) {
      return '<circle cx="' + p.x.toFixed(1) + '" cy="' + (p.y + 4).toFixed(1) + '" r="20" opacity="0"/>';
    }).join("");
    $("#po-bay-boats").innerHTML = spots.map(function (p) {
      return '<g transform="translate(' + p.x.toFixed(1) + " " + p.y.toFixed(1) + ") rotate(" + p.r + ') scale(1.15)" style="display:none">' +
        '<path class="po-bay-boat-hull" d="M-7 0 L7 0 L5 3.5 L-5 3.5 Z"/><path class="po-bay-boat-sail" d="M0 -10 L0 -1 L6 -1 Z"/></g>';
    }).join("");

    $("#po-bay-range").addEventListener("input", function (e) { bay.n = +e.target.value; updateBay(); });
    $$('input[name="po-bay-mode"]').forEach(function (r) {
      r.addEventListener("change", function () { if (r.checked) { bay.mode = r.value; updateBay(); } });
    });
  }

  function mix(a, b, k) {
    var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16); });
    var pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16); });
    return "#" + pa.map(function (v, i) { return Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0"); }).join("");
  }
  var LEVEL_COLORS = ["var(--po-lvl-0)", "var(--po-lvl-1)", "var(--po-lvl-2)", "var(--po-lvl-3)"];
  function levelIdx(v) { return v < 0.25 ? 0 : v < 0.5 ? 1 : v < 0.8 ? 2 : 3; }

  function updateBay() {
    if (!bay.spots.length) return;
    var n = bay.n, dump = bay.mode === "dump";
    var load = dump ? n / 60 : 0;
    $("#po-bay-count").textContent = n;
    $("#po-bay-water").style.fill = mix("#1C9A98", "#4E5E3A", Math.pow(load, 0.8));
    $$("#po-bay-boats g").forEach(function (g, i) { g.style.display = i < n ? "" : "none"; });
    $$("#po-bay-murk circle").forEach(function (c, i) { c.setAttribute("opacity", dump && i < n ? (0.22 + load * 0.3).toFixed(2) : 0); });

    var L = t("impact.bay");
    var bact = dump ? Math.min(1, n / 40) : 0.04;
    var nutr = dump ? Math.min(1, n / 50) : 0.04;
    var clar = dump ? 1 - Math.min(0.88, n / 55) : 0.96;
    var cIdx = clar > 0.8 ? 0 : clar > 0.6 ? 1 : clar > 0.35 ? 2 : 3;
    var rows = [
      { label: L.bacteria, v: bact, text: L.levels[levelIdx(bact)], color: LEVEL_COLORS[levelIdx(bact)] },
      { label: L.nutrients, v: nutr, text: L.levels[levelIdx(nutr)], color: LEVEL_COLORS[levelIdx(nutr)] },
      { label: L.clarity, v: clar, text: L.clarityLevels[cIdx], color: LEVEL_COLORS[cIdx] }
    ];
    $("#po-meters").innerHTML = rows.map(function (r) {
      return '<div class="po-meter"><dt>' + r.label + '</dt><dd style="color:' + r.color + '">' + r.text +
        '</dd><div class="po-meter-bar" aria-hidden="true"><i style="width:' + Math.round(r.v * 100) + "%;background:" + r.color + '"></i></div></div>';
    }).join("");
    $("#po-bay-verdict").textContent = !dump ? L.verdictPump : n < 8 ? L.verdictDumpLow : L.verdictDump;
  }

  /* =====================================================================
     Vodič: kartice
     ===================================================================== */
  function initTabs() {
    var tabs = $$(".po-tab");
    function select(i, focus) {
      tabs.forEach(function (tab, j) {
        var on = i === j;
        tab.setAttribute("aria-selected", on);
        tab.tabIndex = on ? 0 : -1;
        $("#po-panel-" + j).hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i); });
      tab.addEventListener("keydown", function (e) {
        var k = e.key, n = tabs.length, next = null;
        if (k === "ArrowRight" || k === "ArrowDown") next = (i + 1) % n;
        if (k === "ArrowLeft" || k === "ArrowUp") next = (i - 1 + n) % n;
        if (k === "Home") next = 0;
        if (k === "End") next = n - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
  }

  /* =====================================================================
     Smijem li ispustiti?
     ===================================================================== */
  var checker = { where: 0, sys: 0 };
  var WHERE_KEYS = ["port", "near", "mid", "far"];
  var VERDICT = {
    port: ["no", "no", "cond"],
    near: ["no", "no", "cond"],
    mid: ["no", "yes", "yes"],
    far: ["yes", "yes", "yes"]
  };
  function initChecker() {
    $$('input[name="po-where"]').forEach(function (r) { r.addEventListener("change", function () { checker.where = +r.value; updateChecker(); }); });
    $$('input[name="po-sys"]').forEach(function (r) { r.addEventListener("change", function () { checker.sys = +r.value; updateChecker(); }); });
  }
  function updateChecker() {
    var w = WHERE_KEYS[checker.where];
    var v = VERDICT[w][checker.sys];
    var box = $("#po-verdict");
    box.setAttribute("data-v", v);
    box.innerHTML = '<span class="po-verdict-badge">' + t("guide.checker.verdict." + v) + "</span><p>" + t("guide.checker.results." + w)[checker.sys] + "</p>";
  }

  /* =====================================================================
     Koji čep?
     ===================================================================== */
  var capPick = null;
  function initCaps() {
    $$(".po-cap").forEach(function (b) {
      b.addEventListener("click", function () { capPick = +b.getAttribute("data-cap"); updateCaps(); });
    });
  }
  function updateCaps() {
    var fb = $("#po-caps-feedback");
    $$(".po-cap").forEach(function (b) {
      var i = +b.getAttribute("data-cap");
      b.classList.toggle("is-right", capPick === i && i === 2);
      b.classList.toggle("is-wrong", capPick === i && i !== 2);
      b.setAttribute("aria-pressed", capPick === i);
    });
    if (capPick === null) { fb.textContent = ""; fb.className = "po-caps-feedback"; return; }
    fb.textContent = t("pump.caps.feedback")[capPick];
    fb.className = "po-caps-feedback " + (capPick === 2 ? "is-right" : "is-wrong");
  }

  /* =====================================================================
     Kviz
     ===================================================================== */
  var quiz = { i: 0, picks: [], done: false };
  var quizFocus = null; // "next" | "question" | "result"

  function quizBest() { var b = parseInt(sget(BEST_KEY), 10); return isNaN(b) ? null : b; }
  function quizScore() {
    var qs = t("quiz.questions");
    return quiz.picks.reduce(function (s, p, i) { return s + (p === qs[i].c ? 1 : 0); }, 0);
  }

  function renderQuiz() {
    var box = $("#po-quiz");
    var Q = t("quiz");
    var qs = Q.questions, n = qs.length;

    if (quiz.done) {
      var s = quizScore();
      var tier = Q.tiers.filter(function (x) { return s >= x.min; })[0];
      var best = quizBest();
      box.innerHTML =
        '<div class="po-result">' +
        '<p class="po-eyebrow" style="margin:0">' + fmt(Q.result, { s: s, n: n }) + "</p>" +
        '<div class="po-result-score" tabindex="-1" id="po-quiz-result">' + s + "/" + n + "</div>" +
        "<p>" + tier.t + "</p>" +
        (best != null ? '<p class="po-note">' + fmt(Q.best, { b: best, n: n }) + "</p>" : "") +
        '<div class="po-quiz-actions" style="justify-content:center">' +
        '<button type="button" class="po-btn po-btn-ghost" id="po-quiz-again">' + Q.again + "</button>" +
        '<a class="po-btn po-btn-primary" href="map.html">' + t("final.map") + "</a></div></div>";
      $("#po-quiz-again").addEventListener("click", function () {
        quiz = { i: 0, picks: [], done: false }; quizFocus = "question"; renderQuiz();
      });
      if (quizFocus === "result") $("#po-quiz-result").focus();
      quizFocus = null;
      return;
    }

    var q = qs[quiz.i];
    var pick = quiz.picks[quiz.i];
    var answered = pick != null;
    var keys = ["A", "B", "C", "D"];
    var html =
      '<div class="po-quiz-top"><span>' + fmt(Q.progress, { i: quiz.i + 1, n: n }) + "</span><span>" + quizScore() + "/" + n + "</span></div>" +
      '<div class="po-progress" aria-hidden="true"><i style="width:' + Math.round(((quiz.i + (answered ? 1 : 0)) / n) * 100) + '%"></i></div>' +
      '<h3 id="po-quiz-q" tabindex="-1">' + q.q + "</h3>" +
      '<div class="po-options" role="group" aria-labelledby="po-quiz-q">' +
      q.a.map(function (a, j) {
        var cls = "po-option";
        if (answered && j === q.c) cls += " is-correct";
        if (answered && j === pick && pick !== q.c) cls += " is-wrong";
        return '<button type="button" class="' + cls + '" data-opt="' + j + '"' + (answered ? ' aria-disabled="true"' : "") + '><span class="po-option-key" aria-hidden="true">' + keys[j] + "</span><span>" + a + "</span></button>";
      }).join("") + "</div>";
    if (answered) {
      var right = pick === q.c;
      html += '<div class="po-explain ' + (right ? "is-right" : "is-wrong") + '" aria-live="polite"><strong>' + (right ? Q.correct : Q.wrong) + "</strong><p>" + q.e + "</p></div>" +
        '<div class="po-quiz-actions"><button type="button" class="po-btn po-btn-primary" id="po-quiz-next">' +
        (quiz.i === n - 1 ? Q.finish : Q.next) + ' <span aria-hidden="true">→</span></button></div>';
    }
    box.innerHTML = html;

    $$(".po-option", box).forEach(function (b) {
      b.addEventListener("click", function () {
        if (quiz.picks[quiz.i] != null) return;
        quiz.picks[quiz.i] = +b.getAttribute("data-opt");
        quizFocus = "next";
        renderQuiz();
      });
    });
    var next = $("#po-quiz-next");
    if (next) {
      next.addEventListener("click", function () {
        if (quiz.i < n - 1) { quiz.i++; quizFocus = "question"; }
        else {
          quiz.done = true; quizFocus = "result";
          var s = quizScore(), best = quizBest();
          if (best == null || s > best) sset(BEST_KEY, String(s));
        }
        renderQuiz();
      });
    }
    if (quizFocus === "next" && next) next.focus({ preventScroll: true });
    if (quizFocus === "question") $("#po-quiz-q").focus({ preventScroll: true });
    quizFocus = null;
  }

  /* =====================================================================
     Light (paleta D) / dark (paleta A)
     Početni način postavlja skripta u <head> (spremljeni izbor ili postavka uređaja).
     ===================================================================== */
  var MODE_KEY = "po-mode";
  function getMode() { return root.getAttribute("data-po-mode") === "light" ? "light" : "dark"; }
  function syncMode() {
    var m = getMode();
    var btn = $("#po-mode");
    if (btn) {
      var label = t(m === "light" ? "ui.toDark" : "ui.toLight");
      btn.innerHTML = icon(m === "light" ? "moon" : "sun", 18);
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    }
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", m === "light" ? "#EEF7FA" : "#04141C");
    // Zajednička navigacija: ako korisnik nije odabrao temu na Profilu, prati način stranice
    if (!sget("cm-theme")) root.setAttribute("data-theme", m === "light" ? "ocean" : "dubina");
  }
  function setMode(m, save) {
    root.setAttribute("data-po-mode", m);
    if (save) sset(MODE_KEY, m);
    syncMode();
  }
  function initMode() {
    var btn = $("#po-mode");
    if (btn) btn.addEventListener("click", function () { setMode(getMode() === "light" ? "dark" : "light", true); });
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: light)");
      var onChange = function () { if (!sget(MODE_KEY)) setMode(mq.matches ? "light" : "dark", false); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* =====================================================================
     Primjena jezika
     ===================================================================== */
  function applyLang() {
    root.lang = lang;
    doc.title = t("meta.title");
    $$("[data-i18n]").forEach(function (el) { var v = t(el.getAttribute("data-i18n")); if (v != null) el.textContent = v; });
    $$("[data-i18n-html]").forEach(function (el) { var v = t(el.getAttribute("data-i18n-html")); if (v != null) el.innerHTML = v; });
    $$("[data-i18n-aria]").forEach(function (el) { var v = t(el.getAttribute("data-i18n-aria")); if (v != null) el.setAttribute("aria-label", v); });
    $$("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang); });
    syncMode();
    updateBay();
    updateChecker();
    updateCaps();
    renderQuiz();
  }
  function initLang() {
    $$("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        var l = b.getAttribute("data-lang");
        if (l === lang) return;
        lang = l; sset(LANG_KEY, l);
        applyLang();
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
  }

  /* =====================================================================
     Navigacija: gornja traka, sekcije, glatko pomicanje
     ===================================================================== */
  function initChrome() {
    var top = $("#po-top"), main = $("#po-main");
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        // Puna pozadina čim počne zaron, da logo i gumbi ostanu čitljivi preko tamnog mora
        top.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.2 || main.getBoundingClientRect().top <= top.offsetHeight + 1);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    doc.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var target = doc.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (target.id === "po-main") target.focus({ preventScroll: true });
    });

    if ("IntersectionObserver" in window) {
      var chips = $$(".po-chips a");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          chips.forEach(function (c) { c.classList.toggle("is-active", c.getAttribute("href") === "#" + en.target.id); });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      ["utjecaj", "vodic", "prihvat", "kviz"].forEach(function (id) { var s = doc.getElementById(id); if (s) io.observe(s); });
    }
  }

  /* =====================================================================
     GSAP: zaron ispod površine
     ===================================================================== */
  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (reduceMotion || !gsap || !ST) return;
    gsap.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
    root.classList.add("po-anim");

    var intro = $(".po-intro");
    var lines = $$(".po-line");
    var facts = [$(".po-facts-title")].concat($$(".po-fact"));

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: intro, start: "top top", end: "+=320%", scrub: 0.8, pin: true, anticipatePin: 1 }
    });

    tl.to(".po-world", { yPercent: -66.6667, duration: 10 }, 0)
      .to(".po-title", { yPercent: -40, autoAlpha: 0, duration: 1.4 }, 0)
      .to([".po-tagline", ".po-corner", ".po-scrollhint"], { autoAlpha: 0, duration: 0.7 }, 0)
      .fromTo(".po-plume", { autoAlpha: 0, scale: 0.15 }, { autoAlpha: 0.95, scale: 1, duration: 3.2, ease: "power1.out" }, 1.2)
      .to(".po-plume", { yPercent: 85, scale: 1.9, autoAlpha: 0.5, duration: 5.2 }, 4.4);

    // Na računalu zadnja rečenica ostaje lijevo, uz brojke desno
    var wide = window.matchMedia("(min-width: 860px)").matches;
    var slots = [[1.5, 3.1], [3.3, 4.9], [5.1, 6.7], [6.9, 8.0]];
    lines.forEach(function (li, i) {
      var s = slots[i] || slots[slots.length - 1];
      tl.fromTo(li, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, s[0]);
      if (!(wide && i === lines.length - 1)) tl.to(li, { autoAlpha: 0, y: -40, duration: 0.5, ease: "power2.in" }, s[1] - 0.5);
    });
    facts.forEach(function (el, i) {
      tl.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 8.1 + i * 0.35);
    });
    tl.to({}, { duration: 0.6 }, 9.4);

    gsap.to(".po-boat-inner", { y: -5, rotation: 1.5, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { ST.refresh(); });
    window.addEventListener("load", function () { ST.refresh(); });
  }

  /* ---------- Pokretanje ---------- */
  function start() {
    buildStatic();
    buildBay();
    initTabs();
    initChecker();
    initCaps();
    initLang();
    initMode();
    applyLang();
    initChrome();
    initMotion();
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start);
  else start();
})();
