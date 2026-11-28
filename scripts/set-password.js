'use strict';
/*
 * Promjena lozinke računa ili novi račun službenika (portal obrada.html)
 * ----------------------------------------------------------------------
 *   node scripts/set-password.js admin NovaJakaLozinka
 *   node scripts/set-password.js --new-admin ivana Lozinka123 "Ivana Ivić"
 *   (druga baza: dodajte --db=putanja/do/cistomore.db)
 *
 * Nakon promjene lozinke sve postojeće prijave tog računa prestaju vrijediti.
 * Server može raditi za to vrijeme.
 */
const path = require('node:path');

const origEmit = process.emitWarning;
process.emitWarning = function (w, ...rest) {
  const msg = typeof w === 'string' ? w : (w && w.message) || '';
  if (/SQLite/i.test(msg)) return;
  return origEmit.call(process, w, ...rest);
};
const { AppDb } = require('../lib/db.js');

const args = process.argv.slice(2);
const dbArg = args.find(a => a.startsWith('--db='));
const rest = args.filter(a => !a.startsWith('--db='));
const file = path.resolve(__dirname, '..', dbArg ? dbArg.slice(5) : path.join('data', 'cistomore.db'));

function usage(msg) {
  if (msg) console.error('GREŠKA: ' + msg + '\n');
  console.error('Upotreba:\n  node scripts/set-password.js <korisničko-ime> <nova-lozinka>\n  node scripts/set-password.js --new-admin <korisničko-ime> <lozinka> "<Ime i prezime>"');
  process.exit(1);
}

const db = new AppDb(file);
try {
  if (rest[0] === '--new-admin') {
    const [, username, password, name] = rest;
    if (!username || !password) usage('nedostaje korisničko ime ili lozinka');
    if (!/^[A-Za-z0-9._-]{3,32}$/.test(username)) usage('korisničko ime: 3–32 znaka (slova bez kvačica, brojke, . _ -)');
    if (password.length < 8) usage('lozinka službenika mora imati barem 8 znakova');
    if (db.userExists(username)) usage('račun „' + username + '” već postoji');
    db.createUser({ username, name: name || username, password, role: 'admin' });
    console.log('Izrađen je račun službenika „' + username + '”.');
  } else {
    const [username, password] = rest;
    if (!username || !password) usage();
    if (password.length < 6) usage('lozinka mora imati barem 6 znakova');
    if (!db.setPassword(username, password)) usage('račun „' + username + '” ne postoji');
    console.log('Lozinka za „' + username + '” je promijenjena.');
  }
} finally {
  db.close();
}
