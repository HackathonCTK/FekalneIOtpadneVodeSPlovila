/*
 * ČistoMore — zajednička logika svih stranica (učitava se na kraju <body>).
 *
 * Postojeće (grupa 1):   showToast(msg), CM_setTheme(theme), CM_getTheme()
 * Novo (spajanje grupa):
 *   CM_getMode() / CM_setMode("dark"|"light")      način; dark = paleta A, light = paleta D
 *   CM_i18n.add({hr:{...}, en:{...}})                prijevodi stranice (ključevi s točkom)
 *   CM_i18n.t(key, vars) / CM_i18n.lang() / CM_i18n.set("hr"|"en") / CM_i18n.apply(el)
 *       HTML atributi: data-i18n="k" (tekst), data-i18n-html="k" (HTML),
 *       data-i18n-attr="placeholder:k; aria-label:k; title:k"
 *       događaj document "cm:lang" (detail.lang) nakon promjene jezika, "cm:mode" nakon promjene načina
 *   Navigacija: <nav class="sidenav" data-cm-nav="home"></nav> i <nav class="bottomnav" data-cm-nav="home"></nav>
 *       vrijednosti: home | map | report | plovi | obrada | profile (označava aktivnu stavku)
 *   Prekidači (način + HR/EN): automatski u .topbar-row, ili u element [data-cm-controls]
 *   CM_reports: zajedničko spremište prijava (localStorage "cistomore.v1", model grupe 3)
 *       CM_reports.load() -> {v, seq, reports[], warnings{}} ; CM_reports.save(db)
 *       CM_reports.all() -> reports[] ; CM_reports.add(partial) -> spremljena prijava
 */
(function () {
  "use strict";
  var d = document, root = d.documentElement;

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function emit(name, detail) {
    var ev;
    try { ev = new CustomEvent(name, { detail: detail }); }
    catch (e) { ev = d.createEvent("CustomEvent"); ev.initCustomEvent(name, false, false, detail); }
    d.dispatchEvent(ev);
  }

  /* ---------------- Tema i način ---------------- */
  function modeTheme(m) { return m === "light" ? "ocean" : "dubina"; }
  function hasCustomTheme() { var t = safeGet("cm-theme"); return !!(t && t !== "ocean" && t !== "dubina"); }

  // Tema s Profila (demo birač tema grupe 1) ostaje podržana
  window.CM_setTheme = function (theme) {
    root.setAttribute("data-theme", theme);
    safeSet("cm-theme", theme);
  };
  window.CM_getTheme = function () { return safeGet("cm-theme") || modeTheme(window.CM_getMode()); };

  window.CM_getMode = function () { return root.getAttribute("data-mode") === "light" ? "light" : "dark"; };
  window.CM_setMode = function (m, save) {
    m = m === "light" ? "light" : "dark";
    root.setAttribute("data-mode", m);
    root.setAttribute("data-po-mode", m);
    if (!hasCustomTheme()) root.setAttribute("data-theme", modeTheme(m));
    if (save !== false) { safeSet("cm-mode", m); safeSet("po-mode", m); }
    var meta = d.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", m === "light" ? "#EEF7FA" : "#04141C");
    syncControls();
    emit("cm:mode", { mode: m });
  };
  // Ako cm-boot.js nije učitan, postavi način ovdje
  if (!root.getAttribute("data-mode")) {
    var sm = safeGet("cm-mode");
    if (sm !== "light" && sm !== "dark") sm = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    root.setAttribute("data-mode", sm);
    root.setAttribute("data-po-mode", sm);
    root.setAttribute("data-theme", hasCustomTheme() ? safeGet("cm-theme") : modeTheme(sm));
  }

  /* ---------------- Prijevodi (HR/EN) ---------------- */
  var dict = { hr: {}, en: {} };
  function merge(dst, src) {
    Object.keys(src || {}).forEach(function (k) {
      var v = src[k];
      if (v && typeof v === "object" && !Array.isArray(v)) { if (!dst[k] || typeof dst[k] !== "object") dst[k] = {}; merge(dst[k], v); }
      else dst[k] = v;
    });
  }
  function lookup(obj, key) {
    return key.split(".").reduce(function (o, p) { return o == null ? undefined : o[p]; }, obj);
  }
  function fmt(s, vars) {
    return vars ? String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }) : s;
  }
  var lang = (function () {
    var l = safeGet("cm-lang");
    if (l === "hr" || l === "en") return l;
    var a = root.getAttribute("lang");
    return a === "en" ? "en" : "hr";
  })();
  root.setAttribute("lang", lang);

  var ready = false;
  window.CM_i18n = {
    add: function (obj) { merge(dict.hr, obj.hr); merge(dict.en, obj.en); if (ready) this.apply(); },
    lang: function () { return lang; },
    has: function (key) { return lookup(dict[lang], key) !== undefined || lookup(dict.hr, key) !== undefined; },
    t: function (key, vars) {
      var v = lookup(dict[lang], key);
      if (v === undefined) v = lookup(dict.hr, key);
      if (v === undefined) return key;
      return typeof v === "string" ? fmt(v, vars) : v;
    },
    set: function (l) {
      l = l === "en" ? "en" : "hr";
      lang = l;
      safeSet("cm-lang", l);
      root.setAttribute("lang", l);
      this.apply();
      syncControls();
      emit("cm:lang", { lang: l });
    },
    // Prevodi samo ključeve koje rječnik poznaje (ostale atribute data-i18n ne dira)
    apply: function (el) {
      var scope = el || d;
      var self = this;
      Array.prototype.forEach.call(scope.querySelectorAll("[data-i18n]"), function (n) {
        var k = n.getAttribute("data-i18n");
        if (self.has(k)) n.textContent = self.t(k);
      });
      Array.prototype.forEach.call(scope.querySelectorAll("[data-i18n-html]"), function (n) {
        var k = n.getAttribute("data-i18n-html");
        if (self.has(k)) n.innerHTML = self.t(k);
      });
      Array.prototype.forEach.call(scope.querySelectorAll("[data-i18n-attr]"), function (n) {
        n.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
          var i = pair.indexOf(":");
          if (i < 0) return;
          var attr = pair.slice(0, i).trim(), k = pair.slice(i + 1).trim();
          if (attr && self.has(k)) n.setAttribute(attr, self.t(k));
        });
      });
    }
  };

  // Zajednički tekstovi (navigacija, prekidači, opće poruke)
  window.CM_i18n.add({
    hr: {
      cm: {
        nav: {
          main: "Glavna navigacija", home: "Početna", map: "Karta", report: "Nova prijava",
          plovi: "Plovi odgovorno", ploviShort: "Plovi", obrada: "Obrada prijava", profile: "Profil"
        },
        lang: "Jezik", toLight: "Uključi svijetli način", toDark: "Uključi tamni način",
        brand: "ČistoMore", soon: "Uskoro"
      }
    },
    en: {
      cm: {
        nav: {
          main: "Main navigation", home: "Home", map: "Map", report: "New report",
          plovi: "Sail responsibly", ploviShort: "Sail", obrada: "Report handling", profile: "Profile"
        },
        lang: "Language", toLight: "Switch to light mode", toDark: "Switch to dark mode",
        brand: "ČistoMore", soon: "Coming soon"
      }
    }
  });

  /* ---------------- Navigacija (ista na svim stranicama) ---------------- */
  var ICONS = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
    map: '<path d="M9 20 3 17V4l6 3m0 13 6-3m-6 3V7m6 10 6 3V7l-6-3m0 16V4m0 3-6-3"/>',
    report: '<path d="M12 5v14M5 12h14"/>',
    plovi: '<path d="M12 3v14"/><path d="M12 4l7 11h-7"/><path d="M10 7l-5 8h5"/><path d="M3 18h18l-2 3H5z"/>',
    obrada: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="m9 13 2 2 4-4"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 6-6 8-6s6.5 2 8 6"/>'
  };
  // Stranice na računalu (bočni izbornik) i na mobitelu (donja traka, najviše 5)
  var NAV_SIDE = ["home", "map", "report", "plovi", "obrada", "profile"];
  var NAV_BOTTOM = ["home", "map", "report", "plovi", "profile"];
  var HREF = {
    home: "index.html", map: "map.html", report: "report.html",
    plovi: "plovi-odgovorno.html", obrada: "obrada.html", profile: "profile.html"
  };
  function svg(id, w) {
    return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + w + '" fill="none" stroke="currentColor" stroke-width="' +
      (id === "report" ? "2.4" : "2") + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[id] + "</svg>";
  }
  function renderNav(nav) {
    var active = nav.getAttribute("data-cm-nav");
    var bottom = nav.classList.contains("bottomnav");
    var items = bottom ? NAV_BOTTOM : NAV_SIDE;
    nav.setAttribute("data-i18n-attr", "aria-label:cm.nav.main");
    nav.setAttribute("aria-label", window.CM_i18n.t("cm.nav.main"));
    nav.innerHTML = items.map(function (id) {
      var on = id === active;
      var cur = on ? ' aria-current="page"' : "";
      if (id === "report") {
        // Istaknuti gumb „Nova prijava“ (FAB) kao u izvornom rasporedu grupe 1
        return '<a class="nav-fab' + (on ? " active" : "") + '" href="' + HREF[id] + '"' + cur +
          (bottom ? ' data-i18n-attr="aria-label:cm.nav.report" aria-label="' + window.CM_i18n.t("cm.nav.report") + '">' + svg(id, 24)
                  : ">" + svg(id, 20) + '<span class="nlabel" data-i18n="cm.nav.report">' + window.CM_i18n.t("cm.nav.report") + "</span>") +
          "</a>";
      }
      var key = bottom && id === "plovi" ? "cm.nav.ploviShort" : "cm.nav." + id;
      return '<a class="nav-item' + (on ? " active" : "") + '" href="' + HREF[id] + '"' + cur + ">" + svg(id, bottom ? 22 : 20) +
        '<span class="nlabel" data-i18n="' + key + '">' + window.CM_i18n.t(key) + "</span></a>";
    }).join("");
  }

  /* ---------------- Prekidači: način (sunce/mjesec) i jezik (HR/EN) ---------------- */
  var SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  var MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>';
  function controlsHTML() {
    return '<button type="button" class="cm-mode" data-cm-mode-btn></button>' +
      '<div class="cm-lang" role="group" data-i18n-attr="aria-label:cm.lang" aria-label="' + window.CM_i18n.t("cm.lang") + '">' +
      '<button type="button" data-cm-lang="hr" lang="hr" aria-label="Hrvatski">HR</button>' +
      '<button type="button" data-cm-lang="en" lang="en" aria-label="English">EN</button></div>';
  }
  function mountControls() {
    var host = d.querySelector("[data-cm-controls]");
    if (!host) {
      var row = d.querySelector(".topbar-row");
      if (!row) return;
      host = d.createElement("div");
      host.className = "cm-controls";
      host.setAttribute("data-cm-controls", "");
      var bell = row.querySelector(".icon-btn");
      if (bell) row.insertBefore(host, bell); else row.appendChild(host);
    }
    if (!host.classList.contains("cm-controls")) host.classList.add("cm-controls");
    host.innerHTML = controlsHTML();
    host.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("button") : null;
      if (!b) return;
      if (b.hasAttribute("data-cm-mode-btn")) window.CM_setMode(window.CM_getMode() === "light" ? "dark" : "light");
      else if (b.hasAttribute("data-cm-lang")) window.CM_i18n.set(b.getAttribute("data-cm-lang"));
    });
  }
  function syncControls() {
    var m = window.CM_getMode();
    Array.prototype.forEach.call(d.querySelectorAll("[data-cm-mode-btn]"), function (b) {
      var label = window.CM_i18n.t(m === "light" ? "cm.toDark" : "cm.toLight");
      b.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (m === "light" ? MOON : SUN) + "</svg>";
      b.setAttribute("aria-label", label);
      b.setAttribute("title", label);
    });
    Array.prototype.forEach.call(d.querySelectorAll("[data-cm-lang]"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cm-lang") === lang ? "true" : "false");
    });
  }
  // Promjena postavke uređaja vrijedi dok korisnik sam ne odabere način
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: light)");
    var onSys = function () { if (!safeGet("cm-mode")) window.CM_setMode(mq.matches ? "light" : "dark", false); };
    if (mq.addEventListener) mq.addEventListener("change", onSys); else if (mq.addListener) mq.addListener(onSys);
  }

  /* ---------------- Zajedničko spremište prijava (model grupe 3) ---------------- */
  var REPORTS_KEY = "cistomore.v1";
  window.CM_reports = {
    KEY: REPORTS_KEY,
    load: function () {
      var raw = safeGet(REPORTS_KEY);
      if (!raw) return null;
      try { var db = JSON.parse(raw); return db && Array.isArray(db.reports) ? db : null; } catch (e) { return null; }
    },
    save: function (db) {
      try { localStorage.setItem(REPORTS_KEY, JSON.stringify(db)); return true; } catch (e) { return false; }
    },
    all: function () { var db = this.load(); return db ? db.reports : []; },
    // Prijava iz report.html (grupa 1). Polja kao kod grupe 3; službu i županiju određuje obrada.html.
    add: function (p) {
      // Demo prijave grupe 3 zauzimaju brojeve 1170–1185, pa prave prijave kreću od 1186
      var db = this.load() || { v: 1, seq: 1185, reports: [], warnings: {} };
      db.seq = Math.max(Number(db.seq) || 0, 1185) + 1;
      var now = new Date();
      var r = {
        id: now.getFullYear() + "-" + db.seq,
        type: p.type || "fekalne",
        lat: p.lat, lng: p.lng,
        place: p.place || "",
        desc: p.desc || "",
        createdAt: p.createdAt || now.toISOString(),
        status: "zaprimljeno",
        vessel: p.vessel || "",
        heading: p.heading == null ? null : p.heading,
        service: null, reasons: [], county: null, confirmed: false,
        history: [{ t: now.toISOString(), text: "Prijava zaprimljena (Nova prijava)." }],
        photo: p.photo || null,
        pending: false,
        source: "report.html",
        extra: p.extra || null
      };
      db.reports.unshift(r);
      if (!this.save(db)) {
        // Premalo mjesta (npr. velika fotografija): spremi bez fotografije
        r.photo = null;
        this.save(db);
      }
      emit("cm:reports", { added: r });
      return r;
    }
  };

  /* ---------------- Toast (grupa 1) ---------------- */
  var toastTimer;
  window.showToast = function (msg) {
    var t = d.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  };

  /* ---------------- Pokretanje ---------------- */
  function init() {
    Array.prototype.forEach.call(d.querySelectorAll("nav[data-cm-nav]"), renderNav);
    mountControls();
    window.CM_i18n.apply();
    syncControls();
    ready = true;
    root.classList.add("cm-ready");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();
})();
