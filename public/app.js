/*
 * ČistoMore — zajednička logika svih stranica
 * (polazište: app.js grupe 1 — showToast i spremanje izbora; proširenje za spojenu aplikaciju)
 *
 *  - gornja traka, lijevi izbornik (računalo) i donja traka (mobitel) u dizajnu grupe 4
 *  - tamni / svijetli način (localStorage "cm-mode") i jezik HR/EN ("cm-lang", ključ iz INTEGRACIJA.md)
 *  - obavijest showToast(msg) (grupa 1)
 *  - korisnička prijava (račun se čuva u "cm-user" kako bi aplikacija radila i bez signala)
 *  - prijave poslane bez signala čekaju u "cm-outbox" i šalju se kad se veza vrati
 *  - service worker (grupa 3) za rad bez signala
 *
 * Stranica označava:   <header data-cm-header data-cm-sub="sub.map">   gornju traku
 *                      <div data-cm-nav="map">                       izbornike (aktivna stavka)
 *                      <html data-auth="user">                       stranicu samo za prijavljene
 * Tekstovi:            data-t, data-t-html, data-t-aria, data-t-ph, data-t-title (ključevi iz CM.I18N)
 */
(function () {
  'use strict';

  var CM = window.CM = window.CM || {};
  var doc = document, root = doc.documentElement;
  var R = window.CM_ROUTING || null;
  var IS_ADMIN_APP = root.getAttribute('data-app') === 'admin';

  /* ---------- spremanje u preglednik ---------- */
  function sget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function sdel(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  function getJSON(k, def) { var v = sget(k); if (v == null) return def; try { return JSON.parse(v); } catch (e) { return def; } }
  function setJSON(k, v) { return sset(k, JSON.stringify(v)); }
  CM.sget = sget; CM.sset = sset; CM.sdel = sdel; CM.getJSON = getJSON; CM.setJSON = setJSON;

  function dispatch(name, detail) {
    var ev;
    try { ev = new CustomEvent(name, { detail: detail || {} }); }
    catch (e) { ev = doc.createEvent('CustomEvent'); ev.initCustomEvent(name, false, false, detail || {}); }
    window.dispatchEvent(ev);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  CM.esc = esc;

  /* =====================================================================
     Prijevodi (HR/EN)
     ===================================================================== */
  CM.I18N = CM.I18N || { hr: {}, en: {} };
  CM.addI18n = function (dict) {
    ['hr', 'en'].forEach(function (l) { if (dict && dict[l]) Object.keys(dict[l]).forEach(function (k) { CM.I18N[l][k] = dict[l][k]; }); });
  };
  CM.addI18n({
    hr: {
      'brand.name': 'ČistoMore',
      'ui.skip': 'Preskoči na sadržaj', 'ui.lang': 'Jezik',
      'ui.toLight': 'Uključi svijetli način', 'ui.toDark': 'Uključi tamni način',
      'ui.login': 'Prijavi se', 'ui.account': 'Moj profil: {name}',
      'nav.main': 'Glavna navigacija', 'nav.home': 'Početna', 'nav.map': 'Karta', 'nav.report': 'Nova prijava',
      'nav.log': 'Dnevnik', 'nav.plovi': 'Plovi odgovorno', 'nav.ploviShort': 'Plovi', 'nav.profile': 'Profil',
      'sub.home': 'Prijava otpadnih voda s brodova', 'sub.report': 'Obrazac za prijavu', 'sub.map': 'Prihvatna mjesta',
      'sub.plovi': 'Plovi odgovorno', 'sub.log': 'Moj dnevnik', 'sub.profile': 'Moj profil', 'sub.login': 'Korisnički račun',
      'st.pending': 'Čeka slanje', 'st.failed': 'Nije poslano',
      'sync.sent': 'Veza je vraćena. Poslano prijava: {n}.',
      'sync.needLogin': 'Prijave čekaju slanje. Prijavite se ponovno da ih pošaljemo.',
      'time.now': 'upravo sada', 'time.min': 'prije {n} min', 'time.today': 'danas u {t}', 'time.yesterday': 'jučer u {t}',
      'footer': 'ČistoMore · Hackathon 2026 · spojena aplikacija grupa 1–4'
    },
    en: {
      'brand.name': 'ČistoMore',
      'ui.skip': 'Skip to content', 'ui.lang': 'Language',
      'ui.toLight': 'Switch to light mode', 'ui.toDark': 'Switch to dark mode',
      'ui.login': 'Log in', 'ui.account': 'My profile: {name}',
      'nav.main': 'Main navigation', 'nav.home': 'Home', 'nav.map': 'Map', 'nav.report': 'New report',
      'nav.log': 'Logbook', 'nav.plovi': 'Sail responsibly', 'nav.ploviShort': 'Sail', 'nav.profile': 'Profile',
      'sub.home': 'Reporting wastewater from boats', 'sub.report': 'Report form', 'sub.map': 'Pump-out stations',
      'sub.plovi': 'Sail responsibly', 'sub.log': 'My logbook', 'sub.profile': 'My profile', 'sub.login': 'Your account',
      'st.pending': 'Waiting to send', 'st.failed': 'Not sent',
      'sync.sent': 'Back online. Reports sent: {n}.',
      'sync.needLogin': 'Reports are waiting to be sent. Log in again so we can send them.',
      'time.now': 'just now', 'time.min': '{n} min ago', 'time.today': 'today at {t}', 'time.yesterday': 'yesterday at {t}',
      'footer': 'ČistoMore · Hackathon 2026 · combined app of groups 1–4'
    }
  });

  var LANG_KEY = 'cm-lang';
  function detectLang() {
    var saved = sget(LANG_KEY);
    if (saved === 'hr' || saved === 'en') return saved;
    var nav = (navigator.language || 'hr').toLowerCase();
    return /^(hr|bs|sr|sl|cnr)/.test(nav) ? 'hr' : 'en';
  }
  CM.lang = IS_ADMIN_APP ? 'hr' : detectLang();
  root.lang = CM.lang;

  CM.t = function (key, vars) {
    var v = CM.I18N[CM.lang][key];
    if (v == null) v = CM.I18N.hr[key];
    if (v == null) return key;
    if (vars) v = String(v).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return v;
  };
  CM.applyI18n = function (scope) {
    scope = scope || doc;
    var list = function (sel) { return Array.prototype.slice.call(scope.querySelectorAll(sel)); };
    list('[data-t]').forEach(function (el) { el.textContent = CM.t(el.getAttribute('data-t')); });
    list('[data-t-html]').forEach(function (el) { el.innerHTML = CM.t(el.getAttribute('data-t-html')); });
    list('[data-t-aria]').forEach(function (el) { el.setAttribute('aria-label', CM.t(el.getAttribute('data-t-aria'))); });
    list('[data-t-ph]').forEach(function (el) { el.setAttribute('placeholder', CM.t(el.getAttribute('data-t-ph'))); });
    list('[data-t-title]').forEach(function (el) { el.setAttribute('title', CM.t(el.getAttribute('data-t-title'))); });
    list('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === CM.lang)); });
  };
  CM.setLang = function (l) {
    if ((l !== 'hr' && l !== 'en') || IS_ADMIN_APP) return;
    var changed = l !== CM.lang;
    CM.lang = l;
    sset(LANG_KEY, l);
    root.lang = l;
    CM.applyI18n();
    syncModeButton();
    syncAccountButton();
    if (changed) dispatch('cm:lang', { lang: l });
  };
  // nazivi iz dogovora (INTEGRACIJA.md, točka D)
  window.CM_getLang = function () { return CM.lang; };
  window.CM_setLang = CM.setLang;

  /* =====================================================================
     Tamni / svijetli način (paleta A „Dubina“ / paleta D „Ocean“)
     ===================================================================== */
  var MODE_KEY = 'cm-mode';
  (function migrate() {
    // grupa 4 je spremala izbor kao "po-mode"
    var old = sget('po-mode');
    if ((old === 'light' || old === 'dark') && !sget(MODE_KEY)) sset(MODE_KEY, old);
  })();
  CM.getMode = function () { return root.getAttribute('data-mode') === 'light' ? 'light' : 'dark'; };
  function updateThemeMeta() {
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', CM.getMode() === 'light' ? '#EEF7FA' : '#04141C');
  }
  CM.setMode = function (m, save) {
    if (m !== 'light' && m !== 'dark') return;
    root.setAttribute('data-mode', m);
    if (save !== false) sset(MODE_KEY, m);
    updateThemeMeta();
    syncModeButton();
    dispatch('cm:mode', { mode: m });
  };
  if (!root.getAttribute('data-mode')) {
    var savedMode = sget(MODE_KEY);
    root.setAttribute('data-mode', savedMode === 'light' || savedMode === 'dark' ? savedMode
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  }
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: light)');
    var onScheme = function () { if (!sget(MODE_KEY)) CM.setMode(mq.matches ? 'light' : 'dark', false); };
    if (mq.addEventListener) mq.addEventListener('change', onScheme); else if (mq.addListener) mq.addListener(onScheme);
  }
  // drugi prozor promijenio način ili jezik
  window.addEventListener('storage', function (e) {
    if (e.key === MODE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) CM.setMode(e.newValue, false);
    if (e.key === LANG_KEY && (e.newValue === 'hr' || e.newValue === 'en') && !IS_ADMIN_APP) CM.setLang(e.newValue);
    if (e.key === USER_KEY) { CM.user = getJSON(USER_KEY, null); syncAccountButton(); dispatch('cm:user', { user: CM.user }); }
  });

  /* =====================================================================
     Obavijest (grupa 1)
     ===================================================================== */
  var toastTimer;
  window.showToast = CM.toast = function (msg, ms) {
    var t = doc.getElementById('toast');
    if (!t) {
      t = doc.createElement('div');
      t.className = 'toast'; t.id = 'toast';
      t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite');
      doc.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, ms || 3600);
  };

  /* =====================================================================
     Oznake (vrste, statusi, plovila…) na odabranom jeziku
     ===================================================================== */
  function pair(list, hr) { for (var i = 0; i < list.length; i++) if (list[i][0] === hr) return CM.lang === 'en' ? list[i][1] : list[i][0]; return hr; }
  CM.label = {
    status: function (k) { var s = R && R.STATUS[k]; return s ? (CM.lang === 'en' ? s.en : s.label) : k; },
    type: function (k) { var s = R && R.TYPES[k]; return s ? (CM.lang === 'en' ? s.en : s.label) : k; },
    vessel: function (v) { return v && R ? pair(R.VESSELS, v) : (v || ''); },
    size: function (v) { return v && R ? pair(R.SIZES, v) : (v || ''); },
    waste: function (k) { var s = R && R.WASTE[k]; return s ? (CM.lang === 'en' ? s.en : s.label) : (k || ''); },
    dir: function (deg) { return R ? R.dirName(deg, CM.lang) : String(deg); },
    service: function (id) { return R ? R.svcName(id, CM.lang) : id; }
  };

  /* ---------- vrijeme (po uzoru na fmtWhen grupe 3) ---------- */
  function locale() { return CM.lang === 'en' ? 'en-GB' : 'hr-HR'; }
  CM.fmtTime = function (d) { return new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit' }).format(d); };
  CM.fmtDate = function (d, long) {
    return new Intl.DateTimeFormat(locale(), long ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'numeric', year: 'numeric' }).format(d);
  };
  CM.fmtDateTime = function (iso) { var d = new Date(iso); return CM.fmtDate(d) + ' ' + CM.fmtTime(d); };
  function dayKey(d) { return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); }
  CM.fmtWhen = function (iso) {
    var d = new Date(iso), now = new Date(), m = Math.round((now - d) / 60000);
    if (m < 1 && m > -2) return CM.t('time.now');
    if (m >= 1 && m < 60) return CM.t('time.min', { n: m });
    if (dayKey(d) === dayKey(now)) return CM.t('time.today', { t: CM.fmtTime(d) });
    var y = new Date(now.getTime() - 86400000);
    if (dayKey(d) === dayKey(y)) return CM.t('time.yesterday', { t: CM.fmtTime(d) });
    return CM.fmtDateTime(iso);
  };

  /* =====================================================================
     Poziv servera
     ===================================================================== */
  CM.isOnline = function () { return navigator.onLine !== false; };
  // Mrežna greška (bez signala, server ugašen) baca grešku s .network = true;
  // HTTP greška vraća { ok:false, status, data }.
  CM.api = function (method, path, body, opts) {
    opts = opts || {};
    if (!CM.isOnline()) { var off = new Error('offline'); off.network = true; return Promise.reject(off); }
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, opts.timeout || 20000) : null;
    var init = { method: method, credentials: 'same-origin', cache: 'no-store', headers: {} };
    if (body !== undefined) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(body); }
    if (ctrl) init.signal = ctrl.signal;
    return fetch(path, init).then(function (res) {
      clearTimeout(timer);
      return res.text().then(function (txt) {
        var data = null;
        try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = null; }
        return { ok: res.ok, status: res.status, data: data || {} };
      });
    }, function () {
      clearTimeout(timer);
      var e = new Error('network'); e.network = true; throw e;
    });
  };

  function uuid() {
    if (window.crypto && crypto.randomUUID) { try { return crypto.randomUUID(); } catch (e) { /* nesiguran kontekst */ } }
    var b = new Uint8Array(16);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(b);
    else for (var i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
    return Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }
  CM.uuid = uuid;

  /* =====================================================================
     Korisnička prijava
     ===================================================================== */
  var USER_KEY = 'cm-user';
  var MYREP_KEY = 'cm-my-reports';
  CM.user = getJSON(USER_KEY, null);
  CM.setUser = function (u) {
    CM.user = u || null;
    if (u) setJSON(USER_KEY, u); else sdel(USER_KEY);
    syncAccountButton();
    dispatch('cm:user', { user: CM.user });
  };
  CM.loginUrl = function () {
    var here = location.pathname.replace(/^.*\//, '') || 'index.html';
    return 'login.html?next=' + encodeURIComponent(here + location.search);
  };
  // Provjera sesije kod servera. Bez signala ostaje zapamćeni račun.
  CM.refreshUser = function () {
    return CM.api('GET', '/api/me').then(function (r) {
      if (r.ok && r.data.user) { CM.setUser(r.data.user); return CM.user; }
      if ((r.ok && !r.data.user) || r.status === 401) { CM.setUser(null); return null; }
      return CM.user;
    }, function () { return CM.user; });
  };
  CM.requireUser = function () {
    if (!CM.user) { location.replace(CM.loginUrl()); return false; }
    CM.refreshUser().then(function (u) { if (!u) location.replace(CM.loginUrl()); });
    return true;
  };
  CM.logout = function () {
    var done = function () { CM.setUser(null); sdel(MYREP_KEY); location.href = 'index.html'; };
    CM.api('POST', '/api/logout', {}).then(done, done);
  };

  /* ---------- moje prijave (spremljene i za rad bez signala) ---------- */
  CM.cachedReports = function () {
    var c = getJSON(MYREP_KEY, null);
    return c && CM.user && c.userId === CM.user.id && Array.isArray(c.reports) ? c.reports : [];
  };
  function cacheReports(list) { if (CM.user) setJSON(MYREP_KEY, { userId: CM.user.id, at: new Date().toISOString(), reports: list }); }
  function upsertCached(rep) {
    var list = CM.cachedReports().filter(function (x) { return x.id !== rep.id; });
    list.unshift(rep);
    cacheReports(list);
  }
  CM.fetchMyReports = function () {
    if (!CM.user) return Promise.resolve([]);
    return CM.api('GET', '/api/my/reports').then(function (r) {
      if (r.ok && Array.isArray(r.data.reports)) { cacheReports(r.data.reports); return r.data.reports; }
      if (r.status === 401) { CM.setUser(null); }
      return CM.cachedReports();
    }, function () { return CM.cachedReports(); });
  };

  /* =====================================================================
     Prijave bez signala: red čekanja (outbox) i slanje
     ===================================================================== */
  var OUTBOX_KEY = 'cm-outbox';
  CM.outbox = {
    all: function () { var o = getJSON(OUTBOX_KEY, []); return Array.isArray(o) ? o : []; },
    mine: function () { var id = CM.user && CM.user.id; return CM.outbox.all().filter(function (x) { return x.userId === id; }); },
    add: function (item) {
      var list = CM.outbox.all();
      list.push(item);
      if (setJSON(OUTBOX_KEY, list)) return true;
      // premalo prostora: spremi bez fotografija
      item.photos = []; item.photosDropped = true;
      list[list.length - 1] = item;
      return setJSON(OUTBOX_KEY, list) ? 'nophotos' : false;
    },
    remove: function (clientId) { setJSON(OUTBOX_KEY, CM.outbox.all().filter(function (x) { return x.payload.clientId !== clientId; })); },
    update: function (clientId, patch) {
      setJSON(OUTBOX_KEY, CM.outbox.all().map(function (x) {
        if (x.payload.clientId === clientId) Object.keys(patch).forEach(function (k) { x[k] = patch[k]; });
        return x;
      }));
    }
  };

  // Šalje novu prijavu. Rezultat: {status:'sent', report} | {status:'queued', photos:'ok'|'dropped'}
  //                                | {status:'needLogin'} | {status:'error', code}
  CM.submitReport = function (payload) {
    payload.clientId = payload.clientId || uuid();
    payload.submittedAt = new Date().toISOString();
    var queue = function () {
      var r = CM.outbox.add({ userId: CM.user && CM.user.id, payload: payload, queuedAt: payload.submittedAt });
      if (!r) return { status: 'error', code: 'storage_full' };
      ensureSyncTimer();
      return { status: 'queued', photos: r === 'nophotos' ? 'dropped' : 'ok' };
    };
    return CM.api('POST', '/api/reports', payload, { timeout: 30000 }).then(function (r) {
      if (r.ok && r.data.report) { upsertCached(r.data.report); return { status: 'sent', report: r.data.report }; }
      if (r.status === 401) { var q = queue(); CM.setUser(null); return q.status === 'queued' ? { status: 'needLogin' } : q; }
      if (r.status >= 500) return queue();
      return { status: 'error', code: (r.data && r.data.error) || ('http_' + r.status) };
    }, function () { return queue(); });
  };

  var syncing = false, syncTimer = null;
  CM.sync = function () {
    if (syncing || !CM.user || !CM.isOnline()) return Promise.resolve(0);
    var items = CM.outbox.mine().filter(function (x) { return !x.error; });
    if (!items.length) return Promise.resolve(0);
    syncing = true;
    var sent = 0;
    var next = function (i) {
      if (i >= items.length) return Promise.resolve();
      var it = items[i];
      return CM.api('POST', '/api/reports', it.payload, { timeout: 30000 }).then(function (r) {
        if (r.ok && r.data.report) { CM.outbox.remove(it.payload.clientId); upsertCached(r.data.report); sent++; return next(i + 1); }
        if (r.status === 401) { CM.setUser(null); CM.toast(CM.t('sync.needLogin'), 6000); return; }
        if (r.status >= 400 && r.status < 500) { CM.outbox.update(it.payload.clientId, { error: (r.data && r.data.error) || ('http_' + r.status) }); return next(i + 1); }
        return; // greška servera: pokušaj kasnije
      }, function () { /* još nema veze */ });
    };
    return next(0).then(function () {
      syncing = false;
      if (sent) { CM.toast(CM.t('sync.sent', { n: sent })); dispatch('cm:sync', { sent: sent }); }
      if (!CM.outbox.mine().filter(function (x) { return !x.error; }).length) { clearInterval(syncTimer); syncTimer = null; }
      return sent;
    });
  };
  function ensureSyncTimer() {
    if (!syncTimer) syncTimer = setInterval(function () { CM.sync(); }, 30000);
  }
  window.addEventListener('online', function () { setTimeout(CM.sync, 800); });
  doc.addEventListener('visibilitychange', function () { if (doc.visibilityState === 'visible') CM.sync(); });

  /* =====================================================================
     Gornja traka i izbornici (dizajn grupe 4, stavke prema INTEGRACIJA.md, točka C)
     ===================================================================== */
  var ICON = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
    map: '<path d="M9 20 3 17V4l6 3m0 13 6-3m-6 3V7m6 10 6 3V7l-6-3m0 16V4m0 3-6-3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    sail: '<path d="M12 3v14"/><path d="M12 4l7 11h-7"/><path d="M10 7l-5 8h5"/><path d="M3 18h18l-2 3H5z"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 6-6 8-6s6.5 2 8 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/>',
    boat: '<path d="M3 17c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/><path d="M3 21c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/><path d="M5 17V9a2 2 0 0 1 2-2h2V4h6v3h2a2 2 0 0 1 2 2v8"/><path d="M9 11h6"/>'
  };
  function svg(name, size, sw) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 20) + '" height="' + (size || 20) + '" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>';
  }
  CM.icon = svg;

  var NAV = [
    { key: 'home', href: 'index.html', icon: 'home', label: 'nav.home', rail: true, bottom: true },
    { key: 'map', href: 'map.html', icon: 'map', label: 'nav.map', rail: true, bottom: true },
    { key: 'report', href: 'report.html', icon: 'plus', label: 'nav.report', rail: true, bottom: true, fab: true },
    { key: 'log', href: 'book.html', icon: 'book', label: 'nav.log', rail: true, bottom: false },
    { key: 'plovi', href: 'plovi-odgovorno.html', icon: 'sail', label: 'nav.plovi', short: 'nav.ploviShort', rail: true, bottom: true },
    { key: 'profile', href: 'profile.html', icon: 'profile', label: 'nav.profile', rail: true, bottom: true }
  ];

  function renderNav(host) {
    var active = host.getAttribute('data-cm-nav');
    var item = function (n, where) {
      var on = n.key === active;
      var cur = on ? ' aria-current="page"' : '';
      if (n.fab) {
        return '<a class="nav-fab' + (on ? ' active' : '') + '" href="' + n.href + '"' + cur +
          (where === 'bottom' ? ' data-t-aria="' + n.label + '" aria-label="' + esc(CM.t(n.label)) + '">' + svg(n.icon, 24, 2.6) + '</a>'
            : '>' + svg(n.icon, 20, 2.4) + '<span class="nlabel" data-t="' + n.label + '">' + esc(CM.t(n.label)) + '</span></a>');
      }
      var lab = where === 'bottom' && n.short ? n.short : n.label;
      return '<a class="nav-item' + (on ? ' active' : '') + '" href="' + n.href + '"' + cur + '>' + svg(n.icon, where === 'bottom' ? 22 : 20) +
        '<span class="nlabel" data-t="' + lab + '">' + esc(CM.t(lab)) + '</span></a>';
    };
    host.innerHTML =
      '<nav class="sidenav" data-t-aria="nav.main" aria-label="' + esc(CM.t('nav.main')) + '">' + NAV.filter(function (n) { return n.rail; }).map(function (n) { return item(n, 'rail'); }).join('') + '</nav>' +
      '<nav class="bottomnav" data-t-aria="nav.main" aria-label="' + esc(CM.t('nav.main')) + '">' + NAV.filter(function (n) { return n.bottom; }).map(function (n) { return item(n, 'bottom'); }).join('') + '</nav>';
  }

  function renderHeader(host) {
    var sub = host.getAttribute('data-cm-sub') || 'sub.home';
    host.classList.add('po-top');
    if (!host.hasAttribute('data-cm-overlay')) host.classList.add('is-solid');
    if (!host.id) host.id = 'po-top';
    host.innerHTML =
      '<a class="po-brand" href="index.html">' +
        '<span class="po-brand-badge" aria-hidden="true">' + svg('boat', 18) + '</span>' +
        '<span class="po-brand-text"><span class="po-brand-name" data-t="brand.name">ČistoMore</span>' +
        '<span class="po-brand-sub" data-t="' + esc(sub) + '">' + esc(CM.t(sub)) + '</span></span>' +
      '</a>' +
      '<div class="po-top-actions">' +
        '<button type="button" class="po-mode" id="po-mode"></button>' +
        '<div class="po-lang" role="group" data-t-aria="ui.lang" aria-label="' + esc(CM.t('ui.lang')) + '">' +
          '<button type="button" data-lang="hr" lang="hr" aria-label="Hrvatski" aria-pressed="' + (CM.lang === 'hr') + '">HR</button>' +
          '<button type="button" data-lang="en" lang="en" aria-label="English" aria-pressed="' + (CM.lang === 'en') + '">EN</button>' +
        '</div>' +
        '<a class="po-account" id="po-account" href="profile.html"></a>' +
      '</div>';
    host.querySelector('#po-mode').addEventListener('click', function () { CM.setMode(CM.getMode() === 'light' ? 'dark' : 'light', true); });
    Array.prototype.forEach.call(host.querySelectorAll('[data-lang]'), function (b) {
      b.addEventListener('click', function () { CM.setLang(b.getAttribute('data-lang')); });
    });
    syncModeButton();
    syncAccountButton();
  }

  function syncModeButton() {
    var btn = doc.getElementById('po-mode');
    if (!btn) return;
    var light = CM.getMode() === 'light';
    var label = CM.t(light ? 'ui.toDark' : 'ui.toLight');
    btn.innerHTML = svg(light ? 'moon' : 'sun', 18);
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }
  function initials(name) {
    var p = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return '?';
    return ((p[0][0] || '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }
  function syncAccountButton() {
    var a = doc.getElementById('po-account');
    if (!a) return;
    var onProfile = /(^|\/)profile\.html$/.test(location.pathname);
    if (CM.user) {
      a.className = 'po-account is-user' + (onProfile ? ' is-current' : '');
      a.href = 'profile.html';
      a.textContent = initials(CM.user.name || CM.user.username);
      var l = CM.t('ui.account', { name: CM.user.name || CM.user.username });
      a.setAttribute('aria-label', l); a.setAttribute('title', l);
    } else {
      a.className = 'po-account';
      a.href = CM.loginUrl();
      a.innerHTML = svg('login', 18);
      a.setAttribute('aria-label', CM.t('ui.login')); a.setAttribute('title', CM.t('ui.login'));
    }
  }

  CM.renderChrome = function () {
    var hdr = doc.querySelector('[data-cm-header]');
    if (hdr) renderHeader(hdr);
    var nav = doc.querySelector('[data-cm-nav]');
    if (nav) renderNav(nav);
  };

  /* =====================================================================
     Pokretanje
     ===================================================================== */
  updateThemeMeta();
  if (!IS_ADMIN_APP) {
    CM.renderChrome();
    CM.applyI18n();
    var welcome = sget('cm-welcome');
    if (welcome) { sdel('cm-welcome'); setTimeout(function () { CM.toast(welcome); }, 300); }
    if (root.getAttribute('data-auth') === 'user') CM.requireUser();
    else if (CM.user) CM.refreshUser();
    if (CM.outbox.mine().length) { ensureSyncTimer(); setTimeout(CM.sync, 1500); }
  }
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* nije podržano */ }); });
  }
})();
