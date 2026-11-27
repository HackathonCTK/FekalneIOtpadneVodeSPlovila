# ČistoMore: kako su stranice spojene (izvor istine za sve grupe i AI agente)

Sve četiri grupe spojene su u jednu statičnu aplikaciju u rootu repoa (grana `main`),
objavljenu na **https://hackathonctk.github.io/FekalneIOtpadneVodeSPlovila/**.
Bez build alata: čisti HTML/CSS/JS, samo **relativne** putanje (stranica je u podmapi na GitHub Pagesu).

Dogovor tima (README): **boje, fontovi i animacije grupe 4**, **raspored grupe 1**, **sadržaj grupa 2 i 3 kakav jest**,
HR/EN na svim stranicama, tamni i svijetli način. Originalne verzije svih grupa su u `original/`.

## Stranice

| Stranica | Datoteka | Grupa | Napomena |
|---|---|---|---|
| Početna | `index.html` (+ `index-i18n.js`) | 1 | brojke i nedavne prijave iz zajedničkog spremišta |
| Nova prijava | `report.html` (+ `report-i18n.js`) | 1 | sprema prijavu u `cistomore.v1` |
| Karta prihvatnih stanica | `map.html`, `map.css`, `map.js`, `map-i18n.js`, `data/` | 2 | podaci u `data/stations.js` itd. |
| Obrada prijava | `obrada.html`, `obrada.css`, `obrada.js`, `obrada-i18n.js` | 3 | statična verzija za Pages (OSM karta) |
| Obrada prijava, lokalni server | `server.js`, `public/`, `fonts/`, `map-style/`, `demo/`, `scripts/` | 3 | `npm run demo` / `npm start`, vidi README |
| Plovi odgovorno | `plovi-odgovorno.html`, `.css`, `.js`, `-sadrzaj.js` | 4 | vodič, kviz, certifikat |
| Profil | `profile.html` | – | „Uskoro“; korisnički računi naknadno |
| Dnevnik | `book.html` | – | preusmjerava na `plovi-odgovorno.html` |

## A) Rad na GitHubu
- Svaka grupa radi na svojoj grani; na `main` ide kroz pull request (ili uz dogovor tima).
- Ne uploadati datoteke preko weba („Add files via upload“): lako se pregaze tuđe izmjene.
- Prije pull requesta: `git pull origin main`, konflikte riješiti kod sebe, otvoriti stranicu lokalno i kliknuti sve linkove.
- Zajedničke datoteke (`styles.css`, `app.js`, `cm-boot.js`, navigacija) mijenjati u zasebnom malom pull requestu „[zajedničko] …“.

## B) Svaka stranica (predložak)
```html
<html lang="hr">                       <!-- bez data-theme: postavlja ga cm-boot.js -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#04141C">
  <title data-i18n="stranica.title">…</title>
  <script src="cm-boot.js"></script>   <!-- način, tema i jezik prije crtanja -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=JetBrains+Mono:wght@400;600&family=Manrope:wght@400;600;700&display=swap">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="stranica.css">
</head>
<body>
  <div class="app">
    <header class="topbar"><div class="topbar-row">…brand…</div> …</header>   <!-- prekidači se dodaju sami -->
    <nav class="sidenav" data-cm-nav="home"></nav>
    <main class="content">…</main>
    <nav class="bottomnav" data-cm-nav="home"></nav>
    <div class="toast" id="toast"></div>
  </div>
  <script src="app.js"></script>
  <script src="stranica-i18n.js"></script>
  <script src="stranica.js"></script>
</body>
```

## C) Navigacija (generira `app.js`)
- `data-cm-nav` = `home` | `map` | `report` | `plovi` | `obrada` | `profile` (aktivna stavka).
- Računalo (≥ 860 px): Početna, Karta, Nova prijava, Plovi odgovorno, Obrada prijava, Profil.
- Mobitel (najviše 5): Početna · Karta · [+] Nova prijava · Plovi · Profil.

## D) Dizajn
- `cm-boot.js` + `app.js`: **tamni način = paleta A „Dubina“** (`data-theme="dubina"`), **svijetli = paleta D „Ocean“** (`data-theme="ocean"`).
  Gumb sunce/mjesec i HR/EN dodaju se sami u `.topbar-row`. Teme `deepsea`, `turquoise`, `midnight` ostaju za budući Profil.
- Koristiti samo CSS varijable teme (`--bg`, `--surface`, `--surface-2`, `--text`, `--text-muted`, `--primary`, `--accent`,
  `--border`, `--success`, `--warning`, `--danger`, `--on-fab`, `--on-primary`, `--on-topbar` …) i fontove
  `--font-display` (Bricolage Grotesque), `--font-body` (Manrope), `--font-mono` (JetBrains Mono).
- Animacije ulaska samo pomakom (bez `opacity:0`), uz `prefers-reduced-motion`.

## E) Zajedničko stanje (localStorage, bez servera)

| Ključ | Sadržaj | Tko piše | Tko čita |
|---|---|---|---|
| `cm-mode` | `dark` / `light` | gumb sunce/mjesec | sve stranice |
| `cm-lang` | `hr` / `en` | prekidač HR/EN | sve stranice |
| `cm-theme` | posebna tema (budući Profil) | Profil | sve stranice |
| `cistomore.v1` | prijave (model grupe 3) | `report.html` dodaje, `obrada.html` obrađuje | `index.html`, `obrada.html` |
| `po-cert` | `{ name, score, total, date }` certifikat iz kviza | `plovi-odgovorno.js` | `profile.html` |

- **Prijava** (`cistomore.v1` → `reports[]`): `{ id, type, lat, lng, place, desc, createdAt, status: "zaprimljeno" | "obrada" | "rijeseno",
  vessel, heading, service, reasons[], county, confirmed, history[{t, text}], photo, pending, source, extra }`.
  `app.js` nudi `CM_reports.load() / save(db) / all() / add(partial)`; službu, županiju i mjesto prijavi iz `report.html` određuje `obrada.html`.
- **Stanice** (grupa 2): `data/stations.js` → `window.CM_STATIONS.locations[]` s id-jevima poput `HR-SPLIT-SPINUT`;
  kontakti `data/kontakti.js`, regije `data/regije.js`, upute `data/upute.js` (+ `data/upute-en.js`).
- **Duboke poveznice:** `map.html?station=<id>` otvara stanicu na karti; `plovi-odgovorno.html#prihvat` su upute za prihvatnu stanicu,
  `#vodic` vodič, `#kviz` kviz.

## F) Provjera prije objave
Iz roota repoa `python -m http.server 8765`, otvoriti `http://localhost:8765/`, na mobitelu (375 px) i računalu,
u oba načina i oba jezika, kliknuti svaku stavku navigacije: nijedan link ne smije dati 404, konzola bez grešaka.
