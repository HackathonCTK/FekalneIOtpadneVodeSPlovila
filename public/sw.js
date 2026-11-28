/* ČistoMore – service worker (rad bez signala), grupa 3, proširen za cijelu spojenu aplikaciju
 * - stranice, stilovi, skripte, podaci karte prihvatnih mjesta i fontovi: prvo mreža, a bez mreže spremljena kopija
 * - pločice karte i fontovi karte: prvo spremljena kopija (brže), inače mreža
 * - /api/ (računi, prijave) se nikad ne sprema: prijave bez signala čekaju u pregledniku (app.js) i šalju se kasnije
 * - zahtjevi prema drugim poslužiteljima (OpenStreetMap, Open-Meteo) idu izravno
 */
const APP_CACHE = 'cistomore-app-v5';
const MAP_CACHE = 'cistomore-map-v2';
const MAX_MAP_ITEMS = 4000;
const FONTS = ['bricolage-grotesque-latin-opsz-normal', 'bricolage-grotesque-latin-ext-opsz-normal',
  'manrope-latin-400-normal', 'manrope-latin-600-normal', 'manrope-latin-700-normal',
  'manrope-latin-ext-400-normal', 'manrope-latin-ext-600-normal', 'manrope-latin-ext-700-normal',
  'jetbrains-mono-latin-400-normal', 'jetbrains-mono-latin-600-normal',
  'jetbrains-mono-latin-ext-400-normal', 'jetbrains-mono-latin-ext-600-normal'].map(f => '/vendor/fonts/' + f + '.woff2');
const PRECACHE = [
  '/favicon.svg', '/', '/index.html', '/login.html', '/report.html', '/map.html', '/book.html', '/profile.html',
  '/plovi-odgovorno.html', '/admin-login.html', '/obrada.html',
  '/tokens.css', '/styles.css', '/map.css', '/plovi-odgovorno.css',
  '/app.js', '/routing.js', '/basemap.js', '/map.js', '/plovi-odgovorno.js', '/plovi-odgovorno-sadrzaj.js', '/plovi-odgovorno-slike.js',
  '/data/stations.js', '/data/kontakti.js', '/data/upute.js', '/data/regije.js', '/data/i18n-en.js',
  '/vendor/fonts/fonts.css',
  '/vendor/leaflet/leaflet.js', '/vendor/leaflet/leaflet.css',
  '/vendor/leaflet.markercluster/leaflet.markercluster.js', '/vendor/leaflet.markercluster/MarkerCluster.css',
  '/vendor/maplibre-gl/maplibre-gl.js', '/vendor/maplibre-gl/maplibre-gl.css', '/vendor/leaflet-maplibre-gl.js',
  '/vendor/gsap/gsap.min.js', '/vendor/gsap/ScrollTrigger.min.js',
  '/style.json', '/tiles.json'
].concat(FONTS);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(APP_CACHE).then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(() => null)))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== APP_CACHE && k !== MAP_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

let trimming = false;
async function trimMapCache(){
  if (trimming) return; trimming = true;
  try {
    const c = await caches.open(MAP_CACHE); const keys = await c.keys();
    for (let i = 0; i < keys.length - MAX_MAP_ITEMS; i++) await c.delete(keys[i]);
  } finally { trimming = false; }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // npr. prognoza (Open-Meteo), OpenStreetMap
  if (url.pathname.startsWith('/api/')) return;

  if (url.pathname.startsWith('/tiles/') || url.pathname.startsWith('/fonts/')) {
    e.respondWith(caches.open(MAP_CACHE).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.status === 200 || res.status === 204) { c.put(req, res.clone()).catch(() => {}); trimMapCache().catch(() => {}); }
        return res;
      } catch (err) {
        return new Response(null, { status: 204 });           // bez mreže: prazna pločica umjesto greške
      }
    }));
    return;
  }

  e.respondWith(fetch(req).then(res => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(APP_CACHE).then(c => c.put(req, copy)).catch(() => {}); }
    return res;
  }).catch(async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    if (req.mode === 'navigate') {
      // ista stranica s drugim parametrima (npr. map.html?station=…, login.html?next=…), inače početna
      return (await caches.match(req, { ignoreSearch: true })) || (await caches.match('/index.html')) || Response.error();
    }
    return (await caches.match(req, { ignoreSearch: true })) || Response.error();
  }));
});
