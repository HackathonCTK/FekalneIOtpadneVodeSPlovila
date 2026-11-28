# NASTAVAK: stanje spajanja i sljedeći koraci (za drugog agenta / račun)

Grana s cijelim spojenim radom: **`integracija-sve`** (temelj: `origin/main`, spojene `grupa2`, `grupa-3-pracenje-i-obrada-prijava`,
`grupa-4-plovi-odgovorno`). Pravila i struktura: **`INTEGRACIJA.md`**. Originali grupa: **`original/`**.
Cilj: sve radi na https://hackathonctk.github.io/FekalneIOtpadneVodeSPlovila/ (Pages poslužuje `main`).

## Gotovo (testirano lokalno: `python -m http.server 8765` iz roota)
- Sve grane spojene, nijedna datoteka nije izgubljena (183+ datoteka; provjereno usporedbom `git ls-tree`).
- Zajednički temelji: `cm-boot.js` (način/tema/jezik prije crtanja), `app.js` (navigacija `data-cm-nav`, prekidači
  sunce/mjesec i HR/EN, `CM_i18n`, `CM_reports`), `styles.css` (boje A „Dubina“ = dark, D „Ocean“ = light, fontovi i animacije grupe 4).
- Grupa 1: `index.html` (+`index.js`, `index-i18n.js`) uživo iz spremišta; `report.html` (+`report.js`, `report-i18n.js`) sprema prijave.
- Grupa 2: `map.html/.css/.js`, `map-i18n.js`, `data/upute-en.js`; `map.html?station=<id>`.
- Grupa 3: statična `obrada.html/.css/.js`, `obrada-i18n.js` (Leaflet + OSM); serverska verzija netaknuta (`server.js`, `public/`).
- Grupa 4: `plovi-odgovorno.*` na zajedničkoj navigaciji; stanice vode na stvarne id-jeve grupe 2.
- `book.html` preusmjerava na Plovi odgovorno; `profile.html` = „Uskoro“ (profil i baza podataka naknadno).
- Tok prijava provjeren: report.html → `cistomore.v1` (id od 2026-1186) → index (brojke) → obrada (16 demo + prave, služba se dodjeljuje sama).
- Automatska provjera linkova: 0 problema; `node --check` svih JS: 0 grešaka; HR/EN ključevi potpuni.

## Preostalo
1. Brza vizualna provjera svake stranice (375 px i 1280 px, dark/light, HR/EN): `index`, `report`, `map`, `obrada`, `plovi-odgovorno`, `profile`.
   Paziti da ništa ne ostane proziran zbog animacija (animacije smiju mijenjati samo `transform`).
2. Spojiti `integracija-sve` u `main` (vlasnik je odobrio push na main nakon provjere) i pushati:
   `git switch main && git pull && git merge --no-ff integracija-sve && git push origin main`
3. Nakon 1–2 min provjeriti na Pagesu: sve stranice 200, konzola bez grešaka, karta (OSM) se učitava na `map.html` i `obrada.html`.
4. Poznato: `api.bigdatacloud.net` (provjera more/kopno u report.html) vraća 403 – prekidač „promatram s kopna“ je ručni.

## Računi i baza (studeni 2026.)
- Server: `api/server.js` (Node 22+, `node:sqlite`, bez npm paketa). Postavke `api/config.json` (ne pusha se; predložak `api/config.example.json`).
- Pokreće se na Josipovom Windows 10 računalu (24/7): `api/windows/1-instaliraj.bat`, pa `2-pokreni-sada.bat`. Upute: **`api/UPUTE-SERVER.md`**.
- Cloudflare brzi tunel; server upisuje adresu u `api.json` na grani `api-adresa`, a `cm-api.js` je odande čita.
- Klijent: `cm-api.js` (na svim stranicama nakon `app.js`): `CM_account` (e-mail/lozinka, Google), `CM_sync` (prijave u `cistomore.v1` se usklađuju sa serverom, `_srv`), kviz preko događaja `cm:quiz`.
- Uloge: korisnik, služba (označava admin na Profilu), admin (`adminEmails`). Prijave samo s računom.
- Test API-ja: `node api/server.js` (s `"tunnel":{"enabled":false}`), stranice na `http://localhost:8765` same koriste `http://localhost:8787`.