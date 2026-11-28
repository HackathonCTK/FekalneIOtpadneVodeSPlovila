/*
 * ČistoMore — usmjeravanje prijava nadležnoj službi (zajednički modul)
 * ---------------------------------------------------------------------
 * Podaci i pravila usmjeravanja su iz portala grupe 3 („Praćenje i obrada prijava“).
 * Ovdje su izdvojeni da ih koriste i server (dodjela službe pri spremanju prijave),
 * i portal službi (obrada.html), i obrazac za prijavu (pregled kome će prijava otići).
 * Vrste plovila: spojeni popisi grupe 1 (obrazac) i grupe 3 (portal).
 *
 * Granice luka i koncesija, sjedišta i pravila su PRIBLIŽNI PRIMJERI (grupa 3) i
 * treba ih potvrditi s nadležnim institucijama.
 *
 * U pregledniku: window.CM_ROUTING; u Node.js: require('./public/routing.js').
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CM_ROUTING = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- geometrija (grupa 3) ---------- */
  var RAD = Math.PI / 180, R_NM = 3440.065;
  function distNM(a, b) {
    var dLat = (b.lat - a.lat) * RAD, dLng = (b.lng - a.lng) * RAD;
    var h = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.pow(Math.sin(dLng / 2), 2);
    return 2 * R_NM * Math.asin(Math.min(1, Math.sqrt(h)));
  }
  function bearing(a, b) {
    var y = Math.sin((b.lng - a.lng) * RAD) * Math.cos(b.lat * RAD);
    var x = Math.cos(a.lat * RAD) * Math.sin(b.lat * RAD) - Math.sin(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.cos((b.lng - a.lng) * RAD);
    return (Math.atan2(y, x) / RAD + 360) % 360;
  }
  function destPoint(a, brg, nm) {
    var d = nm / R_NM, b = brg * RAD, la = a.lat * RAD, lo = a.lng * RAD;
    var la2 = Math.asin(Math.sin(la) * Math.cos(d) + Math.cos(la) * Math.sin(d) * Math.cos(b));
    var lo2 = lo + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(la), Math.cos(d) - Math.sin(la) * Math.sin(la2));
    return { lat: la2 / RAD, lng: lo2 / RAD };
  }
  function angDiff(a, b) { var d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
  function inPoly(p, poly) {
    var ins = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var yi = poly[i][0], xi = poly[i][1], yj = poly[j][0], xj = poly[j][1];
      if (((yi > p.lat) !== (yj > p.lat)) && (p.lng < (xj - xi) * (p.lat - yi) / (yj - yi) + xi)) ins = !ins;
    }
    return ins;
  }
  function rect(s, w, n, e) { return [[s, w], [s, e], [n, e], [n, w]]; }
  function inCroatiaBox(lat, lng) { return lat >= 42.2 && lat <= 46.6 && lng >= 13.2 && lng <= 19.5; }

  /* ---------- statusi i vrste (grupa 3) ---------- */
  var STATUS = {
    // ključ „zaprimljeno“ ostaje (postojeće prijave), a prikazuje se kao „Nepregledano“
    zaprimljeno: { label: 'Nepregledano', en: 'Not reviewed yet', color: '#E07A2E' },
    obrada: { label: 'U obradi', en: 'In progress', color: '#2F74C0' },
    rijeseno: { label: 'Riješeno', en: 'Resolved', color: '#3E8E50' },
    odbijeno: { label: 'Odbijeno', en: 'Rejected', color: '#C2413A' }
  };
  var ORDER = ['zaprimljeno', 'obrada', 'rijeseno'];        // redoslijed obrade (koraci)
  var ALL_STATUS = ORDER.concat(['odbijeno']);              // odbijeno je izvan redoslijeda, uz razlog
  var TYPES = {
    fekalne: { label: 'Ispuštanje fekalnih ili otpadnih voda s plovila', en: 'Sewage or wastewater discharge from a vessel', vessel: true },
    ulje: { label: 'Uljna mrlja ili onečišćenje mora', en: 'Oil slick or other sea pollution' },
    otpad_more: { label: 'Plutajući otpad u moru', en: 'Floating waste in the sea' },
    otpad_plaza: { label: 'Otpad na plaži', en: 'Waste on a beach' },
    septicka: { label: 'Izljev septičke jame ili kanalizacije u more', en: 'Septic tank or sewer leaking into the sea' },
    napusteno: { label: 'Napušteno ili potonulo plovilo', en: 'Abandoned or sunken vessel', vessel: true },
    otpad_kopno: { label: 'Divlje odlagalište uz obalu', en: 'Illegal dump along the coast' }
  };
  var TYPE_ORDER = ['fekalne', 'ulje', 'otpad_more', 'otpad_plaza', 'septicka', 'napusteno', 'otpad_kopno'];

  /* Vrste plovila: popis grupe 1 dopunjen vrstama iz grupe 3 (gulet, motorni brod, gumenjak,
     brod za kružna putovanja, nepoznato). Vrijednost koja se sprema je hrvatski naziv. */
  var VESSELS = [
    ['Jahta', 'Yacht'],
    ['Jedrilica', 'Sailing boat'],
    ['Gulet', 'Gulet'],
    ['Motorni brod', 'Motorboat'],
    ['Mali čamac / gumenjak', 'Small boat / dinghy'],
    ['Ribarski brod', 'Fishing boat'],
    ['Putnički brod / trajekt', 'Passenger ship / ferry'],
    ['Brod za kružna putovanja', 'Cruise ship'],
    ['Teretni brod', 'Cargo ship'],
    ['Tanker', 'Tanker'],
    ['Ostalo', 'Other'],
    ['Nepoznato', 'Unknown']
  ];
  /* Veličina broda (grupa 1) */
  var SIZES = [
    ['Mali (do 10 m)', 'Small (up to 10 m)'],
    ['Srednji (10–24 m)', 'Medium (10–24 m)'],
    ['Veliki (24–50 m)', 'Large (24–50 m)'],
    ['Vrlo veliki (preko 50 m)', 'Very large (over 50 m)'],
    ['Ne mogu procijeniti', 'Can’t tell']
  ];
  /* Vrsta otpada (grupa 1), samo za ispuštanje s plovila */
  var WASTE = {
    fekalna: { label: 'Fekalna (crne vode)', en: 'Sewage (blackwater)' },
    otpadna: { label: 'Otpadna (sive vode)', en: 'Wastewater (greywater)' },
    ostalo: { label: 'Ostalo / ne znam', en: 'Other / not sure' }
  };
  /* Smjerovi (grupa 3): S = sjever … */
  var DIRS = [['S', 'sjever', 'N', 'north'], ['SI', 'sjeveroistok', 'NE', 'north-east'], ['I', 'istok', 'E', 'east'], ['JI', 'jugoistok', 'SE', 'south-east'],
    ['J', 'jug', 'S', 'south'], ['JZ', 'jugozapad', 'SW', 'south-west'], ['Z', 'zapad', 'W', 'west'], ['SZ', 'sjeverozapad', 'NW', 'north-west']];
  function dirIdx(deg) { return Math.round(((deg % 360) + 360) % 360 / 45) % 8; }
  function dirName(deg, lang) { var d = DIRS[dirIdx(deg)]; return lang === 'en' ? d[3] : d[1]; }
  function dirShort(deg, lang) { var d = DIRS[dirIdx(deg)]; return lang === 'en' ? d[2] : d[0]; }

  var COUNTIES = ['Istarska', 'Primorsko-goranska', 'Ličko-senjska', 'Zadarska', 'Šibensko-kninska', 'Splitsko-dalmatinska', 'Dubrovačko-neretvanska'];
  var COUNTIES_EN = { 'Istarska': 'Istria', 'Primorsko-goranska': 'Primorje-Gorski Kotar', 'Ličko-senjska': 'Lika-Senj', 'Zadarska': 'Zadar',
    'Šibensko-kninska': 'Šibenik-Knin', 'Splitsko-dalmatinska': 'Split-Dalmatia', 'Dubrovačko-neretvanska': 'Dubrovnik-Neretva' };

  /* ---------- nadležne službe (grupa 3, približni primjeri) ---------- */
  var LK = [
    { id: 'lk-pula', name: 'Lučka kapetanija Pula', lat: 44.8695, lng: 13.8455, county: 'Istarska' },
    { id: 'lk-rijeka', name: 'Lučka kapetanija Rijeka', lat: 45.3265, lng: 14.4405, county: 'Primorsko-goranska' },
    { id: 'lk-senj', name: 'Lučka kapetanija Senj', lat: 44.9895, lng: 14.9035, county: 'Ličko-senjska' },
    { id: 'lk-zadar', name: 'Lučka kapetanija Zadar', lat: 44.1165, lng: 15.2265, county: 'Zadarska' },
    { id: 'lk-sibenik', name: 'Lučka kapetanija Šibenik', lat: 43.7345, lng: 15.8885, county: 'Šibensko-kninska' },
    { id: 'lk-split', name: 'Lučka kapetanija Split', lat: 43.5045, lng: 16.4395, county: 'Splitsko-dalmatinska' },
    { id: 'lk-ploce', name: 'Lučka kapetanija Ploče', lat: 43.0545, lng: 17.4325, county: null },
    { id: 'lk-dubrovnik', name: 'Lučka kapetanija Dubrovnik', lat: 42.6595, lng: 18.0855, county: 'Dubrovačko-neretvanska' }
  ];
  var TOWNS = [
    ['umag', 'Grad Umag', 45.434, 13.520, 'Istarska'], ['porec', 'Grad Poreč', 45.227, 13.594, 'Istarska'], ['rovinj', 'Grad Rovinj', 45.081, 13.638, 'Istarska'], ['pula', 'Grad Pula', 44.866, 13.850, 'Istarska'],
    ['opatija', 'Grad Opatija', 45.338, 14.307, 'Primorsko-goranska'], ['rijeka', 'Grad Rijeka', 45.327, 14.442, 'Primorsko-goranska'], ['crikvenica', 'Grad Crikvenica', 45.176, 14.692, 'Primorsko-goranska'], ['krk', 'Grad Krk', 45.027, 14.575, 'Primorsko-goranska'], ['losinj', 'Grad Mali Lošinj', 44.531, 14.468, 'Primorsko-goranska'],
    ['senj', 'Grad Senj', 44.989, 14.905, 'Ličko-senjska'], ['novalja', 'Grad Novalja', 44.556, 14.885, 'Ličko-senjska'],
    ['zadar', 'Grad Zadar', 44.119, 15.231, 'Zadarska'], ['biograd', 'Grad Biograd na Moru', 43.937, 15.443, 'Zadarska'],
    ['vodice', 'Grad Vodice', 43.759, 15.778, 'Šibensko-kninska'], ['sibenik', 'Grad Šibenik', 43.735, 15.890, 'Šibensko-kninska'],
    ['trogir', 'Grad Trogir', 43.516, 16.251, 'Splitsko-dalmatinska'], ['okrug', 'Općina Okrug', 43.494, 16.255, 'Splitsko-dalmatinska'], ['split', 'Grad Split', 43.508, 16.440, 'Splitsko-dalmatinska'], ['solta', 'Općina Šolta', 43.388, 16.276, 'Splitsko-dalmatinska'], ['supetar', 'Grad Supetar', 43.384, 16.553, 'Splitsko-dalmatinska'], ['milna', 'Općina Milna', 43.326, 16.452, 'Splitsko-dalmatinska'], ['bol', 'Općina Bol', 43.262, 16.655, 'Splitsko-dalmatinska'], ['omis', 'Grad Omiš', 43.444, 16.689, 'Splitsko-dalmatinska'], ['makarska', 'Grad Makarska', 43.297, 17.017, 'Splitsko-dalmatinska'], ['hvar', 'Grad Hvar', 43.172, 16.442, 'Splitsko-dalmatinska'], ['vis', 'Grad Vis', 43.062, 16.183, 'Splitsko-dalmatinska'],
    ['ploce', 'Grad Ploče', 43.056, 17.433, 'Dubrovačko-neretvanska', { lk: 'lk-ploce' }], ['vela-luka', 'Općina Vela Luka', 42.963, 16.720, 'Dubrovačko-neretvanska'], ['korcula', 'Grad Korčula', 42.960, 17.135, 'Dubrovačko-neretvanska'], ['ston', 'Općina Ston', 42.838, 17.697, 'Dubrovačko-neretvanska'], ['mljet', 'Općina Mljet', 42.746, 17.530, 'Dubrovačko-neretvanska'], ['dubrovnik', 'Grad Dubrovnik', 42.650, 18.094, 'Dubrovačko-neretvanska'], ['konavle', 'Općina Konavle', 42.581, 18.218, 'Dubrovačko-neretvanska']
  ].map(function (t) {
    var lk = (t[5] && t[5].lk) || (LK.filter(function (l) { return l.county === t[4]; })[0] || {}).id;
    return { id: t[0], unit: t[1], lat: t[2], lng: t[3], county: t[4], lk: lk };
  });
  var PORTS = [
    { id: 'p-split', name: 'Gradska luka Split', authority: 'lu-split', poly: rect(43.4985, 16.4320, 43.5068, 16.4475) },
    { id: 'p-supetar', name: 'Luka Supetar', authority: 'zlu-split', poly: rect(43.3830, 16.5470, 43.3880, 16.5560) },
    { id: 'p-gruz', name: 'Luka Gruž, Dubrovnik', authority: 'lu-dubrovnik', poly: rect(42.6560, 18.0790, 42.6640, 18.0930) },
    { id: 'p-zadar', name: 'Gradska luka Zadar', authority: 'lu-zadar', poly: rect(44.1125, 15.2195, 44.1200, 15.2320) },
    { id: 'p-rijeka', name: 'Luka Rijeka', authority: 'lu-rijeka', poly: rect(45.3180, 14.4180, 45.3290, 14.4450) }
  ];
  var CONCESSIONS = [
    { id: 'c-znjan', name: 'Plaža Žnjan', service: 'k-znjan', poly: rect(43.4990, 16.4600, 43.5055, 16.4860) },
    { id: 'c-bacvice', name: 'Plaža Bačvice', service: 'k-bacvice', poly: rect(43.5000, 16.4478, 43.5030, 16.4520) },
    { id: 'c-banje', name: 'Plaža Banje', service: 'k-banje', poly: rect(42.6398, 18.1125, 42.6428, 18.1180) }
  ];

  function unitEn(unit) { return unit.replace(/^Grad /, 'City of ').replace(/^Općina /, 'Municipality of '); }
  var SERVICES = {};
  LK.forEach(function (l) { SERVICES[l.id] = { id: l.id, name: l.name, en: 'Harbour Master’s Office ' + l.name.replace('Lučka kapetanija ', ''), group: 'Lučke kapetanije' }; });
  [['lu-split', 'Lučka uprava Split', 'Split Port Authority'], ['zlu-split', 'Županijska lučka uprava Split', 'Split County Port Authority'],
    ['lu-dubrovnik', 'Lučka uprava Dubrovnik', 'Dubrovnik Port Authority'], ['lu-zadar', 'Lučka uprava Zadar', 'Zadar Port Authority'],
    ['lu-rijeka', 'Lučka uprava Rijeka', 'Rijeka Port Authority']
  ].forEach(function (a) { SERVICES[a[0]] = { id: a[0], name: a[1], en: a[2], group: 'Lučke uprave' }; });
  [['k-znjan', 'Koncesionar plaže Žnjan', 'Žnjan beach concessionaire'], ['k-bacvice', 'Koncesionar plaže Bačvice', 'Bačvice beach concessionaire'],
    ['k-banje', 'Koncesionar plaže Banje', 'Banje beach concessionaire']
  ].forEach(function (a) { SERVICES[a[0]] = { id: a[0], name: a[1], en: a[2], group: 'Koncesionari plaža' }; });
  TOWNS.forEach(function (t) { SERVICES['kr-' + t.id] = { id: 'kr-' + t.id, name: 'Komunalni redar, ' + t.unit, en: 'Municipal warden, ' + unitEn(t.unit), group: 'Komunalni redari' }; });
  var SERVICE_GROUPS = ['Lučke kapetanije', 'Lučke uprave', 'Koncesionari plaža', 'Komunalni redari'];
  function svcName(id, lang) {
    var s = SERVICES[id];
    if (!s) return lang === 'en' ? 'Unknown service' : 'Nepoznata služba';
    return lang === 'en' ? s.en : s.name;
  }

  function nearestTown(p) {
    var best = TOWNS[0], bd = Infinity;
    TOWNS.forEach(function (t) { var d = distNM(p, t); if (d < bd) { bd = d; best = t; } });
    return best;
  }

  /* Pravila usmjeravanja (grupa 3, primjer koji treba potvrditi s institucijama).
     lang: 'hr' (zadano, sprema se uz prijavu) ili 'en' (pregled u obrascu na engleskom). */
  function route(lat, lng, type, lang) {
    var en = lang === 'en';
    function T(hr, e) { return en ? e : hr; }
    var p = { lat: lat, lng: lng }, town = nearestTown(p), lkId = town.lk;
    var port = PORTS.filter(function (x) { return inPoly(p, x.poly); })[0];
    var conc = CONCESSIONS.filter(function (x) { return inPoly(p, x.poly); })[0];
    var where = en
      ? 'Nearest settlement: ' + unitEn(town.unit) + ' (' + (COUNTIES_EN[town.county] || town.county) + ' County)'
      : 'Najbliže naselje: ' + town.unit + ' (' + town.county + ' županija)';
    var R = [];
    var svc;
    if (type === 'fekalne') {
      R.push(port ? T('Točka je unutar lučkog područja: ', 'The location is inside the port area: ') + port.name : T('Točka je na moru, izvan lučkih područja', 'The location is at sea, outside port areas'));
      R.push(T('Ispuštanje s plovila: nadzor plovidbe vodi lučka kapetanija', 'Discharge from a vessel: navigation is supervised by the harbour master’s office'));
      svc = lkId;
    } else if (type === 'ulje' || type === 'otpad_more') {
      if (port) { R.push(T('Točka je unutar lučkog područja: ', 'The location is inside the port area: ') + port.name); R.push(T('Onečišćenje mora u luci: lučka uprava', 'Sea pollution inside a port: port authority')); svc = port.authority; }
      else if (conc && type === 'otpad_more') { R.push(T('Točka je unutar koncesije: ', 'The location is inside a concession: ') + conc.name); R.push(T('Otpad u moru uz koncesijsku plažu: koncesionar', 'Waste in the sea next to a concession beach: concessionaire')); svc = conc.service; }
      else { R.push(T('Točka je na moru, izvan luka i koncesija', 'The location is at sea, outside ports and concessions')); R.push(T('Onečišćenje mora izvan luke: lučka kapetanija', 'Sea pollution outside a port: harbour master’s office')); svc = lkId; }
    } else if (type === 'otpad_plaza') {
      if (conc) { R.push(T('Točka je unutar koncesije na pomorskom dobru: ', 'The location is inside a concession on the maritime domain: ') + conc.name); R.push(T('Otpad na plaži: održava koncesionar', 'Waste on the beach: the concessionaire maintains it')); svc = conc.service; }
      else if (port) { R.push(T('Točka je unutar lučkog područja: ', 'The location is inside the port area: ') + port.name); R.push(T('Otpad unutar luke: lučka uprava', 'Waste inside a port: port authority')); svc = port.authority; }
      else { R.push(T('Plaža bez upisane koncesije (pomorsko dobro)', 'Beach without a registered concession (maritime domain)')); R.push(T('Održavanje: jedinica lokalne samouprave, komunalni redar', 'Maintenance: local government, municipal warden')); svc = 'kr-' + town.id; }
    } else if (type === 'septicka') {
      R.push(T('Izvor onečišćenja je na kopnu (objekt), a ne na plovilu', 'The source of pollution is on land (a building), not a vessel'));
      R.push(T('Septičke jame i izljevi: komunalni redar', 'Septic tanks and leaks: municipal warden'));
      svc = 'kr-' + town.id;
    } else if (type === 'napusteno') {
      if (port) { R.push(T('Plovilo je unutar lučkog područja: ', 'The vessel is inside the port area: ') + port.name); R.push(T('Napušteno plovilo u luci: lučka uprava', 'Abandoned vessel in a port: port authority')); svc = port.authority; }
      else { R.push(T('Plovilo je izvan luke', 'The vessel is outside a port')); R.push(T('Napuštena i potonula plovila: lučka kapetanija', 'Abandoned and sunken vessels: harbour master’s office')); svc = lkId; }
    } else {
      R.push(T('Otpad na kopnu uz obalu', 'Waste on land along the coast'));
      R.push(T('Komunalni redar, a lokaciju treba upisati i u ELOO', 'Municipal warden; the site should also be entered in ELOO'));
      svc = 'kr-' + town.id;
    }
    R.push(where);
    return { service: svc, reasons: R, county: town.county, town: town.unit };
  }

  /* Naziv mjesta uz novu prijavu (grupa 3: „Blizu: Split“) */
  function placeFor(lat, lng) {
    return 'Blizu: ' + nearestTown({ lat: lat, lng: lng }).unit.replace(/^(Grad|Općina) /, '');
  }

  return {
    RAD: RAD, distNM: distNM, bearing: bearing, destPoint: destPoint, angDiff: angDiff, inPoly: inPoly, rect: rect, inCroatiaBox: inCroatiaBox,
    STATUS: STATUS, ORDER: ORDER, ALL_STATUS: ALL_STATUS, TYPES: TYPES, TYPE_ORDER: TYPE_ORDER, VESSELS: VESSELS, SIZES: SIZES, WASTE: WASTE,
    DIRS: DIRS, dirIdx: dirIdx, dirName: dirName, dirShort: dirShort,
    COUNTIES: COUNTIES, COUNTIES_EN: COUNTIES_EN, LK: LK, TOWNS: TOWNS, PORTS: PORTS, CONCESSIONS: CONCESSIONS,
    SERVICES: SERVICES, SERVICE_GROUPS: SERVICE_GROUPS, svcName: svcName, nearestTown: nearestTown, route: route, placeFor: placeFor
  };
});
