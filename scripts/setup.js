'use strict';
/*
 * Priprema lokalne baze karata (data/croatia.mbtiles)
 * ---------------------------------------------------
 * 1. provjerava Javu (potrebna verzija 21+)
 * 2. preuzima Planetiler (alat koji od OpenStreetMap podataka radi vektorske pločice)
 * 3. Planetiler sam preuzima OSM podatke za Hrvatsku (Geofabrik), obalnu liniju i Natural Earth
 *    te izrađuje bazu u formatu MBTiles (SQLite)
 *
 * Pokretanje:   npm run setup
 * Mogućnosti:   npm run setup -- --area=croatia --memory=3g
 *               npm run setup -- --dry-run          (samo ispiše što bi napravio)
 *   Sve ostale opcije koje počinju s "--" prosljeđuju se Planetileru.
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync, spawn } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const TOOLS = path.join(ROOT, 'tools');
const DATA = path.join(ROOT, 'data');
const JAR = path.join(TOOLS, 'planetiler.jar');
const JAR_URL = 'https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar';

const args = process.argv.slice(2);
const opt = (name, def) => { const a = args.find(x => x.startsWith('--' + name + '=')); return a ? a.slice(name.length + 3) : def; };
const AREA = opt('area', 'croatia');
const MEMORY = opt('memory', process.env.JAVA_XMX || '2g');
const DRY = args.includes('--dry-run');
const passthrough = args.filter(a => a.startsWith('--') && !/^--(area|memory)=/.test(a) && a !== '--dry-run');
const OUT_FINAL = path.join(DATA, AREA + '.mbtiles');
const OUT_TMP = path.join(DATA, AREA + '.tmp.mbtiles');

function fail(msg) { console.error('\nGREŠKA: ' + msg + '\n'); process.exit(1); }
function step(msg) { console.log('\n=== ' + msg); }

function checkJava() {
  const r = spawnSync('java', ['-version'], { encoding: 'utf8' });
  if (r.error) fail('Java nije pronađena. Instalirajte Javu 21 ili noviju (npr. https://adoptium.net) i pokušajte ponovno.\n(Druga mogućnost bez Jave: vidi README, odjeljak "Docker".)');
  const out = (r.stderr || '') + (r.stdout || '');
  const m = out.match(/version "(\d+)(?:\.(\d+))?/);
  let v = m ? Number(m[1]) : NaN;
  if (v === 1 && m[2]) v = Number(m[2]);          // stari format "1.8"
  if (!(v >= 21)) fail('Potrebna je Java 21 ili novija. Pronađeno:\n' + out.trim());
  console.log('Java ' + v + ' – u redu.');
}

async function download(url, dest) {
  const tmp = dest + '.part';
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok || !res.body) fail('Preuzimanje nije uspjelo (' + res.status + '): ' + url);
  // content-length je pouzdan samo ako odgovor nije komprimiran (fetch ga sam raspakira)
  const enc = (res.headers.get('content-encoding') || '').toLowerCase();
  const total = enc && enc !== 'identity' ? 0 : (Number(res.headers.get('content-length')) || 0);
  let got = 0, lastPct = -1;
  const file = fs.createWriteStream(tmp);
  for await (const chunk of res.body) {
    got += chunk.length;
    if (!file.write(chunk)) await new Promise(r => file.once('drain', r));
    if (total) { const pct = Math.floor(got / total * 100); if (pct !== lastPct && pct % 5 === 0) { process.stdout.write('\r  ' + pct + ' %  (' + (got / 1048576).toFixed(0) + ' MB)'); lastPct = pct; } }
  }
  await new Promise((resolve, reject) => file.end(err => (err ? reject(err) : resolve())));
  process.stdout.write('\n');
  if (total && got !== total) { fs.rmSync(tmp, { force: true }); fail('Preuzimanje je prekinuto. Pokušajte ponovno.'); }
  fs.renameSync(tmp, dest);
}

function runPlanetiler() {
  const jargs = [
    '-Xmx' + MEMORY, '-jar', JAR,
    '--download',
    '--area=' + AREA,
    '--output=' + OUT_TMP,
    '--force',
    ...passthrough
  ];
  console.log('java ' + jargs.map(a => (/\s/.test(a) ? '"' + a + '"' : a)).join(' '));
  if (DRY) return Promise.resolve(0);
  return new Promise(resolve => {
    const p = spawn('java', jargs, { cwd: ROOT, stdio: 'inherit' });
    p.on('error', e => fail('Planetiler se nije mogao pokrenuti: ' + e.message));
    p.on('close', code => resolve(code));
  });
}

async function main() {
  console.log('Čisto more – priprema lokalne baze karata (' + AREA + ')');
  console.log('Treba oko 3 GB slobodnog prostora i 5–20 minuta, ovisno o vezi i računalu.');

  step('1/3 Provjera Jave');
  if (DRY) console.log('(dry-run: preskačem provjeru)'); else checkJava();

  step('2/3 Planetiler');
  fs.mkdirSync(TOOLS, { recursive: true });
  fs.mkdirSync(DATA, { recursive: true });
  if (fs.existsSync(JAR)) console.log('Već preuzet: ' + path.relative(ROOT, JAR));
  else if (DRY) console.log('(dry-run) preuzeo bih ' + JAR_URL);
  else { console.log('Preuzimam ' + JAR_URL); await download(JAR_URL, JAR); }

  step('3/3 Izrada baze karata (Planetiler preuzima OSM podatke i radi pločice)');
  const code = await runPlanetiler();
  if (DRY) { console.log('\n(dry-run) Gotovo – ništa nije pokrenuto.'); return; }
  if (code !== 0) { fs.rmSync(OUT_TMP, { force: true }); fail('Planetiler je završio s greškom (kod ' + code + '). Poruke iznad govore zašto.'); }
  if (!fs.existsSync(OUT_TMP)) fail('Planetiler nije napravio datoteku ' + OUT_TMP);
  try {
    fs.renameSync(OUT_TMP, OUT_FINAL);
  } catch (e) {
    fail('Nova baza je spremna (' + path.relative(ROOT, OUT_TMP) + '), ali je ne mogu preimenovati u ' + path.relative(ROOT, OUT_FINAL) +
      ' (' + e.code + '). Zaustavite server, ručno preimenujte datoteku i ponovno pokrenite server.');
  }
  const mb = (fs.statSync(OUT_FINAL).size / 1048576).toFixed(0);
  console.log('\nGotovo! Baza karata: ' + path.relative(ROOT, OUT_FINAL) + ' (' + mb + ' MB)');
  console.log('Ulazne datoteke su u data/sources/ – smijete ih obrisati da oslobodite prostor (trebaju samo za ponovnu izradu).');
  console.log('Pokrenite server:  npm start');
}

if (require.main === module) main().catch(e => fail(e && e.stack || String(e)));
module.exports = { checkJava, download };
