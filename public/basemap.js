/*
 * ČistoMore — podloga karte za sve karte u aplikaciji
 *
 *  1. Ako server ima lokalnu bazu karata (grupa 3: npm run setup → data/croatia.mbtiles),
 *     karta se crta iz nje (MapLibre GL preko Leafleta). Te pločice service worker sprema,
 *     pa se već pregledani dijelovi karte vide i bez signala.
 *  2. Inače (baza još nije izrađena ili preglednik nema WebGL) koristi se OpenStreetMap
 *     preko interneta (kao na karti grupe 2).
 *
 * Upotreba:  CM_BASEMAP.add(map, { onNote: function (razlog) {…} })  → Promise<'local'|'osm'>
 *            razlog: 'osm-error' | 'offline' | 'local-missing'
 * Potrebno:  vendor/leaflet. MapLibre GL (oko 1 MB) učitava se samo kad postoji lokalna baza karata.
 */
(function () {
  'use strict';
  var KEY = 'cm-tiles';
  var checking = null, loadingGL = null;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.async = false;
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  // MapLibre GL i dodatak za Leaflet, ako ih stranica već nije učitala
  function ensureGL() {
    if (window.maplibregl && L.maplibreGL) return Promise.resolve();
    if (loadingGL) return loadingGL;
    if (!document.querySelector('link[href$="maplibre-gl.css"]')) {
      var css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = 'vendor/maplibre-gl/maplibre-gl.css';
      document.head.appendChild(css);
    }
    loadingGL = (window.maplibregl ? Promise.resolve() : loadScript('vendor/maplibre-gl/maplibre-gl.js'))
      .then(function () { return L.maplibreGL ? null : loadScript('vendor/leaflet-maplibre-gl.js'); });
    return loadingGL;
  }

  function remember(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* ignore */ } }
  function remembered() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }

  function hasWebGL() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  // Ima li server lokalnu bazu karata? Bez veze sa serverom vrijedi zadnji poznati odgovor.
  function check() {
    if (checking) return checking;
    if (!/^https?:$/.test(location.protocol)) { checking = Promise.resolve(false); return checking; }
    checking = fetch('/api/status', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (s) {
        var ok = !!(s && s.tiles);
        remember(ok);
        if (!ok) return false;
        // Baza koja pokriva samo dio obale (npr. npm run demo: okolica Splita): dok ima interneta
        // bolji je OpenStreetMap, a bez signala lokalna baza (bolje dio karte nego ništa).
        var b = s.bounds;
        var covers = Array.isArray(b) && b[0] <= 14 && b[1] <= 43 && b[2] >= 18.5 && b[3] >= 46;
        return covers || !navigator.onLine;
      })
      .catch(function () { return remembered(); });
    return checking;
  }

  function addOsm(map, opts) {
    var shown = false;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).on('tileerror', function () {
      if (shown) return;
      shown = true;
      if (opts.onNote) opts.onNote('osm-error');
    }).addTo(map);
    return 'osm';
  }

  function addLocal(map, opts) {
    var gl = L.maplibreGL({ style: location.origin + '/style.json' }).addTo(map);
    var glm = gl.getMaplibreMap && gl.getMaplibreMap();
    if (glm && glm.on) glm.on('error', function (ev) {
      var st = ev && ev.error && ev.error.status;
      if (st === 503 && opts.onNote) opts.onNote('local-missing');
    });
    map._cmGL = gl;
    return 'local';
  }

  window.CM_BASEMAP = {
    check: check,
    add: function (map, opts) {
      opts = opts || {};
      var osm = function () {
        if (!navigator.onLine && opts.onNote) opts.onNote('offline');
        return addOsm(map, opts);
      };
      return check().then(function (local) {
        if (!local || !hasWebGL()) return osm();
        return ensureGL().then(function () {
          try { return addLocal(map, opts); } catch (e) { return osm(); }
        }, osm);
      });
    }
  };
})();
