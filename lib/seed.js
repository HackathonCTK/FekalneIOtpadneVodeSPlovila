'use strict';
/*
 * Početni (demo) podaci
 * - računi: admin / admin (portal nadležnih službi) i korisnik / korisnik (demo korisnik)
 * - prijave: 16 primjera iz portala grupe 3 (seed()), s vremenima u odnosu na trenutak punjenja.
 *   Vrste plovila prevedene su na zajednički popis (routing.js), a četiri prijave pripadaju
 *   demo korisniku da se u njegovom Dnevniku vide različiti statusi.
 */
const R = require('../public/routing.js');

const DEMO_USERS = [
  { username: 'admin', password: 'admin', name: 'Administrator', role: 'admin' },   // glavni admin (staff_role 'glavni', vidi db.js)
  { username: 'korisnik', password: 'korisnik', name: 'Demo korisnik', role: 'user' }
];

// [vrsta, lat, lng, mjesto, opis, prije koliko minuta, status, plovilo (grupa 3), smjer, vrsta otpada, prijavitelj]
const RAW = [
  ['fekalne', 43.3905, 16.3185, 'Uvala Nečujam, Šolta', 'Smeđa mrlja i miris iza motorne jahte nakon što je isplovila iz uvale.', 12, 'zaprimljeno', 'Motorna jahta 12–24 m', 80, 'fekalna', 'korisnik'],
  ['otpad_plaza', 43.5022, 16.4720, 'Plaža Žnjan, Split', 'Plastika i limenke uz rub plaže nakon vikenda.', 40, 'zaprimljeno', null, null, null, 'korisnik'],
  ['ulje', 43.5020, 16.4385, 'Gradska luka Split', 'Duga sjajna mrlja kod gata.', 125, 'obrada', null, null, null, null],
  ['fekalne', 43.4450, 16.4700, 'Splitski kanal', 'Jedrilica ispušta otpadne vode u plovidbi.', 190, 'obrada', 'Jedrilica 8–15 m', 215, 'otpadna', 'korisnik'],
  ['septicka', 43.4945, 16.2610, 'Okrug Gornji, Čiovo', 'Iz cijevi uz obalu teče mutna voda neugodnog mirisa.', 1500, 'zaprimljeno', null, null, null, null],
  ['fekalne', 43.3430, 16.4250, 'Uvala Lučice, Brač', 'Gulet na sidru, ispuštanje s krme.', 1650, 'zaprimljeno', 'Gulet / brod veći od 24 m', null, 'fekalna', null],
  ['otpad_more', 42.6720, 18.0050, 'Kod Koločepa', 'Plutajući otpad nakon juga, uglavnom plastika.', 1700, 'obrada', null, null, null, null],
  ['otpad_plaza', 42.6770, 17.9520, 'Uvala Šunj, Lopud', 'Mnogo otpada naneseno valovima.', 2900, 'zaprimljeno', null, null, null, null],
  ['fekalne', 44.1250, 15.2100, 'Zadarski kanal', 'Mrlja iza velikog putničkog broda.', 2950, 'odbijeno', 'Brod za kružna putovanja', 300, 'ostalo', 'korisnik'],
  ['otpad_plaza', 42.6413, 18.1155, 'Plaža Banje, Dubrovnik', 'Otpad uz liniju mora.', 4300, 'zaprimljeno', null, null, null, null],
  ['fekalne', 42.6970, 17.7380, 'Saplunara, Mljet', 'Gulet u isplovljavanju ostavlja mrlju.', 1450, 'zaprimljeno', 'Gulet / brod veći od 24 m', 120, 'ostalo', null],
  ['napusteno', 43.3855, 16.5515, 'Supetar, Brač', 'Napušteni gumenjak vezan na lukobranu.', 5800, 'rijeseno', 'Gumenjak / brodica do 6 m', null, null, null],
  ['fekalne', 43.1600, 16.3900, 'Pakleni otoci', 'Motorni brod ispušta otpadne vode.', 7200, 'rijeseno', 'Motorni brod 6–12 m', 0, 'otpadna', 'korisnik'],
  ['ulje', 42.6600, 18.0860, 'Luka Gruž, Dubrovnik', 'Uljni film oko vezova.', 8640, 'rijeseno', null, null, null, null],
  ['otpad_kopno', 44.8500, 13.8300, 'Uz obalu južno od Pule', 'Građevinski otpad i vreće uz obalni put.', 11500, 'obrada', null, null, null, null],
  ['otpad_more', 45.3220, 14.4300, 'Luka Rijeka', 'Drvo i plastika u akvatoriju.', 14400, 'rijeseno', null, null, null, null]
];

// Vrste plovila grupe 3 -> zajednički popis (vrsta, veličina) iz routing.js
const VESSEL_MAP = {
  'Motorna jahta 12–24 m': ['Jahta', 'Srednji (10–24 m)'],
  'Jedrilica 8–15 m': ['Jedrilica', 'Srednji (10–24 m)'],
  'Gulet / brod veći od 24 m': ['Gulet', 'Veliki (24–50 m)'],
  'Brod za kružna putovanja': ['Brod za kružna putovanja', 'Vrlo veliki (preko 50 m)'],
  'Gumenjak / brodica do 6 m': ['Mali čamac / gumenjak', 'Mali (do 10 m)'],
  'Motorni brod 6–12 m': ['Motorni brod', 'Mali (do 10 m)']
};

function seedUsers(db) {
  for (const u of DEMO_USERS) if (!db.userExists(u.username)) db.createUser(u);
}

function seedReports(db) {
  const now = Date.now(), ago = m => new Date(now - m * 60000).toISOString();
  const users = {};
  for (const u of DEMO_USERS) { const row = db.findUser(u.username); if (row) users[u.username] = row.id; }
  db.tx(() => {
    db.deleteAllReports();
    RAW.forEach((r, i) => {
      const [type, lat, lng, place, desc, minutes, status, vessel3, heading, wasteType, owner] = r;
      const rt = R.route(lat, lng, type);
      const created = ago(minutes);
      const name = R.svcName(rt.service);
      const idx = R.ORDER.indexOf(status);
      const history = [{ t: created, text: 'Prijava zaprimljena. Automatski prijedlog: ' + name }];
      const statusHistory = [{ status: 'zaprimljeno', t: created }];
      if (idx >= 1) {
        history.push({ t: ago(minutes * 0.8), text: 'Potvrđeno i proslijeđeno: ' + name });
        history.push({ t: ago(minutes * 0.7), text: 'Status: U obradi' });
        statusHistory.push({ status: 'obrada', t: ago(minutes * 0.7) });
      }
      if (idx >= 2) {
        history.push({ t: ago(minutes * 0.3), text: 'Status: Riješeno' });
        statusHistory.push({ status: 'rijeseno', t: ago(minutes * 0.3) });
      }
      let rejectReason = null;
      if (status === 'odbijeno') {
        rejectReason = 'Na lokaciji nije pronađeno onečišćenje; mrlja je bila cvjetanje mora (prirodna pojava).';
        history.push({ t: ago(minutes * 0.5), text: 'Odbijeno: ' + rejectReason });
        statusHistory.push({ status: 'odbijeno', t: ago(minutes * 0.5) });
      }
      const v = vessel3 ? VESSEL_MAP[vessel3] : null;
      db.insertReport({
        id: new Date().getFullYear() + '-' + String(1170 + i),
        clientId: null,
        userId: owner ? (users[owner] || null) : null,
        createdAt: created,
        data: {
          type, lat, lng, place, desc, eventAt: created,
          wasteType: type === 'fekalne' ? wasteType : null,
          vessel: v ? v[0] : null, vesselSize: v ? v[1] : null, vesselColor: null, registration: null,
          heading: type === 'fekalne' && heading != null ? heading : null, observer: null,
          status, statusHistory, rejectReason, service: rt.service, reasons: rt.reasons, county: rt.county,
          confirmed: idx >= 1, history, source: 'demo'
        }
      });
    });
    db.setMeta('seq', 1170 + RAW.length);
  });
}

function seedIfEmpty(db) {
  seedUsers(db);
  if (db.getMeta('seeded') !== '1') {
    seedReports(db);
    db.setMeta('seeded', '1');
    return true;
  }
  return false;
}

module.exports = { seedIfEmpty, seedReports, seedUsers, DEMO_USERS, VESSEL_MAP };
