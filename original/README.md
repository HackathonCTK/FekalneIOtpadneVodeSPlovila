# Originalne verzije (prije spajanja)

Ovdje su neizmijenjene verzije stranica svake grupe, točno onakve kakve su bile na svojim granama
prije spajanja u jednu aplikaciju (27. 11. 2026.). Nove, spojene verzije su u rootu repoa.

| Mapa | Grupa | Izvor (grana) | Sadržaj |
|---|---|---|---|
| `grupa-1/` | 1 – Prijava onečišćenja + početna | `main` (cfd34ba) | `index.html`, `report.html`, `styles.css`, `app.js` |
| `grupa-2/` | 2 – Karta prihvatnih stanica | `grupa2` (2f4df25) | `map.*`, `data/`, `docs/`, `styles.css`, `app.js` |
| `grupa-3/` | 3 – Praćenje i obrada prijava | `grupa-3-pracenje-i-obrada-prijava` (5644c8e) | `public/index.html`, `README.md` |
| `grupa-4/` | 4 – Plovi odgovorno | `grupa-4-plovi-odgovorno` (c93d91a) | `plovi-odgovorno.*`, `styles.css`, `app.js` |

Napomene:
- Grupa 3 je i dalje u cijelosti u rootu (`server.js`, `package.json`, `public/`, `fonts/`, `map-style/`, `demo/`, `scripts/`),
  pa se njihova verzija s lokalnim serverom karata pokreće kao i prije (`npm run demo` ili `npm start`).
  Na GitHub Pagesu se koristi statična verzija `obrada.html` u rootu.
- Svaka mapa ima svoj `styles.css` i `app.js`, pa se originalne stranice mogu otvoriti i same za usporedbu
  (lokalni server iz roota repoa, npr. `python -m http.server 8765`, pa `http://localhost:8765/original/grupa-1/`).
