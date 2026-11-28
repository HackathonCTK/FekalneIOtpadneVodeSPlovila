/*
 * ČistoMore — Obrada prijava (grupa 3), statična verzija (GitHub Pages, bez Node servera).
 * Izvor: public/index.html grupe 3 (lokalna verzija sa serverom karata ostaje nepromijenjena).
 * Razlike: OSM rasterske pločice (Leaflet) umjesto vlastitog servera karata, raspored grupe 1,
 * teme/fontovi grupe 4, HR/EN (CM_i18n), zajedničko spremište prijava "cistomore.v1" s report.html.
 */
(function(){
'use strict';

/* ================= pomoćne funkcije ================= */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- prijevodi ---------- */
const I18N = window.CM_i18n || null;
const DICT = window.OBRADA_I18N || {hr:{}, en:{}};
const lookup = (obj, key) => key.split('.').reduce((o, p) => o == null ? undefined : o[p], obj);
const fill = (s, vars) => vars ? String(s).replace(/\{(\w+)\}/g, (m, k) => vars[k] != null ? vars[k] : m) : String(s);
const lang = () => (I18N && I18N.lang ? I18N.lang() : 'hr') === 'en' ? 'en' : 'hr';
function tr(lg, key, vars){
  let v = lookup(DICT[lg] || {}, 'obrada.' + key);
  if (v === undefined) v = lookup(DICT.hr, 'obrada.' + key);
  if (v === undefined) return key;
  return fill(v, vars);
}
const t = (key, vars) => tr(lang(), key, vars);
const tHr = (key, vars) => tr('hr', key, vars);
const hasKey = key => lookup(DICT.hr, 'obrada.' + key) !== undefined;
const LOC = () => lang() === 'en' ? 'en-GB' : 'hr-HR';

/* ---------- geometrija ---------- */
const RAD = Math.PI / 180, R_NM = 3440.065;
const distNM = (a, b) => { const dLat=(b.lat-a.lat)*RAD, dLng=(b.lng-a.lng)*RAD; const h=Math.sin(dLat/2)**2+Math.cos(a.lat*RAD)*Math.cos(b.lat*RAD)*Math.sin(dLng/2)**2; return 2*R_NM*Math.asin(Math.min(1,Math.sqrt(h))); };
const bearing = (a, b) => { const y=Math.sin((b.lng-a.lng)*RAD)*Math.cos(b.lat*RAD); const x=Math.cos(a.lat*RAD)*Math.sin(b.lat*RAD)-Math.sin(a.lat*RAD)*Math.cos(b.lat*RAD)*Math.cos((b.lng-a.lng)*RAD); return (Math.atan2(y,x)/RAD+360)%360; };
const destPoint = (a, brg, nm) => { const d=nm/R_NM, b=brg*RAD, la=a.lat*RAD, lo=a.lng*RAD; const la2=Math.asin(Math.sin(la)*Math.cos(d)+Math.cos(la)*Math.sin(d)*Math.cos(b)); const lo2=lo+Math.atan2(Math.sin(b)*Math.sin(d)*Math.cos(la),Math.cos(d)-Math.sin(la)*Math.sin(la2)); return {lat:la2/RAD,lng:lo2/RAD}; };
const angDiff = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const num1 = n => n.toLocaleString(LOC(), {minimumFractionDigits:1, maximumFractionDigits:1});
const fmtNM = n => (n < 10 ? num1(n) : Math.round(n)) + ' NM';
const DIRK = ['n','ne','e','se','s','sw','w','nw'];
const dirIdx = deg => Math.round(((deg % 360) + 360) % 360 / 45) % 8;
const dirName = deg => t('dir.' + DIRK[dirIdx(deg)]);
const dirShort = deg => t('dirS.' + DIRK[dirIdx(deg)]);
const WINDS = ['Tramontana','Bura','Levant','Jugo','Oštro','Lebić','Pulenat','Maestral'];
const windName = from => WINDS[dirIdx(from)] + ' (' + dirShort(from) + ')';
const hasLoc = r => !!r && typeof r.lat === 'number' && typeof r.lng === 'number' && isFinite(r.lat) && isFinite(r.lng);

/* ---------- vrijeme ---------- */
const TZ = 'Europe/Zagreb';
const fmtTime = d => new Intl.DateTimeFormat(LOC(), {hour:'2-digit', minute:'2-digit', timeZone:TZ}).format(d);
const fmtDate = d => new Intl.DateTimeFormat(LOC(), {day:'numeric', month:'numeric', timeZone:TZ}).format(d);
const dayKey = d => new Intl.DateTimeFormat('en-CA', {year:'numeric', month:'2-digit', day:'2-digit', timeZone:TZ}).format(d);
function fmtWhen(iso){
  const d = new Date(iso), now = new Date(), m = Math.round((now - d) / 60000);
  if (isNaN(d.getTime())) return '—';
  if (m < 1) return t('when.now');
  if (m < 60) return t('when.min', {n:m});
  if (dayKey(d) === dayKey(now)) return t('when.today', {time:fmtTime(d)});
  const y = new Date(now.getTime() - 86400000);
  if (dayKey(d) === dayKey(y)) return t('when.yesterday', {time:fmtTime(d)});
  return fmtDate(d) + ' ' + fmtTime(d);
}
function fmtStamp(iso){ const d = new Date(iso); return isNaN(d.getTime()) ? '—' : fmtDate(d) + ' ' + fmtTime(d); }
function fmtLocalDT(s){
  const d = new Date(s);
  if (isNaN(d.getTime())) return String(s);
  return d.toLocaleString(LOC(), {day:'numeric', month:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit'});
}

const ICON_ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICON_CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
const ICON_BACK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
const ICON_PIN_OFF = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><path d="M2 2l20 20"/><path d="M9.3 4.3A7 7 0 0 1 19 10.9c0 1.7-.7 3.6-1.7 5.3M14.8 18.6C13.6 20 12 21 12 21s-7-5.5-7-11a7 7 0 0 1 .4-2.3"/></svg>';

/* CSS varijable teme (Leaflet SVG atributi ne razumiju var()) */
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const stColor = k => cssVar('--ob-' + k) || '#888888';

/* ================= referentni podaci ================= */
const ORDER = ['zaprimljeno','obrada','rijeseno'];
const STATUS_ALIAS = {nova:'zaprimljeno', novo:'zaprimljeno', 'novo/zaprimljeno':'zaprimljeno', u_obradi:'obrada', 'u obradi':'obrada', 'riješeno':'rijeseno', resolved:'rijeseno', done:'rijeseno'};
const stLabel = k => t('status.' + k);
const TYPES = { fekalne:{vessel:true}, ulje:{}, otpad_more:{}, otpad_plaza:{}, septicka:{}, napusteno:{vessel:true}, otpad_kopno:{} };
const typeLabel = k => TYPES[k] ? t('type.' + k) : (k ? String(k) : t('type.unknown'));
const VESSELS = ['Gumenjak / brodica do 6 m','Motorni brod 6–12 m','Jedrilica 8–15 m','Motorna jahta 12–24 m','Gulet / brod veći od 24 m','Brod za kružna putovanja','Ribarski brod','Nepoznato'];
const vesselLabel = v => { const i = VESSELS.indexOf(v); return i >= 0 ? t('vessel.v' + i) : (v ? String(v) : t('vessel.unknown')); };
const COUNTIES = ['Istarska','Primorsko-goranska','Ličko-senjska','Zadarska','Šibensko-kninska','Splitsko-dalmatinska','Dubrovačko-neretvanska'];
const countyLabel = (c, hr) => { const i = COUNTIES.indexOf(c); return i >= 0 ? (hr ? tHr : t)('county.c' + i) : (c || '—'); };
/* Sjedišta osam lučkih kapetanija (Ministarstvo mora): približne koordinate zgrada kapetanija */
const LK = [
  {id:'lk-pula',city:'Pula',lat:44.8703,lng:13.8424,county:'Istarska'},
  {id:'lk-rijeka',city:'Rijeka',lat:45.3253,lng:14.4393,county:'Primorsko-goranska'},
  {id:'lk-senj',city:'Senj',lat:44.9893,lng:14.9031,county:'Ličko-senjska'},
  {id:'lk-zadar',city:'Zadar',lat:44.1167,lng:15.2252,county:'Zadarska'},
  {id:'lk-sibenik',city:'Šibenik',lat:43.7340,lng:15.8895,county:'Šibensko-kninska'},
  {id:'lk-split',city:'Split',lat:43.5060,lng:16.4410,county:'Splitsko-dalmatinska'},
  {id:'lk-ploce',city:'Ploče',lat:43.0540,lng:17.4330,county:'Dubrovačko-neretvanska'},
  {id:'lk-dubrovnik',city:'Dubrovnik',lat:42.6600,lng:18.0850,county:'Dubrovačko-neretvanska'}
];
function nearestLK(p){ let best = LK[0], bd = Infinity; LK.forEach(l => { const d = distNM(p, l); if (d < bd){ bd = d; best = l; } }); return {lk:best, km:bd * 1.852}; }
const TOWNS = [
  ['umag','Grad Umag',45.434,13.520,'Istarska'],['porec','Grad Poreč',45.227,13.594,'Istarska'],['rovinj','Grad Rovinj',45.081,13.638,'Istarska'],['pula','Grad Pula',44.866,13.850,'Istarska'],
  ['opatija','Grad Opatija',45.338,14.307,'Primorsko-goranska'],['rijeka','Grad Rijeka',45.327,14.442,'Primorsko-goranska'],['crikvenica','Grad Crikvenica',45.176,14.692,'Primorsko-goranska'],['krk','Grad Krk',45.027,14.575,'Primorsko-goranska'],['losinj','Grad Mali Lošinj',44.531,14.468,'Primorsko-goranska'],
  ['senj','Grad Senj',44.989,14.905,'Ličko-senjska'],['novalja','Grad Novalja',44.556,14.885,'Ličko-senjska'],
  ['zadar','Grad Zadar',44.119,15.231,'Zadarska'],['biograd','Grad Biograd na Moru',43.937,15.443,'Zadarska'],
  ['vodice','Grad Vodice',43.759,15.778,'Šibensko-kninska'],['sibenik','Grad Šibenik',43.735,15.890,'Šibensko-kninska'],
  ['trogir','Grad Trogir',43.516,16.251,'Splitsko-dalmatinska'],['okrug','Općina Okrug',43.494,16.255,'Splitsko-dalmatinska'],['split','Grad Split',43.508,16.440,'Splitsko-dalmatinska'],['solta','Općina Šolta',43.388,16.276,'Splitsko-dalmatinska'],['supetar','Grad Supetar',43.384,16.553,'Splitsko-dalmatinska'],['milna','Općina Milna',43.326,16.452,'Splitsko-dalmatinska'],['bol','Općina Bol',43.262,16.655,'Splitsko-dalmatinska'],['omis','Grad Omiš',43.444,16.689,'Splitsko-dalmatinska'],['makarska','Grad Makarska',43.297,17.017,'Splitsko-dalmatinska'],['hvar','Grad Hvar',43.172,16.442,'Splitsko-dalmatinska'],['vis','Grad Vis',43.062,16.183,'Splitsko-dalmatinska'],
  ['ploce','Grad Ploče',43.056,17.433,'Dubrovačko-neretvanska'],['vela-luka','Općina Vela Luka',42.963,16.720,'Dubrovačko-neretvanska'],['korcula','Grad Korčula',42.960,17.135,'Dubrovačko-neretvanska'],['ston','Općina Ston',42.838,17.697,'Dubrovačko-neretvanska'],['mljet','Općina Mljet',42.746,17.530,'Dubrovačko-neretvanska'],['dubrovnik','Grad Dubrovnik',42.650,18.094,'Dubrovačko-neretvanska'],['konavle','Općina Konavle',42.581,18.218,'Dubrovačko-neretvanska']
].map(a => ({id:a[0], unit:a[1], lat:a[2], lng:a[3], county:a[4]}));
/* Službe: naziv se slaže iz vrste i mjesta, pa se prevodi (HR/EN) */
const SERVICES = {};
LK.forEach(l => SERVICES[l.id] = {id:l.id, kind:'lk', arg:l.city, group:'lk'});
TOWNS.forEach(tw => SERVICES['kr-' + tw.id] = {id:'kr-' + tw.id, kind:'kr', arg:tw.unit, group:'kr'});
const SERVICE_GROUPS = ['lk','kr'];
function svcName(id, hr){
  const f = hr ? tHr : t;
  if (!id) return f('svc.none');
  const s = SERVICES[id];
  return s ? f('svc.' + s.kind, {x:s.arg}) : f('svc.unknown', {id:id});
}

/* Stvarna prihvatna mjesta za fekalne vode (data/stations.js, kontakti data/kontakti.js, regije data/regije.js) */
const STATIONS = ((window.CM_STATIONS && window.CM_STATIONS.locations) || []).map(s => {
  const lat = Number(s.latitude != null ? s.latitude : s.coordinates && s.coordinates.latitude);
  const lng = Number(s.longitude != null ? s.longitude : s.coordinates && s.coordinates.longitude);
  return {id:s.id, name:s.name, address:s.address || '', lat, lng,
    region:(window.CM_REGIONS && window.CM_REGIONS.lokacije && window.CM_REGIONS.lokacije[s.id]) || '',
    contact:(window.CM_CONTACTS && window.CM_CONTACTS[s.id]) || null};
}).filter(s => isFinite(s.lat) && isFinite(s.lng));
const stUrl = s => 'map.html?station=' + encodeURIComponent(s.id);
const stSub = s => [s.address, s.contact && s.contact.telefon].filter(Boolean).join(' · ');
const BAYS = [
  {id:'sunj',name:'Uvala Šunj, Lopud',lat:42.6770,lng:17.9520,facing:135},
  {id:'sudjuradj',name:'Suđurađ, Šipan',lat:42.7110,lng:17.9170,facing:150},
  {id:'kolocep',name:'Gornje Čelo, Koločep',lat:42.6680,lng:18.0120,facing:140},
  {id:'lapad',name:'Uvala Lapad, Dubrovnik',lat:42.6550,lng:18.0650,facing:240},
  {id:'banje',name:'Plaža Banje, Dubrovnik',lat:42.6413,lng:18.1155,facing:160},
  {id:'saplunara',name:'Saplunara, Mljet',lat:42.6970,lng:17.7370,facing:150},
  {id:'prapratno',name:'Prapratno, Pelješac',lat:42.8150,lng:17.6800,facing:210}
];

function nearestTown(p){ let best = TOWNS[0], bd = Infinity; TOWNS.forEach(tw => { const d = distNM(p, tw); if (d < bd){ bd = d; best = tw; } }); return best; }
const shortTown = s => String(s || '').replace(/^(Grad|Općina) /, '');

/* Prijedlog službe: najbliža lučka kapetanija (stvarna sjedišta). Za izvore na kopnu
   (septička jama, otpad na plaži / kopnu) predlaže se komunalni redar najbližeg grada ili općine.
   Službenik uvijek može ručno preusmjeriti. Razlozi su ključevi prijevoda. */
const LAND_TYPES = ['septicka','otpad_plaza','otpad_kopno'];
function route(lat, lng, type){
  const p = {lat, lng}, town = nearestTown(p), near = nearestLK(p);
  const R = [], add = (k, v) => R.push(v ? {k, v} : {k});
  const km = String(Math.max(1, Math.round(near.km)));
  let svc;
  if (LAND_TYPES.includes(type)){
    add('nearestTown', {town:town.unit, km:String(Math.max(1, Math.round(distNM(p, town) * 1.852)))});
    add('landKR'); svc = 'kr-' + town.id;
    add('nearestLK', {city:near.lk.city, km});
  } else {
    add('nearestLK', {city:near.lk.city, km});
    add('seaLK'); svc = near.lk.id;
  }
  const county = town.county || near.lk.county;
  add('where', {town:town.unit, county});
  return {service:svc, reasons:R, county, town:town.unit};
}
/* Varijable u porukama: službe, županije i statusi prevode se pri prikazu */
function resolveVars(v, hr){
  if (!v) return undefined;
  const o = Object.assign({}, v);
  ['svc','from','to'].forEach(k => { if (k in o) o[k] = svcName(o[k], hr); });
  if ('county' in o) o.county = countyLabel(o.county, hr);
  if ('status' in o) o.status = (hr ? tHr : t)('status.' + o.status);
  return o;
}
const reasonText = (x, hr) => (hr ? tHr : t)('r.' + x.k, resolveVars(x.v, hr));

BAYS.forEach(b => { b.ownerId = route(b.lat, b.lng, 'otpad_plaza').service; });

/* ================= povijest (tekst na HR ostaje u modelu, ključ za prijevod uz njega) ================= */
function hEntry(k, v, when){
  const e = {t: when || new Date().toISOString(), text: tHr('h.' + k, resolveVars(v, true)), k:k};
  if (v) e.v = v;
  return e;
}
const LEGACY = {'Prijava zaprimljena (Nova prijava).':'receivedForm', 'Prijava zaprimljena.':'received0'};
function hText(h){
  if (h && h.k && hasKey('h.' + h.k)) return t('h.' + h.k, resolveVars(h.v));
  if (h && h.text && LEGACY[h.text]) return t('h.' + LEGACY[h.text]);
  return h && h.text ? String(h.text) : '';
}

/* ================= stanje (zajedničko spremište "cistomore.v1") ================= */
const KEY = 'cistomore.v1';
/* Stare demo prijave (raniji SEED_BASE 1170–1185, bez polja source) uklanjaju se pri učitavanju */
const isOldDemo = r => r && r.source == null && (function(m){ return !!m && Number(m[1]) >= 1170 && Number(m[1]) <= 1185; })(/^\d{4}-(11[7-8]\d)$/.exec(String(r.id || '')));
let S = null;

/* Prijave iz drugih stranica (report.html) dolaze bez službe/županije: dopuni ih ovdje */
function normalize(r){
  let ch = false;
  const set = (k, v) => { r[k] = v; ch = true; };
  if (!r.id) set('id', new Date().getFullYear() + '-x' + Math.random().toString(36).slice(2, 7));
  else if (typeof r.id !== 'string') set('id', String(r.id));
  if ((r.lng == null || r.lng === '') && r.lon != null) set('lng', r.lon);
  ['lat','lng'].forEach(k => {
    if (r[k] === undefined || r[k] === '') set(k, null);
    else if (r[k] !== null && typeof r[k] !== 'number'){ const n = parseFloat(String(r[k]).replace(',', '.')); set(k, isFinite(n) ? n : null); }
    else if (typeof r[k] === 'number' && !isFinite(r[k])) set(k, null);
  });
  if (!ORDER.includes(r.status)) set('status', STATUS_ALIAS[String(r.status || '').toLowerCase()] || 'zaprimljeno');
  if (!r.createdAt || isNaN(new Date(r.createdAt).getTime())) set('createdAt', new Date().toISOString());
  if (!Array.isArray(r.history)) set('history', []);
  if (!r.history.length){ r.history.push(hEntry('received0', null, r.createdAt)); ch = true; }
  if (!Array.isArray(r.reasons)) set('reasons', []);
  if (typeof r.confirmed !== 'boolean') set('confirmed', !!r.confirmed);
  if ('pending' in r){ delete r.pending; ch = true; }
  // službe iz uklonjenih izmišljenih područja (lučke uprave, koncesionari): predloži ponovno
  if (r.service && !SERVICES[r.service]){ r.service = null; r.confirmed = false; ch = true; }
  if (r.heading != null && typeof r.heading !== 'number'){ const h = Number(r.heading); set('heading', r.heading === '' || !isFinite(h) ? null : h); }
  if (r.place == null) set('place', '');
  if (typeof r.place !== 'string') set('place', String(r.place));
  if (r.vessel != null && typeof r.vessel !== 'string') set('vessel', String(r.vessel));
  if (hasLoc(r) && (!r.service || !r.county || !r.place)){
    const rt = route(r.lat, r.lng, r.type);
    if (!r.service){
      r.service = rt.service;
      r.reasons = rt.reasons.map(x => reasonText(x, true));
      r.history.push(hEntry('autoSuggest', {svc:rt.service}));
    }
    if (!r.county) r.county = rt.county;
    if (!r.place) r.place = tHr('nearPlace', {town:shortTown(rt.town)});
    ch = true;
  }
  return ch;
}
function readStore(){
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && typeof s === 'object' && Array.isArray(s.reports)) return s; } catch(e){}
  return null;
}
function load(){
  let s = readStore(), dirty = false;
  if (!s) return {s:{v:1, seq:0, reports:[], warnings:{}}, dirty:false};
  if ('seeded' in s){ delete s.seeded; dirty = true; }
  if (s.v !== 1){ s.v = 1; dirty = true; }
  if (!s.warnings || typeof s.warnings !== 'object'){ s.warnings = {}; dirty = true; }
  const before = s.reports.length;
  s.reports = s.reports.filter(r => r && typeof r === 'object' && !isOldDemo(r));
  if (s.reports.length !== before) dirty = true;
  let maxN = 0;
  s.reports.forEach(r => {
    if (normalize(r)) dirty = true;
    const m = /-(\d+)$/.exec(r.id); if (m) maxN = Math.max(maxN, Number(m[1]));
  });
  if (!(Number(s.seq) >= maxN)){ s.seq = Math.max(Number(s.seq) || 0, maxN); dirty = true; }
  return {s, dirty};
}
function save(){
  try { localStorage.setItem(KEY, JSON.stringify(S)); return true; }
  catch(e){
    // vjerojatno pun prostor – makni fotografije riješenih prijava i pokušaj ponovno
    try { S.reports.forEach(r => { if (r.status === 'rijeseno') r.photo = null; }); localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch(e2){ return false; }
  }
}
(function(){ const L0 = load(); S = L0.s; if (L0.dirty) save(); })();
const byId = id => S.reports.find(r => r.id === id);
function nextId(){
  let maxN = Number(S.seq) || 0;
  S.reports.forEach(r => { const m = /-(\d+)$/.exec(r.id); if (m) maxN = Math.max(maxN, Number(m[1])); });
  S.seq = maxN + 1;
  return new Date().getFullYear() + '-' + S.seq;
}

function addHistory(r, k, v){ r.history.push(hEntry(k, v)); }
function commit(msg){ save(); renderAll(); if (msg) toast(msg); }

/* ================= toast (zajednički, app.js) ================= */
function toast(text){
  if (typeof window.showToast === 'function') window.showToast(text);
}

/* ================= filteri ================= */
const F = { q:'', region:'', period:'30', vessel:'', type:'', service:'', statuses:new Set(ORDER) };
const D = { region:'', period:'30', vessel:'' };
function fillSelect(sel, items, allLabel, value){
  const old = value !== undefined ? value : sel.value;
  sel.innerHTML = (allLabel ? '<option value="">' + esc(allLabel) + '</option>' : '') + items.map(i => '<option value="' + esc(i[0]) + '">' + esc(i[1]) + '</option>').join('');
  if (Array.from(sel.options).some(o => o.value === old)) sel.value = old;
}
function fillServiceSelect(sel, allLabel, value){
  const old = value !== undefined ? value : sel.value;
  let h = allLabel ? '<option value="">' + esc(allLabel) + '</option>' : '';
  SERVICE_GROUPS.forEach(g => {
    h += '<optgroup label="' + esc(t('svcGroup.' + g)) + '">' + Object.values(SERVICES).filter(s => s.group === g).map(s => '<option value="' + esc(s.id) + '">' + esc(svcName(s.id)) + '</option>').join('') + '</optgroup>';
  });
  sel.innerHTML = h;
  if (Array.from(sel.options).some(o => o.value === old)) sel.value = old;
}
/* Plovila: popis grupe 3 + nepoznati nazivi iz drugih obrazaca (npr. "Jedrilica" iz report.html) */
function vesselOptions(){
  const extra = [];
  S.reports.forEach(r => { if (r.vessel && !VESSELS.includes(r.vessel) && !extra.includes(r.vessel)) extra.push(r.vessel); });
  extra.sort((a, b) => a.localeCompare(b, 'hr'));
  return VESSELS.concat(extra).map(v => [v, vesselLabel(v)]);
}
function typeOptions(){
  const keys = Object.keys(TYPES);
  S.reports.forEach(r => { if (r.type && !keys.includes(r.type)) keys.push(r.type); });
  return keys.map(k => [k, typeLabel(k)]);
}
function fillFilters(){
  fillServiceSelect($('#fService'), t('filters.allServices'), F.service);
  const counties = COUNTIES.map(c => [c, countyLabel(c)]);
  fillSelect($('#fRegion'), counties, t('filters.allCounties'), F.region);
  fillSelect($('#dRegion'), counties, t('filters.allCounties'), D.region);
  const vs = vesselOptions();
  fillSelect($('#fVessel'), vs, t('filters.allVessels'), F.vessel);
  fillSelect($('#dVessel'), vs, t('filters.allVessels'), D.vessel);
  fillSelect($('#fType'), typeOptions(), t('filters.allTypes'), F.type);
}
function inPeriod(r, period){
  if (period === 'all') return true;
  return (Date.now() - new Date(r.createdAt).getTime()) <= Number(period) * 86400000;
}
const byNewest = (a, b) => String(b.createdAt).localeCompare(String(a.createdAt));
function filtered(){
  const q = F.q.trim().toLowerCase();
  return S.reports.filter(r => {
    if (!F.statuses.has(r.status)) return false;
    if (F.region && r.county !== F.region) return false;
    if (F.vessel && r.vessel !== F.vessel) return false;
    if (F.type && r.type !== F.type) return false;
    if (F.service && r.service !== F.service) return false;
    if (!inPeriod(r, F.period)) return false;
    if (q){
      const x = r.extra || {};
      const hay = [r.id, r.place, r.desc, typeLabel(r.type), svcName(r.service), r.vessel || '', vesselLabel(r.vessel), x.registration || '', x.shipColor || ''].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort(byNewest);
}
function filteredD(){
  return S.reports.filter(r => r.type === 'fekalne' && (!D.region || r.county === D.region) && (!D.vessel || r.vessel === D.vessel) && inPeriod(r, D.period)).sort(byNewest);
}

/* ================= karte (Leaflet + OpenStreetMap rasterske pločice) ================= */
const HR_BOUNDS = [[42.35, 13.45], [45.65, 18.6]];
const maps = {};
let noteKey = '', tileErrStreak = 0;
const leafletOK = () => typeof window.L !== 'undefined' && typeof window.L.map === 'function';
function showMapNote(key){
  noteKey = key || '';
  $$('[data-tilenote]').forEach(n => { n.textContent = noteKey ? t(noteKey) : ''; n.classList.toggle('show', !!noteKey); });
}
function makeMap(elId){
  const el = document.getElementById(elId);
  el.classList.add('ob-mapbox');
  const m = L.map(el, {zoomControl:true, attributionControl:true, worldCopyJump:false, minZoom:6, maxZoom:19, maxBounds:[[40.5,11.5],[47.5,21]], maxBoundsViscosity:0.8});
  m.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(m);
  tiles.on('tileerror', () => { tileErrStreak++; if (tileErrStreak >= 3 && noteKey !== 'mapNote.tiles') showMapNote('mapNote.tiles'); });
  tiles.on('tileload', () => { tileErrStreak = 0; if (noteKey === 'mapNote.tiles') showMapNote(''); });
  safeFit(m, HR_BOUNDS);
  return m;
}
function ensureMaps(view){
  if (!leafletOK()){ showMapNote('mapNote.noLeaflet'); return; }
  if (view === 'prijave' && !maps.m1){ maps.m1 = makeMap('map1'); initLayers1(); }
  if (view === 'ispustanja' && !maps.m2){ maps.m2 = makeMap('map2'); initLayers2(); }
  if (view === 'prognoza' && !maps.m3){ maps.m3 = makeMap('map3'); safeFit(maps.m3, [[42.55,17.55],[42.88,18.28]]); maps.g3 = L.layerGroup().addTo(maps.m3); }
  Object.values(maps).forEach(m => { if (m && m.invalidateSize) setTimeout(() => { m.invalidateSize(); flushMap(m); }, 60); });
}
function invalidateAll(){ Object.values(maps).forEach(m => { if (m && m.invalidateSize){ m.invalidateSize(); flushMap(m); } }); if (pickMap) pickMap.invalidateSize(); }
/* Skrivena karta (npr. prikaz "Popis" na mobitelu) ima veličinu 0 i Leaflet tada baca grešku:
   pomak/prilagodbu zapamti i izvedi kad karta postane vidljiva. */
const mapVisible = m => { const c = m && m.getContainer(); return !!(c && c.offsetWidth > 0 && c.offsetHeight > 0); };
function safeFly(m, ll, zoom){
  if (!m) return;
  if (mapVisible(m)){ m._obPending = null; try { m.flyTo(ll, zoom, {duration:.6}); } catch(e){ m.setView(ll, zoom); } }
  else m._obPending = {view:[ll, zoom]};
}
function safeFit(m, bounds, opts){
  if (!m) return;
  if (mapVisible(m)){ m._obPending = null; m.fitBounds(bounds, opts); }
  else m._obPending = {fit:[bounds, opts]};
}
function flushMap(m){
  if (!m || !m._obPending || !mapVisible(m)) return;
  const p = m._obPending; m._obPending = null;
  if (p.view) m.setView(p.view[0], p.view[1]); else if (p.fit) m.fitBounds(p.fit[0], p.fit[1]);
}

/* ---------- slojevi pogleda 1 ---------- */
const LAYERS1 = [
  {key:'lk', color:'--ob-lk', on:true}
];
function initLayers1(){
  const m = maps.m1;
  maps.lay1 = {
    lk:L.layerGroup(LK.map(l => L.marker([l.lat, l.lng], {icon:L.divIcon({className:'', html:'<div class="ob-lk-ico"></div>', iconSize:[22,22], iconAnchor:[11,11]})}).bindTooltip(() => esc(svcName(l.id)))))
  };
  maps.markers1 = L.layerGroup().addTo(m);
  LAYERS1.forEach(l => { if (l.on) maps.lay1[l.key].addTo(m); });
  renderChips1();
  renderMap1(true);
}
function renderChips1(){
  const box = $('#layers1'); if (!box) return;
  box.innerHTML = '<span class="lbl">' + esc(t('layers1.label')) + '</span>' + LAYERS1.map(l =>
    '<button type="button" class="ob-chip" data-layer="' + l.key + '" aria-pressed="' + l.on + '"><span class="sw" style="background:var(' + l.color + ')"></span>' + esc(t('layers1.' + l.key)) + '</button>').join('');
  $$('[data-layer]', box).forEach(b => b.addEventListener('click', () => {
    const l = LAYERS1.find(x => x.key === b.dataset.layer); if (!l || !maps.m1) return;
    l.on = !l.on; b.setAttribute('aria-pressed', String(l.on));
    if (l.on) maps.lay1[l.key].addTo(maps.m1); else maps.m1.removeLayer(maps.lay1[l.key]);
  }));
}

/* ================= pogled 1: prijave ================= */
let sel1 = null;
function statusChips(){
  const box = $('#statusChips'); const counts = {zaprimljeno:0, obrada:0, rijeseno:0};
  S.reports.filter(r => (!F.service || r.service === F.service)).forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
  box.innerHTML = ORDER.map(k => '<button type="button" class="ob-chip" data-st="' + k + '" aria-pressed="' + F.statuses.has(k) + '"><span class="sw" style="background:var(--ob-' + k + ');border-radius:50%"></span>' + esc(stLabel(k)) + ' ' + counts[k] + '</button>').join('') + '<span class="ob-count" id="count1"></span>';
  $$('[data-st]', box).forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.st; if (F.statuses.has(k)) F.statuses.delete(k); else F.statuses.add(k); renderView1();
  }));
}
function pillsHtml(r){
  return (hasLoc(r) ? '' : '<span class="ob-pill noloc">' + ICON_PIN_OFF + ' ' + esc(t('noLoc')) + '</span>') +
    '<span class="ob-pill ' + r.status + '">' + esc(stLabel(r.status)) + '</span>';
}
function renderList1(list){
  const ul = $('#list1');
  const c = $('#count1'); if (c) c.textContent = list.length + ' / ' + S.reports.length;
  if (!S.reports.length){ ul.innerHTML = emptyStoreHtml('li'); return; }
  if (!list.length){ ul.innerHTML = '<li class="ob-empty">' + esc(t('list.empty')) + '</li>'; return; }
  ul.innerHTML = list.map(r => '<li><button type="button" class="ob-row" data-id="' + esc(r.id) + '" aria-current="' + (r.id === sel1) + '">' +
    '<span class="meta"><span><span class="id">#' + esc(r.id) + '</span> · ' + esc(fmtWhen(r.createdAt)) + '</span><span class="pills">' + pillsHtml(r) + '</span></span>' +
    '<span class="t">' + esc(typeLabel(r.type)) + '</span>' +
    '<span class="p">' + esc(r.place || t('noLoc')) + (r.vessel ? ' · ' + esc(vesselLabel(r.vessel)) : '') + '</span>' +
    (r.service
      ? '<span class="s">' + ICON_ARROW + esc(svcName(r.service)) + (r.confirmed ? '' : ' ' + esc(t('list.suggested'))) + '</span>'
      : '<span class="s none">' + ICON_ARROW + esc(t('svc.none')) + '</span>') +
    '</button></li>').join('');
  $$('.ob-row', ul).forEach(b => b.addEventListener('click', () => select1(b.dataset.id, true)));
}
function emptyStoreHtml(tag){
  return '<' + tag + ' class="ob-empty ob-empty-store"><b>' + esc(t('emptyStore.title')) + '</b><span>' + esc(t('emptyStore.p')) + '</span>' +
    '<a class="ob-btn ob-btn-primary ob-btn-sm" href="report.html">' + esc(t('emptyStore.link')) + '</a></' + tag + '>';
}
function markerStyle(r, selected){
  return {radius: selected ? 12 : 8, color: selected ? stColor('ring') : '#ffffff', weight: selected ? 4 : 2, fillColor: stColor(r.status), fillOpacity: 1};
}
function renderMap1(fit){
  if (!maps.m1) return;
  const list = filtered().filter(hasLoc);
  maps.markers1.clearLayers();
  list.forEach(r => {
    const mk = L.circleMarker([r.lat, r.lng], markerStyle(r, r.id === sel1)).bindTooltip(() => esc('#' + r.id + ' · ' + typeLabel(r.type)));
    mk.on('click', () => select1(r.id, false));
    maps.markers1.addLayer(mk);
    if (r.id === sel1) mk.bringToFront();
  });
  if (fit && list.length) safeFit(maps.m1, L.latLngBounds(list.map(r => [r.lat, r.lng])).pad(0.15), {maxZoom:12});
}
function select1(id, fly){
  sel1 = id; renderList1(filtered()); renderMap1(false); renderDetail1();
  const r = byId(id);
  if (r && hasLoc(r) && maps.m1 && fly) safeFly(maps.m1, [r.lat, r.lng], Math.max(maps.m1.getZoom(), 12));
  const row = $('#list1 [data-id="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]'); if (row) row.scrollIntoView({block:'nearest'});
  openDrawer('#detail1');
}
function stepsHtml(r){
  const idx = ORDER.indexOf(r.status);
  return '<ol class="ob-steps">' + ORDER.map((k, i) => '<li class="' + (i <= idx ? 'on' : '') + (i === idx ? ' cur' : '') + '"><i style="' + (i <= idx ? 'background:var(--ob-' + r.status + ')' : '') + '"></i>' + esc(stLabel(k)) + '</li>').join('') + '</ol>';
}
function photoHtml(r){
  const ok = typeof r.photo === 'string' && /^(data:image\/|https?:|blob:)/.test(r.photo);
  return ok ? '<div class="ob-photo"><img src="' + esc(r.photo) + '" alt="' + esc(t('d.photoAlt', {id:r.id})) + '"></div>'
            : '<div class="ob-photo">' + esc(t('d.noPhoto')) + '</div>';
}
function statusButtons(r){
  const idx = ORDER.indexOf(r.status);
  let h = '<div class="ob-btns" style="margin-top:12px">';
  if (idx === 0) h += '<button class="ob-btn ob-btn-dark" type="button" data-act="next">' + esc(t('act.take')) + '</button>';
  if (idx === 1) h += '<button class="ob-btn ob-btn-dark" type="button" data-act="next">' + esc(t('act.resolve')) + '</button>';
  if (idx > 0) h += '<button class="ob-btn ob-btn-plain" type="button" data-act="prev">' + esc(t('act.back')) + '</button>';
  return h + '</div>';
}
function kvHtml(items){
  return '<dl class="ob-kv">' + items.map(i => '<div><dt>' + esc(i[0]) + '</dt><dd>' + esc(i[1]) + '</dd></div>').join('') + '</dl>';
}
function headingText(r){ return r.heading == null ? t('heading.unknownAnchor') : dirName(r.heading) + ' (' + r.heading + '°)'; }
function historyHtml(r, max){
  let h = r.history.slice().reverse();
  if (max) h = h.slice(0, max);
  return '<ul class="ob-history">' + h.map(x => '<li><time datetime="' + esc(x.t) + '">' + esc(fmtStamp(x.t)) + '</time><span>' + esc(hText(x)) + '</span></li>').join('') + '</ul>';
}
function renderDetail1(){
  const el = $('#detail1'); const r = sel1 && byId(sel1);
  if (!r){ el.innerHTML = '<div class="ob-empty" style="margin:auto">' + esc(t('d.empty')) + '</div>'; return; }
  const typ = TYPES[r.type] || {};
  const kv = [[t('kv.place'), r.place || t('noLoc')], [t('kv.reported'), fmtWhen(r.createdAt)]];
  if (r.vessel) kv.push([t('kv.vessel'), vesselLabel(r.vessel)]);
  if (typ.vessel || r.heading != null) kv.push([t('kv.heading'), headingText(r)]);
  kv.push([t('kv.coords'), hasLoc(r) ? r.lat.toFixed(4) + ', ' + r.lng.toFixed(4) : t('noLoc')]);
  kv.push([t('kv.county'), r.county ? countyLabel(r.county) : '—']);
  const x = r.extra && typeof r.extra === 'object' ? r.extra : {};
  if (x.wasteType) kv.push([t('kv.wasteType'), x.wasteType]);
  if (x.shipSize) kv.push([t('kv.shipSize'), x.shipSize]);
  if (x.shipColor) kv.push([t('kv.shipColor'), x.shipColor]);
  if (x.registration) kv.push([t('kv.registration'), x.registration]);
  if (x.observedFromLand != null && x.observedFromLand !== '') kv.push([t('kv.observedFromLand'), typeof x.observedFromLand === 'boolean' ? t(x.observedFromLand ? 'yes' : 'no') : String(x.observedFromLand)]);
  if (x.datetimeLocal) kv.push([t('kv.observedAt'), fmtLocalDT(x.datetimeLocal)]);
  if (r.source) kv.push([t('kv.source'), r.source === 'report.html' ? t('kv.sourceForm') : r.source === 'obrada.html' ? t('kv.sourceObrada') : r.source]);

  const reasons = hasLoc(r) ? route(r.lat, r.lng, r.type).reasons.map(z => reasonText(z))
    : (r.reasons && r.reasons.length ? r.reasons.map(String) : [t('route.noLocReason')]);
  const routeTitle = !r.service ? t('route.none') : r.confirmed ? t('route.confirmed') : t('route.suggested');
  const last = r.history[r.history.length - 1];

  el.innerHTML =
    '<div class="ob-dtop"><button class="ob-btn ob-btn-plain ob-btn-sm ob-dback" type="button" data-act="close">' + ICON_BACK + esc(t('d.back')) + '</button><span class="id">' + esc(t('d.report', {id:r.id})) + '</span><span class="pills">' + pillsHtml(r) + '</span></div>' +
    '<h3>' + esc(typeLabel(r.type)) + '</h3>' + photoHtml(r) +
    (r.desc ? '<p class="ob-desc">' + esc(r.desc) + '</p>' : '') +
    kvHtml(kv) +
    '<div class="ob-card route' + (r.service ? '' : ' none') + '"><span class="ob-eyebrow">' + esc(routeTitle) + '</span><span class="svc">' + esc(svcName(r.service)) + '</span>' +
    '<ul class="ob-reasons">' + reasons.map(z => '<li>' + esc(z) + '</li>').join('') + '</ul>' +
    '<div class="ob-btns">' + (r.confirmed || !r.service ? '' : '<button class="ob-btn ob-btn-primary" type="button" data-act="confirm">' + esc(t('act.confirm')) + '</button>') +
    '<button class="ob-btn ob-btn-ghost" type="button" data-act="reassign">' + esc(t(r.service ? 'act.reassign' : 'act.assign')) + '</button></div></div>' +
    '<div><div class="ob-eyebrow" style="margin-bottom:10px">' + esc(t('d.statusTitle')) + '</div>' + stepsHtml(r) + statusButtons(r) + '</div>' +
    '<div class="ob-public"><div class="ob-eyebrow" style="margin-bottom:6px">' + esc(t('public.title')) + '</div>' +
      esc(t('public.p1', {id:r.id})) + ' <b>' + esc(stLabel(r.status)) + '</b>. ' + esc(t('public.p2', {svc:svcName(r.service), when:last ? fmtWhen(last.t) : '—'})) + '</div>' +
    '<div><div class="ob-eyebrow" style="margin-bottom:8px">' + esc(t('d.historyTitle')) + '</div>' + historyHtml(r) + '</div>';
  bindDetailActions(el, r);
}
function bindDetailActions(el, r){
  $$('[data-act]', el).forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.act;
    if (a === 'close') return closeDrawers();
    if (a === 'confirm' && r.service){ r.confirmed = true; addHistory(r, 'confirmed', {svc:r.service}); commit(t('toast.forwarded', {id:r.id, svc:svcName(r.service)})); }
    if (a === 'reassign') openReassign(r);
    if (a === 'next'){
      const i = ORDER.indexOf(r.status);
      if (i < 2){
        r.status = ORDER[i + 1];
        if (!r.confirmed && r.service){ r.confirmed = true; addHistory(r, 'confirmed', {svc:r.service}); }
        addHistory(r, 'status', {status:r.status});
        commit(t('toast.status', {id:r.id, status:stLabel(r.status)}));
      }
    }
    if (a === 'prev'){
      const i = ORDER.indexOf(r.status);
      if (i > 0){ r.status = ORDER[i - 1]; addHistory(r, 'statusBack', {status:r.status}); commit(t('toast.statusBack', {id:r.id, status:stLabel(r.status)})); }
    }
    if (a === 'notify') notifyStations(r);
    if (a === 'open1'){ sel1 = r.id; closeDrawers(); location.hash = '#prijave'; setTimeout(() => select1(r.id, true), 150); }
  }));
}
function renderView1(fit){
  statusChips();
  const list = filtered();
  renderList1(list); renderMap1(fit); renderDetail1();
  const n = S.reports.filter(r => r.status === 'zaprimljeno').length;
  $$('[data-badge]').forEach(b => { b.textContent = n; b.style.display = n ? '' : 'none'; b.setAttribute('aria-label', t('tabs.badge', {n:n})); });
}

/* ================= preusmjeravanje ================= */
let reassignTarget = null;
function openReassign(r){
  reassignTarget = r;
  fillServiceSelect($('#svcSel'), null, r.service || '');
  $('#svcTitle').textContent = t(r.service ? 'svcDlg.title' : 'svcDlg.titleAssign');
  $('#svcWhy').value = '';
  $('#svcDlg').showModal();
}
$('#svcForm').addEventListener('submit', e => {
  e.preventDefault();
  const r = reassignTarget; if (!r) return;
  const to = $('#svcSel').value, why = $('#svcWhy').value.trim();
  if (!to) return;
  if (to === r.service && r.confirmed){ $('#svcDlg').close(); return; }
  const from = r.service;
  r.service = to; r.confirmed = true;
  if (!from) addHistory(r, why ? 'assignedWhy' : 'assigned', why ? {to, why} : {to});
  else if (from === to) addHistory(r, why ? 'confirmedToWhy' : 'confirmedTo', why ? {svc:to, why} : {svc:to});
  else addHistory(r, why ? 'redirectWhy' : 'redirect', why ? {from, to, why} : {from, to});
  $('#svcDlg').close();
  commit(t('toast.redirected', {id:r.id, svc:svcName(to)}));
});

/* ================= pogled 2: ispuštanja s plovila ================= */
let sel2 = null;
const LAYERS2 = [ {key:'reports', on:true}, {key:'stations', on:true}, {key:'track', on:true} ];
function arrowIcon(deg, size){
  return L.divIcon({className:'ob-arrow', iconSize:[size,size], iconAnchor:[size/2,size/2],
    html:'<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" style="transform:rotate(' + deg + 'deg);color:var(--ob-track)" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V4M6 10l6-6 6 6"/></svg>'});
}
function initLayers2(){
  const m = maps.m2;
  m.createPane('stations'); m.getPane('stations').style.zIndex = 350;
  maps.lay2 = { reports:L.layerGroup().addTo(m), stations:L.layerGroup().addTo(m), track:L.layerGroup().addTo(m) };
  STATIONS.forEach(s => {
    L.marker([s.lat, s.lng], {pane:'stations', icon:L.divIcon({className:'', iconSize:[26,26], iconAnchor:[13,13], html:'<div class="ob-st-ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/></svg></div>'})})
      .bindTooltip(() => esc(s.name + (s.address ? ' · ' + s.address : '')))
      .bindPopup(() => '<b>' + esc(s.name) + '</b>' + (stSub(s) ? '<br>' + esc(stSub(s)) : '') + '<br><a href="' + esc(stUrl(s)) + '">' + esc(t('st.open')) + '</a>')
      .addTo(maps.lay2.stations);
  });
  renderChips2();
  renderMap2(true);
}
function renderChips2(){
  const box = $('#layers2'); if (!box) return;
  box.innerHTML = '<span class="lbl">' + esc(t('layers2.label')) + '</span>' + LAYERS2.map(l =>
    '<button type="button" class="ob-chip" data-layer2="' + l.key + '" aria-pressed="' + l.on + '">' + esc(t('layers2.' + l.key)) + '</button>').join('');
  $$('[data-layer2]', box).forEach(b => b.addEventListener('click', () => {
    const l = LAYERS2.find(x => x.key === b.dataset.layer2); if (!l || !maps.m2) return;
    l.on = !l.on; b.setAttribute('aria-pressed', String(l.on));
    if (l.on) maps.lay2[l.key].addTo(maps.m2); else maps.m2.removeLayer(maps.lay2[l.key]);
  }));
}
function renderMap2(fit){
  if (!maps.m2) return;
  const list = filteredD().filter(hasLoc);
  maps.lay2.reports.clearLayers(); maps.lay2.track.clearLayers();
  const trackColor = stColor('track');
  list.forEach(r => {
    const selected = r.id === sel2;
    const mk = L.circleMarker([r.lat, r.lng], markerStyle(r, selected)).bindTooltip(() => esc('#' + r.id + ' · ' + (r.vessel ? vesselLabel(r.vessel) : t('d2.vesselGeneric'))));
    mk.on('click', () => select2(r.id, false));
    maps.lay2.reports.addLayer(mk);
    if (r.heading != null){
      const end = destPoint(r, r.heading, 6);
      L.polyline([[r.lat, r.lng], [end.lat, end.lng]], {color:trackColor, weight: selected ? 4 : 3, dashArray:'8 7', opacity: selected ? 1 : .8, interactive:false}).addTo(maps.lay2.track);
      L.marker([end.lat, end.lng], {icon:arrowIcon(r.heading, 22), interactive:false, keyboard:false}).addTo(maps.lay2.track);
    }
  });
  if (fit && list.length) safeFit(maps.m2, L.latLngBounds(list.map(r => [r.lat, r.lng])).pad(0.2), {maxZoom:11});
}
function stationsAhead(r){
  if (!hasLoc(r)) return [];
  const all = STATIONS.map(s => ({s, d:distNM(r, s), b:bearing(r, s)}));
  let res;
  if (r.heading == null) res = all.sort((a, b) => a.d - b.d).slice(0, 3);
  else res = all.filter(x => angDiff(x.b, r.heading) <= 60 && x.d <= 45).sort((a, b) => a.d - b.d).slice(0, 3);
  if (!res.length) res = all.sort((a, b) => a.d - b.d).slice(0, 2);
  return res;
}
function renderTable2(list){
  const tb = $('#tbody2');
  if (!list.length){ tb.innerHTML = '<tr><td colspan="6" class="ob-empty">' + esc(t(S.reports.length ? 'tbl.empty' : 'emptyStore.title')) + '</td></tr>'; return; }
  tb.innerHTML = list.map(r => '<tr data-id="' + esc(r.id) + '" aria-current="' + (r.id === sel2) + '">' +
    '<td data-label="' + esc(t('tbl.id')) + '"><button type="button" class="ob-link" data-id="' + esc(r.id) + '">#' + esc(r.id) + '</button></td>' +
    '<td data-label="' + esc(t('tbl.time')) + '">' + esc(fmtWhen(r.createdAt)) + '</td>' +
    '<td data-label="' + esc(t('tbl.place')) + '">' + esc(r.place || t('noLoc')) + '</td>' +
    '<td data-label="' + esc(t('tbl.vessel')) + '">' + esc(vesselLabel(r.vessel)) + '</td>' +
    '<td data-label="' + esc(t('tbl.heading')) + '">' + esc(r.heading == null ? t('tbl.anchor') : dirName(r.heading)) + '</td>' +
    '<td data-label="' + esc(t('tbl.status')) + '"><span class="ob-pill ' + r.status + '">' + esc(stLabel(r.status)) + '</span></td></tr>').join('');
  $$('tr[data-id]', tb).forEach(tr2 => tr2.addEventListener('click', () => select2(tr2.dataset.id, true)));
}
function select2(id, fly){
  sel2 = id; renderView2(false);
  const r = byId(id);
  if (r && hasLoc(r) && maps.m2 && fly) safeFly(maps.m2, [r.lat, r.lng], Math.max(maps.m2.getZoom(), 10));
  openDrawer('#detail2');
}
function renderDetail2(){
  const el = $('#detail2'); const r = sel2 && byId(sel2);
  if (!r || r.type !== 'fekalne'){ el.innerHTML = '<div class="ob-empty" style="margin:auto">' + esc(t('d2.empty')) + '</div>'; return; }
  const ah = stationsAhead(r);
  const deg = r.heading == null ? null : r.heading;
  const loc = hasLoc(r);
  el.innerHTML =
    '<div class="ob-dtop"><button class="ob-btn ob-btn-plain ob-btn-sm ob-dback" type="button" data-act="close">' + ICON_BACK + esc(t('d.back')) + '</button><span class="id">#' + esc(r.id) + ' · ' + esc(fmtWhen(r.createdAt)) + '</span><span class="pills">' + pillsHtml(r) + '</span></div>' +
    photoHtml(r) + (r.desc ? '<p class="ob-desc">' + esc(r.desc) + '</p>' : '') +
    '<div style="display:flex;gap:14px;align-items:center">' +
      '<div class="ob-compass" role="img" aria-label="' + esc(deg == null ? t('d2.compassUnknown') : t('d2.compassAria', {dir:dirName(deg)})) + '"><span class="n">' + esc(t('dirS.n')) + '</span>' +
        (deg == null ? '<span class="unk">' + esc(t('d2.anchor1')) + '<br>' + esc(t('d2.anchor2')) + '</span>' : '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(' + deg + 'deg)" aria-hidden="true"><path d="M12 20V4M6 10l6-6 6 6"/></svg>') +
      '</div>' +
      kvHtml([[t('kv.vessel'), vesselLabel(r.vessel)], [t('kv.heading'), deg == null ? t('heading.unknown') : dirName(deg)], [t('kv.place'), r.place || t('noLoc')], [t('kv.competent'), svcName(r.service)]]).replace('class="ob-kv"', 'class="ob-kv" style="flex:1"') +
    '</div>' +
    '<div class="ob-card"><span class="ob-eyebrow">' + esc(deg == null ? t('d2.nearest') : t('d2.ahead')) + '</span>' +
      (loc ? ah.map(x => '<div class="ob-ahead"><span><a class="ob-st-link" href="' + esc(stUrl(x.s)) + '"><b>' + esc(x.s.name) + '</b></a><small>' + esc(stSub(x.s)) + '</small></span><span class="d">' + fmtNM(x.d) + '</span></div>').join('')
           : '<p class="ob-hint" style="margin:0">' + esc(t('d2.noLocStations')) + '</p>') + '</div>' +
    '<div class="ob-btns"><button class="ob-btn ob-btn-primary" type="button" data-act="notify" style="flex:1 1 100%"' + (loc ? '' : ' disabled') + '>' + esc(t('act.notify')) + '</button>' +
      (ORDER.indexOf(r.status) < 2 ? '<button class="ob-btn ob-btn-dark" type="button" data-act="next" style="flex:1">' + esc(t(r.status === 'zaprimljeno' ? 'act.take' : 'act.resolve')) + '</button>' : '') +
      '<button class="ob-btn ob-btn-ghost" type="button" data-act="open1" style="flex:1">' + esc(t('act.open1')) + '</button></div>' +
    '<div><div class="ob-eyebrow" style="margin-bottom:8px">' + esc(t('d.historyTitle')) + '</div>' + historyHtml(r, 6) + '</div>';
  bindDetailActions(el, r);
}
function notifyStations(r){
  const st = stationsAhead(r); if (!st.length) return;
  const names = st.map(x => x.s.name).join(', ');
  addHistory(r, 'notify', {names});
  commit(t('toast.notified', {names}));
}
function renderView2(fit){
  const list = filteredD();
  renderTable2(list); renderMap2(fit); renderDetail2();
}

/* ================= pogled 3: prognoza nanosa ================= */
const FC = { state:'idle', days:[], perBay:{}, updated:null, day:0, selBay:null, currents:false };
function onshore(speed, from, facing){ return speed * Math.cos(angDiff(from, facing) * RAD); }
function reportsNearBay(b){
  return S.reports.filter(r => (r.type === 'otpad_plaza' || r.type === 'otpad_more') && hasLoc(r) && inPeriod(r, '30') && distNM(r, b) <= 3).length;
}
function analyseDay(b, hours){
  // hours: [{h, ws, wd, cv, cd}] ws u čvorovima, cv u čvorovima (prema cd)
  let best = null; const onList = [];
  hours.forEach(x => {
    if (x.ws == null || x.wd == null) return;
    const on = onshore(x.ws, x.wd, b.facing);
    onList.push({h:x.h, on});
    if (!best || on > best.on) best = {on, ws:x.ws, wd:x.wd, h:x.h};
  });
  if (!best) return null;
  const top = onList.map(x => x.on).sort((a, c) => c - a).slice(0, 3);
  const windOn = Math.max(0, top.reduce((a, c) => a + c, 0) / top.length);
  let curOn = 0;
  hours.forEach(x => { if (x.cv != null && x.cd != null){ const c = x.cv * Math.cos(angDiff(x.cd, (b.facing + 180) % 360) * RAD); if (c > curOn) curOn = c; } });
  const thr = Math.max(5, best.on * 0.6);
  const win = onList.filter(x => x.on >= thr).map(x => x.h);
  const rep = reportsNearBay(b);
  const score = windOn + curOn * 12 + Math.min(rep, 4) * 1.5;
  const level = score >= 18 ? 'visok' : score >= 9 ? 'srednji' : 'nizak';
  let maxWs = null;
  hours.forEach(x => { if (x.ws != null && (!maxWs || x.ws > maxWs.ws)) maxWs = {ws:x.ws, wd:x.wd}; });
  return {level, score, windOn, curOn, rep, window: win.length ? [Math.min(...win), Math.max(...win)] : null, dom: maxWs || {ws:best.ws, wd:best.wd}};
}
function groupHours(times, get){
  const days = {};
  times.forEach((tm, i) => { const d = tm.slice(0, 10), h = Number(tm.slice(11, 13)); (days[d] = days[d] || []).push(Object.assign({h}, get(i))); });
  return days;
}
async function fetchJSON(url, ms){
  const ctrl = new AbortController(); const tm = setTimeout(() => ctrl.abort(), ms);
  try { const r = await fetch(url, {signal:ctrl.signal}); if (!r.ok) throw new Error('HTTP ' + r.status); return await r.json(); }
  finally { clearTimeout(tm); }
}
async function loadForecast(){
  FC.state = 'loading'; renderSrc();
  const lat = BAYS.map(b => b.lat).join(','), lng = BAYS.map(b => b.lng).join(',');
  try {
    const w = await fetchJSON('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng + '&hourly=wind_speed_10m,wind_direction_10m&wind_speed_unit=kn&timezone=Europe%2FZagreb&forecast_days=3', 12000);
    const W = Array.isArray(w) ? w : [w];
    if (W.length !== BAYS.length || !W[0].hourly) throw new Error('unexpected response');
    let M = null;
    try {
      const m = await fetchJSON('https://marine-api.open-meteo.com/v1/marine?latitude=' + lat + '&longitude=' + lng + '&hourly=ocean_current_velocity,ocean_current_direction&timezone=Europe%2FZagreb&forecast_days=3', 12000);
      M = Array.isArray(m) ? m : [m];
      if (M.length !== BAYS.length) M = null;
    } catch(e){ M = null; }
    const perBay = {}; let dayList = null;
    BAYS.forEach((b, i) => {
      const hw = W[i].hourly, hm = M && M[i] && M[i].hourly;
      const mIdx = {}; if (hm && hm.time) hm.time.forEach((tm, j) => mIdx[tm] = j);
      const g = groupHours(hw.time, j => {
        const tm = hw.time[j], mj = mIdx[tm];
        return {ws:hw.wind_speed_10m[j], wd:hw.wind_direction_10m[j],
          cv: (hm && mj != null && hm.ocean_current_velocity && hm.ocean_current_velocity[mj] != null) ? hm.ocean_current_velocity[mj] / 1.852 : null,
          cd: (hm && mj != null && hm.ocean_current_direction) ? hm.ocean_current_direction[mj] : null};
      });
      const keys = Object.keys(g).sort().slice(0, 3);
      if (!dayList) dayList = keys;
      perBay[b.id] = keys.map(k => analyseDay(b, g[k]));
    });
    FC.days = dayList; FC.perBay = perBay; FC.state = 'ok'; FC.currents = !!M; FC.updated = new Date();
  } catch(e){
    FC.state = 'error'; FC.err = e && e.message; FC.days = []; FC.perBay = {};
  }
  if (FC.day >= FC.days.length) FC.day = 0;
  renderView3();
}
function dayLabel(k, i){
  const d = new Date(k + 'T12:00:00');
  const wd = new Intl.DateTimeFormat(LOC(), {weekday:'short'}).format(d);
  const date = new Intl.DateTimeFormat(LOC(), {day:'numeric', month:'numeric'}).format(d);
  return (i === 0 ? t('day.today') : i === 1 ? t('day.tomorrow') : wd.charAt(0).toUpperCase() + wd.slice(1)) + ', ' + date;
}
function renderSrc(){
  const el = $('#fcSrc');
  if (FC.state === 'loading' || FC.state === 'idle'){ el.className = 'ob-src'; el.textContent = t('fc.loading'); return; }
  if (FC.state === 'ok'){ el.className = 'ob-src'; el.textContent = t('fc.ok', {what:t(FC.currents ? 'fc.windCur' : 'fc.wind'), time:fmtTime(FC.updated)}); return; }
  if (FC.state === 'error'){ el.className = 'ob-src warn'; el.textContent = t('fc.errShort'); }
}
const RANK = {visok:0, srednji:1, nizak:2};
const kn = v => Math.round(v) + ' ' + t('unit.kn');
function renderView3(){
  renderSrc();
  const tabs = $('#dayTabs');
  if (FC.state === 'idle' || (FC.state === 'loading' && !FC.days.length)){
    tabs.innerHTML = ''; $('#bays').innerHTML = '<div class="ob-empty">' + esc(t('fc.loading')) + '</div>'; renderMap3(); return;
  }
  if (FC.state === 'error' || (FC.state === 'loading' && !FC.days.length)){
    tabs.innerHTML = '';
    $('#bays').innerHTML = '<div class="ob-empty ob-fc-err" role="alert"><b>' + esc(t('fc.errTitle')) + '</b><span>' + esc(t(navigator.onLine ? 'fc.errBody' : 'fc.errOffline')) + '</span>' +
      '<button class="ob-btn ob-btn-primary ob-btn-sm" type="button" data-retry>' + esc(t('fc.retry')) + '</button></div>';
    const rb = $('#bays [data-retry]'); if (rb) rb.addEventListener('click', loadForecast);
    renderMap3(); return;
  }
  tabs.innerHTML = FC.days.map((k, i) => {
    let dom = null; BAYS.forEach(b => { const a = FC.perBay[b.id] && FC.perBay[b.id][i]; if (a && (!dom || a.dom.ws > dom.ws)) dom = a.dom; });
    return '<button class="ob-daytab" role="tab" type="button" data-day="' + i + '" aria-selected="' + (i === FC.day) + '"><b>' + esc(dayLabel(k, i)) + '</b><span>' + (dom ? esc(windName(dom.wd) + ' ' + t('fc.upTo', {v:kn(dom.ws)})) : '—') + '</span></button>';
  }).join('');
  $$('[data-day]', tabs).forEach(b => b.addEventListener('click', () => { FC.day = Number(b.dataset.day); renderView3(); }));
  const key = FC.days[FC.day];
  const rows = BAYS.map(b => ({b, a: FC.perBay[b.id] && FC.perBay[b.id][FC.day]})).filter(x => x.a).sort((x, y) => RANK[x.a.level] - RANK[y.a.level] || y.a.score - x.a.score);
  const box = $('#bays');
  box.innerHTML = '<div><h3>' + esc(t('fc.expected', {day:key ? dayLabel(key, FC.day) : ''})) + '</h3><p class="ob-hint" style="margin:4px 0 0;font-size:13px">' + esc(t('fc.riskHint')) + '</p></div>' +
    rows.map(({b, a}) => {
      const wk = key + ':' + b.id, sent = S.warnings[wk];
      const win = a.window ? (a.window[0] + '–' + (a.window[1] + 1) + ' h') : t('fc.noWindow');
      return '<div class="ob-bay" data-bay="' + b.id + '" aria-current="' + (FC.selBay === b.id) + '">' +
        '<div class="h"><button type="button" class="ob-bay-name" data-focus="' + b.id + '">' + esc(b.name) + '</button><span class="ob-pill ' + a.level + '">' + esc(t('risk.' + a.level)) + '</span></div>' +
        '<div class="m">' + esc(t('fc.windOn', {v:kn(a.windOn), win:win})) + (FC.currents ? esc(t('fc.current', {v:num1(a.curOn) + ' ' + t('unit.kn')})) : '') + '</div>' +
        '<div class="m">' + esc(t('fc.nearby', {n:a.rep, owner:svcName(b.ownerId)})) + '</div>' +
        (a.level === 'nizak' ? '' : sent ? '<span class="ob-sent">' + ICON_CHECK + esc(t('fc.sentAt', {time:fmtTime(new Date(sent))})) + '</span>' : '<button class="ob-btn ob-btn-primary ob-btn-sm" type="button" data-warn="' + b.id + '" style="align-self:flex-start">' + esc(t('fc.warnBtn')) + '</button>') +
        '</div>';
    }).join('');
  $$('[data-warn]', box).forEach(btn => btn.addEventListener('click', () => {
    const b = BAYS.find(x => x.id === btn.dataset.warn);
    S.warnings[key + ':' + b.id] = new Date().toISOString(); save(); renderView3();
    toast(t('toast.warn', {bay:b.name, owner:svcName(b.ownerId)}));
  }));
  $$('[data-focus]', box).forEach(btn => btn.addEventListener('click', () => {
    const b = BAYS.find(x => x.id === btn.dataset.focus); FC.selBay = b.id;
    safeFly(maps.m3, [b.lat, b.lng], 13);
    renderView3();
    if (window.matchMedia('(max-width:1199px)').matches) $('#map3').scrollIntoView({behavior:'smooth', block:'center'});
  }));
  renderMap3();
}
function renderMap3(){
  if (!maps.m3) return;
  const g = maps.g3; g.clearLayers();
  S.reports.filter(r => (r.type === 'otpad_plaza' || r.type === 'otpad_more') && hasLoc(r) && inPeriod(r, '30')).forEach(r => {
    L.marker([r.lat, r.lng], {icon:L.divIcon({className:'', iconSize:[12,12], iconAnchor:[6,6], html:'<div class="ob-waste-ico"></div>'})}).bindTooltip(() => esc('#' + r.id + ' · ' + typeLabel(r.type))).addTo(g);
  });
  BAYS.forEach(b => {
    const a = FC.perBay[b.id] && FC.perBay[b.id][FC.day]; if (!a) return;
    const size = a.level === 'visok' ? 46 : a.level === 'srednji' ? 38 : 30, sel = FC.selBay === b.id;
    const to = (a.dom.wd + 180) % 360;
    const c = 'var(--ob-' + a.level + ')';
    const html = '<div class="ob-bay-ring" style="width:' + size + 'px;height:' + size + 'px;border-color:' + (sel ? 'var(--ob-ring)' : c) + ';background:color-mix(in srgb, ' + c + ' 24%, transparent);color:var(--ob-arrow)">' +
      '<svg width="' + (size - 14) + '" height="' + (size - 14) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(' + to + 'deg)" aria-hidden="true"><path d="M12 20V4M6 10l6-6 6 6"/></svg></div>';
    const mk = L.marker([b.lat, b.lng], {icon:L.divIcon({className:'', html, iconSize:[size,size], iconAnchor:[size/2,size/2]}), keyboard:true, title:b.name})
      .bindTooltip(() => esc(b.name + ' · ' + t('risk.' + a.level) + ' · ' + windName(a.dom.wd) + ' ' + kn(a.dom.ws)));
    mk.on('click', () => { FC.selBay = b.id; renderView3(); const el = $('#bays [data-bay="' + b.id + '"]'); if (el) el.scrollIntoView({block:'nearest', behavior:'smooth'}); });
    g.addLayer(mk);
  });
}
$('#fcReload').addEventListener('click', loadForecast);

/* ================= ladice s detaljima (tablet / mobitel / manji desktop) ================= */
const DRAWER_MQ = '(max-width:1499px)';
let drawerReturn = null;
function openDrawer(sel){
  if (!window.matchMedia(DRAWER_MQ).matches) return;
  if (!document.querySelector('.ob-detail.open')) drawerReturn = document.activeElement;
  $(sel).classList.add('open'); $('#backdrop').classList.add('open');
  setTimeout(() => $(sel).focus(), 60);
}
function closeDrawers(){
  const was = !!document.querySelector('.ob-detail.open');
  $$('.ob-detail.open').forEach(d => d.classList.remove('open')); $('#backdrop').classList.remove('open');
  if (was && drawerReturn && document.contains(drawerReturn)) { try { drawerReturn.focus(); } catch(e){} }
  drawerReturn = null;
}
$('#backdrop').addEventListener('click', closeDrawers);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){
    if (document.querySelector('dialog[open]')) return;
    closeDrawers();
  }
});

/* ================= unos prijave (kako je šalje građanin / nautičar) ================= */
let pick = null, pickMap = null, pickMarker = null, photoData = null;
function fillNewForm(){
  const type = $('#nType').value, ves = $('#nVessel').value, hd = $('#nHeading').value;
  fillSelect($('#nType'), Object.keys(TYPES).map(k => [k, typeLabel(k)]), null, type);
  fillSelect($('#nVessel'), VESSELS.map(v => [v, vesselLabel(v)]), t('new.choose'), ves);
  $('#nHeading').innerHTML = '<option value="">' + esc(t('heading.unknownAnchor')) + '</option>' + DIRK.map((d, i) => { const s = dirName(i * 45); return '<option value="' + (i * 45) + '">' + esc(s.charAt(0).toUpperCase() + s.slice(1)) + '</option>'; }).join('');
  $('#nHeading').value = hd || '';
}
function syncTypeFields(){
  const tp = TYPES[$('#nType').value];
  $('#nVesselWrap').style.display = tp && tp.vessel ? '' : 'none';
  $('#nHeadingWrap').style.display = $('#nType').value === 'fekalne' ? '' : 'none';
  updatePreview();
}
function setPick(lat, lng, pan){
  if (!isFinite(lat) || !isFinite(lng)) return;
  pick = {lat, lng};
  $('#nLat').value = lat.toFixed(5); $('#nLng').value = lng.toFixed(5);
  if (pickMap){
    const st = {radius:10, color:stColor('ring'), weight:3, fillColor:stColor('zaprimljeno'), fillOpacity:1};
    if (!pickMarker) pickMarker = L.circleMarker([lat, lng], st).addTo(pickMap);
    else pickMarker.setLatLng([lat, lng]);
    if (pan) pickMap.setView([lat, lng], Math.max(pickMap.getZoom(), 11));
  }
  updatePreview();
}
function inCroatiaBox(lat, lng){ return lat >= 42.2 && lat <= 46.6 && lng >= 13.2 && lng <= 19.5; }
function updatePreview(){
  const el = $('#nPreview');
  if (!pick){ el.textContent = t('new.previewEmpty'); return; }
  if (!inCroatiaBox(pick.lat, pick.lng)){ el.textContent = t('new.outside'); return; }
  const rt = route(pick.lat, pick.lng, $('#nType').value);
  el.innerHTML = '<b>' + esc(t('new.willGo')) + '</b> ' + esc(svcName(rt.service)) + '<br><span class="ob-hint">' + esc(reasonText(rt.reasons[0])) + '</span>';
}
$('#newBtn').addEventListener('click', () => {
  $('#newForm').reset(); fillNewForm(); $('#nErr').textContent = ''; pick = null; photoData = null;
  if (pickMarker && pickMap){ pickMap.removeLayer(pickMarker); pickMarker = null; }
  syncTypeFields();
  $('#newDlg').showModal();
  setTimeout(() => {
    if (!leafletOK()) return;
    if (!pickMap){
      pickMap = makeMap('pickMap'); pickMap.setView([43.51, 16.44], 9);
      pickMap.on('click', e => setPick(e.latlng.lat, e.latlng.lng, false));
    }
    pickMap.invalidateSize();
  }, 80);
});
$('#nType').addEventListener('change', syncTypeFields);
['#nLat','#nLng'].forEach(s => $(s).addEventListener('change', () => {
  const lat = parseFloat($('#nLat').value.replace(',', '.')), lng = parseFloat($('#nLng').value.replace(',', '.'));
  if (isFinite(lat) && isFinite(lng)) setPick(lat, lng, true);
}));
$('#nGeo').addEventListener('click', () => {
  $('#nErr').textContent = '';
  if (!navigator.geolocation){ $('#nErr').textContent = t('new.errGeoUnsupported'); return; }
  navigator.geolocation.getCurrentPosition(p => setPick(p.coords.latitude, p.coords.longitude, true),
    () => { $('#nErr').textContent = t('new.errGeo'); }, {enableHighAccuracy:true, timeout:10000});
});
$('#nPhoto').addEventListener('change', e => {
  photoData = null; const f = e.target.files && e.target.files[0]; if (!f) return;
  if (!/^image\//.test(f.type)){ $('#nErr').textContent = t('new.errImg'); return; }
  const img = new Image(), url = URL.createObjectURL(f);
  img.onload = () => {
    const max = 900, sc = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    photoData = c.toDataURL('image/jpeg', 0.72); URL.revokeObjectURL(url);
  };
  img.onerror = () => { $('#nErr').textContent = t('new.errImgLoad'); URL.revokeObjectURL(url); };
  img.src = url;
});
$('#newForm').addEventListener('submit', e => {
  e.preventDefault();
  const type = $('#nType').value, err = $('#nErr');
  if (!pick){ err.textContent = t('new.errPick'); return; }
  if (!inCroatiaBox(pick.lat, pick.lng)){ err.textContent = t('new.errOutside'); return; }
  if (TYPES[type].vessel && !$('#nVessel').value){ err.textContent = t('new.errVessel'); return; }
  const rt = route(pick.lat, pick.lng, type);
  const id = nextId();
  const now = new Date().toISOString();
  const hv = $('#nHeading').value;
  const r = {id, type, lat:pick.lat, lng:pick.lng, place:tHr('nearPlace', {town:shortTown(rt.town)}), desc:$('#nDesc').value.trim(), createdAt:now, status:'zaprimljeno',
    vessel: TYPES[type].vessel ? $('#nVessel').value : null, heading: (type === 'fekalne' && hv !== '') ? Number(hv) : null,
    service:rt.service, reasons:rt.reasons.map(x => reasonText(x, true)), county:rt.county, confirmed:false, photo:photoData, source:'obrada.html',
    history:[hEntry('received', {svc:rt.service}, now)]};
  S.reports.push(r);
  if (!save()){ r.photo = null; save(); setTimeout(() => toast(t('toast.photoNotSaved')), 2800); }
  $('#newDlg').close();
  F.statuses.add('zaprimljeno');
  fillFilters();
  if (type === 'fekalne' && currentView() === 'ispustanja'){ renderAll(); select2(id, true); }
  else { if (currentView() !== 'prijave') location.hash = '#prijave'; setTimeout(() => { renderView1(false); select1(id, true); }, 90); }
  toast(t('toast.created', {id, svc:svcName(rt.service)}));
});
$$('dialog [data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));


/* ================= filteri: povezivanje ================= */
function initFilters(){
  fillFilters();
  let qT;
  $('#fQ').addEventListener('input', e => { clearTimeout(qT); qT = setTimeout(() => { F.q = e.target.value; renderView1(false); updateFilterCount(); }, 150); });
  [['#fRegion','region'],['#fPeriod','period'],['#fVessel','vessel'],['#fType','type'],['#fService','service']].forEach(([s, k]) =>
    $(s).addEventListener('change', e => { F[k] = e.target.value; renderView1(true); updateFilterCount(); }));
  [['#dRegion','region'],['#dPeriod','period'],['#dVessel','vessel']].forEach(([s, k]) =>
    $(s).addEventListener('change', e => { D[k] = e.target.value; renderView2(true); }));
  $('#fClear').addEventListener('click', () => {
    Object.assign(F, {q:'', region:'', period:'30', vessel:'', type:''}); F.statuses = new Set(ORDER);
    $('#fQ').value = ''; $('#fRegion').value = ''; $('#fPeriod').value = '30'; $('#fVessel').value = ''; $('#fType').value = '';
    renderView1(true); updateFilterCount();
  });
  $('#fToggle').addEventListener('click', () => { const o = $('#filters1').classList.toggle('open'); $('#fToggle').setAttribute('aria-expanded', String(o)); });
  $$('[data-seg]').forEach(b => b.addEventListener('click', () => {
    $('#work1').dataset.show = b.dataset.seg; $$('[data-seg]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    if (b.dataset.seg === 'map' && maps.m1) setTimeout(() => { maps.m1.invalidateSize(); flushMap(maps.m1); }, 50);
  }));
  $$('[data-seg2]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.seg2; $('#work2').dataset.show = v; $$('[data-seg2]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    applyPhoneTableVisibility();
    if (v === 'map' && maps.m2) setTimeout(() => { maps.m2.invalidateSize(); flushMap(maps.m2); }, 50);
  }));
}
function updateFilterCount(){
  const n = ['region','vessel','type'].filter(k => F[k]).length + (F.period !== '30' ? 1 : 0) + (F.q ? 1 : 0);
  $('#fToggle').textContent = t('filters.toggle') + (n ? ' (' + n + ')' : '');
}
function applyPhoneTableVisibility(){
  if (window.matchMedia('(max-width:759px)').matches) $('#tblWrap').style.display = $('#work2').dataset.show === 'list' ? '' : 'none';
  else $('#tblWrap').style.display = '';
}

/* ================= kartice modula (hash routing) ================= */
const VIEWS = ['prijave','ispustanja','prognoza'];
function currentView(){ const h = location.hash.replace('#', ''); return VIEWS.includes(h) ? h : 'prijave'; }
function showView(){
  const v = currentView();
  VIEWS.forEach(x => $('#v-' + x).classList.toggle('active', x === v));
  $$('[data-view]').forEach(a => { if (a.dataset.view === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  closeDrawers();
  ensureMaps(v);
  if (v === 'prognoza' && FC.state === 'idle') loadForecast();
  if (v === 'prognoza') renderMap3();
}
window.addEventListener('hashchange', () => { showView(); const bar = $('.ob-bar'); if (bar && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({block:'start'}); });
let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { invalidateAll(); if (!window.matchMedia(DRAWER_MQ).matches) closeDrawers(); applyPhoneTableVisibility(); }, 150); });

function renderAll(fit){ renderView1(!!fit); renderView2(!!fit); if (FC.state !== 'idle') renderView3(); }

/* ================= zajedničko spremište: promjene iz drugih kartica (npr. report.html) ================= */
window.addEventListener('storage', e => {
  if (e.key !== null && e.key !== KEY) return;
  const oldIds = new Set(S.reports.map(r => r.id));
  const L1 = load(); S = L1.s; if (L1.dirty) save();
  const added = S.reports.filter(r => !oldIds.has(r.id));
  fillFilters(); renderAll(false);
  if (added.length === 1) toast(t('toast.incoming', {id:added[0].id}));
  else if (added.length > 1) toast(t('toast.incomingN', {n:added.length}));
});

/* ================= promjena jezika i načina (app.js) ================= */
document.addEventListener('cm:lang', () => {
  fillFilters(); updateFilterCount();
  if ($('#newDlg').open){ fillNewForm(); syncTypeFields(); }
  if ($('#svcDlg').open && reassignTarget){ fillServiceSelect($('#svcSel')); $('#svcTitle').textContent = t(reassignTarget.service ? 'svcDlg.title' : 'svcDlg.titleAssign'); }
  renderChips1(); renderChips2(); showMapNote(noteKey);
  renderAll(false); renderSrc();
});
document.addEventListener('cm:mode', () => {
  // Leaflet SVG boje čitaju se iz CSS varijabli – ponovno iscrtaj
  setTimeout(() => { renderMap1(false); renderMap2(false); renderMap3(); if (pickMarker) pickMarker.setStyle({color:stColor('ring'), fillColor:stColor('zaprimljeno')}); }, 30);
});

/* ================= pokretanje ================= */
initFilters();
updateFilterCount();
renderAll(false);
renderSrc();
showView();
applyPhoneTableVisibility();
setInterval(() => { if (currentView() === 'prijave') renderList1(filtered()); }, 60000);
window.cistoMore = { maps, get state(){ return S; } };
})();
