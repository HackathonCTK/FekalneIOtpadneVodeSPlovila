/*
 * ČistoMore — Obrada prijava: prijevodi (HR/EN), ključevi "obrada.*".
 * Učitava se nakon app.js; obrada.js čita isti rječnik (window.OBRADA_I18N),
 * a hrvatski tekst koristi i za zapis povijesti u zajedničkom spremištu.
 */
(function(){
'use strict';
var hr = {
  title: 'ČistoMore – Obrada prijava',
  brandSub: 'Portal za nadležne službe',
  pageTitle: 'Obrada prijava',
  pageSub: 'Praćenje, usmjeravanje i rješavanje prijava onečišćenja mora',
  tabs: {
    label: 'Moduli obrade prijava',
    prijave: 'Prijave i usmjeravanje', prijaveShort: 'Prijave',
    ispustanja: 'Ispuštanja s plovila', ispustanjaShort: 'Ispuštanja',
    prognoza: 'Prognoza nanosa', prognozaShort: 'Prognoza',
    badge: '{n} novih prijava'
  },
  newBtn: 'Unesi prijavu',
  v1: {
    h: 'Prijave i usmjeravanje',
    p: 'Aplikacija iz lokacije i vrste problema predlaže nadležnu službu. Službenik potvrđuje, preusmjerava i vodi status.',
    serviceFor: 'Prikaz za službu',
    listAria: 'Popis prijava', mapAria: 'Karta prijava i nadležnosti', detailAria: 'Detalji prijave'
  },
  filters: {
    toggle: 'Filteri', q: 'Pretraži', qPh: 'ID, lokacija, opis…', region: 'Lokacija (županija)', period: 'Datum',
    vessel: 'Vrsta plovila', type: 'Vrsta problema', clear: 'Očisti filtere',
    allServices: 'Sve službe', allCounties: 'Sve županije', allVessels: 'Sva plovila', allTypes: 'Sve vrste'
  },
  period: { '1': 'Zadnja 24 sata', '7': 'Zadnjih 7 dana', '30': 'Zadnjih 30 dana', all: 'Sve' },
  seg: { label: 'Prikaz', list: 'Popis', map: 'Karta' },
  layers1: { label: 'Slojevi nadležnosti', lk: 'Sjedišta lučkih kapetanija' },
  layers2: { label: 'Prikaži', reports: 'Prijave ispuštanja', stations: 'Crpne stanice i prihvat otpada', track: 'Smjer kretanja' },
  legend2: { report: 'Prijava ispuštanja', station: 'Prihvatno mjesto za fekalne vode', track: 'Prijavljeni smjer kretanja' },
  legend3: { waste: 'Prijava otpada (30 dana)' },
  mapNote: {
    tiles: 'Karta se ne može učitati (nema veze s poslužiteljem OpenStreetMapa). Prijave, filteri i obrada i dalje rade.',
    noLeaflet: 'Biblioteka za kartu nije učitana (nema interneta). Popis i obrada prijava i dalje rade.'
  },
  status: { zaprimljeno: 'Zaprimljeno', obrada: 'U obradi', rijeseno: 'Riješeno' },
  type: {
    fekalne: 'Ispuštanje fekalnih ili otpadnih voda s plovila',
    ulje: 'Uljna mrlja ili onečišćenje mora',
    otpad_more: 'Plutajući otpad u moru',
    otpad_plaza: 'Otpad na plaži',
    septicka: 'Izljev septičke jame ili kanalizacije u more',
    napusteno: 'Napušteno ili potonulo plovilo',
    otpad_kopno: 'Divlje odlagalište uz obalu',
    unknown: 'Nepoznata vrsta problema'
  },
  vessel: {
    v0: 'Gumenjak / brodica do 6 m', v1: 'Motorni brod 6–12 m', v2: 'Jedrilica 8–15 m', v3: 'Motorna jahta 12–24 m',
    v4: 'Gulet / brod veći od 24 m', v5: 'Brod za kružna putovanja', v6: 'Ribarski brod', v7: 'Nepoznato',
    unknown: 'Nepoznato'
  },
  county: {
    c0: 'Istarska', c1: 'Primorsko-goranska', c2: 'Ličko-senjska', c3: 'Zadarska',
    c4: 'Šibensko-kninska', c5: 'Splitsko-dalmatinska', c6: 'Dubrovačko-neretvanska'
  },
  svc: {
    lk: 'Lučka kapetanija {x}', kr: 'Komunalni redar, {x}',
    none: 'Služba nije određena', unknown: 'Nepoznata služba ({id})'
  },
  svcGroup: { lk: 'Lučke kapetanije', kr: 'Komunalni redari' },
  st: { open: 'Otvori na karti' },
  dir: { n: 'sjever', ne: 'sjeveroistok', e: 'istok', se: 'jugoistok', s: 'jug', sw: 'jugozapad', w: 'zapad', nw: 'sjeverozapad' },
  dirS: { n: 'S', ne: 'SI', e: 'I', se: 'JI', s: 'J', sw: 'JZ', w: 'Z', nw: 'SZ' },
  when: { now: 'upravo sada', min: 'prije {n} min', today: 'danas {time}', yesterday: 'jučer {time}' },
  r: {
    nearestLK: 'Najbliža lučka kapetanija: {city} ({km} km)',
    nearestTown: 'Najbliži grad / općina: {town} ({km} km)',
    seaLK: 'Onečišćenje mora i ispuštanja s plovila: nadzor vodi lučka kapetanija',
    landKR: 'Izvor je na kopnu ili na plaži: komunalni redar grada / općine',
    where: 'Najbliže naselje: {town} ({county} županija)'
  },
  h: {
    received: 'Prijava zaprimljena. Automatski prijedlog: {svc}',
    received0: 'Prijava zaprimljena.',
    receivedForm: 'Prijava zaprimljena (Nova prijava).',
    autoSuggest: 'Automatski prijedlog nadležne službe: {svc}',
    confirmed: 'Potvrđeno i proslijeđeno: {svc}',
    status: 'Status: {status}',
    statusBack: 'Status vraćen na: {status}',
    redirect: 'Preusmjereno s „{from}” na: {to}',
    redirectWhy: 'Preusmjereno s „{from}” na: {to}. Razlog: {why}',
    confirmedTo: 'Potvrđeno: {svc}',
    confirmedToWhy: 'Potvrđeno: {svc}. Razlog: {why}',
    assigned: 'Dodijeljeno službi: {to}',
    assignedWhy: 'Dodijeljeno službi: {to}. Razlog: {why}',
    notify: 'Obavijest za crpne stanice / marine: {names}'
  },
  nearPlace: 'Blizu: {town}',
  noLoc: 'Bez lokacije',
  list: { empty: 'Nema prijava za odabrane filtere.', suggested: '(prijedlog)' },
  d: {
    empty: 'Odaberite prijavu s popisa ili karte.', back: 'Natrag', report: 'Prijava #{id}',
    photoAlt: 'Fotografija uz prijavu #{id}', noPhoto: 'Prijava je poslana bez fotografije',
    statusTitle: 'Status', historyTitle: 'Povijest'
  },
  kv: {
    place: 'Lokacija', reported: 'Prijavljeno', vessel: 'Vrsta plovila', heading: 'Smjer kretanja', coords: 'Koordinate',
    county: 'Županija', wasteType: 'Vrsta otpada', shipSize: 'Veličina plovila', shipColor: 'Boja plovila',
    registration: 'Registracija / ime plovila', observedFromLand: 'Opaženo s kopna', observedAt: 'Vrijeme opažanja',
    source: 'Izvor', sourceForm: 'Obrazac „Nova prijava”', sourceObrada: 'Uneseno u obradi prijava', competent: 'Nadležno'
  },
  yes: 'Da', no: 'Ne',
  heading: { unknownAnchor: 'Nepoznat / na sidru', unknown: 'Nepoznat' },
  route: {
    confirmed: 'Nadležna služba', suggested: 'Predložena nadležna služba', none: 'Nadležna služba nije određena',
    noLocReason: 'Prijava nema lokaciju, pa službu nije moguće automatski predložiti. Odaberite službu ručno.'
  },
  act: {
    confirm: 'Potvrdi i proslijedi', reassign: 'Druga služba…', assign: 'Dodijeli službu…',
    take: 'Preuzmi u obradu', resolve: 'Označi kao riješeno', back: 'Vrati status',
    notify: 'Obavijesti marine na smjeru plovidbe', open1: 'Otvori u Prijavama'
  },
  public: { title: 'Što vidi prijavitelj', p1: 'Prijava #{id}:', p2: 'Zadužena služba: {svc}. Zadnja promjena: {when}.' },
  v2: {
    h: 'Ispuštanje fekalnih i otpadnih voda s plovila',
    p: 'Prijave s fotografijom, vrstom plovila i smjerom kretanja te karta mjesta za ispumpavanje i prihvat otpada.',
    location: 'Lokacija', mapAria: 'Karta ispuštanja i crpnih stanica', detailAria: 'Detalji prijave ispuštanja'
  },
  d2: {
    empty: 'Odaberite prijavu ispuštanja na karti ili u tablici.', vesselGeneric: 'plovilo',
    compassAria: 'Smjer kretanja: {dir}', compassUnknown: 'Smjer nepoznat', anchor1: 'sidro /', anchor2: 'nepoznat',
    nearest: 'Najbliže crpne stanice', ahead: 'Crpne stanice na smjeru plovidbe',
    noLocStations: 'Prijava nema lokaciju, pa nije moguće pronaći crpne stanice na smjeru plovidbe.'
  },
  tbl: {
    caption: 'Prijave ispuštanja s plovila', id: 'ID', time: 'Vrijeme', place: 'Lokacija', vessel: 'Plovilo',
    heading: 'Smjer', status: 'Status', empty: 'Nema prijava ispuštanja za odabrane filtere.', anchor: 'Na sidru / nepoznat'
  },
  v3: {
    h: 'Prognoza nanosa otpada',
    p: 'Vjetar i morske struje uz prijave građana pokazuju gdje očekivati otpad u sljedeća 3 dana.'
  },
  fc: {
    reload: 'Osvježi', dayTabs: 'Dan prognoze', mapAria: 'Karta prognoze', baysAria: 'Uvale s očekivanim nanosom',
    mapLabel: 'Krug = razina rizika · strelica = smjer vjetra',
    loading: 'Učitavanje prognoze…',
    ok: 'Open-Meteo: {what} · dohvaćeno u {time}', wind: 'vjetar', windCur: 'vjetar i morske struje',
    errShort: 'Prognoza nije dohvaćena', errTitle: 'Prognozu nije moguće dohvatiti',
    errBody: 'Open-Meteo trenutačno ne odgovara. Pokušajte ponovno za nekoliko trenutaka.',
    errOffline: 'Nema internetske veze. Spojite se i pokušajte ponovno.', retry: 'Pokušaj ponovno',
    upTo: 'do {v}', expected: 'Očekivani nanos · {day}',
    riskHint: 'Rizik = vjetar prema obali + struja prema obali + prijave otpada u blizini (30 dana).',
    windOn: 'Vjetar prema obali: {v} · razdoblje: {win}', noWindow: 'nije očekivan',
    current: ' · struja prema obali: {v}', nearby: 'Prijave u blizini: {n} · Odgovorni: {owner}',
    sentAt: 'Upozorenje zabilježeno u {time}', warnBtn: 'Pošalji upozorenje upravitelju'
  },
  unit: { kn: 'čv' },
  day: { today: 'Danas', tomorrow: 'Sutra' },
  risk: { visok: 'Visok rizik', srednji: 'Srednji rizik', nizak: 'Nizak rizik' },
  foot: 'Karta: © suradnici OpenStreetMapa. Prognoza vjetra i struja: Open-Meteo. Prihvatna mjesta: popis dokumentiranih instalacija (rad potvrdite s operaterom). Prijedlog službe temelji se na najbližoj lučkoj kapetaniji i službenik ga uvijek može promijeniti. Podaci se spremaju samo u ovom pregledniku.',
  dlg: { close: 'Zatvori' },
  new: {
    title: 'Unos prijave', intro: 'Unesite prijavu zaprimljenu telefonom, e-poštom ili na terenu. Odaberite lokaciju klikom na kartu.',
    type: 'Vrsta problema', vessel: 'Vrsta plovila', heading: 'Smjer kretanja plovila', pickAria: 'Karta za odabir lokacije',
    lat: 'Geogr. širina', lng: 'Geogr. dužina', geo: 'Moja lokacija', desc: 'Opis (neobavezno)', descPh: 'Što ste vidjeli?',
    photo: 'Fotografija (neobavezno)', cancel: 'Odustani', submit: 'Pošalji prijavu', choose: 'Odaberite',
    previewEmpty: 'Odaberite lokaciju da vidite kojoj će službi prijava otići.',
    outside: 'Lokacija je izvan područja Hrvatske.', willGo: 'Prijava će ići:',
    errPick: 'Odaberite lokaciju na karti ili upišite koordinate.',
    errOutside: 'Lokacija mora biti na području Hrvatske.',
    errVessel: 'Odaberite vrstu plovila (ili „Nepoznato”).',
    errGeoUnsupported: 'Preglednik ne podržava lokaciju. Kliknite na kartu.',
    errGeo: 'Lokacija nije dostupna (nema dopuštenja ili signala). Kliknite na kartu.',
    errImg: 'Odaberite sliku.', errImgLoad: 'Sliku nije moguće učitati.'
  },
  svcDlg: {
    title: 'Preusmjeri drugoj službi', titleAssign: 'Dodijeli nadležnu službu', select: 'Nadležna služba',
    why: 'Razlog preusmjeravanja', whyPh: 'Npr. izvor onečišćenja je na kopnu, nadležan je komunalni redar',
    hint: 'Razlog se upisuje u povijest prijave. Iz takvih ispravaka mogu se poboljšati pravila usmjeravanja.',
    submit: 'Spremi'
  },
  emptyStore: { title: 'Još nema prijava', p: 'Prijave građana i nautičara pojavit će se ovdje čim budu poslane.', link: 'Pošalji prijavu' },
  toast: {
    forwarded: 'Prijava #{id} proslijeđena: {svc}.',
    status: 'Status prijave #{id}: {status}.',
    statusBack: 'Status prijave #{id} vraćen na: {status}.',
    redirected: 'Prijava #{id} usmjerena: {svc}.',
    notified: 'Obavijest zabilježena za: {names}.',
    warn: 'Upozorenje za {bay} zabilježeno ({owner}).',
    created: 'Prijava #{id} zaprimljena i usmjerena: {svc}.',
    photoNotSaved: 'Fotografija nije spremljena (premalo prostora na uređaju).',
    incoming: 'Stigla je nova prijava #{id}.',
    incomingN: 'Stiglo je novih prijava: {n}.'
  }
};

var en = {
  title: 'ČistoMore – Report handling',
  brandSub: 'Portal for authorities',
  pageTitle: 'Report handling',
  pageSub: 'Track, route and resolve marine pollution reports',
  tabs: {
    label: 'Report handling modules',
    prijave: 'Reports & routing', prijaveShort: 'Reports',
    ispustanja: 'Vessel discharges', ispustanjaShort: 'Discharges',
    prognoza: 'Debris forecast', prognozaShort: 'Forecast',
    badge: '{n} new reports'
  },
  newBtn: 'Log a report',
  v1: {
    h: 'Reports & routing',
    p: 'From the location and type of problem, the app suggests the competent authority. An officer confirms, reroutes and tracks the status.',
    serviceFor: 'View as authority',
    listAria: 'Report list', mapAria: 'Map of reports and jurisdictions', detailAria: 'Report details'
  },
  filters: {
    toggle: 'Filters', q: 'Search', qPh: 'ID, location, description…', region: 'Location (county)', period: 'Date',
    vessel: 'Vessel type', type: 'Problem type', clear: 'Clear filters',
    allServices: 'All authorities', allCounties: 'All counties', allVessels: 'All vessels', allTypes: 'All types'
  },
  period: { '1': 'Last 24 hours', '7': 'Last 7 days', '30': 'Last 30 days', all: 'All' },
  seg: { label: 'View', list: 'List', map: 'Map' },
  layers1: { label: 'Jurisdiction layers', lk: 'Harbour master offices' },
  layers2: { label: 'Show', reports: 'Discharge reports', stations: 'Pump-out & waste reception', track: 'Heading' },
  legend2: { report: 'Discharge report', station: 'Sewage pump-out point', track: 'Reported heading' },
  legend3: { waste: 'Waste report (30 days)' },
  mapNote: {
    tiles: 'The map cannot load (no connection to the OpenStreetMap server). Reports, filters and handling still work.',
    noLeaflet: 'The map library is not loaded (no internet). The report list and handling still work.'
  },
  status: { zaprimljeno: 'Received', obrada: 'In progress', rijeseno: 'Resolved' },
  type: {
    fekalne: 'Sewage or wastewater discharge from a vessel',
    ulje: 'Oil slick or sea pollution',
    otpad_more: 'Floating waste at sea',
    otpad_plaza: 'Waste on the beach',
    septicka: 'Septic tank or sewer outflow into the sea',
    napusteno: 'Abandoned or sunken vessel',
    otpad_kopno: 'Illegal dump on the coast',
    unknown: 'Unknown problem type'
  },
  vessel: {
    v0: 'Dinghy / boat up to 6 m', v1: 'Motorboat 6–12 m', v2: 'Sailboat 8–15 m', v3: 'Motor yacht 12–24 m',
    v4: 'Gulet / vessel over 24 m', v5: 'Cruise ship', v6: 'Fishing vessel', v7: 'Unknown',
    unknown: 'Unknown'
  },
  county: {
    c0: 'Istria', c1: 'Primorje-Gorski Kotar', c2: 'Lika-Senj', c3: 'Zadar',
    c4: 'Šibenik-Knin', c5: 'Split-Dalmatia', c6: 'Dubrovnik-Neretva'
  },
  svc: {
    lk: 'Harbour Master’s Office {x}', kr: 'Municipal warden, {x}',
    none: 'No authority assigned', unknown: 'Unknown authority ({id})'
  },
  svcGroup: { lk: 'Harbour master offices', kr: 'Municipal wardens' },
  st: { open: 'Open on the map' },
  dir: { n: 'north', ne: 'northeast', e: 'east', se: 'southeast', s: 'south', sw: 'southwest', w: 'west', nw: 'northwest' },
  dirS: { n: 'N', ne: 'NE', e: 'E', se: 'SE', s: 'S', sw: 'SW', w: 'W', nw: 'NW' },
  when: { now: 'just now', min: '{n} min ago', today: 'today {time}', yesterday: 'yesterday {time}' },
  r: {
    nearestLK: 'Nearest harbour master office: {city} ({km} km)',
    nearestTown: 'Nearest town / municipality: {town} ({km} km)',
    seaLK: 'Sea pollution and vessel discharges: supervised by the harbour master',
    landKR: 'The source is on land or on the beach: municipal warden',
    where: 'Nearest settlement: {town} ({county} County)'
  },
  h: {
    received: 'Report received. Automatic suggestion: {svc}',
    received0: 'Report received.',
    receivedForm: 'Report received (New report form).',
    autoSuggest: 'Automatic authority suggestion: {svc}',
    confirmed: 'Confirmed and forwarded: {svc}',
    status: 'Status: {status}',
    statusBack: 'Status reverted to: {status}',
    redirect: 'Rerouted from “{from}” to: {to}',
    redirectWhy: 'Rerouted from “{from}” to: {to}. Reason: {why}',
    confirmedTo: 'Confirmed: {svc}',
    confirmedToWhy: 'Confirmed: {svc}. Reason: {why}',
    assigned: 'Assigned to: {to}',
    assignedWhy: 'Assigned to: {to}. Reason: {why}',
    notify: 'Notice to pump-out stations / marinas: {names}'
  },
  nearPlace: 'Near: {town}',
  noLoc: 'No location',
  list: { empty: 'No reports match the selected filters.', suggested: '(suggested)' },
  d: {
    empty: 'Select a report from the list or the map.', back: 'Back', report: 'Report #{id}',
    photoAlt: 'Photo attached to report #{id}', noPhoto: 'The report was sent without a photo',
    statusTitle: 'Status', historyTitle: 'History'
  },
  kv: {
    place: 'Location', reported: 'Reported', vessel: 'Vessel type', heading: 'Heading', coords: 'Coordinates',
    county: 'County', wasteType: 'Waste type', shipSize: 'Vessel size', shipColor: 'Vessel colour',
    registration: 'Registration / vessel name', observedFromLand: 'Observed from land', observedAt: 'Observed at',
    source: 'Source', sourceForm: '“New report” form', sourceObrada: 'Logged in report handling', competent: 'Competent'
  },
  yes: 'Yes', no: 'No',
  heading: { unknownAnchor: 'Unknown / at anchor', unknown: 'Unknown' },
  route: {
    confirmed: 'Competent authority', suggested: 'Suggested competent authority', none: 'No competent authority yet',
    noLocReason: 'The report has no location, so no authority can be suggested automatically. Choose one manually.'
  },
  act: {
    confirm: 'Confirm and forward', reassign: 'Other authority…', assign: 'Assign authority…',
    take: 'Start processing', resolve: 'Mark as resolved', back: 'Revert status',
    notify: 'Notify marinas along the heading', open1: 'Open in Reports'
  },
  public: { title: 'What the reporter sees', p1: 'Report #{id}:', p2: 'Assigned to: {svc}. Last change: {when}.' },
  v2: {
    h: 'Sewage and wastewater discharges from vessels',
    p: 'Reports with photo, vessel type and heading, plus a map of pump-out and waste reception points.',
    location: 'Location', mapAria: 'Map of discharges and pump-out stations', detailAria: 'Discharge report details'
  },
  d2: {
    empty: 'Select a discharge report on the map or in the table.', vesselGeneric: 'vessel',
    compassAria: 'Heading: {dir}', compassUnknown: 'Heading unknown', anchor1: 'anchor /', anchor2: 'unknown',
    nearest: 'Nearest pump-out stations', ahead: 'Pump-out stations along the heading',
    noLocStations: 'The report has no location, so stations along the heading cannot be found.'
  },
  tbl: {
    caption: 'Discharge reports from vessels', id: 'ID', time: 'Time', place: 'Location', vessel: 'Vessel',
    heading: 'Heading', status: 'Status', empty: 'No discharge reports match the selected filters.', anchor: 'At anchor / unknown'
  },
  v3: {
    h: 'Waste drift forecast',
    p: 'Wind and sea currents, together with citizen reports, show where to expect waste over the next 3 days.'
  },
  fc: {
    reload: 'Refresh', dayTabs: 'Forecast day', mapAria: 'Forecast map', baysAria: 'Bays with expected debris',
    mapLabel: 'Circle = risk level · arrow = wind direction',
    loading: 'Loading forecast…',
    ok: 'Open-Meteo: {what} · fetched at {time}', wind: 'wind', windCur: 'wind and sea currents',
    errShort: 'Forecast not loaded', errTitle: 'The forecast could not be loaded',
    errBody: 'Open-Meteo is not responding right now. Please try again in a moment.',
    errOffline: 'No internet connection. Connect and try again.', retry: 'Try again',
    upTo: 'up to {v}', expected: 'Expected debris · {day}',
    riskHint: 'Risk = onshore wind + onshore current + nearby waste reports (30 days).',
    windOn: 'Onshore wind: {v} · window: {win}', noWindow: 'not expected',
    current: ' · onshore current: {v}', nearby: 'Nearby reports: {n} · Responsible: {owner}',
    sentAt: 'Warning logged at {time}', warnBtn: 'Send warning to the manager'
  },
  unit: { kn: 'kn' },
  day: { today: 'Today', tomorrow: 'Tomorrow' },
  risk: { visok: 'High risk', srednji: 'Medium risk', nizak: 'Low risk' },
  foot: 'Map: © OpenStreetMap contributors. Wind and current forecast: Open-Meteo. Pump-out points: list of documented installations (confirm operation with the operator). The suggested authority is based on the nearest harbour master office and can always be changed by an officer. Data is stored only in this browser.',
  dlg: { close: 'Close' },
  new: {
    title: 'Log a report', intro: 'Log a report received by phone, e-mail or in the field. Pick the location by clicking the map.',
    type: 'Problem type', vessel: 'Vessel type', heading: 'Vessel heading', pickAria: 'Map for picking the location',
    lat: 'Latitude', lng: 'Longitude', geo: 'My location', desc: 'Description (optional)', descPh: 'What did you see?',
    photo: 'Photo (optional)', cancel: 'Cancel', submit: 'Send report', choose: 'Choose',
    previewEmpty: 'Pick a location to see which authority the report will go to.',
    outside: 'The location is outside Croatia.', willGo: 'The report will go to:',
    errPick: 'Pick a location on the map or enter coordinates.',
    errOutside: 'The location must be in Croatia.',
    errVessel: 'Choose a vessel type (or “Unknown”).',
    errGeoUnsupported: 'This browser does not support location. Click the map.',
    errGeo: 'Location unavailable (no permission or signal). Click the map.',
    errImg: 'Choose an image.', errImgLoad: 'The image could not be loaded.'
  },
  svcDlg: {
    title: 'Reroute to another authority', titleAssign: 'Assign competent authority', select: 'Competent authority',
    why: 'Reason', whyPh: 'E.g. the source is on land, the municipal warden is responsible',
    hint: 'The reason is recorded in the report history. Such corrections can improve the routing rules.',
    submit: 'Save'
  },
  emptyStore: { title: 'No reports yet', p: 'Reports from citizens and boaters will appear here as soon as they are sent.', link: 'Send a report' },
  toast: {
    forwarded: 'Report #{id} forwarded: {svc}.',
    status: 'Report #{id} status: {status}.',
    statusBack: 'Report #{id} status reverted to: {status}.',
    redirected: 'Report #{id} routed to: {svc}.',
    notified: 'Notice logged for: {names}.',
    warn: 'Warning for {bay} logged ({owner}).',
    created: 'Report #{id} received and routed to: {svc}.',
    photoNotSaved: 'The photo was not saved (not enough storage on this device).',
    incoming: 'New report #{id} arrived.',
    incomingN: 'New reports arrived: {n}.'
  }
};

window.OBRADA_I18N = { hr: { obrada: hr }, en: { obrada: en } };
if (window.CM_i18n && typeof window.CM_i18n.add === 'function') window.CM_i18n.add(window.OBRADA_I18N);
})();
