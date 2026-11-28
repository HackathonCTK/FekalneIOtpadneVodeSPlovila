// ČistoMore: karta prihvatnih mjesta, dodatni slojevi
//  - zone zabrane ispuštanja (nacionalni parkovi, parkovi prirode, posebni rezervati u moru; granice pojednostavljene)
//  - crte 3 NM i 12 NM od najbližeg kopna i približna polazna crta (data/obala.js, izračun iz Natural Earth 10m)
//  - provjera dodirom, GPS-om ili upisanim koordinatama: smije li se ovdje ispuštati i pod kojim uvjetima
//  - nevrijeme: vjetar, udari i grmljavina uz obalu (Open-Meteo, bez ključa), uz poveznicu na službena upozorenja DHMZ-a
// Sve je približno i služi za upozorenje i edukaciju, ne za navigaciju.
(function(){
  "use strict";

  var MM = window.CM_MAP, COAST = window.CM_COAST;
  var doc = document;
  function $(id){ return doc.getElementById(id); }
  function esc(s){ return CM.esc(s); }

  CM.addI18n({
    hr: {
      "zone.layers": "Slojevi karte", "zone.lZones": "Zone zabrane", "zone.lLines": "Crte 3 i 12 NM", "zone.lWx": "Nevrijeme",
      "zone.legendZone": "Zabranjeno ispuštanje (park ili rezervat)", "zone.legend12": "12 NM od kopna", "zone.legend3": "3 NM od kopna",
      "zone.legendBase": "Polazna crta (približno)", "zone.legendWx": "Vjetar i nevrijeme",
      "zone.approx": "Granice i crte su približne (izračun aplikacije), nisu službena karta. Za plovidbu koristi službene karte HHI-ja.",
      "zone.checkTitle": "Smijem li ovdje isprazniti spremnik?",
      "zone.checkLead": "Dodirni more na karti, upiši koordinate ili uzmi svoju lokaciju.",
      "zone.coordsLabel": "Koordinate", "zone.coordsPh": "npr. 43.5081, 16.4402 ili 43°30,5′N 16°26,4′E",
      "zone.check": "Provjeri", "zone.gps": "Moja lokacija", "zone.gpsBusy": "Tražim…",
      "zone.coordsErr": "Ne prepoznajem koordinate. Upiši npr. 43.5081, 16.4402 ili 43°30,5′N 16°26,4′E.",
      "zone.coordsOut": "Te koordinate nisu na Jadranu.",
      "zone.here": "Ovdje si", "zone.point": "Odabrana točka",
      "zone.dist": "Udaljenost od kopna (polazne crte)", "zone.distInner": "0 NM: unutarnje vode (unutar polazne crte)",
      "zone.distNm": "oko {n} NM",
      "zone.where.land": "Kopno", "zone.where.port": "Luka ili marina", "zone.where.park": "Zaštićeno područje",
      "zone.where.near": "Do 3 NM od kopna", "zone.where.mid": "3 do 12 NM od kopna", "zone.where.far": "Više od 12 NM od kopna",
      "zone.landText": "Ova točka je na kopnu (prema pojednostavljenoj obali). Odaberi točku na moru.",
      "zone.portNear": "Blizu: {name}",
      "zone.sys.0": "Samo spremnik (neobrađeno)", "zone.sys.1": "Usitnjavanje i dezinfekcija", "zone.sys.2": "Odobreni uređaj za obradu",
      "zone.v.yes": "Dopušteno", "zone.v.cond": "Uvjetno", "zone.v.no": "Nije dopušteno",
      "zone.r.port.0": "U lukama, marinama i sidrištima spremnik se prazni samo na prihvatnoj stanici.",
      "zone.r.port.1": "Ni usitnjene i dezinficirane fekalne vode ne smiju u more u luci, marini ili sidrištu. Koristi prihvatnu stanicu.",
      "zone.r.port.2": "Ispust iz odobrenog uređaja MARPOL načelno dopušta, ali ga mnoge luke i marine zabranjuju. Provjeri pravila marine.",
      "zone.r.park.0": "U nacionalnim parkovima, parkovima prirode i posebnim rezervatima u moru ne ispuštaj otpadne vode. Koristi prihvatnu stanicu.",
      "zone.r.park.1": "Pravilnici zaštićenih područja zabranjuju ispuštanje otpadnih voda s plovila.",
      "zone.r.park.2": "I pročišćene vode su ovdje zabranjene ili ograničene. Provjeri pravilnik parka.",
      "zone.r.near.0": "Preblizu si kopna. Neobrađene fekalne vode smiju se ispuštati tek više od 12 NM od najbližeg kopna.",
      "zone.r.near.1": "Preblizu si kopna. Usitnjene i dezinficirane fekalne vode smiju se ispuštati tek više od 3 NM od najbližeg kopna.",
      "zone.r.near.2": "MARPOL to dopušta ako je uređaj odobren i ispravan te ako ispust ne ostavlja vidljive krute tvari i ne mijenja boju mora. Provjeri i lokalna pravila.",
      "zone.r.mid.0": "Neobrađene fekalne vode smiju se ispuštati tek više od 12 NM od najbližeg kopna.",
      "zone.r.mid.1": "Dopušteno ako je uređaj odobren i ploviš barem 4 čvora.",
      "zone.r.mid.2": "Dopušteno uz odobren i ispravan uređaj za obradu.",
      "zone.r.far.0": "Dopušteno ako ploviš barem 4 čvora i spremnik prazniš postupno, a ne odjednom.",
      "zone.r.far.1": "Dopušteno ako je uređaj odobren i ploviš barem 4 čvora.",
      "zone.r.far.2": "Dopušteno uz odobren i ispravan uređaj za obradu.",
      "zone.nearest": "Najbliža prihvatna stanica", "zone.show": "Prikaži",
      "zone.foreign": "Točka je izvan hrvatskog dijela Jadrana: vrijede i pravila te države.",
      "zone.foreignW": "Točka je na sredini Jadrana ili bliže talijanskoj obali: udaljenost je računata samo od istočne obale Jadrana.",
      "zone.rulesNote": "Pojednostavljeno prema MARPOL Prilogu IV i Pravilniku NN 72/2021. Kad nisi siguran, koristi prihvatnu stanicu.",
      "zone.popMore": "Detalji ispod karte",
      "zone.wxOk": "Bez jakog vjetra ni grmljavine uz obalu (sljedećih 12 h).",
      "zone.wxWarn": "Nevrijeme uz obalu (sljedećih 12 h): {list}.",
      "zone.wxLoading": "Učitavam vjetar uz obalu…", "zone.wxFail": "Podaci o vjetru trenutačno nisu dostupni.",
      "zone.wxOld": "Podaci od {time} (bez veze).",
      "zone.wxOfficial": "Službena upozorenja: DHMZ (meteo.hr)", "zone.wxSource": "Podaci: Open-Meteo.com",
      "zone.wxNow": "Sada: {dir} {ws} čv, udari {wg} čv", "zone.wxMax": "Do 12 h: udari do {g} čv",
      "zone.wxStorm": "grmljavina", "zone.wxGale": "olujni udari", "zone.wxStrong": "jak vjetar",
      "zone.dir.bura": "bura", "zone.dir.jugo": "jugo", "zone.dir.maestral": "maestral", "zone.dir.tramontana": "tramontana",
      "zone.dir.levant": "levant", "zone.dir.ostro": "oštro", "zone.dir.lebic": "lebić", "zone.dir.pulenat": "pulenat"
    },
    en: {
      "zone.layers": "Map layers", "zone.lZones": "No-discharge zones", "zone.lLines": "3 and 12 NM lines", "zone.lWx": "Weather",
      "zone.legendZone": "No discharge (park or reserve)", "zone.legend12": "12 NM from land", "zone.legend3": "3 NM from land",
      "zone.legendBase": "Baseline (approximate)", "zone.legendWx": "Wind and storms",
      "zone.approx": "Boundaries and lines are approximate (computed by the app), not an official chart. For navigation use official HHI charts.",
      "zone.checkTitle": "Can I empty my tank here?",
      "zone.checkLead": "Tap the sea on the map, type coordinates or use your location.",
      "zone.coordsLabel": "Coordinates", "zone.coordsPh": "e.g. 43.5081, 16.4402 or 43°30.5′N 16°26.4′E",
      "zone.check": "Check", "zone.gps": "My location", "zone.gpsBusy": "Locating…",
      "zone.coordsErr": "I can't read those coordinates. Try e.g. 43.5081, 16.4402 or 43°30.5′N 16°26.4′E.",
      "zone.coordsOut": "Those coordinates aren't in the Adriatic.",
      "zone.here": "You are here", "zone.point": "Selected point",
      "zone.dist": "Distance from land (baseline)", "zone.distInner": "0 NM: internal waters (inside the baseline)",
      "zone.distNm": "about {n} NM",
      "zone.where.land": "Land", "zone.where.port": "Port or marina", "zone.where.park": "Protected area",
      "zone.where.near": "Within 3 NM of land", "zone.where.mid": "3 to 12 NM from land", "zone.where.far": "Beyond 12 NM from land",
      "zone.landText": "This point is on land (based on the simplified coastline). Pick a point at sea.",
      "zone.portNear": "Near: {name}",
      "zone.sys.0": "Holding tank only (untreated)", "zone.sys.1": "Comminuting and disinfecting", "zone.sys.2": "Approved treatment plant",
      "zone.v.yes": "Allowed", "zone.v.cond": "Conditional", "zone.v.no": "Not allowed",
      "zone.r.port.0": "In ports, marinas and anchorages the tank is emptied only at a pump-out station.",
      "zone.r.port.1": "Comminuted and disinfected sewage can't go overboard in a port, marina or anchorage either. Use a pump-out station.",
      "zone.r.port.2": "MARPOL generally allows effluent from an approved plant, but many ports and marinas ban it. Check the marina's rules.",
      "zone.r.park.0": "Don't discharge wastewater in national parks, nature parks or marine reserves. Use a pump-out station.",
      "zone.r.park.1": "The rules of protected areas ban discharging wastewater from boats.",
      "zone.r.park.2": "Even treated effluent is banned or restricted here. Check the park's rules.",
      "zone.r.near.0": "You're too close to land. Untreated sewage may only be discharged beyond 12 NM from the nearest land.",
      "zone.r.near.1": "You're too close to land. Comminuted and disinfected sewage may only be discharged beyond 3 NM from the nearest land.",
      "zone.r.near.2": "MARPOL allows it if the plant is approved and working, and the effluent leaves no visible solids or discolouration. Check local rules too.",
      "zone.r.mid.0": "Untreated sewage may only be discharged beyond 12 NM from the nearest land.",
      "zone.r.mid.1": "Allowed if the system is approved and you're under way at 4 kn or more.",
      "zone.r.mid.2": "Allowed with an approved, working treatment plant.",
      "zone.r.far.0": "Allowed if you're under way at 4 kn or more and empty the tank gradually, not all at once.",
      "zone.r.far.1": "Allowed if the system is approved and you're under way at 4 kn or more.",
      "zone.r.far.2": "Allowed with an approved, working treatment plant.",
      "zone.nearest": "Nearest pump-out station", "zone.show": "Show",
      "zone.foreign": "This point is outside the Croatian part of the Adriatic: that country's rules apply too.",
      "zone.foreignW": "This point is mid-Adriatic or closer to the Italian coast: distance is measured from the eastern Adriatic coast only.",
      "zone.rulesNote": "Simplified from MARPOL Annex IV and the Croatian Ordinance NN 72/2021. When in doubt, use a pump-out station.",
      "zone.popMore": "Details below the map",
      "zone.wxOk": "No strong wind or thunderstorms along the coast (next 12 h).",
      "zone.wxWarn": "Bad weather along the coast (next 12 h): {list}.",
      "zone.wxLoading": "Loading wind along the coast…", "zone.wxFail": "Wind data isn't available right now.",
      "zone.wxOld": "Data from {time} (offline).",
      "zone.wxOfficial": "Official warnings: DHMZ (meteo.hr)", "zone.wxSource": "Data: Open-Meteo.com",
      "zone.wxNow": "Now: {dir} {ws} kn, gusts {wg} kn", "zone.wxMax": "Next 12 h: gusts up to {g} kn",
      "zone.wxStorm": "thunderstorms", "zone.wxGale": "gale-force gusts", "zone.wxStrong": "strong wind",
      "zone.dir.bura": "bora", "zone.dir.jugo": "jugo (sirocco)", "zone.dir.maestral": "maestral", "zone.dir.tramontana": "tramontana",
      "zone.dir.levant": "levant", "zone.dir.ostro": "ostro", "zone.dir.lebic": "lebić (libeccio)", "zone.dir.pulenat": "pulenat (ponente)"
    }
  });
  function T(k, v){ return CM.t("zone." + k, v); }

  /* ---------- Zaštićena područja u moru (pojednostavljene granice, [lat, lon]) ---------- */
  var ZONES = [
    { hr: "NP Brijuni", en: "Brijuni National Park", c: [[44.955,13.735],[44.935,13.79],[44.89,13.80],[44.855,13.77],[44.87,13.71],[44.92,13.70]] },
    { hr: "Posebni rezervat Limski zaljev", en: "Lim Bay special reserve", c: [[45.139,13.62],[45.137,13.735],[45.124,13.735],[45.126,13.62]] },
    { hr: "PP Telašćica", en: "Telašćica Nature Park", c: [[43.935,15.13],[43.92,15.22],[43.875,15.24],[43.85,15.18],[43.88,15.11]] },
    { hr: "NP Kornati", en: "Kornati National Park", c: [[43.86,15.20],[43.83,15.32],[43.78,15.45],[43.72,15.42],[43.74,15.28],[43.80,15.18]] },
    { hr: "PP Lastovsko otočje", en: "Lastovo Islands Nature Park", c: [[42.80,16.70],[42.79,16.92],[42.73,17.02],[42.68,16.95],[42.69,16.75]] },
    { hr: "NP Mljet", en: "Mljet National Park", c: [[42.80,17.31],[42.79,17.42],[42.75,17.45],[42.725,17.36],[42.76,17.29]] },
    { hr: "Posebni rezervat Malostonski zaljev", en: "Mali Ston Bay special reserve", c: [[42.905,17.62],[42.88,17.72],[42.84,17.75],[42.81,17.70],[42.85,17.60]] }
  ];

  /* ---------- Geometrija (iste formule kao alat koji je napravio data/obala.js) ---------- */
  var LAT0 = 43.8, KX = 111.32 * Math.cos(LAT0 * Math.PI / 180), KY = 110.57, NM = 1.852;
  var SEGS = [];
  if(COAST){
    COAST.coast.forEach(function(f){
      for(var i = 0; i + 3 < f.length; i += 2){
        SEGS.push([f[i + 1] * KX, f[i] * KY, f[i + 3] * KX, f[i + 2] * KY]);
      }
    });
  }
  function inPoly(lat, lon, poly){
    var ins = false;
    for(var i = 0, j = poly.length - 1; i < poly.length; j = i++){
      var ai = poly[i][0], oi = poly[i][1], aj = poly[j][0], oj = poly[j][1];
      if((ai > lat) !== (aj > lat) && lon < (oj - oi) * (lat - ai) / (aj - ai) + oi) ins = !ins;
    }
    return ins;
  }
  function segDist(x, y, x1, y1, x2, y2){
    var dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy;
    var t = L ? ((x - x1) * dx + (y - y1) * dy) / L : 0;
    t = Math.max(0, Math.min(1, t));
    return { d: Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)), cross: dx * (y - y1) - dy * (x - x1) };
  }
  // + more, − kopno (kopno je lijevo od smjera crte), null ako nema obale u krugu od 30 km
  function signedDist(x, y){
    var best = Infinity, side = 0;
    for(var k = 0; k < SEGS.length; k++){
      var s = SEGS[k], r = segDist(x, y, s[0], s[1], s[2], s[3]);
      if(r.d < best - 1e-9){ best = r.d; side = r.cross; }
      else if(Math.abs(r.d - best) <= 1e-9) side += r.cross;
    }
    if(best > 30) return null;
    return side > 0 ? -best : best;
  }
  function distToBase(x, y){
    var best = Infinity, B = COAST.base;
    for(var i = 0; i < B.length - 1; i++){
      best = Math.min(best, segDist(x, y, B[i][1] * KX, B[i][0] * KY, B[i + 1][1] * KX, B[i + 1][0] * KY).d);
    }
    COAST.islets.forEach(function(p){ best = Math.min(best, Math.hypot(x - p[2] * KX, y - p[1] * KY)); });
    return best;
  }
  // MARPOL udaljenost u km: < 0 kopno, 0 unutarnje vode, inače do obale, polazne crte ili otočića
  function marpolDist(lat, lon){
    var x = lon * KX, y = lat * KY;
    var sd = signedDist(x, y), inner = inPoly(lat, lon, COAST.inner);
    if(sd == null){ if(inner) return -30; sd = 30; }
    if(inner && sd > 15) return -sd;
    if(sd < 0) return sd;
    if(inner) return 0;
    return Math.min(sd, distToBase(x, y));
  }
  function eastOfMedian(lat, lon){
    var M = COAST.median;
    for(var i = 0; i < M.length - 1; i++){
      var la = M[i][0], loa = M[i][1], lb = M[i + 1][0], lob = M[i + 1][1];
      if(lat <= la && lat >= lb){ var k = (la - lat) / (la - lb); return lon > loa + (lob - loa) * k; }
    }
    return lat > M[0][0] ? lon > M[0][1] : lon > M[M.length - 1][1];
  }
  function km(lat1, lon1, lat2, lon2){ return Math.hypot((lon1 - lon2) * KX, (lat1 - lat2) * KY); }

  /* ---------- Procjena za točku ---------- */
  var VERDICT = { port: ["no", "no", "cond"], park: ["no", "no", "no"], near: ["no", "no", "cond"], mid: ["no", "yes", "yes"], far: ["yes", "yes", "yes"] };
  function nearestStation(lat, lon){
    var best = null, bd = Infinity;
    (MM ? MM.places : []).forEach(function(p){
      if(!p.hasPos) return;
      var d = km(lat, lon, p.lat, p.lon);
      if(d < bd){ bd = d; best = p; }
    });
    return best ? { p: best, km: bd } : null;
  }
  function assess(lat, lon){
    var d = marpolDist(lat, lon);
    var zone = null;
    ZONES.forEach(function(z){ if(!zone && inPoly(lat, lon, z.c)) zone = z; });
    var st = nearestStation(lat, lon);
    var where;
    // Obala je pojednostavljena (~1 km), pa točka tik uz nju (npr. u luci) ne smije ispasti „kopno“
    if(d < 0 && d > -1.2){ d = 0; }
    if(d < 0 && !zone) where = "land";
    else if(st && st.km < 1.2) where = "port";
    else if(zone) where = "park";
    else if(d < 3 * NM) where = "near";
    else if(d < 12 * NM) where = "mid";
    else where = "far";
    var foreign = !eastOfMedian(lat, lon) ? "foreignW" : ((lat < 42.42 && lon > 18.52) || (lat > 45.47 && lon < 13.66)) ? "foreign" : "";
    return { lat: lat, lon: lon, d: d, where: where, zone: zone, st: st, foreign: foreign };
  }

  /* ---------- Koordinate: čitanje i ispis ---------- */
  function parseCoords(str){
    var s = String(str || "").trim().toUpperCase().replace(/[°º˚′'’″"”]/g, " ").replace(/\s+/g, " ");
    if(!s) return null;
    if(s.indexOf(".") < 0 && /\d,\d/.test(s) && /\d,\d+\s*[NS]?\s*[;\s]\s*\d/.test(s)) s = s.replace(/(\d),(\d)/g, "$1.$2");
    var hemi = s.match(/[NSEW]/g) || [];
    var parts;
    if(/[NS]/.test(s) && /[EW]/.test(s)){
      var m = s.match(/^(.*?)([NS])\s*[,;]?\s*(.*?)([EW])\s*$/) || s.match(/^([NS])(.*?)([EW])(.*)$/);
      if(!m) return null;
      if(m[1] === "N" || m[1] === "S") parts = [{ v: m[2], h: m[1] }, { v: m[4], h: m[3] }];
      else parts = [{ v: m[1], h: m[2] }, { v: m[3], h: m[4] }];
    } else if(hemi.length){
      return null;
    } else {
      var nums = s.split(/[\s,;]+/).filter(Boolean);
      var half = nums.length / 2;
      if(nums.length !== 2 && nums.length !== 4 && nums.length !== 6) return null;
      parts = [{ v: nums.slice(0, half).join(" "), h: "N" }, { v: nums.slice(half).join(" "), h: "E" }];
    }
    function dms(p){
      var n = p.v.trim().split(/[\s,;]+/).filter(Boolean).map(Number);
      if(!n.length || n.length > 3 || n.some(isNaN)) return NaN;
      var v = n[0] + (n[1] || 0) / 60 + (n[2] || 0) / 3600;
      return p.h === "S" || p.h === "W" ? -v : v;
    }
    var lat = dms(parts[0]), lon = dms(parts[1]);
    if(isNaN(lat) || isNaN(lon)) return null;
    return { lat: lat, lon: lon };
  }
  function fmtDm(v, pos, neg){
    var a = Math.abs(v), d = Math.floor(a), m = (a - d) * 60;
    var ms = m.toFixed(2);
    if(ms === "60.00"){ d += 1; ms = "0.00"; }
    if(CM.lang !== "en") ms = ms.replace(".", ",");
    return d + "°" + ms + "′ " + (v >= 0 ? pos : neg);
  }
  function fmtCoords(lat, lon){
    return fmtDm(lat, "N", "S") + "  " + fmtDm(lon, "E", "W") + "  (" + lat.toFixed(5) + ", " + lon.toFixed(5) + ")";
  }
  function fmtNm(kmv){
    var n = kmv / NM;
    var s = n < 10 ? n.toFixed(1) : String(Math.round(n));
    return CM.lang === "en" ? s : s.replace(".", ",");
  }

  /* ---------- Slojevi na karti ---------- */
  var map = MM && MM.map;
  var groups = {}, checkMarker = null, lastCheck = null;
  var LAYER_KEY = "cm-map-layers";
  var layerOn = CM.getJSON(LAYER_KEY, null) || { zones: true, lines: true, wx: true };

  function flatToLatLngs(f){ var out = []; for(var i = 0; i + 1 < f.length; i += 2) out.push([f[i], f[i + 1]]); return out; }
  function buildLayers(){
    if(!map || !window.L) return;
    groups.zones = L.layerGroup(ZONES.map(function(z){
      return L.polygon(z.c, { className: "cm-zone", weight: 2 })
        .bindTooltip(function(){ return esc(CM.lang === "en" ? z.en : z.hr) + " · " + esc(T("legendZone")); }, { sticky: true });
    }));
    var lines = [];
    if(COAST){
      lines.push(L.polyline(COAST.nm12.map(flatToLatLngs), { className: "cm-nm12", interactive: false, weight: 2 }));
      lines.push(L.polyline(COAST.nm3.map(flatToLatLngs), { className: "cm-nm3", interactive: false, weight: 1.5 }));
      lines.push(L.polyline(COAST.base, { className: "cm-base", interactive: false, weight: 1.2 }));
    }
    groups.lines = L.layerGroup(lines);
    groups.wx = L.layerGroup();
    Object.keys(groups).forEach(function(k){ if(layerOn[k]) groups[k].addTo(map); });
  }
  function setLayer(k, on){
    layerOn[k] = on;
    CM.setJSON(LAYER_KEY, layerOn);
    if(!map || !groups[k]) return;
    if(on) groups[k].addTo(map); else map.removeLayer(groups[k]);
    if(k === "wx"){ $("wxNote").hidden = !on; if(on) loadWeather(false); }
  }

  /* ---------- Provjera ---------- */
  function badge(v){ return '<span class="zone-badge is-' + v + '">' + esc(T("v." + v)) + "</span>"; }
  function renderCheck(a, isGps){
    lastCheck = { a: a, gps: isGps };
    var box = $("checkResult");
    var html = '<p class="zone-coords"><b>' + esc(T(isGps ? "here" : "point")) + ":</b> " + esc(fmtCoords(a.lat, a.lon)) + "</p>";
    html += '<p class="zone-where is-' + a.where + '">' + esc(T("where." + a.where)) +
      (a.where === "park" && a.zone ? " · " + esc(CM.lang === "en" ? a.zone.en : a.zone.hr) : "") +
      (a.where === "port" && a.st ? " · " + esc(T("portNear", { name: a.st.p.name })) : "") + "</p>";
    if(a.where === "land"){
      html += "<p>" + esc(T("landText")) + "</p>";
    } else {
      html += '<p class="zone-dist">' + esc(T("dist")) + ": <b>" + esc(a.d <= 0 ? T("distInner") : T("distNm", { n: fmtNm(a.d) })) + "</b></p>";
      html += '<ul class="zone-rules">' + [0, 1, 2].map(function(i){
        var v = VERDICT[a.where][i];
        return '<li><div class="zone-rule-head"><span>' + esc(T("sys." + i)) + "</span>" + badge(v) + "</div><p>" + esc(T("r." + a.where + "." + i)) + "</p></li>";
      }).join("") + "</ul>";
    }
    if(a.foreign) html += '<p class="zone-foreign">' + esc(T(a.foreign)) + "</p>";
    if(a.st){
      html += '<div class="zone-nearest"><span>' + esc(T("nearest")) + ": <b>" + esc(a.st.p.name) + "</b> · " + esc(fmtNm(a.st.km)) + " NM</span>" +
        '<button type="button" class="link-btn" id="zoneShowSt">' + esc(T("show")) + "</button></div>";
    }
    html += '<p class="zone-note">' + esc(T("rulesNote")) + " " + esc(T("approx")) + "</p>";
    box.innerHTML = html;
    box.hidden = false;
    var b = $("zoneShowSt");
    if(b) b.addEventListener("click", function(){ if(MM) MM.select(a.st.p); });
    if(CM.motion) CM.motion.swap(box);

    if(map){
      var ll = [a.lat, a.lon];
      if(!checkMarker){
        checkMarker = L.marker(ll, { icon: L.divIcon({ className: "cm-check-pin", html: "<span></span>", iconSize: [22, 22] }), keyboard: false, zIndexOffset: 800 }).addTo(map);
      } else checkMarker.setLatLng(ll);
      var worst = a.where === "land" ? "" : badge(VERDICT[a.where][0]);
      checkMarker.bindPopup('<div class="zone-pop"><b>' + esc(T("where." + a.where)) + "</b>" + (worst ? "<br>" + esc(T("sys.0")) + ": " + worst : "") +
        '<br><a href="#checkCard" class="zone-pop-more">' + esc(T("popMore")) + " ↓</a></div>", { autoPan: true }).openPopup();
    }
  }
  function runCheck(lat, lon, isGps, pan){
    if(!COAST) return;
    if(lat < 39.5 || lat > 46.2 || lon < 12 || lon > 20.5){ showErr(T("coordsOut")); return; }
    showErr("");
    var a = assess(lat, lon);
    if(map && pan) map.setView([lat, lon], Math.max(map.getZoom(), 10));
    renderCheck(a, isGps);
  }
  function showErr(msg){ var e = $("coordsErr"); e.textContent = msg; if(msg) $("coordsInput").setAttribute("aria-invalid", "true"); else $("coordsInput").removeAttribute("aria-invalid"); }

  function initCheck(){
    $("coordsForm").addEventListener("submit", function(e){
      e.preventDefault();
      var p = parseCoords($("coordsInput").value);
      if(!p){ showErr(T("coordsErr")); if(CM.motion) CM.motion.shake($("coordsInput")); return; }
      runCheck(p.lat, p.lon, false, true);
    });
    $("gpsCheck").addEventListener("click", function(){
      var btn = this, label = btn.querySelector("span");
      if(!navigator.geolocation){ showErr(CM.t("map.noGeo")); return; }
      btn.classList.add("busy"); label.textContent = T("gpsBusy");
      navigator.geolocation.getCurrentPosition(function(pos){
        btn.classList.remove("busy"); label.textContent = T("gps");
        var lat = pos.coords.latitude, lon = pos.coords.longitude;
        $("coordsInput").value = lat.toFixed(5) + ", " + lon.toFixed(5);
        runCheck(lat, lon, true, true);
      }, function(err){
        btn.classList.remove("busy"); label.textContent = T("gps");
        showErr(CM.t(err && err.code === 1 ? "map.geoDenied" : !window.isSecureContext ? "map.geoHttps" : "map.geoNone"));
      }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
    });
    if(map){
      map.on("click", function(e){
        if(MM.isPicking()) return;
        $("coordsInput").value = e.latlng.lat.toFixed(5) + ", " + e.latlng.lng.toFixed(5);
        runCheck(e.latlng.lat, e.latlng.lng, false, false);
      });
      map.on("popupopen", function(e){
        var a = e.popup.getElement() && e.popup.getElement().querySelector(".zone-pop-more");
        if(a) a.addEventListener("click", function(ev){ ev.preventDefault(); $("checkCard").scrollIntoView({ behavior: CM.motion && CM.motion.reduced ? "auto" : "smooth", block: "start" }); });
      });
    }
  }

  /* ---------- Nevrijeme (Open-Meteo) ---------- */
  var WX_POINTS = [
    ["Umag", 45.43, 13.50], ["Pula", 44.86, 13.82], ["Rijeka", 45.31, 14.42], ["Senj", 44.99, 14.88], ["Mali Lošinj", 44.53, 14.44],
    ["Zadar", 44.10, 15.20], ["Kornati", 43.80, 15.30], ["Šibenik", 43.70, 15.86], ["Split", 43.49, 16.43], ["Vis", 43.04, 16.15],
    ["Makarska", 43.28, 17.00], ["Korčula", 42.97, 17.13], ["Lastovo", 42.74, 16.86], ["Palagruža", 42.39, 16.26], ["Dubrovnik", 42.63, 18.08]
  ];
  var WX_KEY = "cm-wx", wxTimer = null, wxData = null;
  function dirName(deg){
    // Jadranski vjetrovi po smjeru odakle pušu (bura je ENE–NE, jugo ESE–SE)
    var d = ((deg % 360) + 360) % 360;
    var n = d < 20 || d >= 337.5 ? "tramontana" : d < 80 ? "bura" : d < 105 ? "levant" : d < 160 ? "jugo" : d < 200 ? "ostro" : d < 245 ? "lebic" : d < 290 ? "pulenat" : "maestral";
    return T("dir." + n);
  }
  function level(p){
    if(p.storm || p.maxGust >= 34) return "alert";
    if(p.maxGust >= 25) return "warn";
    return "ok";
  }
  function parseWx(json){
    var arr = Array.isArray(json) ? json : [json];
    return arr.map(function(r, i){
      var c = r.current || {}, h = r.hourly || {};
      var gusts = (h.wind_gusts_10m || []).filter(function(v){ return v != null; });
      var codes = h.weather_code || [];
      return {
        name: WX_POINTS[i][0], lat: WX_POINTS[i][1], lon: WX_POINTS[i][2],
        ws: Math.round(c.wind_speed_10m || 0), wg: Math.round(c.wind_gusts_10m || 0), wd: c.wind_direction_10m || 0,
        maxGust: Math.round(Math.max.apply(null, gusts.concat([c.wind_gusts_10m || 0]))),
        storm: codes.concat([c.weather_code]).some(function(code){ return code >= 95; })
      };
    });
  }
  function renderWx(data, when, stale){
    wxData = { data: data, when: when, stale: stale };
    if(groups.wx){
      groups.wx.clearLayers();
      data.forEach(function(p){
        var lv = level(p);
        var html = '<span class="wx-arrow" style="transform:rotate(' + Math.round(p.wd + 180) + 'deg)"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V4M6 10l6-6 6 6"/></svg></span><b>' + p.ws + "</b>" + (p.storm ? '<i aria-hidden="true">⚡</i>' : "");
        L.marker([p.lat, p.lon], { icon: L.divIcon({ className: "cm-wx is-" + lv, html: html, iconSize: null }), keyboard: false })
          .bindTooltip(function(){
            var t = "<b>" + esc(p.name) + "</b><br>" + esc(T("wxNow", { dir: dirName(p.wd), ws: p.ws, wg: p.wg })) + "<br>" + esc(T("wxMax", { g: p.maxGust }));
            if(p.storm) t += "<br>⚡ " + esc(T("wxStorm"));
            return t;
          }, { direction: "top", offset: [0, -8] })
          .addTo(groups.wx);
      });
    }
    var bad = data.filter(function(p){ return level(p) !== "ok"; }).sort(function(a, b){ return b.maxGust - a.maxGust; });
    var note = $("wxNote");
    var msg = bad.length
      ? T("wxWarn", { list: bad.slice(0, 5).map(function(p){
          var what = p.storm ? T("wxStorm") : p.maxGust >= 34 ? T("wxGale") : T("wxStrong");
          return p.name + " (" + what + ", " + dirName(p.wd) + ", " + p.maxGust + (CM.lang === "en" ? " kn" : " čv") + ")";
        }).join("; ") })
      : T("wxOk");
    note.className = "zone-wx is-" + (bad.some(function(p){ return level(p) === "alert"; }) ? "alert" : bad.length ? "warn" : "ok");
    note.innerHTML = '<span class="zone-wx-text">' + esc(msg) + (stale ? " " + esc(T("wxOld", { time: CM.fmtTime(new Date(when)) })) : "") + "</span>" +
      '<span class="zone-wx-links"><a class="cm-link" href="https://meteo.hr" target="_blank" rel="noopener">' + esc(T("wxOfficial")) + "</a> · " +
      '<a class="cm-link" href="https://open-meteo.com" target="_blank" rel="noopener">' + esc(T("wxSource")) + "</a></span>";
  }
  function loadWeather(force){
    var note = $("wxNote");
    var cached = CM.getJSON(WX_KEY, null);
    if(!force && cached && Date.now() - cached.when < 15 * 60000){ renderWx(cached.data, cached.when, false); return; }
    if(!wxData) note.innerHTML = '<span class="zone-wx-text">' + esc(T("wxLoading")) + "</span>";
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + WX_POINTS.map(function(p){ return p[1]; }).join(",") +
      "&longitude=" + WX_POINTS.map(function(p){ return p[2]; }).join(",") +
      "&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code&hourly=wind_gusts_10m,weather_code" +
      "&forecast_hours=12&wind_speed_unit=kn&timezone=Europe%2FZagreb";
    fetch(url).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); }).then(function(json){
      var data = parseWx(json), when = Date.now();
      CM.setJSON(WX_KEY, { data: data, when: when });
      renderWx(data, when, false);
    }).catch(function(){
      if(cached) renderWx(cached.data, cached.when, true);
      else note.innerHTML = '<span class="zone-wx-text">' + esc(T("wxFail")) + '</span><span class="zone-wx-links"><a class="cm-link" href="https://meteo.hr" target="_blank" rel="noopener">' + esc(T("wxOfficial")) + "</a></span>";
    });
  }

  /* ---------- Pokretanje ---------- */
  function initToggles(){
    Array.prototype.forEach.call(doc.querySelectorAll("[data-layer]"), function(inp){
      var k = inp.getAttribute("data-layer");
      inp.checked = !!layerOn[k];
      inp.addEventListener("change", function(){ setLayer(k, inp.checked); });
    });
    $("wxNote").hidden = !layerOn.wx;
  }
  CM.applyI18n();   // tekstovi u map.html s ključevima zone.* dodani su tek ovdje
  buildLayers();
  initToggles();
  initCheck();
  if(layerOn.wx) loadWeather(false);
  wxTimer = setInterval(function(){ if(layerOn.wx && doc.visibilityState === "visible") loadWeather(true); }, 15 * 60000);
  window.addEventListener("cm:lang", function(){
    if(lastCheck) renderCheck(lastCheck.a, lastCheck.gps);
    if(wxData) renderWx(wxData.data, wxData.when, wxData.stale);
  });
  CM.zone = { assess: assess, parseCoords: parseCoords, marpolDist: marpolDist };   // za provjeru i testove
})();
