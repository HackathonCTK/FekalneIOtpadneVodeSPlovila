/*
 * ČistoMore — Dio 4: „Plovi odgovorno“
 * Prikaz sadržaja (HR/EN), interakcije (uvala, vodič, provjera pravila, čepovi, kviz)
 * i GSAP scroll animacija uvoda. Tekstovi su u plovi-odgovorno-sadrzaj.js.
 * Bez GSAP-a ili uz „smanjeno kretanje“ stranica radi kao obična, sav sadržaj je vidljiv.
 *
 * Spojena aplikacija: gumbe za način (tamni/svijetli) i jezik (HR/EN) u gornjoj traci
 * poslužuje zajednički app.js (window.CM). Ova skripta sluša događaje "cm:lang" i "cm:mode".
 * „Primjeri stanica“ su stvarna prihvatna mjesta s karte grupe 2 (data/stations.js).
 */
(function () {
  "use strict";

  var C = window.PO_CONTENT;
  if (!C) return;

  var doc = document;
  var root = doc.documentElement;
  var LANG_KEY = "cm-lang";       // zajednički ključ: ostale grupe ga mogu čitati
  var BEST_KEY = "po-quiz-best10";  // novi ključ: stari rezultat bio je od 8 pitanja
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var M = (window.CM && window.CM.motion) || null;   // zajednički pokret (app.js): reveal, swap, pop…

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
  var lang = (window.CM && CM.lang) || detectLang();
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

  /* ---------- Prihvatna mjesta s karte grupe 2 ---------- */
  function stationRecord(id) {
    var list = (window.CM_STATIONS && window.CM_STATIONS.locations) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function renderStations() {
    var REG = (window.CM_REGIONS && window.CM_REGIONS.lokacije) || {};
    var CON = window.CM_CONTACTS || {};
    var EN = window.CM_DATA_EN || {};
    $$("#po-stations [data-station]").forEach(function (li) {
      var id = li.getAttribute("data-station"), rec = stationRecord(id), c = CON[id] || {};
      if (!rec) return;
      var region = REG[id] || "Ostalo";
      if (lang === "en" && EN.regije && EN.regije[region]) region = EN.regije[region];
      $("[data-st=name]", li).textContent = rec.name;
      $("[data-st=place]", li).textContent = region + " · " + String(rec.address || "").replace(/,\s*Hrvatska\s*$/i, "");
      $("[data-st=contact]", li).textContent = c.telefon ? c.telefon : (c.vhf ? "VHF " + c.vhf : "");
    });
  }

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

    // Primjeri stanica — stvarna prihvatna mjesta s karte grupe 2 (data/stations.js)
    // Link prema karti grupe 2: map.html?station=<id> (dogovor u INTEGRACIJA.md, točka D)
    $("#po-stations").innerHTML = base.pump.stations.items.filter(function (s) { return !!stationRecord(s.id); }).map(function (s) {
      return '<li class="po-station" data-station="' + s.id + '"><span class="po-station-pin">' + icon("pin", 18) + '</span><h4 data-st="name"></h4><p data-st="place"></p><p class="po-hours" data-st="contact"></p><a href="map.html?station=' + encodeURIComponent(s.id) + '"><span data-i18n="pump.stations.onMap"></span> →</a></li>';
    }).join("");

    // Korak po korak u slikama: nacrtane ilustracije (plovi-odgovorno-slike.js) + tekst iz sadržaja
    var ILL = window.PO_ILLUSTRATIONS || [];
    $("#po-howto").innerHTML = base.howto.steps.map(function (_, i) {
      var k = "howto.steps." + i;
      return '<figure class="po-howto"><div class="po-howto-art">' + (ILL[i] || "") + "</div>" +
        '<figcaption><h3 data-i18n="' + k + '.t"></h3><p data-i18n="' + k + '.d"></p></figcaption></figure>';
    }).join("");
    // Fotografije (slobodne licence, Wikimedia Commons): autor i licenca ispod svake
    var photos = base.howto.photos || [];
    if (photos.length) {
      $("#po-photos-wrap").hidden = false;
      $("#po-photos").innerHTML = photos.map(function (ph, i) {
        var k = "howto.photos." + i;
        return '<figure class="po-photo"><img src="' + ph.src + '" loading="lazy" decoding="async" width="800" height="600" data-i18n-alt="' + k + '.alt" alt="">' +
          '<figcaption><span data-i18n="' + k + '.c"></span><small>' +
          '<a href="' + ph.page + '" target="_blank" rel="noopener">' + ph.author + "</a>, " +
          '<a href="' + ph.lu + '" target="_blank" rel="noopener"><span data-i18n="' + k + '.license">' + ph.license + "</span></a>, Wikimedia Commons</small></figcaption></figure>";
      }).join("");
    }

    // Jesi li znao? — kratke činjenice, svaka sa svojim izvorom
    $("#po-know").innerHTML = base.know.items.map(function (it, i) {
      var k = "know.items." + i;
      return '<article class="po-know"><p class="po-know-big" data-i18n="' + k + '.n"></p><h3 data-i18n="' + k + '.t"></h3><p data-i18n="' + k + '.d"></p>' +
        '<a class="po-know-src" href="' + it.u + '" target="_blank" rel="noopener"><span data-i18n="know.src"></span>: <span data-i18n="' + k + '.s"></span></a></article>';
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

    // Mjerači se grade jednom; updateBay() samo mijenja tekst i širinu (da prijelaz radi)
    $("#po-meters").innerHTML = ["bacteria", "nutrients", "clarity"].map(function (k) {
      return '<li class="po-meter" data-meter="' + k + '"><span class="po-meter-label" data-i18n="impact.bay.' + k + '"></span>' +
        '<span class="po-meter-val"></span><span class="po-meter-bar" aria-hidden="true"><i></i></span></li>';
    }).join("");

    $("#po-bay-range").addEventListener("input", function (e) { bay.n = +e.target.value; updateBay(); });
    $$('input[name="po-bay-mode"]').forEach(function (r) {
      r.addEventListener("change", function () { if (r.checked) { bay.mode = r.value; updateBay(); } });
    });
  }

  function mix(a, b, k) {
    var pa = [1, 3, 5].map(function (i) { return parseInt(a.slice(i, i + 2), 16); });
    var pb = [1, 3, 5].map(function (i) { return parseInt(b.slice(i, i + 2), 16); });
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
    var rows = {
      bacteria: { v: bact, text: L.levels[levelIdx(bact)], color: LEVEL_COLORS[levelIdx(bact)] },
      nutrients: { v: nutr, text: L.levels[levelIdx(nutr)], color: LEVEL_COLORS[levelIdx(nutr)] },
      clarity: { v: clar, text: L.clarityLevels[cIdx], color: LEVEL_COLORS[cIdx] }
    };
    $$("#po-meters .po-meter").forEach(function (li) {
      var r = rows[li.getAttribute("data-meter")];
      var val = $(".po-meter-val", li), bar = $(".po-meter-bar i", li);
      val.textContent = r.text;
      val.style.color = r.color;
      bar.style.width = Math.round(r.v * 100) + "%";
      bar.style.background = r.color;
    });
    // Tekst ocjene mijenja se samo kad se stvarno promijeni (čitač zaslona ga ne ponavlja na svaki pomak)
    var verdict = !dump ? L.verdictPump : n < 8 ? L.verdictDumpLow : L.verdictDump;
    var vEl = $("#po-bay-verdict");
    if (vEl.textContent !== verdict) {
      vEl.textContent = verdict;
      if (M && vEl.__seen) M.swap(vEl);   // prvi upis (pri učitavanju) bez prijelaza
      vEl.__seen = true;
    }
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
    if (M) M.swap(fb);
  }

  /* =====================================================================
     Kviz + certifikat „Odgovorni nautičar“
     ===================================================================== */
  var CERT_KEY = "po-cert";   // { name, score, total, date } — Profil ga može prikazati kao značku
  var quizFocus = null;       // "next" | "question" | "result" | "certName" | "certImg"
  var quizAnim = null;        // "q" novo pitanje | "a" odgovor | "r" rezultat | "c" certifikat (data-anim na #po-quiz, vidi CSS)
  var quizMoved = null;       // { to, dir } poredaj ili { multi } odabir: što je upravo promijenjeno
  var quizPct = null;         // zadnja nacrtana širina trake napretka (da se traka animira, a ne preskoči)
  // error je ključ teksta (nameErr | error), pa se prevodi pri svakom prikazu
  var cert = { name: "", draft: "", url: null, blob: null, error: "", date: null, busy: false, gen: 0 };

  // Odgovori se miješaju pri svakom pokretanju. order[i] su izvorni indeksi odgovora,
  // a picks[i] čuva izvorni indeks pa promjena jezika ne mijenja stanje kviza.
  function shuffledIdx(n) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(i);
    for (var j = n - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var tmp = a[j]; a[j] = a[k]; a[k] = tmp; }
    return a;
  }
  // Svaki kviz uzima quiz.size nasumičnih pitanja iz baze (quiz.questions).
  // set[i] je izvorni indeks pitanja u bazi, pa promjena jezika ne mijenja stanje kviza.
  //
  // Tipovi pitanja (polje "type" u sadržaju):
  //   (bez type) / "single"  jedan točan od ponuđenih:      a: [...], c: indeks
  //   "tf"                   točno / netočno:                c: true | false
  //   "multi"                više točnih, pa „Provjeri“:     a: [...], c: [indeksi]
  //   "order"                poredaj korake, pa „Provjeri“:  a: [...] u TOČNOM redoslijedu
  function newQuiz() {
    var all = base.quiz.questions;
    var size = Math.min(base.quiz.size || all.length, all.length);
    var set = shuffledIdx(all.length).slice(0, size);
    return {
      i: 0, picks: [], draft: [], done: false, set: set,
      order: set.map(function (qi) {
        var q = all[qi], type = q.type || "single";
        if (type === "tf") return [0, 1];
        var o = shuffledIdx(q.a.length);
        // poredaj: nikad ne kreni od već točnog redoslijeda
        if (type === "order") while (o.every(function (v, k) { return v === k; })) o = shuffledIdx(q.a.length);
        return o;
      })
    };
  }
  // Pitanje u obliku za prikaz; "tf" postaje pitanje s dva odgovora (Točno / Netočno)
  function normQ(q) {
    var type = q.type || "single";
    if (type === "tf") return { type: "tf", q: q.q, e: q.e, a: [t("quiz.tfTrue"), t("quiz.tfFalse")], c: q.c ? 0 : 1 };
    return { type: type, q: q.q, e: q.e, a: q.a, c: q.c };
  }
  function quizQs() {
    var all = t("quiz.questions");
    return quiz.set.map(function (qi) { return normQ(all[qi]); });
  }
  function isRight(q, p) {
    if (p == null) return false;
    if (q.type === "multi") {
      var want = q.c.slice().sort().join(","), got = p.slice().sort().join(",");
      return want === got;
    }
    if (q.type === "order") return p.every(function (v, k) { return v === k; });
    return p === q.c;
  }
  var quiz = newQuiz();

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]; });
  }
  function announce(msg) {
    var st = $("#po-quiz-status");
    if (!st) return;
    st.textContent = "";
    setTimeout(function () { st.textContent = msg; }, 60);
  }
  function quizBest() { var b = parseInt(sget(BEST_KEY), 10); return isNaN(b) ? null : b; }
  function quizScore() {
    var qs = quizQs();
    return quiz.picks.reduce(function (s, p, i) { return s + (isRight(qs[i], p) ? 1 : 0); }, 0);
  }
  function certDateText() {
    var d = cert.date ? new Date(cert.date) : new Date();
    try { return d.toLocaleDateString(lang === "hr" ? "hr-HR" : "en-GB", { day: "numeric", month: "long", year: "numeric" }); }
    catch (e) { return d.toISOString().slice(0, 10); }
  }
  function clearCert() {
    if (cert.url) { try { URL.revokeObjectURL(cert.url); } catch (e) {} }
    cert.url = null; cert.blob = null; cert.error = "";
  }

  function renderQuiz() {
    var box = $("#po-quiz");
    var Q = t("quiz");
    var qs = quizQs(), n = qs.length;
    var anim = quizAnim, moved = quizMoved;
    quizAnim = null; quizMoved = null;
    box.setAttribute("data-anim", anim || "");

    if (quiz.done) { renderResult(box, Q, n, anim); return; }

    var q = qs[quiz.i];
    var pick = quiz.picks[quiz.i];
    var answered = pick != null;
    var keys = ["A", "B", "C", "D", "E", "F"];
    var pct = Math.round(((quiz.i + (answered ? 1 : 0)) / n) * 100);
    var startPct = quizPct == null ? pct : quizPct;
    var html =
      '<div class="po-quiz-top"><span>' + fmt(Q.progress, { i: quiz.i + 1, n: n }) + "</span><span>" + quizScore() + "/" + n + "</span></div>" +
      '<div class="po-progress" aria-hidden="true"><i style="width:' + startPct + '%"></i></div>' +
      (q.type !== "single" ? '<p class="po-quiz-kind">' + Q.kind[q.type] + "</p>" : "") +
      '<h3 id="po-quiz-q" tabindex="-1">' + q.q + "</h3>";

    if (q.type === "multi") {
      // Više točnih: odabir se pali/gasi, „Provjeri“ potvrđuje
      var sel = quiz.draft[quiz.i] || [];
      html += '<div class="po-options" role="group" aria-labelledby="po-quiz-q">' +
        quiz.order[quiz.i].map(function (orig) {
          var on = answered ? pick.indexOf(orig) >= 0 : sel.indexOf(orig) >= 0;
          var good = q.c.indexOf(orig) >= 0;
          var cls = "po-option po-option-multi", mark = on ? "■" : "", sr = "";
          if (answered && good) { cls += " is-correct"; mark = "✓"; sr = on ? Q.srCorrect : Q.srMissed; }
          if (answered && on && !good) { cls += " is-wrong"; mark = "✗"; sr = Q.srYours; }
          return '<button type="button" class="' + cls + '" data-multi="' + orig + '" aria-pressed="' + on + '"' + (answered ? ' aria-disabled="true"' : "") + ">" +
            '<span class="po-option-key" aria-hidden="true">' + mark + "</span><span>" + q.a[orig] +
            (sr ? ' <span class="po-sr">(' + sr + ")</span>" : "") + "</span></button>";
        }).join("") + "</div>";
      if (!answered) html += '<div class="po-quiz-actions"><button type="button" class="po-btn po-btn-primary" id="po-quiz-check"' + (sel.length ? "" : ' aria-disabled="true"') + ">" + Q.check + "</button></div>";
    } else if (q.type === "order") {
      // Poredaj: strelice gore/dolje mijenjaju redoslijed, „Provjeri“ potvrđuje
      var seq = answered ? pick : (quiz.draft[quiz.i] || quiz.order[quiz.i]);
      html += '<ol class="po-order" aria-labelledby="po-quiz-q">' + seq.map(function (orig, pos) {
        var cls = "po-order-item", note = "";
        if (answered) {
          if (orig === pos) cls += " is-correct";
          else { cls += " is-wrong"; note = '<small class="po-order-note">' + fmt(Q.orderAt, { n: orig + 1 }) + "</small>"; }
        }
        var txt = q.a[orig];
        return '<li class="' + cls + '"><span class="po-order-num" aria-hidden="true">' + (pos + 1) + "</span>" +
          '<span class="po-order-text">' + txt + note + "</span>" +
          (answered ? "" :
            '<span class="po-order-btns">' +
            '<button type="button" class="po-order-btn" data-move="' + pos + '" data-dir="-1"' + (pos === 0 ? ' aria-disabled="true"' : "") + ' aria-label="' + esc(fmt(Q.moveUp, { s: txt })) + '">↑</button>' +
            '<button type="button" class="po-order-btn" data-move="' + pos + '" data-dir="1"' + (pos === seq.length - 1 ? ' aria-disabled="true"' : "") + ' aria-label="' + esc(fmt(Q.moveDown, { s: txt })) + '">↓</button>' +
            "</span>") +
          "</li>";
      }).join("") + "</ol>";
      if (!answered) html += '<div class="po-quiz-actions"><button type="button" class="po-btn po-btn-primary" id="po-quiz-check">' + Q.check + "</button></div>";
    } else {
      // Jedan točan (i točno / netočno): klik odmah odgovara
      html += '<div class="po-options' + (q.type === "tf" ? " po-options-tf" : "") + '" role="group" aria-labelledby="po-quiz-q">' +
        quiz.order[quiz.i].map(function (orig, j) {
          var cls = "po-option", mark = q.type === "tf" ? (orig === 0 ? "✓" : "✗") : keys[j], sr = "";
          if (answered && orig === q.c) { cls += " is-correct"; mark = "✓"; sr = Q.srCorrect; }
          if (answered && orig === pick && pick !== q.c) { cls += " is-wrong"; mark = "✗"; sr = Q.srYours; }
          return '<button type="button" class="' + cls + '" data-opt="' + orig + '"' + (answered ? ' aria-disabled="true"' : "") + ">" +
            '<span class="po-option-key" aria-hidden="true">' + mark + "</span><span>" + q.a[orig] +
            (sr ? ' <span class="po-sr">(' + sr + ")</span>" : "") + "</span></button>";
        }).join("") + "</div>";
    }

    if (answered) {
      var right = isRight(q, pick);
      html += '<div class="po-explain ' + (right ? "is-right" : "is-wrong") + '"><strong>' + (right ? Q.correct : Q.wrong) + "</strong><p>" + q.e + "</p></div>" +
        '<div class="po-quiz-actions"><button type="button" class="po-btn po-btn-primary" id="po-quiz-next">' +
        (quiz.i === n - 1 ? Q.finish : Q.next) + ' <span aria-hidden="true">→</span></button></div>';
    }
    box.innerHTML = html;
    // Traka napretka klizi na novu vrijednost (nova traka pa prisilni reflow, da prijelaz stvarno krene)
    var bar = $(".po-progress i", box);
    if (bar && startPct !== pct) { void bar.offsetWidth; bar.style.width = pct + "%"; }
    quizPct = pct;
    quizMotion(box, anim, moved, q);

    function answer(p) {
      quiz.picks[quiz.i] = p;
      quizFocus = "next";
      quizAnim = "a";
      renderQuiz();
      var qq = quizQs()[quiz.i];
      announce((isRight(qq, p) ? t("quiz.correct") : t("quiz.wrong")) + " " + qq.e);
    }
    $$(".po-option[data-opt]", box).forEach(function (b) {
      b.addEventListener("click", function () {
        if (quiz.picks[quiz.i] != null) return;
        answer(+b.getAttribute("data-opt"));
      });
    });
    $$(".po-option[data-multi]", box).forEach(function (b) {
      b.addEventListener("click", function () {
        if (quiz.picks[quiz.i] != null) return;
        var o = +b.getAttribute("data-multi");
        var cur = (quiz.draft[quiz.i] || []).slice();
        var at = cur.indexOf(o);
        if (at >= 0) cur.splice(at, 1); else cur.push(o);
        quiz.draft[quiz.i] = cur;
        quizFocus = { multi: o };
        quizMoved = { multi: o };
        renderQuiz();
      });
    });
    $$(".po-order-btn", box).forEach(function (b) {
      b.addEventListener("click", function () {
        if (quiz.picks[quiz.i] != null || b.getAttribute("aria-disabled") === "true") return;
        var pos = +b.getAttribute("data-move"), dir = +b.getAttribute("data-dir");
        var cur = (quiz.draft[quiz.i] || quiz.order[quiz.i]).slice();
        var to = pos + dir;
        var tmp = cur[pos]; cur[pos] = cur[to]; cur[to] = tmp;
        quiz.draft[quiz.i] = cur;
        // fokus ostaje na istoj stavci (na njenom novom mjestu); na rubu prijeđi na drugu strelicu
        var edge = to === 0 || to === cur.length - 1;
        quizFocus = { move: to, dir: edge ? -dir : dir };
        quizMoved = { to: to, dir: dir };
        renderQuiz();
        announce(fmt(t("quiz.movedTo"), { s: quizQs()[quiz.i].a[tmp], n: to + 1 }));
      });
    });
    var check = $("#po-quiz-check");
    if (check) {
      check.addEventListener("click", function () {
        if (check.getAttribute("aria-disabled") === "true") return;
        if (q.type === "multi") answer((quiz.draft[quiz.i] || []).slice());
        else answer((quiz.draft[quiz.i] || quiz.order[quiz.i]).slice());
      });
    }
    var next = $("#po-quiz-next");
    if (next) {
      next.addEventListener("click", function () {
        if (quiz.i < n - 1) { quiz.i++; quizFocus = "question"; quizAnim = "q"; }
        else {
          quiz.done = true; quizFocus = "result"; quizAnim = "r";
          var s = quizScore(), best = quizBest();
          if (best == null || s > best) sset(BEST_KEY, String(s));
        }
        renderQuiz();
      });
    }
    if (quizFocus === "next" && next) next.focus();
    if (quizFocus === "question") $("#po-quiz-q").focus();
    if (quizFocus && quizFocus.multi != null) { var mb = $('[data-multi="' + quizFocus.multi + '"]', box); if (mb) mb.focus(); }
    if (quizFocus && quizFocus.move != null) { var ob = $('[data-move="' + quizFocus.move + '"][data-dir="' + quizFocus.dir + '"]', box); if (ob) ob.focus(); }
    quizFocus = null;
  }

  function renderResult(box, Q, n, anim) {
    var s = quizScore();
    var CT = Q.cert;
    var ok = s >= CT.min;
    var tier = Q.tiers.filter(function (x) { return s >= x.min; })[0];
    var best = quizBest();
    var html =
      '<div class="po-result">' +
      '<p class="po-eyebrow" style="margin:0">' + fmt(Q.result, { s: s, n: n }) + "</p>" +
      '<div class="po-result-score" tabindex="-1" id="po-quiz-result"><span class="po-sr">' + s + "/" + n + '</span><span aria-hidden="true" id="po-score-vis">' + s + "/" + n + "</span></div>" +
      "<p>" + tier.t + "</p>" +
      (best != null ? '<p class="po-note">' + fmt(Q.best, { b: best, n: n }) + "</p>" : "");

    if (ok) {
      html +=
        '<div class="po-cert">' +
        '<p class="po-cert-earned">' + CT.earned + "</p>" +
        '<form class="po-cert-form" id="po-cert-form" novalidate>' +
        '<label for="po-cert-name">' + CT.nameLabel + "</label>" +
        '<div class="po-cert-row">' +
        '<input id="po-cert-name" name="po-cert-name" type="text" autocomplete="name" maxlength="40" placeholder="' + esc(CT.namePh) + '" value="' + esc(cert.draft) + '"' +
        ' aria-describedby="po-cert-err"' + (cert.error ? ' aria-invalid="true"' : "") + ">" +
        '<button type="submit" class="po-btn po-btn-primary">' + CT.create + "</button></div>" +
        '<p class="po-cert-err" id="po-cert-err">' + esc(cert.error ? CT[cert.error] : "") + "</p></form>";
      if (cert.url) {
        var alt = fmt(CT.imgAlt, { name: cert.name, s: s, n: n, date: certDateText() });
        var canShare = false;
        try {
          var f = new File([cert.blob], CT.file, { type: "image/png" });
          canShare = !!(navigator.canShare && navigator.share && navigator.canShare({ files: [f] }));
        } catch (e) {}
        html +=
          '<figure class="po-cert-out"><img id="po-cert-img" tabindex="-1" src="' + cert.url + '" alt="' + esc(alt) + '" width="1080" height="1350"></figure>' +
          '<div class="po-quiz-actions" style="justify-content:center">' +
          '<a class="po-btn po-btn-primary" href="' + cert.url + '" download="' + esc(CT.file) + '">' + CT.download + "</a>" +
          (canShare ? '<button type="button" class="po-btn po-btn-ghost" id="po-cert-share">' + CT.share + "</button>" : "") +
          "</div>";
      }
      html += "</div>";
    } else {
      html += '<p class="po-cert-need">' + fmt(CT.needMore, { m: CT.min, n: n }) + "</p>";
    }

    html +=
      '<div class="po-quiz-actions" style="justify-content:center">' +
      '<button type="button" class="po-btn po-btn-ghost" id="po-quiz-again">' + Q.again + "</button>" +
      '<a class="po-btn ' + (ok ? "po-btn-ghost" : "po-btn-primary") + '" href="#vodic">' + t("nav.guide") + "</a></div></div>";
    box.innerHTML = html;

    // Rezultat: broj se pobroji, a za certifikat padne konfeti (samo kad se rezultat prvi put pojavi)
    if (anim === "r" && M && !reduceMotion) {
      var vis = $("#po-score-vis");
      if (vis) countScore(vis, s, n);
      if (ok) confetti($(".po-result", box));
    }
    $("#po-quiz-again").addEventListener("click", function () {
      cert.gen++; cert.busy = false; cert.date = null;  // poništi crtanje koje je možda još u tijeku
      quiz = newQuiz(); clearCert(); quizFocus = "question"; quizAnim = "q"; quizPct = null; renderQuiz();
    });
    var form = $("#po-cert-form");
    if (form) {
      var input = $("#po-cert-name");
      // cert.draft = tekst u polju; cert.name = zadnje potvrđeno (valjano) ime na certifikatu
      input.addEventListener("input", function () {
        cert.draft = input.value;
        if (cert.error) { cert.error = ""; $("#po-cert-err").textContent = ""; input.removeAttribute("aria-invalid"); }
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = input.value.trim().replace(/\s+/g, " ");
        cert.draft = name;
        if (!name) {
          cert.error = "nameErr";
          $("#po-cert-err").textContent = CT.nameErr;
          input.setAttribute("aria-invalid", "true");
          input.focus();
          announce(CT.nameErr);
          return;
        }
        if (cert.busy) return;
        cert.name = name;
        var btn = $('button[type="submit"]', form);
        btn.textContent = CT.busy;
        btn.setAttribute("aria-disabled", "true");
        form.setAttribute("aria-busy", "true");
        makeCert(s, n, true);
      });
    }
    var share = $("#po-cert-share");
    if (share) {
      share.addEventListener("click", function () {
        try {
          var file = new File([cert.blob], CT.file, { type: "image/png" });
          navigator.share({ files: [file], title: CT.heading, text: CT.shareText }).catch(function () {});
        } catch (e) {}
      });
    }
    if (quizFocus === "result") $("#po-quiz-result").focus();
    if (quizFocus === "certName" && $("#po-cert-name")) $("#po-cert-name").focus();
    if (quizFocus === "certImg" && $("#po-cert-img")) $("#po-cert-img").focus();
    quizFocus = null;
  }

  /* ---------- Pokret u kvizu (Web Animations; uz prefers-reduced-motion se ne poziva) ---------- */
  function quizMotion(box, anim, moved, q) {
    if (reduceMotion || !box.animate) return;
    // Poredaj: pomaknuta stavka i ona koju je zamijenila klize na novo mjesto
    if (moved && moved.to != null) {
      var items = $$(".po-order-item", box), a = items[moved.to], b = items[moved.to - moved.dir];
      if (a && b) {
        var d = moved.dir * (b.offsetHeight + 8), opt = { duration: 240, easing: "cubic-bezier(.2,.7,.2,1)" };
        a.animate([{ transform: "translateY(" + (-d) + "px)" }, { transform: "none" }], opt);
        b.animate([{ transform: "translateY(" + d + "px)" }, { transform: "none" }], opt);
      }
    }
    // Više točnih: oznaka odabrane opcije poskoči
    if (moved && moved.multi != null) {
      var mk = $('[data-multi="' + moved.multi + '"] .po-option-key', box);
      if (mk) mk.animate([{ transform: "scale(.6)" }, { transform: "scale(1.15)", offset: 0.6 }, { transform: "none" }], { duration: 260, easing: "ease-out" });
    }
    // Točan odgovor: brojač rezultata poskoči
    if (anim === "a" && q && isRight(q, quiz.picks[quiz.i])) {
      var sc = $(".po-quiz-top span:last-child", box);
      if (sc) sc.animate([{ transform: "scale(1)" }, { transform: "scale(1.5)" }, { transform: "scale(1)" }], { duration: 380, easing: "ease-out" });
    }
  }
  function countScore(el, s, n) {
    if (doc.hidden || !s) return;
    var t0 = null, dur = 700;
    (function step(t) {
      if (t0 == null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      k = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(s * k) + "/" + n;
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
    setTimeout(function () { el.textContent = s + "/" + n; }, dur + 150);
  }
  function confetti(host) {
    if (!host || !host.animate || reduceMotion) return;
    var wrap = doc.createElement("div");
    wrap.className = "po-confetti";
    wrap.setAttribute("aria-hidden", "true");
    var colors = ["var(--po-accent)", "var(--po-accent-2)", "var(--po-amber)", "var(--po-warn)", "#fff"];
    for (var i = 0; i < 26; i++) {
      var p = doc.createElement("i");
      p.style.background = colors[i % colors.length];
      wrap.appendChild(p);
      var ang = (-90 + (Math.random() - 0.5) * 140) * Math.PI / 180, dist = 90 + Math.random() * 130;
      var x = Math.cos(ang) * dist, y = Math.sin(ang) * dist;
      p.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: "translate(" + x + "px," + y + "px) rotate(" + Math.round(Math.random() * 360) + "deg)", opacity: 1, offset: 0.45 },
        { transform: "translate(" + (x * 1.15) + "px," + (y + 160) + "px) rotate(" + Math.round(Math.random() * 720) + "deg)", opacity: 0 }
      ], { duration: 1300 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" });
    }
    host.appendChild(wrap);
    setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 2000);
  }

  function makeCert(s, n, focusImg) {
    if (!cert.date) cert.date = new Date().toISOString();
    cert.busy = true;
    var gen = ++cert.gen;   // starije crtanje (drugi jezik, novi pokušaj) se odbacuje
    var nm = cert.name;
    drawCertificate(nm, s, n).then(function (blob) {
      if (gen !== cert.gen) return;
      cert.busy = false;
      clearCert();
      cert.blob = blob;
      cert.url = URL.createObjectURL(blob);
      sset(CERT_KEY, JSON.stringify({ name: nm, score: s, total: n, date: cert.date }));
      sset("po-cert-name", nm);
      if (focusImg) { quizFocus = "certImg"; quizAnim = "c"; }
      renderQuiz();
      if (focusImg) announce(t("quiz.cert.earned"));
    }).catch(function () {
      if (gen !== cert.gen) return;
      cert.busy = false;
      cert.error = "error";
      quizFocus = "certName";
      renderQuiz();
    });
  }

  /* ---------- Crtanje certifikata (canvas 1080 × 1350, paleta trenutnog načina) ---------- */
  function certRoundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }
  function certWrap(g, text, maxW) {
    var words = String(text).split(" "), lines = [], line = "";
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
      if (g.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }
  function certFit(g, text, weight, family, size, maxW, min) {
    var s = size;
    do { g.font = weight + " " + s + "px " + family; s -= 4; } while (g.measureText(text).width > maxW && s > min);
  }
  function drawCertificate(name, s, n) {
    var CT = t("quiz.cert");
    var light = getMode() === "light";
    var P = light
      ? { bg1: "#F4FBFD", bg2: "#D7EEF6", ink: "#082A35", muted: "#4F6D78", accent: "#006BA6", sail: "#00B4D8", sea1: "#00B4D8", sea2: "#023E63", line: "rgba(2,62,99,.18)" }
      : { bg1: "#04141C", bg2: "#0B2A36", ink: "#E8F4F2", muted: "#8FB3B0", accent: "#9EF0E0", sail: "#2EC4B6", sea1: "#1D7A84", sea2: "#04141C", line: "rgba(158,240,224,.24)" };
    var DISPLAY = '"Bricolage Grotesque", "Segoe UI", sans-serif';
    var BODY = '"Manrope", "Segoe UI", sans-serif';
    var MONO = '"JetBrains Mono", Consolas, monospace';
    var fontsReady = (doc.fonts && doc.fonts.load)
      ? Promise.all([
          doc.fonts.load("800 120px " + DISPLAY), doc.fonts.load("700 60px " + DISPLAY),
          doc.fonts.load("400 34px " + BODY), doc.fonts.load("600 34px " + BODY),
          doc.fonts.load("600 26px " + MONO)
        ]).catch(function () {})
      : Promise.resolve();

    return fontsReady.then(function () {
      var W = 1080, H = 1350, X = 100, MAXW = W - 2 * X;
      var c = doc.createElement("canvas");
      c.width = W; c.height = H;
      var g = c.getContext("2d");

      var bg = g.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, P.bg2); bg.addColorStop(1, P.bg1);
      g.fillStyle = bg; g.fillRect(0, 0, W, H);

      // More i jedrilica u donjem dijelu, unutar okvira
      var seaTop = 1060;
      g.save();
      certRoundRect(g, 40, 40, W - 80, H - 80, 40); g.clip();
      var sea = g.createLinearGradient(0, seaTop, 0, H);
      sea.addColorStop(0, P.sea1); sea.addColorStop(1, P.sea2);
      g.fillStyle = sea; g.beginPath(); g.moveTo(0, seaTop);
      for (var x = 0; x <= W; x += 10) g.lineTo(x, seaTop + Math.sin(x / 70) * 10);
      g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();

      g.save();
      var sc = 1.1;
      g.translate(W - 120 - 220 * sc, seaTop + 8 - 176 * sc);
      g.scale(sc, sc);
      g.strokeStyle = P.ink; g.lineWidth = 3; g.lineCap = "round";
      g.beginPath(); g.moveTo(112, 8); g.lineTo(112, 152); g.stroke();
      g.fillStyle = light ? "#FFFFFF" : "#F4FBFA"; g.fill(new Path2D("M115 14 L115 146 L190 146 Z"));
      g.fillStyle = P.sail; g.fill(new Path2D("M108 30 L108 146 L52 146 Z"));
      g.fillStyle = light ? "#FFFFFF" : "#F4FBFA"; g.fill(new Path2D("M18 152 H204 L186 176 Q112 190 38 176 Z"));
      g.strokeStyle = P.sail; g.lineWidth = 3; g.beginPath(); g.moveTo(24, 160); g.lineTo(198, 160); g.stroke();
      g.restore();

      g.globalAlpha = 0.35; g.fillStyle = P.accent; g.beginPath(); g.moveTo(0, seaTop + 34);
      for (var x2 = 0; x2 <= W; x2 += 10) g.lineTo(x2, seaTop + 34 + Math.sin(x2 / 48 + 1) * 8);
      g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();
      g.globalAlpha = 1;

      g.fillStyle = "#E8F4F2"; g.font = "600 24px " + MONO; g.textAlign = "left";
      g.fillText(CT.issuer.toUpperCase(), X, H - 96);
      g.restore();

      // Okvir
      g.strokeStyle = P.line; g.lineWidth = 3;
      certRoundRect(g, 40, 40, W - 80, H - 80, 40); g.stroke();

      g.textAlign = "left"; g.textBaseline = "alphabetic";
      if ("letterSpacing" in g) g.letterSpacing = "6px";
      g.fillStyle = P.accent; g.font = "600 26px " + MONO;
      g.fillText(CT.kicker.toUpperCase(), X, 170);
      if ("letterSpacing" in g) g.letterSpacing = "0px";

      // Naslov u dva reda
      g.fillStyle = P.ink;
      var hw = CT.heading.split(" ");
      var h1 = hw[0], h2 = hw.slice(1).join(" ");
      certFit(g, hw.reduce(function (a, b) { return a.length > b.length ? a : b; }, ""), "800", DISPLAY, 124, MAXW, 70);
      g.fillText(h1, X, 300);
      if (h2) g.fillText(h2, X, 412);

      // Ime
      g.fillStyle = P.ink;
      certFit(g, name, "700", DISPLAY, 76, MAXW, 36);
      g.fillText(name, X, 560);
      g.strokeStyle = P.line; g.lineWidth = 2;
      g.beginPath(); g.moveTo(X, 592); g.lineTo(W - X, 592); g.stroke();

      // Podnaslov
      g.fillStyle = P.muted; g.font = "400 34px " + BODY;
      certWrap(g, CT.sub, MAXW).slice(0, 2).forEach(function (ln, i) { g.fillText(ln, X, 648 + i * 46); });

      // Rezultat i datum
      g.fillStyle = P.muted; g.font = "600 24px " + MONO;
      g.fillText(CT.scoreLabel.toUpperCase(), X, 800);
      g.fillText(CT.dateLabel.toUpperCase(), X + 300, 800);
      g.fillStyle = P.accent; g.font = "800 64px " + DISPLAY;
      g.fillText(s + "/" + n, X, 870);
      g.fillStyle = P.ink; g.font = "700 44px " + DISPLAY;
      g.fillText(certDateText(), X + 300, 866);

      // Obećanje
      g.fillStyle = P.ink; g.font = "600 36px " + BODY;
      g.fillText(lang === "hr" ? "„" + CT.pledge + "”" : "“" + CT.pledge + "”", X, 970);

      return new Promise(function (resolve, reject) {
        c.toBlob(function (b) { if (b) resolve(b); else reject(new Error("toBlob")); }, "image/png");
      });
    });
  }

  /* =====================================================================
     Light (paleta D) / dark (paleta A)
     Početni način postavlja skripta u <head> (spremljeni izbor ili postavka uređaja).
     ===================================================================== */
  // Način bira zajednička gornja traka (app.js, localStorage "cm-mode"); certifikat se crta u boji trenutnog načina.
  function getMode() {
    if (window.CM && CM.getMode) return CM.getMode();
    return root.getAttribute("data-mode") === "light" ? "light" : "dark";
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
    $$("[data-i18n-alt]").forEach(function (el) { var v = t(el.getAttribute("data-i18n-alt")); if (v != null) el.setAttribute("alt", v); });
    renderStations();
    updateBay();
    updateChecker();
    updateCaps();
    renderQuiz();
    // Već izrađeni certifikat crta se ponovno na novom jeziku
    if ((cert.url || cert.busy) && quiz.done && cert.name && quizScore() >= t("quiz.cert.min")) {
      makeCert(quizScore(), quiz.set.length, false);
    }
  }
  function initLang() {
    // Prekidač HR/EN je u zajedničkoj gornjoj traci (app.js); ovdje se samo prevodi sadržaj stranice.
    window.addEventListener("cm:lang", function () {
      var l = (window.CM && CM.lang) || lang;
      if (l === lang) return;
      lang = l;
      applyLang();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  }

  /* =====================================================================
     Navigacija: gornja traka, sekcije, glatko pomicanje
     ===================================================================== */
  function initChrome() {
    var top = $("#po-top"), main = $("#po-main");
    var ticking = false;
    // Tanka traka napretka čitanja uz gornji rub
    var readbar = doc.createElement("div");
    readbar.className = "po-readbar";
    readbar.setAttribute("aria-hidden", "true");
    doc.body.appendChild(readbar);
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        // Puna pozadina čim počne zaron, da logo i gumbi ostanu čitljivi preko tamnog mora
        top.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.2);
        var span = doc.documentElement.scrollHeight - window.innerHeight;
        readbar.style.transform = "scaleX(" + (span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0).toFixed(4) + ")";
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Poveznice unutar stranice: glatko pomicanje, adresa se ažurira, fokus ide na naslov sekcije
    doc.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      var target = id && doc.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      try { history.replaceState(null, "", "#" + id); } catch (err) {}
      var focusEl = target.id === "po-main" ? target : ($("h2", target) || target);
      if (!focusEl.hasAttribute("tabindex")) focusEl.setAttribute("tabindex", "-1");
      focusEl.focus({ preventScroll: true });
    });

    if ("IntersectionObserver" in window) {
      var chips = $$(".po-chips a");
      var inner = $(".po-chips-inner");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          chips.forEach(function (c) {
            var on = c.getAttribute("href") === "#" + en.target.id;
            c.classList.toggle("is-active", on);
            if (on) {
              c.setAttribute("aria-current", "true");
              // aktivni chip uvijek vidljiv u traci koja se pomiče vodoravno
              if (inner && inner.scrollWidth > inner.clientWidth) {
                inner.scrollTo({ left: c.offsetLeft - (inner.clientWidth - c.offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
              }
            } else c.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      ["utjecaj", "vodic", "prihvat", "slike", "znao", "kviz"].forEach(function (id) { var s = doc.getElementById(id); if (s) io.observe(s); });
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

    // Ljuljanje broda radi samo dok je uvod na ekranu
    var bob = gsap.to(".po-boat-inner", { y: -5, rotation: 1.5, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: intro, start: "top top", end: "+=320%", scrub: 0.8, pin: true, anticipatePin: 1,
        onLeave: function () { bob.pause(); }, onEnterBack: function () { bob.resume(); }
      }
    });

    // Tekst se gasi samo prozirnošću (opacity), pa ostaje dostupan čitačima zaslona
    tl.to(".po-world", { yPercent: -66.6667, duration: 10 }, 0)
      .to(".po-title", { yPercent: -40, opacity: 0, duration: 1.4 }, 0)
      .to(".po-intro-bottom", { opacity: 0, duration: 0.7 }, 0)
      .fromTo(".po-plume", { autoAlpha: 0, scale: 0.15 }, { autoAlpha: 0.95, scale: 1, duration: 3.2, ease: "power1.out" }, 1.2)
      .to(".po-plume", { yPercent: 85, scale: 1.9, autoAlpha: 0.5, duration: 5.2 }, 4.4);

    // Dubinski paralax: sunce se sporije gubi (dalje je), a dno i trava „izrone“ prema kraju zarona
    tl.to(".po-sun", { y: "22vh", duration: 6 }, 0)
      .fromTo(".po-grass", { yPercent: 32 }, { yPercent: 0, duration: 10 }, 0)
      .fromTo(".po-seabed", { yPercent: 14 }, { yPercent: 0, duration: 10 }, 0);

    // Na računalu zadnja rečenica ostaje lijevo, uz brojke desno
    var wide = window.matchMedia("(min-width: 860px)").matches;
    var slots = [[1.5, 3.1], [3.3, 4.9], [5.1, 6.7], [6.9, 8.0]];
    lines.forEach(function (li, i) {
      var s = slots[i] || slots[slots.length - 1];
      tl.fromTo(li, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, s[0]);
      if (!(wide && i === lines.length - 1)) tl.to(li, { opacity: 0, y: -40, duration: 0.5, ease: "power2.in" }, s[1] - 0.5);
    });
    facts.forEach(function (el, i) {
      tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 8.1 + i * 0.35);
    });
    tl.to({}, { duration: 0.6 }, 9.4); // kratko zadržavanje na dnu prije nastavka stranice

    // Prikvačeni uvod dodaje visinu tek nakon učitavanja, pa poveznica poput
    // plovi-odgovorno.html#vodic mora ponovno skočiti na svoju sekciju.
    function landOnHash() {
      var id = decodeURIComponent((location.hash || "").slice(1));
      var target = id && doc.getElementById(id);
      if (target) target.scrollIntoView({ block: "start" });
    }
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { ST.refresh(); });
    // Samo pri novom otvaranju stranice (ne pri osvježavanju ili „natrag“), i ako korisnik još nije sam pomicao stranicu
    var navEntry = (performance.getEntriesByType && performance.getEntriesByType("navigation")[0]) || {};
    var userMoved = false;
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (ev) {
      window.addEventListener(ev, function () { userMoved = true; }, { once: true, passive: true });
    });
    window.addEventListener("load", function () {
      ST.refresh();
      if ((navEntry.type || "navigate") === "navigate" && !userMoved) landOnHash();
    });
  }

  /* =====================================================================
     Pokret sekcija: ulaz pri skrolanju (CM.motion), uvala, žive ilustracije, brojke
     ===================================================================== */
  function initReveal() {
    var bayEl = $(".po-bay");
    function seen() { if (bayEl) bayEl.classList.add("is-seen"); }
    if (!M || reduceMotion || !("IntersectionObserver" in window) || doc.hidden) seen();
    if (!M || reduceMotion) return;
    var groups = [".po-head > *", ".po-bay", ".po-impact", ".po-guide", ".po-checker", ".po-step", ".po-caps", ".po-stations-head",
      ".po-station", ".po-howto", ".po-photos > h3", ".po-photos > p", ".po-photo", ".po-know", ".po-quiz", ".po-final .po-wrap > *"];
    M.reveal($$(groups.join(", "), $("#po-main")));
    // Mjerači uvale se napune tek kad uvala dođe na ekran
    if (bayEl && !bayEl.classList.contains("is-seen")) {
      var bio = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { seen(); bio.disconnect(); }
      }, { threshold: 0.25 });
      bio.observe(bayEl);
      doc.addEventListener("visibilitychange", function () { if (doc.hidden) { seen(); bio.disconnect(); } });
    }
  }
  function countUp(el) {
    if (!el || doc.hidden) return;
    var m = /^(\d+)(\D.*)?$/.exec(el.textContent.trim());
    if (!m || +m[1] < 2) return;
    var to = +m[1], suf = m[2] || "", t0 = null, dur = 900, last = null;
    (function step(t) {
      if (t0 == null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      k = 1 - Math.pow(1 - k, 3);
      if (last != null && el.textContent !== last) return;   // jezik promijenjen usred brojanja: ne diraj
      last = Math.round(to * k) + suf;
      el.textContent = last;
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  function initLive() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    // Ilustracije se animiraju samo dok su na ekranu
    var live = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("is-live", e.isIntersecting); });
    }, { threshold: 0.35 });
    $$(".po-howto").forEach(function (el) { live.observe(el); });
    // „Jesi li znao?“: brojke se pobroje kad kartica uđe
    var know = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        know.unobserve(e.target);
        countUp($(".po-know-big", e.target));
      });
    }, { threshold: 0.6 });
    $$(".po-know").forEach(function (el) { know.observe(el); });
  }

  /* ---------- Pokretanje ---------- */
  function start() {
    cert.name = cert.draft = sget("po-cert-name") || "";
    buildStatic();
    buildBay();
    initTabs();
    initChecker();
    initCaps();
    initLang();
    applyLang();
    initChrome();
    initReveal();
    initLive();
  }
  // Skripta je "defer": DOM je već učitan, pa se sadržaj prikazuje odmah.
  // GSAP se učitava poslije (također "defer"), pa animaciju pokrećemo na DOMContentLoaded.
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start);
  else start();
  if (doc.readyState === "complete") initMotion();
  else doc.addEventListener("DOMContentLoaded", initMotion);
})();
