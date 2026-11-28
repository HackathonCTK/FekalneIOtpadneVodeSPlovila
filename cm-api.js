/*
 * ČistoMore — veza sa serverom (računi, prijave, kviz). Učitava se nakon app.js na svim stranicama.
 *
 *   CM_api.base()            -> Promise<adresa servera | null>
 *   CM_account.user()        -> prijavljeni korisnik {id, email, ime, uloga} ili null
 *   CM_account.login / register / google / logout / rename / refresh
 *   CM_sync.now()            -> Promise: pošalji nove prijave i promjene, povuci stanje sa servera
 *
 * Adresa servera:
 *   - localStorage "cm-api" (ručno, za testiranje), inače
 *   - na localhostu: http://localhost:8787, inače
 *   - api.json na grani "api-adresa" repoa (server je tamo upiše kad se tunel podigne).
 *
 * Prijave i dalje žive u localStorage "cistomore.v1" (CM_reports) jer ih sve stranice
 * tako čitaju; ovaj sloj ih usklađuje sa serverom:
 *   r._srv = true      prijava postoji na serveru (id dodjeljuje server)
 *   bez _srv           lokalna prijava koja čeka slanje (id oblika 2026-L1186)
 * Događaji: "cm:account" (prijava/odjava), "cm:sync" (podaci sa servera stigli).
 */
(function () {
  "use strict";
  var d = document;
  var REPO_RAW = "https://raw.githubusercontent.com/HackathonCTK/FekalneIOtpadneVodeSPlovila/api-adresa/api.json";
  var REPO_API = "https://api.github.com/repos/HackathonCTK/FekalneIOtpadneVodeSPlovila/contents/api.json?ref=api-adresa";
  var K_TOKEN = "cm-token", K_USER = "cm-user", K_SNAP = "cm-sync-snap", K_BASE = "cm-api-cache";

  function sget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function jget(k) { try { return JSON.parse(sget(k) || "null"); } catch (e) { return null; } }
  function emit(name, detail) {
    try { d.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch (e) {}
  }
  function t(k, v) { return window.CM_i18n ? CM_i18n.t(k, v) : k; }

  /* ---------------- Prijevodi ---------------- */
  if (window.CM_i18n) CM_i18n.add({
    hr: { acc: {
      needLogin: "Za slanje prijave prijavi se ili napravi račun.",
      needLoginBtn: "Prijava / registracija",
      offline: "Server trenutno nije dostupan. Prijava je spremljena na uređaju i poslat će se automatski.",
      viewOnly: "Pregled: status prijava mogu mijenjati samo računi nadležnih službi. Tvoje izmjene ovdje se ne spremaju.",
      loginFirst: "Prijavi se (Profil) da vidiš prijave sa servera.",
      err: {
        "pogresni-podaci": "Pogrešan e-mail ili lozinka.",
        "email-zauzet": "Račun s tim e-mailom već postoji. Prijavi se.",
        "email-neispravan": "Upiši ispravnu e-mail adresu.",
        "lozinka-prekratka": "Lozinka mora imati barem 8 znakova.",
        "ime-obavezno": "Upiši ime.",
        "previse-pokusaja": "Previše pokušaja. Pričekaj malo pa pokušaj ponovno.",
        "server": "Server nije dostupan. Pokušaj malo kasnije.",
        "google": "Prijava Googleom nije uspjela.",
        "default": "Nešto nije u redu. Pokušaj ponovno."
      }
    } },
    en: { acc: {
      needLogin: "Sign in or create an account to send a report.",
      needLoginBtn: "Sign in / sign up",
      offline: "The server isn't reachable right now. Your report is saved on this device and will be sent automatically.",
      viewOnly: "View only: only authority accounts can change report status. Your changes here aren't saved.",
      loginFirst: "Sign in (Profile) to see reports from the server.",
      err: {
        "pogresni-podaci": "Wrong email or password.",
        "email-zauzet": "An account with that email already exists. Sign in.",
        "email-neispravan": "Enter a valid email address.",
        "lozinka-prekratka": "The password must be at least 8 characters.",
        "ime-obavezno": "Enter your name.",
        "previse-pokusaja": "Too many attempts. Wait a bit and try again.",
        "server": "The server isn't reachable. Try again a little later.",
        "google": "Google sign-in failed.",
        "default": "Something went wrong. Try again."
      }
    } }
  });

  /* ---------------- Adresa servera ---------------- */
  var basePromise = null;
  function isLocal() { return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname); }
  function clean(u) { return typeof u === "string" && /^https?:\/\/[^\s"'<>]+$/.test(u) ? u.replace(/\/+$/, "") : null; }
  function health(u) {
    var ctl = "AbortController" in window ? new AbortController() : null;
    var to = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
    return fetch(u + "/api/health", { cache: "no-store", signal: ctl ? ctl.signal : undefined })
      .then(function (r) { clearTimeout(to); return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.ok) { CM_api.info = j; return u; } return null; })
      .catch(function () { clearTimeout(to); return null; });
  }
  function discover() {
    var manual = clean(sget("cm-api"));
    if (manual) return Promise.resolve([manual]);
    if (isLocal()) return Promise.resolve(["http://localhost:8787"]);
    var cached = clean(sget(K_BASE));
    var fromRaw = fetch(REPO_RAW + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return j && clean(j.url); })
      .catch(function () { return null; });
    return fromRaw.then(function (u) {
      if (u) return [u, cached].filter(Boolean);
      // rezerva: GitHub API (bez CDN predmemorije)
      return fetch(REPO_API, { cache: "no-store", headers: { Accept: "application/vnd.github.raw+json" } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { return [j && clean(j.url), cached].filter(Boolean); })
        .catch(function () { return cached ? [cached] : []; });
    });
  }
  function base(force) {
    if (force) basePromise = null;
    if (!basePromise) {
      basePromise = discover().then(function (list) {
        var i = 0;
        function next() {
          if (i >= list.length) return null;
          var u = list[i++];
          return health(u).then(function (ok) { return ok || next(); });
        }
        return next();
      }).then(function (u) {
        if (u && !isLocal() && !sget("cm-api")) sset(K_BASE, u);
        // server nije dostupan: za 30 s potraži adresu ponovno i pošalji što čeka
        if (!u) setTimeout(function () { basePromise = null; if (CM_account.user()) schedule(); }, 30000);
        return u;
      });
    }
    return basePromise;
  }

  function req(method, path, body) {
    return base().then(function (b) {
      if (!b) { var e = new Error("server"); e.code = "server"; throw e; }
      var h = { "Content-Type": "application/json" };
      var tok = sget(K_TOKEN);
      if (tok) h.Authorization = "Bearer " + tok;
      return fetch(b + path, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined, cache: "no-store" })
        .catch(function () {
          basePromise = null;   // adresa se možda promijenila (novi tunel)
          var e = new Error("server"); e.code = "server"; throw e;
        })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok) {
              var e = new Error(j.error || "default"); e.code = j.error || "default"; e.status = r.status;
              if (r.status === 401 && tok && path.indexOf("/api/auth/") !== 0) dropSession();
              throw e;
            }
            return j;
          });
        });
    });
  }
  window.CM_api = { base: base, req: req, info: null, errText: function (e) {
    var c = (e && e.code) || "default";
    var key = "acc.err." + c;
    return CM_i18n && CM_i18n.has(key) ? t(key) : (/^google/.test(c) ? t("acc.err.google") : t("acc.err.default"));
  } };

  /* ---------------- Račun ---------------- */
  function setSession(j) {
    sset(K_TOKEN, j.token);
    sset(K_USER, JSON.stringify(j.korisnik));
    emit("cm:account", { user: j.korisnik });
    return sync().then(function () { return j.korisnik; }, function () { return j.korisnik; });
  }
  function dropSession() {
    sset(K_TOKEN, null); sset(K_USER, null); sset(K_SNAP, null);
    // makni prijave sa servera s ovog uređaja (pripadaju računu)
    var db = CM_reports.load();
    if (db) {
      var before = db.reports.length;
      db.reports = db.reports.filter(function (r) { return !r._srv; });
      if (db.reports.length !== before) { CM_reports.save(db); emit("cm:reports", { sync: true }); emit("cm:sync"); }
    }
    emit("cm:account", { user: null });
  }
  window.CM_account = {
    user: function () { return sget(K_TOKEN) ? jget(K_USER) : null; },
    isService: function () { var u = this.user(); return !!u && (u.uloga === "sluzba" || u.uloga === "admin"); },
    login: function (email, lozinka) { return req("POST", "/api/auth/login", { email: email, lozinka: lozinka }).then(setSession); },
    register: function (ime, email, lozinka) { return req("POST", "/api/auth/register", { ime: ime, email: email, lozinka: lozinka }).then(setSession); },
    google: function (credential) { return req("POST", "/api/auth/google", { credential: credential }).then(setSession); },
    logout: function () {
      var p = sget(K_TOKEN) ? req("POST", "/api/auth/logout").catch(function () {}) : Promise.resolve();
      return p.then(dropSession);
    },
    rename: function (ime) {
      return req("PATCH", "/api/me", { ime: ime }).then(function (j) {
        sset(K_USER, JSON.stringify(j.korisnik)); emit("cm:account", { user: j.korisnik }); return j.korisnik;
      });
    },
    refresh: function () {
      if (!sget(K_TOKEN)) return Promise.resolve(null);
      return req("GET", "/api/me").then(function (j) {
        sset(K_USER, JSON.stringify(j.korisnik));
        if (j.kviz) mergeCert(j.kviz);
        emit("cm:account", { user: j.korisnik });
        return j.korisnik;
      });
    }
  };

  /* ---------------- Kviz / certifikat ---------------- */
  function mergeCert(k) {
    var c = jget("po-cert");
    if (!c || (Number(k.rezultat) || 0) > (Number(c.score) || 0) || (!c.name && k.ime)) {
      sset("po-cert", JSON.stringify({ name: k.ime || (c && c.name) || "", score: k.rezultat, total: k.ukupno, date: k.datum }));
    }
  }
  d.addEventListener("cm:quiz", function (e) {
    var x = e.detail || {};
    if (!CM_account.user()) return;
    req("POST", "/api/kviz", { rezultat: x.rezultat, ukupno: x.ukupno, ime: x.ime || "" }).catch(function () {});
  });

  /* ---------------- Usklađivanje prijava ---------------- */
  var MUT = ["status", "service", "county", "confirmed", "reasons", "history", "place"];
  function sig(r) { var o = {}; MUT.forEach(function (k) { o[k] = r[k] === undefined ? null : r[k]; }); return JSON.stringify(o); }
  function fromServer(r, b) {
    r._srv = true;
    if (typeof r.photo === "string" && /^photos\//.test(r.photo)) r.photo = b + "/api/" + r.photo;
    return r;
  }
  function pushNew(b) {
    var db = CM_reports.load();
    if (!db) return Promise.resolve({});
    var svc = CM_account.isService();
    var todo = db.reports.filter(function (r) {
      return r && !r._srv && (r.source === "report.html" || (svc && r.source === "obrada.html"));
    });
    var map = {};
    return todo.reduce(function (p, r) {
      return p.then(function () {
        return req("POST", "/api/prijave", {
          type: r.type, lat: r.lat, lng: r.lng, place: r.place, desc: r.desc, createdAt: r.createdAt,
          vessel: r.vessel, heading: r.heading, photo: r.photo, extra: r.extra, source: r.source
        }).then(function (j) {
          map[r.id] = j.prijava.id;
          var cur = CM_reports.load();
          cur.reports = cur.reports.map(function (x) { return x.id === r.id ? fromServer(j.prijava, b) : x; });
          CM_reports.save(cur);
          var snap = jget(K_SNAP) || {}; snap[j.prijava.id] = sig(j.prijava); sset(K_SNAP, JSON.stringify(snap));
        });
      });
    }, Promise.resolve()).then(function () { return map; });
  }
  function pushChanges() {
    if (!CM_account.isService()) return Promise.resolve();
    var db = CM_reports.load(); if (!db) return Promise.resolve();
    var snap = jget(K_SNAP) || {};
    var changed = db.reports.filter(function (r) { return r._srv && snap[r.id] && snap[r.id] !== sig(r); });
    return changed.reduce(function (p, r) {
      return p.then(function () {
        var body = {}; MUT.forEach(function (k) { body[k] = r[k]; });
        return req("PATCH", "/api/prijave/" + encodeURIComponent(r.id), body).then(function (j) {
          snap[r.id] = sig(j.prijava); sset(K_SNAP, JSON.stringify(snap));
        });
      });
    }, Promise.resolve());
  }
  function pull(b) {
    var u = CM_account.user(); if (!u) return Promise.resolve();
    return req("GET", "/api/prijave" + (CM_account.isService() ? "?sve=1" : "")).then(function (j) {
      var srv = (j.prijave || []).map(function (r) { return fromServer(r, b); });
      var db = CM_reports.load() || { v: 1, seq: 1185, reports: [], warnings: {} };
      var local = db.reports.filter(function (r) { return r && !r._srv; });
      var before = JSON.stringify(db.reports.filter(function (r) { return r && r._srv; }));
      db.reports = srv.concat(local).sort(function (a, z) { return String(z.createdAt).localeCompare(String(a.createdAt)); });
      var snap = {}; srv.forEach(function (r) { snap[r.id] = sig(r); });
      sset(K_SNAP, JSON.stringify(snap));
      if (JSON.stringify(srv) !== before) {
        CM_reports.save(db);
        emit("cm:reports", { sync: true });
        emit("cm:sync");
      }
    });
  }
  var running = null;
  function sync() {
    if (!CM_account.user()) return Promise.resolve();
    // već radi: pričekaj pa pokreni još jednom (da uhvati i najnovije promjene)
    if (running) return running.then(sync, sync);
    running = base().then(function (b) {
      if (!b) throw Object.assign(new Error("server"), { code: "server" });
      return pushNew(b).then(function (map) {
        return pushChanges().then(function () { return pull(b); }).then(function () { return map; });
      });
    });
    var mine = running;
    mine.then(function () { if (running === mine) running = null; }, function () { if (running === mine) running = null; });
    return mine;
  }
  var timer = null;
  function schedule() { clearTimeout(timer); timer = setTimeout(function () { sync().catch(function () {}); }, 600); }
  d.addEventListener("cm:reports", function (e) { if (!(e.detail && e.detail.sync)) schedule(); });
  d.addEventListener("cm:reports-saved", schedule);
  window.CM_sync = { now: sync };

  /* ---------------- Obavijest na Obradi za račune koji nisu služba ---------------- */
  function obradaNotice() {
    var nav = d.querySelector('nav[data-cm-nav="obrada"]');
    var host = d.querySelector("main.content");
    if (!nav || !host) return;
    var el = d.getElementById("cm-acc-notice");
    var msg = !CM_account.user() ? t("acc.loginFirst") : (CM_account.isService() ? "" : t("acc.viewOnly"));
    if (!msg) { if (el) el.remove(); return; }
    if (!el) {
      el = d.createElement("p"); el.id = "cm-acc-notice"; el.className = "cm-acc-notice"; el.setAttribute("role", "status");
      host.insertBefore(el, host.firstChild);
    }
    el.innerHTML = "";
    var a = d.createElement("a"); a.href = "profile.html"; a.textContent = msg;
    el.appendChild(CM_account.user() ? d.createTextNode(msg) : a);
  }
  d.addEventListener("cm:account", obradaNotice);
  d.addEventListener("cm:lang", obradaNotice);

  /* ---------------- Pokretanje ---------------- */
  function start() {
    obradaNotice();
    if (!CM_account.user()) return;
    CM_account.refresh().catch(function () {}).then(function () { return sync(); }).catch(function () {});
    setInterval(function () { if (!d.hidden) sync().catch(function () {}); }, 60000);
    d.addEventListener("visibilitychange", function () { if (!d.hidden) schedule(); });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", start); else start();
})();
