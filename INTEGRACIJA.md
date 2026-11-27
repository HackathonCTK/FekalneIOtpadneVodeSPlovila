# ČistoMore: dogovor o spajanju stranica i radu na GitHubu

Nacrt grupe 4 (Plovi odgovorno). Svaka grupa ga pregleda i komentarom u ovom pull requestu napiše:
1. svoju grupu i datoteke koje ima ili planira;
2. slaže li se s točkama A–F ili što mijenja;
3. što treba od drugih grupa i do kada.

Kad se dogovorimo, ova datoteka je izvor istine za sve grupe i njihove AI agente.

## Grupe

| Grupa | Dio aplikacije | Glavna stranica | Grana |
|---|---|---|---|
| 1 | Prijava onečišćenja | `report.html` | `grupa-1-prijava` |
| 2 | Pražnjenje spremnika, karta prihvatnih stanica | `map.html` | `grupa-2-karta` |
| 3 | Praćenje i obrada prijava (nadležne službe) | `obrada.html` | `grupa-3-obrada` |
| 4 | Plovi odgovorno (edukacija, kviz) | `plovi-odgovorno.html` | `grupa-4-plovi-odgovorno` |

Zajedničke datoteke: `index.html` (Početna), `styles.css` (teme preko `data-theme`, navigacija), `app.js` (`showToast`, `CM_setTheme`/`CM_getTheme`, ključ `cm-theme`). Bez build alata, čisti HTML/CSS/JS.

## A) Rad na GitHubu
- Nitko ne commita izravno na `main` i nitko ne uploada datoteke preko weba („Add files via upload“). Koristimo git.
- Svaka grupa radi na svojoj grani (tablica gore). Zajedničke promjene idu na grane `zajednicko-<opis>`.
- Na `main` samo kroz pull request. Spaja ga netko iz druge grupe, nakon što stranicu otvori lokalno i klikne sve linkove.
- Prije pull requesta spoji najnoviji `main` u svoju granu (`git pull origin main`) i konflikte riješi kod sebe.
- U svom pull requestu ne mijenjaš tuđe datoteke. Promjene zajedničkih datoteka (`index.html`, `styles.css`, `app.js`, navigacija) idu u zaseban mali pull request s naslovom „[zajedničko] …“.

## B) Datoteke i vlasnici (sve u rootu repoa)

| Stranica | Datoteka | Vlasnik |
|---|---|---|
| Početna | `index.html` | ? (tko ima novu početnu, neka je pošalje pod ovim imenom) |
| Nova prijava | `report.html` | grupa 1 |
| Karta stanica | `map.html` | grupa 2 |
| Obrada prijava | `obrada.html` | grupa 3 |
| Plovi odgovorno | `plovi-odgovorno.html` | grupa 4 |
| Dnevnik (moje prijave) | `book.html` | ? |
| Profil (i birač teme) | `profile.html` | ? |

- Dodatne CSS/JS datoteke imenuj prefiksom svoje stranice (`map.css`, `map.js` …), da nema sudara.
- Dok stranica ne postoji, vlasnik odmah pushne jednostavnu verziju „U izradi“ s istom navigacijom, da nema 404.

## C) Navigacija (ista na svim stranicama)
- **Mobitel**, donja traka (najviše 5): Početna · Karta · [+] Nova prijava · Plovi odgovorno · Profil. Dnevnik se otvara s Početne i s Profila.
- **Računalo** (≥ 860 px, bočni izbornik): Početna, Karta, Nova prijava, Dnevnik, Plovi odgovorno, Obrada prijava, Profil.
- Aktivna stavka ima klasu `active`.
- Prijedlog: jedan zajednički `nav.js` koji ubacuje navigaciju u `<nav data-cm-nav="map"></nav>`, pa se izbornik mijenja na jednom mjestu. Dok ga nema, svi kopiraju isti HTML navigacije (primjer: `plovi-odgovorno.html` na grani `grupa-4-plovi-odgovorno`).

## D) Zajedničko stanje (localStorage, bez servera)

| Ključ / datoteka | Sadržaj | Tko piše | Tko čita |
|---|---|---|---|
| `cm-theme` | tema: `ocean`, `deepsea`, `turquoise`, `midnight` | Profil | sve stranice (`app.js`) |
| `cm-lang` | `hr` ili `en` | bilo koja stranica s prekidačem jezika | sve stranice |
| `cm-reports` | niz prijava (polja ispod) | grupa 1 dodaje; grupa 3 mijenja `status` i `authority` | grupa 3, `book.html` |
| `stations.js` | `window.CM_STATIONS` (polja ispod) | grupa 2 | grupa 2, grupa 4, Početna |

- **Prijava** (`cm-reports`): `{ id, createdAt (ISO), lat, lon, location, vesselType, wasteType, description, photos: [dataURL], status: "nova" | "u_obradi" | "rijeseno", authority }`
- **Stanica** (`CM_STATIONS`): `{ id, name, city, port, lat, lon, hours, phone, services: ["crne vode", "sive vode", "kaljuža"] }`
- Karta podržava `map.html?station=<id>` (otvori i istakni stanicu). Grupa 4 već linka tako: `split`, `zadar`, `rijeka`, `pula`.
- Upute za korištenje prihvatne stanice postoje na jednom mjestu: grupa 2 za „Kako koristiti“ linka na `plovi-odgovorno.html#prihvat`.
- **Otvoreno pitanje:** je li `book.html` (Dnevnik) samo „moje prijave“ ili i „moja pražnjenja spremnika“ (`cm-pumpouts`)?
- Pomoćne funkcije idu u `app.js`, u zaseban pull request: `CM_getLang/CM_setLang`, `CM_getReports/CM_saveReport`.
- Grupa 4 sprema zadnji certifikat iz kviza u `po-cert` (`{ name, score, total, date }`). Profil ga može prikazati kao značku „Odgovorni nautičar“.

## E) Svaka stranica
- `<html lang="hr" data-theme="ocean">` i isti `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- Učitava `styles.css` pa svoj CSS, a `app.js` na kraju `<body>`.
- Test: iz roota repoa pokreni `python -m http.server 8765`, otvori `http://localhost:8765/` i klikni svaku stavku navigacije na mobitelu i na računalu. Nijedan link ne smije dati 404.

## F) Rokovi
- **Večeras:** svaka grupa pushne barem „U izradi“ verziju svoje stranice (bez 404).
- **Sutra do 14:00:** sve spojeno u `main`.
- **Od 14:00 do 16:00:** samo popravci i proba prezentacije, bez novih značajki.
