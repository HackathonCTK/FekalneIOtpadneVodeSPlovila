# ČistoMore – spojena aplikacija (grupe 1–4)

Aplikacija za čisto more uz hrvatsku obalu, spojena iz radova četiriju grupa u jednu:

- **građani i nautičari** prijavljuju ispuštanje fekalnih i otpadnih voda s plovila (fotografija, GPS, vrsta i smjer plovila, vrijeme, opis), pronalaze najbliže mjesto za pražnjenje spremnika i uče kako ploviti odgovorno;
- aplikacija iz lokacije i vrste problema **predlaže nadležnu službu** i prijavitelju javno prikazuje status: *Zaprimljeno → U obradi → Riješeno*;
- **nadležne službe** u zasebnom portalu pregledavaju i filtriraju prijave, mijenjaju status, preusmjeravaju ih i dobivaju **prognozu nanosa otpada** (vjetar i struje, Open-Meteo);
- radi i **bez mrežnog signala**: stranice su spremljene na uređaju, a prijave i promjene šalju se kad se veza vrati.

## Pokretanje

Potreban je **Node.js 22.13 ili noviji** (preporuka: aktualna LTS verzija s https://nodejs.org). `npm install` nije potreban jer projekt nema vanjskih paketa.

```
npm start
```

Otvorite **http://localhost:8080**. U terminalu piše i adresa za mobitel u istoj Wi-Fi mreži.

| Naredba | Što radi |
|---|---|
| `npm start` | pokreće cijelu aplikaciju. Dok nema lokalne baze karata, karte koriste OpenStreetMap preko interneta |
| `npm run setup` | jednom izrađuje lokalnu bazu karata `data/croatia.mbtiles` (treba Java 21+, oko 3 GB prostora, 5–20 min). Nakon toga karte rade i bez interneta |
| `npm run demo` | server s malom probnom bazom karata (samo okolica Splita). Dok ima interneta, karte i dalje koriste OpenStreetMap jer probna baza ne pokriva cijelu obalu |
| `npm run set-password -- admin NovaLozinka` | mijenja lozinku računa (vidi „Računi“) |

Ostale postavke servera (port, druga baza karata, `--db=` za drugu bazu prijava) i rješavanje problema s kartom opisani su u odjeljku „Lokalni server karata“ niže.

**Važno za mobitel:** preglednici dopuštaju rad bez signala, GPS i kompas samo na `http://localhost` ili preko **HTTPS-a**. Na adresi `http://192.168.x.x:8080` aplikacija radi, ali bez tih mogućnosti. Za stvarnu upotrebu server postavite iza HTTPS-a (npr. `caddy reverse-proxy --from vasa-domena.hr --to localhost:8080`).

**Jezik:** korisničke stranice otvaraju se na hrvatskom ako je preglednik na hrvatskom (ili bosanskom, srpskom, slovenskom), a inače na engleskom. Prekidač HR/EN u gornjoj traci pamti izbor. Portal službi je samo na hrvatskom.

## Računi

Korisnička prijava i prijava službi su **odvojene** (različiti kolačići): korisnički račun ne može otvoriti portal službi, a račun službe ne može se prijaviti kao korisnik.

| Tko | Gdje | Podaci |
|---|---|---|
| građani i nautičari | `login.html` (ikona u gornjoj traci) | registracija ili demo račun **korisnik / korisnik** |
| nadležne službe | `admin-login.html` → `obrada.html` | privremeno **admin / admin** |

Prije stvarne upotrebe promijenite lozinku službe, dodajte nove službenike i isključite demo korisnika promjenom njegove lozinke:

```
npm run set-password -- admin NovaJakaLozinka
node scripts/set-password.js --new-admin ivana Lozinka123 "Ivana Ivić"
npm run set-password -- korisnik NekaDrugaLozinka
```

Stranice za prijavu prikazuju demo podatke samo dok račun ima početnu lozinku. Nakon promjene ta obavijest nestaje, a sve dotadašnje prijave tog računa prestaju vrijediti.

Lozinke se spremaju samo kao sažetak (scrypt). Računi i prijave su u `data/cistomore.db`. U portalu, izbornik ⋮ → „Vrati početne demo podatke“ briše sve prijave i vraća 16 demo prijava (računi ostaju). Za potpuno novi početak zaustavite server i obrišite `data/cistomore.db` (i `cistomore.db-wal` i `cistomore.db-shm` ako postoje).

## Stranice

| Stranica | Datoteka | Izvor | Prijava |
|---|---|---|---|
| Početna | `index.html` | grupa 1 | nije potrebna; prijavljeni vide pregled svojih prijava |
| Nova prijava | `report.html` | grupa 1 (+ pravila usmjeravanja grupe 3) | korisnička |
| Karta prihvatnih mjesta | `map.html` | grupa 2 | nije potrebna |
| Plovi odgovorno | `plovi-odgovorno.html` | grupa 4 | nije potrebna |
| Dnevnik (moje prijave i statusi) | `book.html` | novo | korisnička |
| Profil (izgled, jezik, certifikat, odjava) | `profile.html` | novo | korisnička |
| Prijava / novi račun | `login.html` | novo | – |
| Portal nadležnih službi | `obrada.html` | grupa 3 | službe (`admin-login.html`) |

Navigacija je prema dogovoru iz `docs/INTEGRACIJA.md` (točka C): na mobitelu donja traka *Početna · Karta · [+] Nova prijava · Plovi · Profil* (Dnevnik se otvara s Početne i s Profila), na računalu plutajući lijevi izbornik. Jedina razlika: u izborniku građana nema stavke „Obrada prijava“ jer portal službi traži zasebnu prijavu. Do njega se dolazi poveznicom na stranici za prijavu i na Profilu, ili izravno na `admin-login.html`.

## Što je od koje grupe

**Grupa 1, Prijava onečišćenja (glavna aplikacija):** početna stranica i obrazac: fotografije, GPS lokacija, vrsta i veličina broda, boja, registracija, vrijeme, opis, „Promatram s kopna“ s kompasom.
Dodano: vrsta problema (potrebna za usmjeravanje), **smjer kretanja plovila** (zahtjev s plakata), odabir lokacije na karti, pregled kome prijava ide, slanje na server i čekanje prijave bez signala. Popis vrsta plovila dopunjen je vrstama iz grupe 3 (gulet, motorni brod, gumenjak, brod za kružna putovanja, nepoznato).

**Grupa 2, Pražnjenje spremnika:** interaktivna karta 28 prihvatnih mjesta s kontaktima, uslugama i izvorima, pretraga, najbliže mjesto i upute u 7 koraka. Njihove datoteke s podacima u `public/data/` nisu mijenjane.
Dodano: engleski prijevod podataka (`public/data/i18n-en.js`), poveznica `map.html?station=<id>` (dogovor iz INTEGRACIJA.md) i lokalna podloga karte. Ista mjesta sada koriste i portal službi i stranica Plovi odgovorno, umjesto njihovih primjera.

**Grupa 3, Praćenje i obrada prijava:** portal službi s popisom, kartom i slojevima nadležnosti, filtrima (lokacija, datum, vrsta plovila), prijedlogom nadležne službe, statusima, preusmjeravanjem, ispuštanjima s plovila i prognozom nanosa. Uz to lokalni server karata i rad bez signala.
Pravila usmjeravanja izdvojena su u `public/routing.js` da ih koriste server, portal i obrazac. Usporedbom na 65 702 slučaja daju iste rezultate kao izvorni kod. Prijave se sada spremaju na serveru, pa prijava s mobitela odmah stiže u portal na računalu. Portal prikazuje i polja iz obrasca grupe 1 i sve fotografije.

**Grupa 4, Plovi odgovorno:** vodič, provjera „Smijem li ispustiti?“, utjecaj na uvalu, koraci na prihvatnoj stanici, kviz i certifikat. **Njihov dizajn sada koristi cijela aplikacija:** tamni način (paleta „Dubina“), svijetli način (paleta „Ocean“), fontovi, gornja traka, plutajući izbornik, kartice i gumbi, te prekidač HR/EN na svim korisničkim stranicama.

## Rad bez signala

- Service worker (`public/sw.js`, grupa 3) sprema sve stranice, stilove, skripte, podatke karte i fontove. Nakon prvog posjeta aplikacija se otvara i bez veze.
- Prijava poslana bez signala čeka na uređaju (vidi se u Dnevniku kao „Čeka slanje“) i šalje se automatski kad se veza vrati. Isto vrijedi za promjene u portalu službi, gdje se rad bez signala može i simulirati (izbornik ⋮).
- Karta bez signala radi samo s lokalnom bazom karata (`npm run setup`). OpenStreetMap preko interneta tada nije dostupan.
- Prognoza nanosa bez veze prikazuje označeni primjer scenarija juga (kao kod grupe 3).

## Struktura projekta

```
server.js                 server (grupa 3) + API za račune i prijave
lib/db.js                 baza aplikacije (SQLite, ugrađeni node:sqlite)
lib/api.js                API: /api/register, /api/login, /api/reports, /api/admin/…
lib/seed.js               demo računi i 16 demo prijava (iz portala grupe 3)
scripts/setup.js          izrada lokalne baze karata (grupa 3)
scripts/set-password.js   promjena lozinke / novi službenik
map-style/, fonts/        stil i slova lokalne karte (grupa 3)
demo/proba-split.mbtiles  probna baza karata (grupa 3)
data/                     ovdje nastaju croatia.mbtiles i cistomore.db (u .gitignore, ne idu u git)
docs/                     plan i provjera podataka karte (grupa 2), INTEGRACIJA.md
public/
  index.html report.html                grupa 1
  map.html map.js map.css data/          grupa 2
  obrada.html                            grupa 3
  plovi-odgovorno.*                      grupa 4
  login.html book.html profile.html admin-login.html   novo
  tokens.css styles.css                  zajednički dizajn (grupa 4)
  app.js                                 zajednička logika (izbornici, način, jezik, prijava, slanje bez signala)
  routing.js                             pravila usmjeravanja (grupa 3), zajednička za server i preglednik
  basemap.js                             podloga karte: lokalna baza ili OpenStreetMap
  sw.js                                  rad bez signala
  vendor/                                Leaflet, MapLibre, markercluster, GSAP, fontovi (lokalno, bez CDN-a)
```

## API (sažetak)

| Metoda i put | Tko | Što |
|---|---|---|
| `POST /api/register`, `POST /api/login`, `POST /api/logout`, `GET /api/me` | korisnici | račun i prijava |
| `GET /api/my/reports`, `POST /api/reports` | korisnici | moje prijave, nova prijava (s fotografijama) |
| `GET /api/photos/:id` | vlasnik prijave ili služba | fotografija |
| `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me` | službe | prijava u portal |
| `GET/POST /api/admin/reports`, `PATCH /api/admin/reports/:id` | službe | sve prijave, unos prijave, status, služba i povijest |
| `POST /api/admin/warnings`, `POST /api/admin/reset` | službe | upozorenje o nanosu, vraćanje demo podataka |

## Promjene u odnosu na grane grupa (za pregled u timu)

- Statusi prijava su *Zaprimljeno / U obradi / Riješeno*, kao u zadatku i portalu grupe 3. Na plakatu je pisalo *nova / u provjeri / riješeno*. Ako tim želi te nazive, mijenjaju se na jednom mjestu: `STATUS` u `public/routing.js`.
- Grupa 1: stat „Ukupno zbrinuto 38.4 m³“ i ogledni popis prijava na početnoj zamijenjeni su stvarnim prijavama prijavljenog korisnika. „MARPOL pravila“ sada vode na vodič u Plovi odgovorno.
- Grupa 3: `public/index.html` je sada `obrada.html`, a gumb „Nova prijava“ u portalu je „Unesi prijavu“ (dojava telefonom). Ispravljena je greška zbog koje se na mobitelu, u prikazu „Popis“, dodirom na prijavu nisu otvarali detalji: Leaflet je bacao *Invalid LatLng (NaN, NaN)* jer je karta bila skrivena.
- Grupa 4: tekst prvog koraka na prihvatnoj stanici sada kaže da se na karti provjeravaju kontakt i kada uređaj radi, jer radno vrijeme nije poznato za sva mjesta. Umjesto oglednih stanica (Split, Zadar, Rijeka, Pula) prikazuju se četiri stvarna mjesta s karte za koja službena stranica navodi prihvat fekalnih voda: ACI marina Rovinj, Marina Punat, Marina Dalmacija i ACI marina Dubrovnik.
- Fontovi, Leaflet, markercluster i GSAP više se ne učitavaju s CDN-a nego iz `public/vendor/` (rad bez interneta).
- Odstupanja od točke D u `docs/INTEGRACIJA.md`: umjesto četiri teme (`cm-theme`) cijela aplikacija ima tamni i svijetli način grupe 4 (`cm-mode`); prijave nisu u `cm-reports` u pregledniku nego na serveru; ključevi statusa su kao kod grupe 3 (`zaprimljeno`, `obrada`, `rijeseno`). Jezik je i dalje u `cm-lang`, a certifikat iz kviza u `po-cert` (Profil ga prikazuje kao značku „Odgovorni nautičar“).

## Što još nije gotovo

- Prijave se službama ne šalju e-poštom ni u njihove sustave: portal je mjesto obrade. Granice luka i koncesija i pravila usmjeravanja su **probni podaci** (kao kod grupe 3) koje prije stvarne upotrebe treba potvrditi s institucijama.
- Koordinate prihvatnih mjesta su približne, a rad uređaja treba potvrditi kod operatora (vidi `docs/provjera-podataka.md`).
- Lozinka službe `admin / admin` je privremena (promjena: odjeljak „Računi“).

## Lokalni server karata (grupa 3)

```
 OpenStreetMap podaci za Hrvatsku (Geofabrik)
              │   npm run setup  (jednom, 5–20 min)
              ▼
 data/croatia.mbtiles   ← lokalna baza karata (SQLite, vektorske pločice)
              │
              ▼
 server.js (Node.js)  ──►  /tiles/{z}/{x}/{y}.pbf, /style.json, /fonts/…   karta
                       ──►  /api/…                                          računi i prijave
                       ──►  /                                               aplikacija (public/)
```

| Postavka | Kako |
|---|---|
| drugi port | `node server.js --port=8081` |
| druga baza karata | `node server.js --mbtiles=putanja/do/baze.mbtiles` |
| druga baza prijava | `node server.js --db=putanja/do/cistomore.db` |
| samo ovo računalo (ne mreža) | `node server.js --host=127.0.0.1` |
| više memorije za izradu baze | `npm run setup -- --memory=4g` |
| druga regija | `npm run setup -- --area=slovenia`, zatim `node server.js --mbtiles=data/slovenia.mbtiles` |
| samo prikaz naredbi | `npm run setup -- --dry-run` |

Bez Jave bazu možete izraditi Dockerom:
```
docker run --rm -e JAVA_TOOL_OPTIONS="-Xmx2g" -v "${PWD}/data:/data" ghcr.io/onthegomap/planetiler:latest --download --area=croatia --output=/data/croatia.mbtiles
```

| Poruka | Rješenje |
|---|---|
| „Port 8080 je zauzet” | `node server.js --port=8081` |
| „Potreban je Node.js 22.13 ili noviji” | instalirajte noviji Node.js s https://nodejs.org |
| „Java nije pronađena” / „Potrebna je Java 21” | instalirajte Javu 21+ ili koristite Docker (gore) |
| Planetiler: `OutOfMemoryError` | `npm run setup -- --memory=4g` |
| **Windows:** datoteka se ne može preimenovati na kraju `npm run setup` | zaustavite server (Ctrl+C) i ponovno pokrenite `npm run setup` |

## Licence i navođenje izvora

- Podaci karte: © suradnici OpenStreetMapa (ODbL), shema © OpenMapTiles. Navod je ugrađen u kartu i ne smije se uklanjati.
- Leaflet (BSD-2), MapLibre GL JS (BSD-3), maplibre-gl-leaflet (ISC), Leaflet.markercluster (MIT), Planetiler (Apache-2.0).
- Fontovi Bricolage Grotesque, Manrope, JetBrains Mono i Noto Sans: SIL Open Font License 1.1.
- GSAP 3.12.5: GreenSockova besplatna standardna licenca (https://gsap.com/standard-license).
- Izvori podataka o prihvatnim mjestima navedeni su uz svako mjesto na karti (grupa 2). Izvori za edukativni sadržaj navedeni su na dnu stranice Plovi odgovorno (grupa 4).
