# Plan: Karta za pražnjenje spremnika (ČistoMore)

Dio aplikacije **ČistoMore** (projekt `FekalneIOtpadneVodeSPlovila`). Stranica `map.html`, na koju već vodi link „Karta" u navigaciji.

## Kriteriji
- Interaktivna karta mjesta za prihvat fekalnih i otpadnih voda s broda.
- Prikaz luka i marina koje imaju uslugu pražnjenja spremnika.
- Pregled lokacije, kontakata i dodatnih usluga.
- Pretraživanje prihvatnih mjesta.
- Pronalaženje najbližeg prihvatnog mjesta.
- Prikaz osnovnih uputa za korištenje prihvatne usluge.

## Dogovorene odluke
| Tema | Odluka |
|---|---|
| Tehnologija | Čisti HTML, JS i CSS + **Leaflet 1.9.4** i **Leaflet.markercluster 1.5.3** (oba s cdnjs) i podloga **OpenStreetMap** |
| Grupiranje | Popis po regijama (Istra, Kvarner, Sjeverna, Srednja i Južna Dalmacija) + spajanje bliskih markera u skupinu s brojem |
| Detalji mjesta | Bez preciznosti koordinate (na zahtjev korisnika) |
| Postojeće datoteke | **Ne diraju se** (`index.html`, `report.html`, `styles.css`, `app.js`) |
| Izvor lokacija | **Samo** `lokacije_fekalnih_voda_hrvatska_29_s_koordinatama.json`. Stari JSON bez koordinata se ne koristi |
| Koordinate | Iz tog JSON-a (WGS84). Većinom su to približna središta marina/luka, a ne točna pozicija pumpe, i tako piše u aplikaciji |
| Luka Gruž i Luka Dubrovnik | Iste koordinate, pa idu u **jedan marker** s oba zapisa. Ukupno **28 lokacija** |
| Kontakti i dodatne usluge | Istražuju se sa službenih stranica marina i luka, uz izvor za svaki podatak. Gdje nema podatka, piše „Podatak nije dostupan" |
| Upute | Opći koraci prema službenim dokumentima (plan prihvata Marine Punat, ŽLU Vela Luka, Pravilnik čl. 61), uz izvore |
| Pokretanje | Puna karta radi **samo preko servera** (Live Server, hosting). OpenStreetMap blokira pločice bez zaglavlja Referer, a `file://` ga ne šalje (provjereno: odgovor 403 „Access blocked"). Dvoklikom se umjesto karte prikazuje poruka, a popis, pretraga i GPS rade |

## Posljedice odluke „samo novi JSON"
Novi JSON nema vrstu uređaja (fiksni/mobilni), godine instalacije ni oznaku službene potvrde. Zato:
- **nema filtera fiksni/mobilni**; pretraga ostaje (naziv, mjesto, otok),
- **svi markeri izgledaju jednako**; sve lokacije imaju status „rad uređaja potvrditi kod operatora",
- u detaljima nema godine ni vrste uređaja; prikazuje se `verification_note` iz JSON-a.

## Gdje se radi
Projekt iz ZIP-a raspakira se u `C:\Users\CTK\Desktop\fdff`, a nove datoteke dodaju se uz postojeće.

## Nove datoteke
| Datoteka | Sadržaj |
|---|---|
| `map.html` | Stranica karte s istom gornjom trakom i izbornicima kao ostale stranice; „Karta" je aktivna |
| `map.css` | Samo stilovi karte, preko postojećih CSS varijabli, pa radi u sve 4 teme |
| `map.js` | Sva logika karte |
| `data/lokacije_fekalnih_voda_hrvatska_29_s_koordinatama.json` | Izvorni JSON, bez izmjena |
| `data/stations.js` | Isti podaci kao `window.CM_STATIONS = {...}`, tako da radi i bez servera |
| `data/kontakti.js` | Istraženi kontakti, usluge i izvori po `id`-u lokacije, odvojeno od JSON-a |
| `data/upute.js` | Opće upute (koraci, važne napomene, izvori) |
| `data/regije.js` | Regija za svaku lokaciju (po županijama; Senj je uz Kvarner) |
| `.claude/launch.json` | Samo za testiranje: lokalni server (`python -m http.server 8765`). Nije dio aplikacije |

`stations.js` se ponovo radi ovako (Git Bash, iz mape projekta):
```
{ printf 'window.CM_STATIONS = '; cat data/lokacije_fekalnih_voda_hrvatska_29_s_koordinatama.json; printf ';\n'; } > data/stations.js
```

## Pravila izgleda (zadao korisnik)
Ne koristiti: emojije u naslovima, font Inter, kartice s obojenim lijevim rubom, glassmorphism, slab kontrast (posebno u tamnim temama), značku iznad naslova, ikone na svakom koraku, neprilagođene shadcn komponente, sekcije koje se pojavljuju pri skrolanju, efekte koji prate kursor, gumbe koji na hover samo izblijede, nedosljedne razmake, duge crtice (—), prazne fraze, serif kurziv za naglaske, Space Grotesk / Instrument Serif, grain teksturu, ljubičasto-plave prijelaze, tekst s prijelazom boja.

Kako je to provedeno: font i boje dolaze iz postojećeg `styles.css`; ikone samo na pretrazi, gumbu za lokaciju, zatvaranju i strelica na retcima koji otvaraju detalje; hover mijenja boju pozadine i ruba; kontrast gumba i poveznica provjeren u sve 4 teme (najmanje 4,8:1); razmaci 8/12/16 px.

## Podaci
Iz JSON-a: `id, name, address, latitude, longitude, coordinates.basis, coordinates.precision_note, current_operational_status, verification_note, sources`.

Iz `kontakti.js` (po `id`): `telefon, email, vhf, web, usluge [], izvori [{ naziv, url }]`.

## Izgled
```
┌───────────────────────────────┐
│ Prije dolaska provjerite rad  │
│ uređaja kod operatora         │
│ [Marina ili mjesto] [Najbliže]│
│ (Najbliže: X, 4 km [Detalji]) │
│ ┌───────────────────────────┐ │
│ │ KARTA: ● mjesto  (4) skup. │ │
│ └───────────────────────────┘ │
│ Legenda                       │
│ [Kako koristiti uslugu     >] │
│ Prihvatna mjesta     28 mjesta│
│ ISTRA 5                       │
│ [ACI marina Rovinj         >] │
│ KVARNER 6 ...                 │
└───────────────────────────────┘
```
Na mobitelu se detalji otvaraju kao panel odozdo, na računalu kao prozor u sredini. Gumbi Navigacija i Prikaži na karti stoje u dnu panela i vidljivi su i kad se sadržaj pomiče.

## Funkcije
1. **Prikaz:** 28 markera; bliski markeri spajaju se u skupinu s brojem, a klik na skupinu približi kartu. Legenda opisuje znakove i nije klikabilna.
2. **Detalji:** u zaglavlju naziv, regija i adresa; zatim status, kontakt, dodatne usluge, lokacija (adresa, koordinate, udaljenost) i izvori. U dnu gumbi „Navigacija" (Google Maps) i „Prikaži na karti". Za Gruž se prikazuju oba zapisa.
3. **Popis i pretraga:** popis po regijama od sjevera prema jugu; pretraga po nazivu, mjestu, otoku ili regiji dok tipkaš. Hrvatska slova se zanemaruju („sibenik" nađe „Šibenik").
4. **Najbliže:** GPS (`navigator.geolocation`) i haversine. Rezultat se prikazuje u kartici iznad karte (Detalji, Navigacija, Poništi), a popis se slaže po udaljenosti (zračna linija). Bez GPS-a korisnik klikne na kartu. Ako preglednik ne odgovori u 12 sekundi (npr. Firefox kad se upit za dopuštenje samo zatvori), gumb se vrati i nudi odabir na karti.
5. **Upute:** kartica ispod karte otvara 7 koraka, važne napomene i izvore.

## Redoslijed izrade
1. Raspakirati projekt, napraviti kostur `map.html` i provjeriti link „Karta".
2. Kopirati JSON i napraviti `stations.js`.
3. Ubaciti kartu, markere (Gruž spojen), legendu i upozorenje.
4. Napraviti popis i pretragu.
5. Napraviti panel s detaljima i navigacijom.
6. Napraviti najbliže mjesto.
7. Napraviti skočni prozor s uputama.
8. Istražiti kontakte, usluge i upute te popuniti `kontakti.js`.
9. Testirati: dvoklik i server, mobitel i desktop, sve 4 teme.

## Rizici
- Bez interneta nema podloge karte; popis i pretraga i dalje rade.
- GPS kod otvaranja dvoklikom (`file://`) neki preglednici blokiraju; preko servera radi.
- Koordinate su približne; marker može biti nekoliko stotina metara od pumpe.
- Ako se JSON promijeni, treba ponovo napraviti `stations.js` (opisat ću kako).
