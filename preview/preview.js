/*
 * ČistoMore — „pregled bez servera“ za GitHub Pages.
 *
 * Ovu skriptu NE učitava pravi server. GitHub Action (.github/workflows/seniori-preview.yml)
 * je kopira u seniori/preview.js na grani main i ubacuje u <head> svake stranice.
 * Ona tumači pozive prema /api/... u pregledniku: račun, prijave i obrada rade nad podacima
 * u localStorage ovog preglednika (ključ "cm-preview-db"), pa se cijela aplikacija može
 * isprobati bez Node servera. Demo računi: korisnik / korisnik i admin / admin.
 * Fotografije se u pregledu ne spremaju.
 */
(function () {
  "use strict";
  window.CM_PREVIEW = true;
  var KEY = "cm-preview-db";
  var realFetch = window.fetch ? window.fetch.bind(window) : null;

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load() { try { var d = JSON.parse(lsGet(KEY)); if (d && d.users && d.reports) return d; } catch (e) {} return null; }
  var db = load() || {
    v: 1, seq: 1185, seeded: false, session: { user: 1, admin: null },
    users: [
      { id: 1, username: "korisnik", name: "Demo korisnik", password: "korisnik", createdAt: new Date().toISOString() },
      { id: 2, username: "admin", name: "Služba (demo)", password: "admin", createdAt: new Date().toISOString() }
    ],
    reports: [], warnings: {}
  };
  function save() { lsSet(KEY, JSON.stringify(db)); }
  function pub(u) { return u ? { id: u.id, username: u.username, name: u.name, createdAt: u.createdAt } : null; }
  function userById(id) { for (var i = 0; i < db.users.length; i++) if (db.users[i].id === id) return db.users[i]; return null; }

  // Početno stanje: korisnik je već prijavljen, da se Dnevnik, Profil i Nova prijava mogu odmah otvoriti.
  if (!lsGet("cm-user") && db.session.user) lsSet("cm-user", JSON.stringify(pub(userById(db.session.user))));
  if (!db.session.user && lsGet("cm-user")) { try { db.session.user = JSON.parse(lsGet("cm-user")).id || null; } catch (e) {} }

  /* ---------- Prijave ---------- */
  function R() { return window.CM_ROUTING || null; }
  function nextId() { db.seq += 1; return new Date().getFullYear() + "-" + db.seq; }
  function makeReport(b, userId, source) {
    var r = R(), now = new Date().toISOString();
    var rt = r && r.route ? r.route(b.lat, b.lng, b.type) : { service: null, reasons: [], county: null };
    var history = [{ t: now, text: "Prijava zaprimljena. Automatski prijedlog: " + (r && rt.service && r.svcName ? r.svcName(rt.service) : "—") }];
    if (source === "sluzba") history.push({ t: now, text: "Prijavu je unijela služba (npr. dojava telefonom)" });
    return {
      id: nextId(), userId: userId, createdAt: now, type: b.type || "fekalne", wasteType: b.wasteType || null,
      lat: b.lat, lng: b.lng, place: r && r.placeFor ? r.placeFor(b.lat, b.lng) : "",
      desc: String(b.desc || "").slice(0, 2000), eventAt: b.eventAt || now,
      vessel: b.vessel || null, vesselSize: b.vesselSize || null, vesselColor: b.vesselColor || null, registration: b.registration || null,
      heading: b.heading == null ? null : b.heading, observer: b.observer || null,
      status: "zaprimljeno", statusHistory: [{ status: "zaprimljeno", t: now }],
      service: rt.service, reasons: rt.reasons || [], county: rt.county, confirmed: false, history: history,
      photos: [], source: source || "gradjanin", clientId: b.clientId || null
    };
  }
  function seed() {
    if (db.seeded) return;
    var r = R(); if (!r || !r.route) return;
    db.seeded = true;
    var spots = [
      [43.5081, 16.4402, "fekalne", "Jedrilica", "zaprimljeno"], [44.8683, 13.8481, "fekalne", "Motorni brod", "obrada"],
      [44.1194, 15.2314, "ulje", "Gumenjak", "rijeseno"], [42.6507, 18.0944, "otpad_more", "Gulet", "obrada"],
      [43.7350, 15.8952, "fekalne", "Jedrilica", "zaprimljeno"], [45.3271, 14.4422, "fekalne", "Brod za kružna putovanja", "rijeseno"]
    ];
    spots.forEach(function (s, i) {
      var rep = makeReport({ lat: s[0], lng: s[1], type: s[2], vessel: s[3], desc: "Demo prijava za pregled." }, null, "gradjanin");
      var ago = (i + 1) * 3 * 3600 * 1000, t0 = new Date(Date.now() - ago).toISOString();
      rep.createdAt = t0; rep.eventAt = t0; rep.statusHistory = [{ status: "zaprimljeno", t: t0 }]; rep.history[0].t = t0;
      if (s[4] !== "zaprimljeno") { var t1 = new Date(Date.now() - ago * 0.6).toISOString(); rep.status = "obrada"; rep.statusHistory.push({ status: "obrada", t: t1 }); rep.confirmed = true; rep.history.push({ t: t1, text: "Status: U obradi" }); }
      if (s[4] === "rijeseno") { var t2 = new Date(Date.now() - ago * 0.3).toISOString(); rep.status = "rijeseno"; rep.statusHistory.push({ status: "rijeseno", t: t2 }); rep.history.push({ t: t2, text: "Status: Riješeno" }); }
      db.reports.push(rep);
    });
    save();
  }
  function userView(r) {
    var h = r.history || [];
    return { id: r.id, clientId: r.clientId, type: r.type, wasteType: r.wasteType, lat: r.lat, lng: r.lng, place: r.place, desc: r.desc,
      createdAt: r.createdAt, eventAt: r.eventAt, status: r.status, statusHistory: r.statusHistory || [],
      vessel: r.vessel, vesselSize: r.vesselSize, vesselColor: r.vesselColor, registration: r.registration, heading: r.heading, observer: r.observer,
      service: r.service, confirmed: !!r.confirmed, lastChange: h.length ? h[h.length - 1].t : r.createdAt, photos: [] };
  }
  function adminView(r) {
    var u = r.userId ? userById(r.userId) : null;
    return { id: r.id, type: r.type, wasteType: r.wasteType, lat: r.lat, lng: r.lng, place: r.place, desc: r.desc,
      createdAt: r.createdAt, eventAt: r.eventAt, updatedAt: r.updatedAt || r.createdAt, status: r.status, statusHistory: r.statusHistory || [],
      vessel: r.vessel, vesselSize: r.vesselSize, vesselColor: r.vesselColor, registration: r.registration, heading: r.heading, observer: r.observer,
      service: r.service, reasons: r.reasons || [], county: r.county, confirmed: !!r.confirmed, history: r.history || [],
      photos: [], source: r.source, reporter: u ? { name: u.name, username: u.username } : null };
  }

  /* ---------- „Server“ ---------- */
  function ok(status, obj) { return [status, obj]; }
  function err(status, code) { return [status, { error: code }]; }
  function handle(method, path, b) {
    b = b || {};
    var m, u = db.session.user ? userById(db.session.user) : null, a = db.session.admin ? userById(db.session.admin) : null;
    if (path === "/api/me" && method === "GET") return ok(200, { user: pub(u), demo: !!(u && u.password === "korisnik") });
    if (path === "/api/register" && method === "POST") {
      var un = String(b.username || "").trim(), nm = String(b.name || "").trim(), pw = String(b.password || "");
      if (!/^[A-Za-z0-9._-]{3,32}$/.test(un)) return err(400, "invalid_username");
      if (nm.length < 2) return err(400, "invalid_name");
      if (pw.length < 6) return err(400, "weak_password");
      if (db.users.some(function (x) { return x.username.toLowerCase() === un.toLowerCase(); })) return err(409, "username_taken");
      var nu = { id: db.users.length + 1, username: un, name: nm, password: pw, createdAt: new Date().toISOString() };
      db.users.push(nu); db.session.user = nu.id; save(); return ok(201, { user: pub(nu) });
    }
    if (path === "/api/login" && method === "POST") {
      var cand = db.users.filter(function (x) { return x.username.toLowerCase() === String(b.username || "").toLowerCase() && x.password === b.password && x.username !== "admin"; })[0];
      if (!cand) return err(401, "invalid_credentials");
      db.session.user = cand.id; save(); return ok(200, { user: pub(cand) });
    }
    if (path === "/api/logout" && method === "POST") { db.session.user = null; save(); return ok(200, { ok: true }); }
    if (path === "/api/my/reports" && method === "GET") {
      if (!u) return err(401, "unauthorized");
      return ok(200, { reports: db.reports.filter(function (r) { return r.userId === u.id; }).map(userView), serverTime: new Date().toISOString() });
    }
    if (path === "/api/reports" && method === "POST") {
      if (!u) return err(401, "unauthorized");
      if (b.clientId) { var ex = db.reports.filter(function (r) { return r.clientId === b.clientId && r.userId === u.id; })[0]; if (ex) return ok(200, { report: userView(ex) }); }
      var lat = Number(b.lat), lng = Number(b.lng);
      if (!isFinite(lat) || !isFinite(lng)) return err(400, "location_required");
      if (R() && R().inCroatiaBox && !R().inCroatiaBox(lat, lng)) return err(400, "outside_croatia");
      var rep = makeReport({ type: b.type, lat: lat, lng: lng, desc: b.desc, eventAt: b.eventAt, wasteType: b.wasteType, vessel: b.vessel, vesselSize: b.vesselSize,
        vesselColor: b.vesselColor, registration: b.registration, heading: b.heading, observer: b.observer, clientId: b.clientId }, u.id, "gradjanin");
      db.reports.unshift(rep); save(); return ok(201, { report: userView(rep) });
    }
    if (path === "/api/admin/login" && method === "POST") {
      var ad = db.users.filter(function (x) { return x.username === "admin" && x.password === b.password && String(b.username).toLowerCase() === "admin"; })[0];
      if (!ad) return err(401, "invalid_credentials");
      db.session.admin = ad.id; save(); return ok(200, { user: pub(ad) });
    }
    if (path === "/api/admin/logout" && method === "POST") { db.session.admin = null; save(); return ok(200, { ok: true }); }
    if (path === "/api/admin/me" && method === "GET") {
      // obrada.html i admin-login.html čuvaju prijavu i u localStorage "cm-admin"; drži ih usklađenima
      if (a) lsSet("cm-admin", JSON.stringify({ username: a.username, name: a.name }));
      else { try { localStorage.removeItem("cm-admin"); } catch (e) {} }
      return ok(200, { user: pub(a), demo: !!(a && a.password === "admin") });
    }
    if (path.indexOf("/api/admin/") === 0 && !a) return err(401, "unauthorized");
    if (path === "/api/admin/reports" && method === "GET") {
      seed();
      return ok(200, { reports: db.reports.map(adminView), warnings: db.warnings, serverTime: new Date().toISOString() });
    }
    if (path === "/api/admin/reports" && method === "POST") {
      var lt = Number(b.lat), ln = Number(b.lng);
      if (!isFinite(lt) || !isFinite(ln)) return err(400, "location_required");
      var rp = makeReport({ type: b.type, lat: lt, lng: ln, desc: b.desc, eventAt: b.eventAt, wasteType: b.wasteType, vessel: b.vessel, vesselSize: b.vesselSize,
        vesselColor: b.vesselColor, registration: b.registration, heading: b.heading, observer: b.observer, clientId: b.clientId }, null, "sluzba");
      db.reports.unshift(rp); save(); return ok(201, { report: adminView(rp) });
    }
    if ((m = /^\/api\/admin\/reports\/(\d{4}-\d{1,9})$/.exec(path)) && method === "PATCH") {
      var r = db.reports.filter(function (x) { return x.id === m[1]; })[0];
      if (!r) return err(404, "not_found");
      var now = new Date().toISOString();
      if (b.status != null) {
        if (["zaprimljeno", "obrada", "rijeseno"].indexOf(b.status) < 0) return err(400, "invalid_status");
        if (b.status !== r.status) { r.statusHistory = (r.statusHistory || []).concat([{ status: b.status, t: now }]); r.status = b.status; }
      }
      if (b.service != null) r.service = b.service;
      if (b.confirmed != null) r.confirmed = !!b.confirmed;
      if (Array.isArray(b.history)) {
        var seen = {}; (r.history || []).forEach(function (h) { seen[h.t + "|" + h.text] = 1; });
        b.history.slice(0, 50).forEach(function (h) {
          var text = String((h && h.text) || "").slice(0, 500); if (!text) return;
          var t = h.t && !isNaN(new Date(h.t)) ? new Date(h.t).toISOString() : now;
          if (!seen[t + "|" + text]) { seen[t + "|" + text] = 1; r.history.push({ t: t, text: text }); }
        });
        r.history.sort(function (x, y) { return x.t.localeCompare(y.t); });
      }
      r.updatedAt = now; save(); return ok(200, { report: adminView(r) });
    }
    if (path === "/api/admin/warnings" && method === "POST") { db.warnings[String(b.key)] = b.at || new Date().toISOString(); save(); return ok(200, { ok: true, key: b.key, at: db.warnings[String(b.key)] }); }
    if (path === "/api/admin/reset" && method === "POST") { db.reports = []; db.seeded = false; db.seq = 1185; seed(); save(); return ok(200, { ok: true }); }
    return err(404, "not_found");
  }

  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || "";
    var u; try { u = new URL(url, location.href); } catch (e) { return realFetch(input, init); }
    var m = u.origin === location.origin ? /(\/api\/.*)$/.exec(u.pathname) : null;
    if (!m) return realFetch(input, init);
    var method = ((init && init.method) || (typeof input !== "string" && input.method) || "GET").toUpperCase();
    var body = null; try { body = init && init.body ? JSON.parse(init.body) : null; } catch (e) {}
    var res = m[1] === "/api/status" ? [404, { error: "not_found" }] : handle(method, m[1], body);
    var text = JSON.stringify(res[1]);
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(new Response(text, { status: res[0], headers: { "Content-Type": "application/json" } }));
      }, 120);
    });
  };

  /* ---------- Oznaka „pregled“ ---------- */
  function badge() {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-expanded", "false");
    var hasNav = !!document.querySelector(".bottomnav");
    b.style.cssText = "position:fixed;left:12px;bottom:" + (hasNav ? "88px" : "12px") + ";z-index:90;max-width:min(300px,calc(100vw - 24px));padding:8px 12px;border-radius:999px;border:1px solid rgba(158,240,224,.4);" +
      "background:rgba(4,20,28,.92);color:#E8F4F2;font:600 12px/1.35 system-ui,sans-serif;cursor:pointer;text-align:left;box-shadow:0 6px 18px rgba(0,0,0,.35)";
    var short = "Pregled bez servera";
    var long = "Pregled bez servera: račun, prijave i obrada rade samo u ovom pregledniku. Demo: korisnik / korisnik, služba: admin / admin (portal Obrada). Pritisni za zatvaranje.";
    b.textContent = short;
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open));
      b.style.borderRadius = open ? "999px" : "16px";
      b.textContent = open ? short : long;
    });
    document.body.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", badge); else badge();
})();
