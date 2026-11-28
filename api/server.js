'use strict';
/*
 * ČistoMore — API server (računi, prijave, kviz)
 * ----------------------------------------------
 * Pokretanje:  node api/server.js        (ili windows\pokreni-server.bat)
 * Postavke:    api/config.json           (predložak: api/config.example.json)
 * Baza:        api/data/cistomore.db     (SQLite, ugrađen u Node 22+)
 * Fotografije: api/data/photos/*.jpg
 *
 * Server ne poslužuje web-stranice; one su na GitHub Pagesu i zovu ovaj API.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

/* ---------------- Postavke ---------------- */
const ROOT = __dirname;
const DATA = path.join(ROOT, 'data');
const PHOTOS = path.join(DATA, 'photos');
fs.mkdirSync(PHOTOS, { recursive: true });

function loadConfig() {
  const file = path.join(ROOT, 'config.json');
  const example = path.join(ROOT, 'config.example.json');
  if (!fs.existsSync(file)) {
    fs.copyFileSync(example, file);
    console.log('Napravljen api/config.json iz predloška. Upiši googleClientId i adminEmails.');
  }
  // Notepad zna dodati BOM na početak datoteke; makni ga prije čitanja
  try { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')); }
  catch (e) { console.error('Greška u api/config.json:', e.message); process.exit(1); }
}
const CFG = loadConfig();
const PORT = Number(process.env.PORT || CFG.port || 8787);
const ADMINS = (CFG.adminEmails || []).map(s => String(s).trim().toLowerCase()).filter(Boolean);
const GOOGLE_ID = String(CFG.googleClientId || '').trim();

/* ---------------- Baza ---------------- */
const db = new DatabaseSync(path.join(DATA, 'cistomore.db'));
db.exec('PRAGMA journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS korisnici (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  ime TEXT NOT NULL DEFAULT '',
  lozinka TEXT,                       -- scrypt hash; NULL kod Google računa
  google_sub TEXT UNIQUE,
  uloga TEXT NOT NULL DEFAULT 'korisnik',   -- korisnik | sluzba
  stvoren TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sesije (
  token TEXT PRIMARY KEY,
  korisnik TEXT NOT NULL REFERENCES korisnici(id) ON DELETE CASCADE,
  stvorena TEXT NOT NULL,
  istek TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS prijave (
  id TEXT PRIMARY KEY,
  broj INTEGER NOT NULL,
  korisnik TEXT REFERENCES korisnici(id) ON DELETE SET NULL,
  podaci TEXT NOT NULL,               -- cijela prijava (JSON, model grupe 3)
  status TEXT NOT NULL DEFAULT 'zaprimljeno',
  stvorena TEXT NOT NULL,
  promijenjena TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS kviz (
  korisnik TEXT PRIMARY KEY REFERENCES korisnici(id) ON DELETE CASCADE,
  rezultat INTEGER NOT NULL,
  ukupno INTEGER NOT NULL,
  ime TEXT NOT NULL DEFAULT '',
  datum TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS pokusaji (
  kljuc TEXT PRIMARY KEY,
  broj INTEGER NOT NULL,
  do_kada TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_prijave_korisnik ON prijave(korisnik);
`);

/* ---------------- Pomoćno ---------------- */
const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();
const q = (sql) => db.prepare(sql);

function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return 'scrypt$' + salt.toString('base64') + '$' + key.toString('base64');
}
function checkPassword(pw, stored) {
  if (!stored || !stored.startsWith('scrypt$')) return false;
  const [, s, k] = stored.split('$');
  const salt = Buffer.from(s, 'base64'), key = Buffer.from(k, 'base64');
  let test;
  try { test = crypto.scryptSync(pw, salt, key.length, { N: 16384, r: 8, p: 1 }); } catch (e) { return false; }
  return key.length === test.length && crypto.timingSafeEqual(key, test);
}

/* Ograničavanje pokušaja (prijava, registracija) */
function rateLimit(key, max, minutes) {
  const cutoff = now();
  q('DELETE FROM pokusaji WHERE do_kada < ?').run(cutoff);
  const row = q('SELECT broj, do_kada FROM pokusaji WHERE kljuc = ?').get(key);
  if (!row) {
    const until = new Date(Date.now() + minutes * 60000).toISOString();
    q('INSERT INTO pokusaji (kljuc, broj, do_kada) VALUES (?, 1, ?)').run(key, until);
    return true;
  }
  if (row.broj >= max) return false;
  q('UPDATE pokusaji SET broj = broj + 1 WHERE kljuc = ?').run(key);
  return true;
}

/* Uloge: korisnik | sluzba (označi admin) | admin (e-mail u config.adminEmails; ima i prava službe) */
const isAdminEmail = (email) => ADMINS.includes(String(email).toLowerCase());
function uloga(email, stored) {
  if (isAdminEmail(email)) return 'admin';
  return stored === 'sluzba' ? 'sluzba' : 'korisnik';
}
const jeSluzba = (u) => !!u && (u.uloga === 'sluzba' || u.uloga === 'admin');

function newSession(userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const istek = new Date(Date.now() + 90 * 86400000).toISOString();
  q('INSERT INTO sesije (token, korisnik, stvorena, istek) VALUES (?, ?, ?, ?)').run(token, userId, now(), istek);
  return { token, istek };
}
function userFromToken(token) {
  if (!token) return null;
  const s = q('SELECT korisnik, istek FROM sesije WHERE token = ?').get(token);
  if (!s) return null;
  if (s.istek < now()) { q('DELETE FROM sesije WHERE token = ?').run(token); return null; }
  const u = q('SELECT id, email, ime, uloga FROM korisnici WHERE id = ?').get(s.korisnik);
  if (!u) return null;
  // admin se čita iz postavki, pa dodavanje e-maila u adminEmails odmah vrijedi
  u.uloga = uloga(u.email, u.uloga);
  return u;
}
const javniKorisnik = (u) => ({ id: u.id, email: u.email, ime: u.ime, uloga: u.uloga });

/* Provjera Google ID tokena preko Googleove službene provjere */
async function verifyGoogle(credential) {
  if (!GOOGLE_ID) throw new Error('google-nije-postavljen');
  const res = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(credential));
  if (!res.ok) throw new Error('google-token-nevazeci');
  const d = await res.json();
  if (d.aud !== GOOGLE_ID) throw new Error('google-token-drugi-klijent');
  if (!d.email || d.email_verified === 'false' || d.email_verified === false) throw new Error('google-email-nepotvrden');
  if (Number(d.exp) * 1000 < Date.now()) throw new Error('google-token-istekao');
  return { sub: d.sub, email: String(d.email).toLowerCase(), ime: d.name || d.given_name || '' };
}

/* ---------------- Prijave ---------------- */
const STATUSI = ['zaprimljeno', 'obrada', 'rijeseno'];

function savePhoto(dataUrl, id) {
  if (typeof dataUrl !== 'string') return null;
  const m = /^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) return null;
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 3 * 1024 * 1024) return null;           // najviše 3 MB
  const ext = m[1] === 'png' ? 'png' : m[1] === 'webp' ? 'webp' : 'jpg';
  const name = id.replace(/[^\w-]/g, '') + '-' + crypto.randomBytes(4).toString('hex') + '.' + ext;
  fs.writeFileSync(path.join(PHOTOS, name), buf);
  return 'photos/' + name;
}
function reportOut(row) {
  const r = JSON.parse(row.podaci);
  r.id = row.id;
  r.status = row.status;
  r.owner = row.korisnik;
  return r;
}
function nextNumber() {
  const row = q('SELECT MAX(broj) AS m FROM prijave').get();
  return Math.max(Number(row && row.m) || 0, 1185) + 1;
}

/* ---------------- HTTP ---------------- */
function cors(req, res) {
  const origin = req.headers.origin;
  const allowed = CFG.allowedOrigins || [];
  if (origin && (allowed.includes(origin) || allowed.includes('*'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '86400');
    return true;
  }
  return !origin;   // zahtjevi bez Origina (curl, provjera zdravlja) prolaze
}
function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}
function readBody(req, limit = 8 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > limit) { reject(new Error('preveliko')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (e) { reject(new Error('neispravan-json')); }
    });
    req.on('error', reject);
  });
}
const str = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
const emailOk = (e) => /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(e) && e.length <= 254;
const clientKey = (req, pre) => pre + ':' + (req.socket.remoteAddress || '?');

const server = http.createServer(async (req, res) => {
  if (!cors(req, res)) return send(res, 403, { error: 'origin-nije-dopusten' });
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname.replace(/\/+$/, '') || '/';
  const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const me = userFromToken(auth);

  try {
    /* --- zdravlje --- */
    if (p === '/api/health' && req.method === 'GET') {
      const n = q('SELECT COUNT(*) AS c FROM prijave').get().c;
      return send(res, 200, { ok: true, prijava: n, googleClientId: GOOGLE_ID || null, vrijeme: now() });
    }

    /* --- fotografije --- */
    if (p.startsWith('/api/photos/') && req.method === 'GET') {
      const name = path.basename(decodeURIComponent(p.slice('/api/photos/'.length)));
      const file = path.join(PHOTOS, name);
      if (!file.startsWith(PHOTOS) || !fs.existsSync(file)) return send(res, 404, { error: 'nema-fotografije' });
      const ext = path.extname(file).slice(1);
      res.writeHead(200, { 'Content-Type': 'image/' + (ext === 'jpg' ? 'jpeg' : ext), 'Cache-Control': 'private, max-age=86400' });
      return fs.createReadStream(file).pipe(res);
    }

    /* --- registracija --- */
    if (p === '/api/auth/register' && req.method === 'POST') {
      if (!rateLimit(clientKey(req, 'reg'), 10, 60)) return send(res, 429, { error: 'previse-pokusaja' });
      const b = await readBody(req, 64 * 1024);
      const email = str(b.email, 254).toLowerCase();
      const ime = str(b.ime, 60);
      const pw = String(b.lozinka || '');
      if (!emailOk(email)) return send(res, 400, { error: 'email-neispravan' });
      if (pw.length < 8) return send(res, 400, { error: 'lozinka-prekratka' });
      if (!ime) return send(res, 400, { error: 'ime-obavezno' });
      if (q('SELECT id FROM korisnici WHERE email = ?').get(email)) return send(res, 409, { error: 'email-zauzet' });
      const id = uid();
      q('INSERT INTO korisnici (id, email, ime, lozinka, uloga, stvoren) VALUES (?, ?, ?, ?, ?, ?)')
        .run(id, email, ime, hashPassword(pw), 'korisnik', now());
      const s = newSession(id);
      return send(res, 201, { token: s.token, korisnik: javniKorisnik({ id, email, ime, uloga: uloga(email, 'korisnik') }) });
    }

    /* --- prijava e-mailom --- */
    if (p === '/api/auth/login' && req.method === 'POST') {
      if (!rateLimit(clientKey(req, 'log'), 20, 15)) return send(res, 429, { error: 'previse-pokusaja' });
      const b = await readBody(req, 64 * 1024);
      const email = str(b.email, 254).toLowerCase();
      const u = q('SELECT * FROM korisnici WHERE email = ?').get(email);
      if (!u || !checkPassword(String(b.lozinka || ''), u.lozinka)) return send(res, 401, { error: 'pogresni-podaci' });
      const s = newSession(u.id);
      u.uloga = uloga(u.email, u.uloga);
      return send(res, 200, { token: s.token, korisnik: javniKorisnik(u) });
    }

    /* --- prijava Google računom --- */
    if (p === '/api/auth/google' && req.method === 'POST') {
      if (!rateLimit(clientKey(req, 'goo'), 30, 15)) return send(res, 429, { error: 'previse-pokusaja' });
      const b = await readBody(req, 64 * 1024);
      let g;
      try { g = await verifyGoogle(String(b.credential || '')); }
      catch (e) { return send(res, 401, { error: e.message }); }
      let u = q('SELECT * FROM korisnici WHERE google_sub = ?').get(g.sub) || q('SELECT * FROM korisnici WHERE email = ?').get(g.email);
      if (!u) {
        const id = uid();
        q('INSERT INTO korisnici (id, email, ime, google_sub, uloga, stvoren) VALUES (?, ?, ?, ?, ?, ?)')
          .run(id, g.email, g.ime || g.email.split('@')[0], g.sub, 'korisnik', now());
        u = q('SELECT * FROM korisnici WHERE id = ?').get(id);
      } else if (!u.google_sub) {
        q('UPDATE korisnici SET google_sub = ? WHERE id = ?').run(g.sub, u.id);
      }
      u.uloga = uloga(u.email, u.uloga);
      const s = newSession(u.id);
      return send(res, 200, { token: s.token, korisnik: javniKorisnik(u) });
    }

    /* --- odjava --- */
    if (p === '/api/auth/logout' && req.method === 'POST') {
      if (auth) q('DELETE FROM sesije WHERE token = ?').run(auth);
      return send(res, 200, { ok: true });
    }

    /* Sve ispod traži prijavljenog korisnika */
    if (p.startsWith('/api/') && !me) return send(res, 401, { error: 'nisi-prijavljen' });

    /* --- moj račun --- */
    if (p === '/api/me' && req.method === 'GET') {
      const k = q('SELECT rezultat, ukupno, ime, datum FROM kviz WHERE korisnik = ?').get(me.id) || null;
      return send(res, 200, { korisnik: javniKorisnik(me), kviz: k });
    }
    if (p === '/api/me' && req.method === 'PATCH') {
      const b = await readBody(req, 16 * 1024);
      const ime = str(b.ime, 60);
      if (!ime) return send(res, 400, { error: 'ime-obavezno' });
      q('UPDATE korisnici SET ime = ? WHERE id = ?').run(ime, me.id);
      return send(res, 200, { korisnik: javniKorisnik({ ...me, ime }) });
    }

    /* --- kviz --- */
    if (p === '/api/kviz' && req.method === 'POST') {
      const b = await readBody(req, 16 * 1024);
      const rez = Math.max(0, Math.min(100, Number(b.rezultat) || 0));
      const uk = Math.max(1, Math.min(100, Number(b.ukupno) || 10));
      const ime = str(b.ime, 60);
      const prev = q('SELECT rezultat FROM kviz WHERE korisnik = ?').get(me.id);
      if (!prev || rez >= prev.rezultat) {
        q('INSERT INTO kviz (korisnik, rezultat, ukupno, ime, datum) VALUES (?, ?, ?, ?, ?) ' +
          'ON CONFLICT(korisnik) DO UPDATE SET rezultat = excluded.rezultat, ukupno = excluded.ukupno, ime = excluded.ime, datum = excluded.datum')
          .run(me.id, rez, uk, ime, now());
      }
      const k = q('SELECT rezultat, ukupno, ime, datum FROM kviz WHERE korisnik = ?').get(me.id);
      return send(res, 200, { kviz: k });
    }

    /* --- prijave: popis --- */
    if (p === '/api/prijave' && req.method === 'GET') {
      const sve = url.searchParams.get('sve') === '1' && jeSluzba(me);
      const rows = sve
        ? q('SELECT * FROM prijave ORDER BY stvorena DESC').all()
        : q('SELECT * FROM prijave WHERE korisnik = ? ORDER BY stvorena DESC').all(me.id);
      return send(res, 200, { prijave: rows.map(reportOut) });
    }

    /* --- prijave: nova --- */
    if (p === '/api/prijave' && req.method === 'POST') {
      if (!rateLimit(clientKey(req, 'pri'), 60, 60)) return send(res, 429, { error: 'previse-pokusaja' });
      const b = await readBody(req);
      const broj = nextNumber();
      const id = new Date().getFullYear() + '-' + broj;
      const t = now();
      const photo = savePhoto(b.photo, id);
      const r = {
        id,
        type: str(b.type, 40) || 'fekalne',
        lat: typeof b.lat === 'number' && isFinite(b.lat) ? b.lat : null,
        lng: typeof b.lng === 'number' && isFinite(b.lng) ? b.lng : null,
        place: str(b.place, 120),
        desc: str(b.desc, 2000),
        createdAt: (b.createdAt && !isNaN(new Date(b.createdAt).getTime())) ? new Date(b.createdAt).toISOString() : t,
        status: 'zaprimljeno',
        vessel: str(b.vessel, 60),
        heading: typeof b.heading === 'number' && isFinite(b.heading) ? b.heading : null,
        service: null, reasons: [], county: null, confirmed: false,
        history: [{ t, text: 'Prijava zaprimljena (Nova prijava).' }],
        photo: photo,
        source: jeSluzba(me) && b.source === 'obrada.html' ? 'obrada.html' : 'report.html',
        extra: b.extra && typeof b.extra === 'object' ? b.extra : null,
        autor: me.ime
      };
      q('INSERT INTO prijave (id, broj, korisnik, podaci, status, stvorena, promijenjena) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(id, broj, me.id, JSON.stringify(r), r.status, r.createdAt, t);
      return send(res, 201, { prijava: r });
    }

    /* --- prijave: promjena (samo služba) --- */
    const mPr = /^\/api\/prijave\/([\w-]+)$/.exec(p);
    if (mPr && req.method === 'PATCH') {
      if (!jeSluzba(me)) return send(res, 403, { error: 'nije-dopusteno' });
      const row = q('SELECT * FROM prijave WHERE id = ?').get(mPr[1]);
      if (!row) return send(res, 404, { error: 'nema-prijave' });
      const b = await readBody(req, 256 * 1024);
      const r = JSON.parse(row.podaci);
      const t = now();
      if (b.status != null) {
        if (!STATUSI.includes(b.status)) return send(res, 400, { error: 'status-neispravan' });
        r.status = b.status;
      }
      if (b.service !== undefined) r.service = b.service == null ? null : str(b.service, 60);
      if (b.county !== undefined) r.county = b.county == null ? null : str(b.county, 60);
      if (typeof b.place === 'string') r.place = str(b.place, 120);
      if (b.confirmed !== undefined) r.confirmed = !!b.confirmed;
      if (Array.isArray(b.reasons)) r.reasons = b.reasons.slice(0, 10).map(x => str(x, 200));
      if (Array.isArray(b.history)) r.history = b.history.slice(-50);
      else if (b.note) r.history.push({ t, text: str(b.note, 300) });
      if (!Array.isArray(r.history) || !r.history.length) r.history = [{ t, text: 'Promjena.' }];
      q('UPDATE prijave SET podaci = ?, status = ?, promijenjena = ? WHERE id = ?')
        .run(JSON.stringify(r), r.status, t, row.id);
      return send(res, 200, { prijava: { ...r, id: row.id, owner: row.korisnik } });
    }

    /* --- admin: računi i uloge --- */
    if (p === '/api/admin/korisnici' && req.method === 'GET') {
      if (me.uloga !== 'admin') return send(res, 403, { error: 'nije-dopusteno' });
      const rows = q(`SELECT k.id, k.email, k.ime, k.uloga, k.stvoren,
                        (SELECT COUNT(*) FROM prijave p WHERE p.korisnik = k.id) AS prijava
                      FROM korisnici k ORDER BY k.stvoren DESC`).all();
      return send(res, 200, { korisnici: rows.map(r => ({ ...r, uloga: uloga(r.email, r.uloga) })) });
    }
    const mUl = /^\/api\/admin\/korisnici\/([\w-]+)$/.exec(p);
    if (mUl && req.method === 'PATCH') {
      if (me.uloga !== 'admin') return send(res, 403, { error: 'nije-dopusteno' });
      const b = await readBody(req, 4 * 1024);
      if (b.uloga !== 'sluzba' && b.uloga !== 'korisnik') return send(res, 400, { error: 'uloga-neispravna' });
      const u = q('SELECT id, email FROM korisnici WHERE id = ?').get(mUl[1]);
      if (!u) return send(res, 404, { error: 'nema-korisnika' });
      q('UPDATE korisnici SET uloga = ? WHERE id = ?').run(b.uloga, u.id);
      return send(res, 200, { ok: true, uloga: uloga(u.email, b.uloga) });
    }

    return send(res, 404, { error: 'nepoznata-putanja' });
  } catch (e) {
    if (e && (e.message === 'preveliko' || e.message === 'neispravan-json')) return send(res, 400, { error: e.message });
    console.error('Greška:', e);
    return send(res, 500, { error: 'greska-servera' });
  }
});

/* ---------------- Sigurnosna kopija (svaki dan, čuva se backupDays dana) ---------------- */
const BACKUP = path.join(ROOT, 'backup');
function backup() {
  try {
    fs.mkdirSync(path.join(BACKUP, 'photos'), { recursive: true });
    const day = now().slice(0, 10);
    const file = path.join(BACKUP, 'cistomore-' + day + '.db');
    if (!fs.existsSync(file)) {
      db.exec("VACUUM INTO '" + file.replace(/'/g, "''") + "'");
      console.log('Sigurnosna kopija: ' + file);
    }
    // fotografije: kopiraj samo nove
    for (const f of fs.readdirSync(PHOTOS)) {
      const dst = path.join(BACKUP, 'photos', f);
      if (!fs.existsSync(dst)) fs.copyFileSync(path.join(PHOTOS, f), dst);
    }
    const keep = Math.max(1, Number(CFG.backupDays) || 14);
    const olds = fs.readdirSync(BACKUP).filter(f => /^cistomore-\d{4}-\d{2}-\d{2}\.db$/.test(f)).sort();
    olds.slice(0, Math.max(0, olds.length - keep)).forEach(f => fs.unlinkSync(path.join(BACKUP, f)));
  } catch (e) { console.error('Sigurnosna kopija nije uspjela:', e.message); }
}

/* ---------------- Cloudflare brzi tunel + objava adrese na GitHubu ----------------
   Brzi tunel (bez domene i bez prijave u Cloudflare) dobije nasumičnu adresu
   https://<nesto>.trycloudflare.com. Server je zapiše u api/data/adresa.txt i, ako je
   postavljen github.token, u datoteku api.json na grani "api-adresa" repoa.
   Stranice (cm-api.js) tu datoteku čitaju i tako znaju kamo slati zahtjeve. */
let tunnelUrl = null;
async function gh(method, apiPath, body) {
  const res = await fetch('https://api.github.com' + apiPath, {
    method,
    headers: {
      'Authorization': 'Bearer ' + CFG.github.token,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'cistomore-api',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data = null; try { data = JSON.parse(text); } catch (e) {}
  return { status: res.status, data };
}
async function publishUrl(u) {
  fs.writeFileSync(path.join(DATA, 'adresa.txt'), u + '\n');
  const G = CFG.github || {};
  if (!G.token) { console.log('github.token nije postavljen: adresa NIJE objavljena (vidi api/data/adresa.txt).'); return; }
  const repo = G.repo, branch = G.branch || 'api-adresa', file = G.file || 'api.json';
  try {
    // grana postoji? ako ne, napravi je od main
    let ref = await gh('GET', `/repos/${repo}/git/ref/heads/${branch}`);
    if (ref.status === 404) {
      const main = await gh('GET', `/repos/${repo}/git/ref/heads/main`);
      if (main.status !== 200) throw new Error('ne mogu pročitati main (' + main.status + ')');
      const mk = await gh('POST', `/repos/${repo}/git/refs`, { ref: 'refs/heads/' + branch, sha: main.data.object.sha });
      if (mk.status !== 201) throw new Error('ne mogu napraviti granu (' + mk.status + ')');
    } else if (ref.status !== 200) throw new Error('GitHub ' + ref.status);
    const cur = await gh('GET', `/repos/${repo}/contents/${file}?ref=${branch}`);
    const content = Buffer.from(JSON.stringify({ url: u, vrijeme: now() }, null, 2) + '\n').toString('base64');
    const put = await gh('PUT', `/repos/${repo}/contents/${file}`, {
      message: 'API adresa: ' + u, content, branch, ...(cur.status === 200 ? { sha: cur.data.sha } : {})
    });
    if (put.status !== 200 && put.status !== 201) throw new Error('objava nije uspjela (' + put.status + ')');
    console.log('Adresa objavljena na GitHubu (grana ' + branch + ').');
  } catch (e) {
    console.error('Objava adrese na GitHubu nije uspjela: ' + e.message + '. Pokušavam ponovno za 2 min.');
    setTimeout(() => { if (tunnelUrl === u) publishUrl(u); }, 120000);
  }
}
function startTunnel() {
  const T = CFG.tunnel || {};
  if (!T.enabled) return;
  const { spawn } = require('node:child_process');
  const bin = T.cloudflaredPath || 'cloudflared';
  let child;
  try {
    child = spawn(bin, ['tunnel', '--no-autoupdate', '--url', 'http://127.0.0.1:' + PORT], { windowsHide: true });
  } catch (e) {
    console.error('cloudflared se ne može pokrenuti (' + e.message + '). Pokušavam ponovno za 30 s.');
    return setTimeout(startTunnel, 30000);
  }
  const onData = (buf) => {
    const m = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/.exec(buf.toString());
    if (m && m[0] !== tunnelUrl) {
      tunnelUrl = m[0];
      console.log('Tunel radi: ' + tunnelUrl);
      publishUrl(tunnelUrl);
    }
  };
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);
  child.on('error', (e) => console.error('cloudflared greška: ' + e.message));
  child.on('exit', (code) => {
    console.error('cloudflared je stao (kod ' + code + '). Ponovno pokretanje za 15 s.');
    tunnelUrl = null;
    setTimeout(startTunnel, 15000);
  });
  process.on('exit', () => { try { child.kill(); } catch (e) {} });
}

server.listen(PORT, '127.0.0.1', () => {
  console.log('ČistoMore API radi na http://127.0.0.1:' + PORT);
  console.log('Baza: ' + path.join(DATA, 'cistomore.db'));
  if (!GOOGLE_ID) console.log('Napomena: googleClientId nije postavljen, prijava Googleom je isključena.');
  if (!ADMINS.length) console.log('Napomena: adminEmails je prazan, nitko nije admin.');
  backup();
  setInterval(backup, 6 * 3600 * 1000);
  startTunnel();
});
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(0));
