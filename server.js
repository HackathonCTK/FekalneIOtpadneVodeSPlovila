'use strict';
/*
 * Čisto more – lokalni server (grupa 3, proširen za spojenu aplikaciju)
 * ---------------------------------------------------------------------
 * Poslužuje:
 *   /                         aplikaciju (mapa public/: sve stranice svih grupa)
 *   /tiles/{z}/{x}/{y}.pbf    vektorske pločice iz lokalne baze (MBTiles = SQLite)
 *   /tiles.json               opis baze karata (TileJSON)
 *   /style.json               stil karte za MapLibre
 *   /fonts/{font}/{raspon}.pbf fontove za natpise na karti
 *   /api/status               stanje servera i baze karata
 *   /api/...                  računi, prijave i portal službi (lib/api.js, baza data/cistomore.db)
 *
 * Pokretanje:  node server.js     (ili: npm start)
 * Postavke (argument ili varijabla okruženja):
 *   --port=8080      / PORT      zadano 8080
 *   --host=0.0.0.0   / HOST      zadano 0.0.0.0 (dostupno i drugim uređajima u istoj mreži)
 *   --mbtiles=...    / MBTILES   zadano data/croatia.mbtiles
 *   --db=...         / APP_DB    zadano data/cistomore.db (računi i prijave)
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 13)) {
  console.error('Potreban je Node.js 22.13 ili noviji (imate ' + process.versions.node + '). Preuzmite ga s https://nodejs.org');
  process.exit(1);
}
// node:sqlite je ugrađen u Node.js; upozorenje "ExperimentalWarning" je bezopasno pa ga skrivamo.
const origEmit = process.emitWarning;
process.emitWarning = function (w, ...rest) {
  const msg = typeof w === 'string' ? w : (w && w.message) || '';
  if (/SQLite/i.test(msg)) return;
  return origEmit.call(process, w, ...rest);
};
const { DatabaseSync } = require('node:sqlite');
const { AppDb } = require('./lib/db.js');
const { seedIfEmpty } = require('./lib/seed.js');
const { createApi } = require('./lib/api.js');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const FONTS_DIR = path.join(ROOT, 'fonts');
const STYLE_FILE = path.join(ROOT, 'map-style', 'style.json');
// Postavke: argumenti (--port=8080 --host=0.0.0.0 --mbtiles=putanja) ili varijable okruženja
const argv = process.argv.slice(2);
const arg = name => { const a = argv.find(x => x.startsWith('--' + name + '=')); return a ? a.slice(name.length + 3) : undefined; };
const PORT = Number(arg('port') || process.env.PORT) || 8080;
const HOST = arg('host') || process.env.HOST || '0.0.0.0';
const MBTILES = path.resolve(ROOT, arg('mbtiles') || process.env.MBTILES || path.join('data', 'croatia.mbtiles'));
const APP_DB = path.resolve(ROOT, arg('db') || process.env.APP_DB || path.join('data', 'cistomore.db'));

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2', '.webp': 'image/webp', '.md': 'text/markdown; charset=utf-8'
};

/* ---------------- baza aplikacije (računi, prijave) ---------------- */
let appDb;
try {
  appDb = new AppDb(APP_DB);
  if (seedIfEmpty(appDb)) console.log('Baza aplikacije pripremljena s demo podacima: ' + path.relative(ROOT, APP_DB));
  appDb.purgeSessions();
  setInterval(() => { try { appDb.purgeSessions(); } catch { /* ignore */ } }, 3600 * 1000).unref();
} catch (e) {
  console.error('Bazu aplikacije nije moguće otvoriti (' + APP_DB + '): ' + e.message);
  process.exit(1);
}
const handleApi = createApi(appDb);

/* ---------------- baza karata (MBTiles) ---------------- */
let db = null, tileStmt = null, meta = null, dbMtime = 0;

function openDb() {
  let st;
  try { st = fs.statSync(MBTILES); } catch { closeDb(); return false; }
  if (db && st.mtimeMs === dbMtime) return true;   // već otvorena i nepromijenjena
  closeDb();
  try {
    db = new DatabaseSync(MBTILES, { readOnly: true });
    tileStmt = db.prepare('SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?');
    meta = {};
    for (const row of db.prepare('SELECT name, value FROM metadata').all()) meta[row.name] = row.value;
    dbMtime = st.mtimeMs;
    console.log('Baza karata otvorena: ' + path.relative(ROOT, MBTILES) + ' (' + (st.size / 1048576).toFixed(1) + ' MB)');
    return true;
  } catch (e) {
    console.error('Bazu karata nije moguće otvoriti (' + MBTILES + '): ' + e.message);
    closeDb();
    return false;
  }
}
function closeDb() {
  if (db) { try { db.close(); } catch { /* ignore */ } }
  db = null; tileStmt = null; meta = null; dbMtime = 0;
}
let lastCheck = 0;
function dbReady() {
  // provjera najviše jednom u 2 s (da se nova baza učita bez ponovnog pokretanja servera)
  const now = Date.now();
  if (db && now - lastCheck < 2000) return true;
  lastCheck = now;
  return openDb();
}
function metaJson() {
  try { return meta && meta.json ? JSON.parse(meta.json) : {}; } catch { return {}; }
}

/* ---------------- pomoćne funkcije ---------------- */
function originOf(req) {
  const proto = (req.headers['x-forwarded-proto'] || '').split(',')[0].trim() || (req.socket.encrypted ? 'https' : 'http');
  const host = (req.headers['x-forwarded-host'] || req.headers.host || ('localhost:' + PORT)).split(',')[0].trim();
  return proto + '://' + host;
}
function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({ 'Access-Control-Allow-Origin': '*' }, headers || {}));
  res.end(res.req.method === 'HEAD' ? undefined : body);
}
function sendJson(res, status, obj, extra) {
  send(res, status, JSON.stringify(obj), Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' }, extra || {}));
}
function notFound(res) { send(res, 404, 'Nije pronađeno', { 'Content-Type': 'text/plain; charset=utf-8' }); }

/* ---------------- rute ---------------- */
function handleTile(req, res, z, x, y) {
  if (!dbReady()) return sendJson(res, 503, { error: 'Baza karata nije pripremljena. Pokrenite: npm run setup' });
  const n = 2 ** z;
  if (z > 30 || x >= n || y >= n) return send(res, 400, 'Neispravna pločica');
  const row = tileStmt.get(z, x, n - 1 - y);            // MBTiles koristi TMS (y je obrnut)
  if (!row || !row.tile_data) {
    // prazna pločica (npr. otvoreno more ili izvan Hrvatske) – 204 je za MapLibre ispravan odgovor
    return send(res, 204, undefined, { 'Cache-Control': 'public, max-age=86400' });
  }
  const buf = Buffer.from(row.tile_data);
  const headers = { 'Content-Type': 'application/x-protobuf', 'Cache-Control': 'public, max-age=86400', 'Content-Length': buf.length };
  if (buf[0] === 0x1f && buf[1] === 0x8b) headers['Content-Encoding'] = 'gzip';
  send(res, 200, buf, headers);
}

function tileJson(req) {
  const o = originOf(req), m = meta || {}, j = metaJson();
  const num = (v, d) => (v != null && v !== '' && isFinite(Number(v)) ? Number(v) : d);
  const tj = {
    tilejson: '3.0.0',
    name: m.name || 'Hrvatska',
    description: m.description || '',
    attribution: m.attribution || '<a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap suradnici</a>',
    scheme: 'xyz',
    tiles: [o + '/tiles/{z}/{x}/{y}.pbf'],
    minzoom: num(m.minzoom, 0),
    maxzoom: num(m.maxzoom, 14)
  };
  // Popis slojeva (vector_layers) namjerno se ne šalje: MapLibre bi tada javljao greške za svaki
  // sloj stila koji u bazi ne postoji, a karti taj popis nije potreban.
  if (j.vector_layers) tj['x-layers'] = j.vector_layers.map(l => l.id);
  if (m.bounds) tj.bounds = m.bounds.split(',').map(Number);
  if (m.center) tj.center = m.center.split(',').map(Number);
  return tj;
}

let styleTemplate = null;
function styleJson(req) {
  if (!styleTemplate) styleTemplate = fs.readFileSync(STYLE_FILE, 'utf8');
  return styleTemplate.split('{ORIGIN}').join(originOf(req));
}

function handleFont(res, stack, range) {
  if (!/^\d+-\d+$/.test(range)) return send(res, 400, 'Neispravan raspon');
  const names = stack.split(',').map(s => s.trim()).filter(Boolean);
  for (const name of names) {
    if (!/^[\w \-]+$/.test(name)) continue;
    const file = path.join(FONTS_DIR, name, range + '.pbf');
    if (file.startsWith(FONTS_DIR + path.sep) && fs.existsSync(file)) {
      return send(res, 200, fs.readFileSync(file), { 'Content-Type': 'application/x-protobuf', 'Cache-Control': 'public, max-age=604800' });
    }
  }
  // Raspon znakova koji nije uključen (npr. rijetka pisma): prazan, ali ispravan odgovor.
  send(res, 200, Buffer.alloc(0), { 'Content-Type': 'application/x-protobuf', 'Cache-Control': 'public, max-age=604800' });
}

function handleStatic(req, res, pathname) {
  let rel;
  try { rel = decodeURIComponent(pathname); } catch { return send(res, 400, 'Neispravna adresa'); }
  if (rel.includes('\0')) return send(res, 400, 'Neispravna adresa');
  if (rel === '/' || rel === '') rel = '/index.html';
  const file = path.resolve(PUBLIC_DIR, '.' + rel);
  if (file !== PUBLIC_DIR && !file.startsWith(PUBLIC_DIR + path.sep)) return notFound(res);
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return notFound(res);
    const ext = path.extname(file).toLowerCase();
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': st.size,
      // aplikacija i service worker se uvijek provjeravaju; biblioteke se smiju dulje čuvati
      'Cache-Control': rel.startsWith('/vendor/') ? 'public, max-age=86400' : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN'
    };
    if (rel === '/sw.js') headers['Service-Worker-Allowed'] = '/';
    res.writeHead(200, headers);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Max-Age': '86400' });
    return res.end();
  }
  let url;
  try { url = new URL(req.url, 'http://localhost'); } catch { return send(res, 400, 'Neispravna adresa'); }
  const p = url.pathname;
  // računi, prijave i portal službi (POST/PATCH su dopušteni samo ovdje)
  if (p.startsWith('/api/') && p !== '/api/status') {
    handleApi(req, res, p).catch(e => {
      console.error('Greška pri obradi ' + req.url + ':', e);
      if (!res.headersSent) send(res, 500, 'Greška na serveru');
      else res.destroy();
    });
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Metoda nije dopuštena', { Allow: 'GET, HEAD, OPTIONS' });
  try {
    let m;
    if ((m = p.match(/^\/tiles\/(\d{1,2})\/(\d{1,9})\/(\d{1,9})\.pbf$/))) return handleTile(req, res, +m[1], +m[2], +m[3]);
    if (p === '/tiles.json') {
      if (!dbReady()) return sendJson(res, 503, { error: 'Baza karata nije pripremljena. Pokrenite: npm run setup' });
      return sendJson(res, 200, tileJson(req));
    }
    if (p === '/style.json') return send(res, 200, styleJson(req), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
    if ((m = p.match(/^\/fonts\/([^/]+)\/([^/]+)\.pbf$/))) {
      let stack; try { stack = decodeURIComponent(m[1]); } catch { return send(res, 400, 'Neispravna adresa'); }
      return handleFont(res, stack, m[2]);
    }
    if (p === '/api/status') {
      const ok = dbReady();
      let size = null; try { size = fs.statSync(MBTILES).size; } catch { /* nema datoteke */ }
      return sendJson(res, 200, {
        server: 'ok', tiles: ok, file: path.relative(ROOT, MBTILES), sizeMB: size == null ? null : +(size / 1048576).toFixed(1),
        name: ok ? (meta.name || null) : null, minzoom: ok ? Number(meta.minzoom || 0) : null, maxzoom: ok ? Number(meta.maxzoom || 14) : null,
        bounds: ok && meta.bounds ? meta.bounds.split(',').map(Number) : null,
        hint: ok ? null : 'Baza karata nije pripremljena. Pokrenite: npm run setup'
      });
    }
    return handleStatic(req, res, p);
  } catch (e) {
    console.error('Greška pri obradi ' + req.url + ':', e);
    if (!res.headersSent) send(res, 500, 'Greška na serveru');
    else res.destroy();
  }
});

server.on('error', e => {
  if (e.code === 'EADDRINUSE') console.error('Port ' + PORT + ' je zauzet. Pokrenite s drugim portom, npr.:  node server.js --port=8081');
  else console.error(e);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log('\nČistoMore – server pokrenut');
  console.log('  Na ovom računalu:   http://localhost:' + PORT);
  for (const list of Object.values(os.networkInterfaces())) {
    for (const a of list || []) if (a.family === 'IPv4' && !a.internal) console.log('  U lokalnoj mreži:   http://' + a.address + ':' + PORT);
  }
  const stillDemo = (name, pw) => { const u = appDb.findUser(name); return !!(u && appDb.checkPassword(u, pw)); };
  console.log('  Portal nadležnih službi: /admin-login.html' + (stillDemo('admin', 'admin') ? '  (privremeno: admin / admin; promjena: npm run set-password -- admin NovaLozinka)' : ''));
  if (stillDemo('korisnik', 'korisnik')) console.log('  Demo korisnik:           korisnik / korisnik');
  if (!openDb()) console.log('\n  NAPOMENA: lokalna baza karata ne postoji (' + path.relative(ROOT, MBTILES) + ').\n  Karte zato koriste OpenStreetMap preko interneta. Za kartu bez signala pokrenite:  npm run setup\n');
  else console.log('');
});

function shutdown() { server.close(); closeDb(); appDb.close(); process.exit(0); }
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
