# Čisto more – aplikacija s lokalnim serverom karata

Aplikacija za praćenje i obradu prijava onečišćenja mora. Karta Hrvatske dolazi iz **vaše vlastite baze karata**, a ne s OpenStreetMap servera.

```
 OpenStreetMap podaci za Hrvatsku (Geofabrik)
              │   npm run setup  (jednom, 5–20 min)
              ▼
 data/croatia.mbtiles   ← lokalna baza karata (SQLite, vektorske pločice)
              │
              ▼
 server.js (Node.js)  ──►  /tiles/{z}/{x}/{y}.pbf   pločice iz baze
                       ──►  /style.json              izgled karte
                       ──►  /fonts/...               slova za natpise
                       ──►  /                        aplikacija
              │
              ▼
 preglednik (računalo ili mobitel): Leaflet + MapLibre crtaju kartu
```

## Što treba instalirati

| Program | Verzija | Za što | Preuzimanje |
|---|---|---|---|
| Node.js | 22.13 ili novija (preporuka: 24 LTS) | server | https://nodejs.org |
| Java | 21 ili novija | samo za izradu baze karata | https://adoptium.net |

Za izradu baze treba i oko **3 GB slobodnog prostora** i internetska veza. Kad je baza gotova, server i karta rade bez interneta.

Nije potrebno pokretati `npm install`, jer projekt ne koristi vanjske pakete.

## Pokretanje: 3 koraka

Otvorite terminal (Windows: PowerShell) u ovoj mapi.

**1. Izradite bazu karata** (samo prvi put):
```
npm run setup
```
Skripta preuzima alat Planetiler, a on preuzima OSM podatke za Hrvatsku, obalnu liniju i Natural Earth te izrađuje `data/croatia.mbtiles` (nekoliko stotina MB).

**2. Pokrenite server:**
```
npm start
```

**3. Otvorite aplikaciju:** http://localhost:8080

U terminalu je ispisana i adresa za druge uređaje u istoj mreži (npr. `http://192.168.1.20:8080`). Na nju se može spojiti mobitel na istom Wi-Fi-ju.

### Brza provjera bez izrade baze
```
npm run demo
```
Pokreće server s malom probnom bazom (samo okolica Splita i nacrtani primjer obale). Tako odmah vidite radi li sve.

## Ako nemate Javu: izrada baze preko Dockera

```
docker run --rm -e JAVA_TOOL_OPTIONS="-Xmx2g" -v "${PWD}/data:/data" ghcr.io/onthegomap/planetiler:latest --download --area=croatia --output=/data/croatia.mbtiles
```
Nakon toga pokrenite `npm start`.

## Postavke

| Što | Kako |
|---|---|
| drugi port | `node server.js --port=8081` |
| druga baza | `node server.js --mbtiles=putanja/do/baze.mbtiles` |
| samo ovo računalo (ne mreža) | `node server.js --host=127.0.0.1` |
| više memorije za izradu baze | `npm run setup -- --memory=4g` |
| druga regija (naziv kao na Geofabriku) | `npm run setup -- --area=slovenia`, zatim `node server.js --mbtiles=data/slovenia.mbtiles` |
| samo prikaz naredbi koje bi se pokrenule | `npm run setup -- --dry-run` |

## Ažuriranje karte

OSM se stalno mijenja. Za novije podatke ponovno pokrenite `npm run setup`. Nova baza se najprije sprema kao `data/croatia.tmp.mbtiles`, a staru zamjenjuje tek kad je gotova, pa server za to vrijeme normalno radi. Server novu bazu sam učita, bez ponovnog pokretanja.
**Windows:** ako se na kraju javi da se datoteka ne može preimenovati, zaustavite server (Ctrl+C) i pokrenite `npm run setup` ponovno.

Datoteke u `data/sources/` služe samo za izradu baze i smiju se obrisati.

## Rad bez signala

- Aplikacija sprema sebe i dijelove karte koje ste već pregledali, pa ih prikazuje i bez veze sa serverom.
- Prijave i promjene napravljene bez signala čuvaju se na uređaju.
- **Važno:** preglednici dopuštaju rad bez signala (i GPS lokaciju) samo na `http://localhost` ili preko **HTTPS-a**. Na mobitelu koji otvara `http://192.168.x.x:8080` aplikacija radi, ali bez tih dviju mogućnosti. Za stvarnu upotrebu postavite server iza HTTPS-a, npr. s Caddyjem (`caddy reverse-proxy --from vasa-domena.hr --to localhost:8080`).

## Kad nešto ne radi

| Poruka | Rješenje |
|---|---|
| „Baza karata još nije pripremljena” | pokrenite `npm run setup` (ili `npm run demo` za probu) |
| „Server karata nije dostupan” | server nije pokrenut: `npm start` |
| „Port 8080 je zauzet” | `node server.js --port=8081` |
| „Java nije pronađena” / „Potrebna je Java 21” | instalirajte Javu 21+ ili koristite Docker (gore) |
| Planetiler: `OutOfMemoryError` | `npm run setup -- --memory=4g` |
| „Ovaj preglednik ne može prikazati kartu” | preglednik nema WebGL; koristite noviji Chrome, Edge, Firefox ili Safari |

## Struktura projekta

```
server.js              server (Node.js, bez vanjskih paketa; baza se čita ugrađenim node:sqlite)
scripts/setup.js       izrada baze karata (Planetiler)
map-style/style.json   izgled karte (boje, slojevi, natpisi)
map-style/gen-style.js izvor za style.json (za izmjene: uredite pa pokrenite node map-style/gen-style.js)
fonts/                 slova za natpise (Noto Sans)
public/index.html      aplikacija
public/sw.js           rad bez signala
public/vendor/         Leaflet, MapLibre GL, maplibre-gl-leaflet
demo/proba-split.mbtiles  mala probna baza
data/                  ovdje nastaje croatia.mbtiles
```

## Što je još primjer

Granice luka i koncesija, popis crpnih stanica i pravila usmjeravanja u aplikaciji su probni podaci. Prije stvarne upotrebe treba ih potvrditi s institucijama. Podaci o prijavama zasad se spremaju samo u pregledniku. Server poslužuje kartu, ali još ne sprema prijave.

## Licence i navođenje izvora

- Podaci karte: © suradnici OpenStreetMapa (ODbL), shema © OpenMapTiles. Navod je ugrađen u kartu i ne smije se uklanjati.
- Leaflet (BSD-2), MapLibre GL JS (BSD-3), maplibre-gl-leaflet (ISC), Noto Sans (SIL OFL 1.1), Planetiler (Apache-2.0).
