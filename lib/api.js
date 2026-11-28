'use strict';
/*
 * ČistoMore – API za prijave i račune
 *
 * Korisnici (građani, nautičari)          Nadležne službe (portal obrada.html)
 *   POST /api/register                     POST /api/admin/login
 *   POST /api/login                        POST /api/admin/logout
 *   POST /api/logout                       GET  /api/admin/me
 *   GET  /api/me                           GET  /api/admin/reports
 *   PATCH /api/me        (ime, slika)
 *   POST /api/me/password (promjena lozinke)
 *   GET  /api/my/reports                   POST /api/admin/reports        (unos prijave zaprimljene telefonom)
 *   POST /api/reports                      PATCH /api/admin/reports/:id   (status, služba, povijest)
 *   GET  /api/photos/:id                   POST /api/admin/warnings       (upozorenje o nanosu)
 *                                          POST /api/admin/reset          (vrati početne demo podatke)
 *
 * Korisnička i administratorska prijava su odvojene: različiti kolačići (cm_user, cm_admin),
 * a korisnički račun ne može otvoriti portal službi niti obrnuto.
 */
const R = require('../public/routing.js');
const { seedReports, DEMO_USERS } = require('./seed.js');

const USER_COOKIE = 'cm_user';
const ADMIN_COOKIE = 'cm_admin';
const USER_TTL = 30 * 24 * 3600 * 1000;   // 30 dana
const ADMIN_TTL = 7 * 24 * 3600 * 1000;   // 7 dana
const BODY_LIMIT = 16 * 1024 * 1024;      // do 4 fotografije u base64
const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const HEADINGS = [0, 45, 90, 135, 180, 225, 270, 315];
const VESSEL_NAMES = R.VESSELS.map(v => v[0]);
const SIZE_NAMES = R.SIZES.map(s => s[0]);

class HttpError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}

/* ---------------- pomoćne funkcije ---------------- */
function parseCookies(req) {
  const out = {};
  const h = req.headers.cookie;
  if (!h) return out;
  for (const part of h.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim(), v = part.slice(i + 1).trim();
    if (k) { try { out[k] = decodeURIComponent(v); } catch { out[k] = v; } }
  }
  return out;
}
function isHttps(req) {
  return req.socket.encrypted || (req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https';
}
function cookie(req, name, value, maxAgeMs) {
  const parts = [name + '=' + (value ? encodeURIComponent(value) : ''), 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  parts.push('Max-Age=' + (value ? Math.floor(maxAgeMs / 1000) : 0));
  if (isHttps(req)) parts.push('Secure');
  return parts.join('; ');
}
function json(res, status, obj, extraHeaders) {
  const body = obj === undefined ? '' : JSON.stringify(obj);
  const headers = Object.assign({ 'Cache-Control': 'no-store' }, extraHeaders || {});
  if (body) headers['Content-Type'] = 'application/json; charset=utf-8';
  res.writeHead(status, headers);
  res.end(res.req.method === 'HEAD' ? undefined : body);
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    const type = (req.headers['content-type'] || '').toLowerCase();
    if (!type.startsWith('application/json')) return reject(new HttpError(415, 'json_required'));
    const declared = Number(req.headers['content-length'] || 0);
    if (declared > BODY_LIMIT) return reject(new HttpError(413, 'too_large'));
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > BODY_LIMIT) { reject(new HttpError(413, 'too_large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { const v = JSON.parse(Buffer.concat(chunks).toString('utf8')); resolve(v && typeof v === 'object' && !Array.isArray(v) ? v : {}); }
      catch { reject(new HttpError(400, 'bad_json')); }
    });
    req.on('error', () => reject(new HttpError(400, 'bad_request')));
  });
}
const delay = ms => new Promise(r => setTimeout(r, ms));
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
function isoOrNull(v) {
  if (typeof v !== 'string' || v.length > 40) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}
const fmtStamp = iso => new Intl.DateTimeFormat('hr-HR', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zagreb' }).format(new Date(iso));

function publicUser(u) { return u ? { id: u.id, username: u.username, name: u.name, createdAt: u.created_at, avatar: u.avatar || null } : null; }
const MAX_AVATAR_BYTES = 300 * 1024;
// Profilna slika: data URL (JPEG/PNG/WebP, do 300 KB), ili null za uklanjanje
function validAvatar(v) {
  if (v === null) return null;
  if (typeof v !== 'string' || v.length > MAX_AVATAR_BYTES * 1.4) throw new HttpError(400, 'invalid_avatar');
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(v);
  if (!m) throw new HttpError(400, 'invalid_avatar');
  if (Buffer.from(m[2], 'base64').length > MAX_AVATAR_BYTES) throw new HttpError(413, 'avatar_too_large');
  return v;
}

/* ---------------- prikazi prijave ---------------- */
// Za službe: sve, uz interne bilješke (povijest) i razloge usmjeravanja.
function adminView(r, photoIds) {
  return {
    id: r.id, type: r.type, wasteType: r.wasteType || null, lat: r.lat, lng: r.lng, place: r.place, desc: r.desc || '',
    createdAt: r.createdAt, eventAt: r.eventAt || r.createdAt, updatedAt: r.updatedAt,
    status: r.status, statusHistory: r.statusHistory || [],
    vessel: r.vessel || null, vesselSize: r.vesselSize || null, vesselColor: r.vesselColor || null, registration: r.registration || null,
    heading: r.heading == null ? null : r.heading, observer: r.observer || null,
    service: r.service, reasons: r.reasons || [], county: r.county, confirmed: !!r.confirmed, history: r.history || [],
    photos: photoIds || [], source: r.source || 'gradjanin',
    reporter: r.reporterName ? { name: r.reporterName, username: r.reporterUsername } : null
  };
}
// Za prijavitelja: ono što vidi građanin (grupa 3, „Što vidi prijavitelj“): status, služba, zadnja promjena.
function userView(r, photoIds) {
  const h = r.history || [];
  return {
    id: r.id, clientId: r.clientId || null, type: r.type, wasteType: r.wasteType || null, lat: r.lat, lng: r.lng, place: r.place, desc: r.desc || '',
    createdAt: r.createdAt, eventAt: r.eventAt || r.createdAt,
    status: r.status, statusHistory: r.statusHistory || [],
    vessel: r.vessel || null, vesselSize: r.vesselSize || null, vesselColor: r.vesselColor || null, registration: r.registration || null,
    heading: r.heading == null ? null : r.heading, observer: r.observer || null,
    service: r.service, confirmed: !!r.confirmed,
    lastChange: h.length ? h[h.length - 1].t : r.createdAt,
    photos: photoIds || []
  };
}

/* ---------------- provjera nove prijave ---------------- */
function decodePhoto(dataUrl) {
  if (typeof dataUrl !== 'string') throw new HttpError(400, 'invalid_photo');
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) throw new HttpError(400, 'invalid_photo');
  const buf = Buffer.from(m[2], 'base64');
  if (!buf.length || buf.length > MAX_PHOTO_BYTES) throw new HttpError(413, 'photo_too_large');
  return { mime: m[1], buf };
}
function validateReport(b) {
  const type = String(b.type || '');
  if (!R.TYPES[type]) throw new HttpError(400, 'invalid_type');
  const lat = Number(b.lat), lng = Number(b.lng);
  if (!isFinite(lat) || !isFinite(lng)) throw new HttpError(400, 'location_required');
  if (!R.inCroatiaBox(lat, lng)) throw new HttpError(400, 'outside_croatia');
  const isVessel = !!R.TYPES[type].vessel;

  const now = Date.now();
  let eventAt = isoOrNull(b.eventAt);
  if (b.eventAt != null && b.eventAt !== '' && !eventAt) throw new HttpError(400, 'invalid_event_time');
  if (eventAt) {
    const t = new Date(eventAt).getTime();
    if (t > now + 10 * 60000 || t < now - 366 * 86400000) throw new HttpError(400, 'invalid_event_time');
  }

  let vessel = null, vesselSize = null, vesselColor = null, registration = null, heading = null, wasteType = null;
  if (isVessel) {
    vessel = str(b.vessel, 60);
    if (!VESSEL_NAMES.includes(vessel)) throw new HttpError(400, 'vessel_required');
    vesselSize = str(b.vesselSize, 60) || null;
    if (vesselSize && !SIZE_NAMES.includes(vesselSize)) throw new HttpError(400, 'invalid_size');
    vesselColor = str(b.vesselColor, 7) || null;
    if (vesselColor && !/^#[0-9a-fA-F]{6}$/.test(vesselColor)) throw new HttpError(400, 'invalid_color');
    if (vesselColor) vesselColor = vesselColor.toLowerCase();
    registration = str(b.registration, 30) || null;
  }
  if (type === 'fekalne') {
    if (b.heading != null && b.heading !== '') {
      heading = Number(b.heading);
      if (!HEADINGS.includes(heading)) throw new HttpError(400, 'invalid_heading');
    }
    wasteType = str(b.wasteType, 20) || null;
    if (wasteType && !R.WASTE[wasteType]) throw new HttpError(400, 'invalid_waste_type');
  }
  let observer = null;
  if (b.observer && typeof b.observer === 'object') {
    const onLand = !!b.observer.onLand;
    let bearing = b.observer.bearing;
    bearing = bearing == null || bearing === '' ? null : Number(bearing);
    if (bearing != null && (!isFinite(bearing) || bearing < 0 || bearing >= 360)) throw new HttpError(400, 'invalid_bearing');
    if (bearing != null) bearing = Math.round(bearing) % 360;
    if (onLand || bearing != null) observer = { onLand, bearing };
  }
  const desc = str(b.desc, 1000);
  const photos = Array.isArray(b.photos) ? b.photos : [];
  if (photos.length > MAX_PHOTOS) throw new HttpError(400, 'too_many_photos');
  const decoded = photos.map(decodePhoto);
  let clientId = null;
  if (b.clientId != null) {
    clientId = String(b.clientId);
    if (!/^[A-Za-z0-9_-]{8,64}$/.test(clientId)) throw new HttpError(400, 'invalid_client_id');
  }
  const submittedAt = isoOrNull(b.submittedAt);
  return { type, lat, lng, eventAt, wasteType, vessel, vesselSize, vesselColor, registration, heading, observer, desc, decoded, clientId, submittedAt };
}

/* ---------------- API ---------------- */
function createApi(db) {

  function currentUser(req, kind) {
    const c = parseCookies(req)[kind === 'admin' ? ADMIN_COOKIE : USER_COOKIE];
    return c ? db.sessionUser(c, kind) : null;
  }
  function requireUser(req) { const u = currentUser(req, 'user'); if (!u) throw new HttpError(401, 'unauthorized'); return u; }
  function requireAdmin(req) { const u = currentUser(req, 'admin'); if (!u) throw new HttpError(401, 'unauthorized'); return u; }

  function createReport(input, { userId, source }) {
    const existing = input.clientId ? db.getReportByClientId(input.clientId) : null;
    if (existing) {
      // ista prijava poslana ponovno (npr. nakon prekida veze) – ne stvara se duplikat
      if (existing.userId !== (userId == null ? null : userId)) throw new HttpError(409, 'duplicate');
      return { report: existing, created: false };
    }
    const rt = R.route(input.lat, input.lng, input.type);
    const now = new Date().toISOString();
    const history = [{ t: now, text: 'Prijava zaprimljena. Automatski prijedlog: ' + R.svcName(rt.service) }];
    if (input.submittedAt && Date.now() - new Date(input.submittedAt).getTime() > 2 * 60000) {
      history.push({ t: now, text: 'Prijava je poslana bez signala (' + fmtStamp(input.submittedAt) + '), a zaprimljena nakon povratka veze' });
    }
    if (source === 'sluzba') history.push({ t: now, text: 'Prijavu je unijela služba (npr. dojava telefonom)' });
    const id = db.tx(() => {
      const newId = db.nextReportId();
      db.insertReport({
        id: newId, clientId: input.clientId, userId, createdAt: now,
        data: {
          type: input.type, lat: input.lat, lng: input.lng, place: R.placeFor(input.lat, input.lng), desc: input.desc,
          eventAt: input.eventAt || now, wasteType: input.wasteType,
          vessel: input.vessel, vesselSize: input.vesselSize, vesselColor: input.vesselColor, registration: input.registration,
          heading: input.heading, observer: input.observer,
          status: 'zaprimljeno', statusHistory: [{ status: 'zaprimljeno', t: now }],
          service: rt.service, reasons: rt.reasons, county: rt.county, confirmed: false, history, source
        }
      });
      input.decoded.forEach((p, i) => db.insertPhoto(newId, i, p.mime, p.buf));
      return newId;
    });
    return { report: db.getReport(id), created: true };
  }

  const routes = [];
  const on = (method, pattern, fn) => routes.push({ method, pattern, fn });

  /* ----- korisnici ----- */
  on('POST', /^\/api\/register$/, async (req, res) => {
    const b = await readJson(req);
    const username = str(b.username, 40), name = str(b.name, 60), password = typeof b.password === 'string' ? b.password : '';
    if (!/^[A-Za-z0-9._-]{3,32}$/.test(username)) throw new HttpError(400, 'invalid_username');
    if (name.length < 2) throw new HttpError(400, 'invalid_name');
    if (password.length < 6 || password.length > 200) throw new HttpError(400, 'weak_password');
    if (db.userExists(username)) throw new HttpError(409, 'username_taken');
    let user;
    try { user = db.createUser({ username, name, password, role: 'user' }); }
    catch (e) { if (/UNIQUE/i.test(e.message)) throw new HttpError(409, 'username_taken'); throw e; }
    const token = db.createSession(user.id, 'user', USER_TTL);
    json(res, 201, { user: publicUser(user) }, { 'Set-Cookie': cookie(req, USER_COOKIE, token, USER_TTL) });
  });
  on('POST', /^\/api\/login$/, async (req, res) => {
    const b = await readJson(req);
    const user = db.findUser(str(b.username, 40));
    const ok = user && user.role === 'user' && db.checkPassword(user, typeof b.password === 'string' ? b.password : '');
    if (!ok) { await delay(300); throw new HttpError(401, 'invalid_credentials'); }
    const token = db.createSession(user.id, 'user', USER_TTL);
    json(res, 200, { user: publicUser(user) }, { 'Set-Cookie': cookie(req, USER_COOKIE, token, USER_TTL) });
  });
  on('POST', /^\/api\/logout$/, async (req, res) => {
    db.deleteSession(parseCookies(req)[USER_COOKIE]);
    json(res, 200, { ok: true }, { 'Set-Cookie': cookie(req, USER_COOKIE, '', 0) });
  });
  // Ima li demo račun još početnu lozinku? Samo tada stranice za prijavu prikazuju demo podatke.
  // Rezultat se pamti dok se lozinka ne promijeni (scrypt je spor).
  const demoCache = {};
  function hasDemoPassword(username) {
    const demo = DEMO_USERS.find(d => d.username === username);
    const user = demo && db.findUser(username);
    if (!user) return false;
    const key = user.salt + ':' + user.hash;
    if (!demoCache[username] || demoCache[username].key !== key) demoCache[username] = { key, ok: db.checkPassword(user, demo.password) };
    return demoCache[username].ok;
  }

  // „Tko je prijavljen?“ – bez prijave vraća user: null (200), da javne stranice nemaju grešku u konzoli
  on('GET', /^\/api\/me$/, async (req, res) => {
    json(res, 200, { user: publicUser(currentUser(req, 'user')), demo: hasDemoPassword('korisnik') });
  });
  // Uređivanje profila: ime i/ili profilna slika
  on('PATCH', /^\/api\/me$/, async (req, res) => {
    const u = requireUser(req);
    const b = await readJson(req);
    const patch = {};
    if (b.name !== undefined) {
      const name = str(b.name, 60);
      if (name.length < 2) throw new HttpError(400, 'invalid_name');
      patch.name = name;
    }
    if (b.avatar !== undefined) patch.avatar = validAvatar(b.avatar);
    json(res, 200, { user: publicUser(db.updateProfile(u.id, patch)) });
  });
  // Promjena lozinke: traži trenutnu; ostali uređaji se odjave, ovaj ostaje prijavljen
  on('POST', /^\/api\/me\/password$/, async (req, res) => {
    const u = requireUser(req);
    const b = await readJson(req);
    const full = db.getUserFull(u.id);
    const current = typeof b.current === 'string' ? b.current : '', next = typeof b.next === 'string' ? b.next : '';
    if (!db.checkPassword(full, current)) { await delay(300); throw new HttpError(400, 'wrong_password'); }
    if (next.length < 6 || next.length > 200) throw new HttpError(400, 'weak_password');
    db.changePassword(u.id, next, parseCookies(req)[USER_COOKIE]);
    json(res, 200, { ok: true });
  });
  on('GET', /^\/api\/my\/reports$/, async (req, res) => {
    const u = requireUser(req);
    const photos = db.photoIdMap();
    json(res, 200, { reports: db.listReportsByUser(u.id).map(r => userView(r, photos[r.id])), serverTime: new Date().toISOString() });
  });
  on('POST', /^\/api\/reports$/, async (req, res) => {
    const u = requireUser(req);
    const input = validateReport(await readJson(req));
    const { report, created } = createReport(input, { userId: u.id, source: 'gradjanin' });
    json(res, created ? 201 : 200, { report: userView(report, db.photoIds(report.id)) });
  });
  on('GET', /^\/api\/photos\/(\d{1,10})$/, async (req, res, m) => {
    const p = db.getPhoto(m[1]);
    if (!p) throw new HttpError(404, 'not_found');
    const admin = currentUser(req, 'admin');
    const user = admin ? null : currentUser(req, 'user');
    if (!admin && !(user && p.user_id === user.id)) throw new HttpError(user ? 403 : 401, user ? 'forbidden' : 'unauthorized');
    const buf = Buffer.from(p.data);
    res.writeHead(200, { 'Content-Type': p.mime, 'Content-Length': buf.length, 'Cache-Control': 'private, max-age=86400', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : buf);
  });

  /* ----- nadležne službe ----- */
  on('POST', /^\/api\/admin\/login$/, async (req, res) => {
    const b = await readJson(req);
    const user = db.findUser(str(b.username, 40));
    const ok = user && user.role === 'admin' && db.checkPassword(user, typeof b.password === 'string' ? b.password : '');
    if (!ok) { await delay(300); throw new HttpError(401, 'invalid_credentials'); }
    const token = db.createSession(user.id, 'admin', ADMIN_TTL);
    json(res, 200, { user: publicUser(user) }, { 'Set-Cookie': cookie(req, ADMIN_COOKIE, token, ADMIN_TTL) });
  });
  on('POST', /^\/api\/admin\/logout$/, async (req, res) => {
    db.deleteSession(parseCookies(req)[ADMIN_COOKIE]);
    json(res, 200, { ok: true }, { 'Set-Cookie': cookie(req, ADMIN_COOKIE, '', 0) });
  });
  on('GET', /^\/api\/admin\/me$/, async (req, res) => {
    json(res, 200, { user: publicUser(currentUser(req, 'admin')), demo: hasDemoPassword('admin') });
  });
  on('GET', /^\/api\/admin\/reports$/, async (req, res) => {
    requireAdmin(req);
    const photos = db.photoIdMap();
    json(res, 200, { reports: db.listReports().map(r => adminView(r, photos[r.id])), warnings: db.warnings(), serverTime: new Date().toISOString() });
  });
  on('POST', /^\/api\/admin\/reports$/, async (req, res) => {
    requireAdmin(req);
    const input = validateReport(await readJson(req));
    const { report, created } = createReport(input, { userId: null, source: 'sluzba' });
    json(res, created ? 201 : 200, { report: adminView(report, db.photoIds(report.id)) });
  });
  on('PATCH', /^\/api\/admin\/reports\/(\d{4}-\d{1,9})$/, async (req, res, m) => {
    requireAdmin(req);
    const b = await readJson(req);
    const r = db.getReport(m[1]);
    if (!r) throw new HttpError(404, 'not_found');
    const now = Date.now();
    const created = new Date(r.createdAt).getTime();
    const okTime = iso => { const t = new Date(iso).getTime(); return t >= created - 60000 && t <= now + 5 * 60000; };
    if (b.status != null) {
      if (!R.ORDER.includes(b.status)) throw new HttpError(400, 'invalid_status');
      if (b.status !== r.status) {
        const at = isoOrNull(b.statusAt);
        r.statusHistory = (r.statusHistory || []).concat([{ status: b.status, t: at && okTime(at) ? at : new Date(now).toISOString() }]);
        r.status = b.status;
      }
    }
    if (b.service != null) {
      if (!R.SERVICES[b.service]) throw new HttpError(400, 'invalid_service');
      r.service = b.service;
    }
    if (b.confirmed != null) r.confirmed = !!b.confirmed;
    if (Array.isArray(b.history)) {
      if (b.history.length > 50) throw new HttpError(400, 'too_many_entries');
      const seen = new Set((r.history || []).map(h => h.t + '|' + h.text));
      r.history = r.history || [];
      for (const h of b.history) {
        const text = str(h && h.text, 500);
        let t = isoOrNull(h && h.t);
        if (!text) continue;
        if (!t || !okTime(t)) t = new Date(now).toISOString();
        const key = t + '|' + text;
        if (seen.has(key)) continue;
        seen.add(key);
        r.history.push({ t, text });
      }
      r.history.sort((a, c) => a.t.localeCompare(c.t));
    }
    const data = Object.assign({}, r);
    for (const k of ['id', 'clientId', 'userId', 'createdAt', 'updatedAt', 'reporterName', 'reporterUsername']) delete data[k];
    db.updateReportData(r.id, data);
    const fresh = db.getReport(r.id);
    json(res, 200, { report: adminView(fresh, db.photoIds(fresh.id)) });
  });
  on('POST', /^\/api\/admin\/warnings$/, async (req, res) => {
    requireAdmin(req);
    const b = await readJson(req);
    const key = str(b.key, 80);
    if (!/^\d{4}-\d{2}-\d{2}:[a-z0-9-]{1,40}$/.test(key)) throw new HttpError(400, 'invalid_key');
    let at = isoOrNull(b.at);
    const now = Date.now();
    if (!at || new Date(at).getTime() > now + 5 * 60000 || new Date(at).getTime() < now - 7 * 86400000) at = new Date(now).toISOString();
    db.setWarning(key, at);
    json(res, 200, { ok: true, key, at });
  });
  on('POST', /^\/api\/admin\/reset$/, async (req, res) => {
    requireAdmin(req);
    seedReports(db);
    json(res, 200, { ok: true });
  });

  /* Vraća true ako je zahtjev obrađen. */
  return async function handleApi(req, res, pathname) {
    if (!pathname.startsWith('/api/') || pathname === '/api/status') return false;
    const method = req.method === 'HEAD' ? 'GET' : req.method;
    let matchedPath = false;
    for (const rt of routes) {
      const m = rt.pattern.exec(pathname);
      if (!m) continue;
      matchedPath = true;
      if (rt.method !== method) continue;
      try { await rt.fn(req, res, m); }
      catch (e) {
        if (e instanceof HttpError) { if (!res.headersSent) json(res, e.status, { error: e.code }); }
        else {
          console.error('API greška (' + req.method + ' ' + pathname + '):', e);
          if (!res.headersSent) json(res, 500, { error: 'server_error' });
        }
      }
      return true;
    }
    if (matchedPath) json(res, 405, { error: 'method_not_allowed' });
    else json(res, 404, { error: 'not_found' });
    return true;
  };
}

module.exports = { createApi, validateReport, HttpError };
