/* Čisto more – service worker (rad bez signala)
 * - aplikacija, biblioteke i stil karte: prvo mreža, a bez mreže spremljena kopija
 * - pločice karte i fontovi: prvo spremljena kopija (brže), inače mreža
 * - podaci o stanju servera (/api/) se nikad ne spremaju
 */
const APP_CACHE = 'cistomore-app-v2';
const MAP_CACHE = 'cistomore-map-v2';
const MAX_MAP_ITEMS = 4000;
const PRECACHE = ['/', '/index.html', '/vendor/leaflet/leaflet.js', '/vendor/leaflet/leaflet.css',
  '/vendor/maplibre-gl/maplibre-gl.js', '/vendor/maplibre-gl/maplibre-gl.css', '/vendor/leaflet-maplibre-gl.js',
  '/style.json', '/tiles.json'];

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
  if (url.origin !== self.location.origin) return;          // npr. prognoza (Open-Meteo) ide izravno
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
    if (res.ok) { const copy = res.clone(); caches.open(APP_CACHE).then(c => c.put(req, copy)).catch(() => {}); }
    return res;
  }).catch(async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    if (req.mode === 'navigate') return (await caches.match('/index.html')) || Response.error();
    return Response.error();
  }));
});
