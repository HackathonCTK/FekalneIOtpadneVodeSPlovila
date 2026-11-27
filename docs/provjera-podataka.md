# Provjera podataka: što treba pogledati u JSON-u

Datum provjere: 27. 11. 2026. Uspoređeno sa službenim stranicama marina, ACI-ja, D-Marina i lučkih uprava (izvori su u `data/kontakti.js`).
JSON nije mijenjan; odluka o ispravcima je tvoja.

## 1. Prihvat fekalnih voda prema službenim stranicama

| Stanje | Lokacije |
|---|---|
| **Službena stranica kaže da NEMA uređaja** | Marina Borik (D-Marin: najbliža pump-out stanica INA, oko 1 NM) |
| Potvrđeno | ACI Cres, Dubrovnik, Korčula, Opatija, Rab, Rovinj, Slano, Supetarska Draga, Šimuni; Marina Punat; Marina Dalmacija; Marina Betina; Marina Pirovac (naplatno); Marina Mandalina; Marina Trogir (naplatno); Luka Vela Luka (bazen 2); DSR Strožanac (prema planu Općine) |
| Nejasno | Marina Korkyra (pravilnik upućuje na uređaje „u marini ili izvan nje"); Luka Gruž/Dubrovnik (koncesionari za odvoz, fiksni uređaj nije naveden); PŠD Špinut (uređaj samo najavljen 2019.) |
| Stranica ne spominje | Luka Umag, Marina Valalta, Marina Pula (Polesana), Marina Medulin (Puntica), Luka Senj, Marina Drage, Marina Lav |

Sve što službena stranica kaže o prihvatu prikazuje se u aplikaciji pod „Prema službenoj stranici".

## 2. Koordinate koje odstupaju 1 km ili više

| Lokacija | JSON | Službeno / napomena | Odstupanje |
|---|---|---|---|
| Marina Lav | 43.489, 16.56 | 43°29'30" N, 16°32'05" E (≈43.4917, 16.5347) | ~2 km |
| Marina Valalta | 45.107, 13.625 | GPS kampa 45°7'23" N, 13°37'43" E (≈45.1231, 13.6287) | ~1,8 km |
| Marina Borik | 44.145, 15.217 | 44°7'47" N, 15°12'36" E (≈44.1297, 15.2100) | ~1,7 km |
| Marina Pula (Polesana) | 44.866, 13.84 | 44°52,31' N, 13°49,22' E (≈44.8718, 13.8203) | ~1,7 km |
| Luka Vela Luka, bazen 2 | 42.96, 16.716 | 42°57,3' N, 16°42,05' E (≈42.9550, 16.7008) | ~1,35 km |
| ACI marina Cres | 44.95, 14.4 | adresa Obala sv. Benedikta 3 (OSM ≈44.948, 14.415, neslužbeno) | ~1,2 km |
| Marina Mandalina | 43.727, 15.907 | 43°43'8" N, 15°53'59" E (≈43.7189, 15.8997) | ~1,1 km |
| Marina Dalmacija | 44.047, 15.31 | 44°3'14" N, 15°18'1" E (≈44.0539, 15.3003) | ~1 km |
| DSR Strožanac | 43.499, 16.55 | službene koordinate nema; prema planu Općine lučica je zapadnije, uz hotel Lav | vjerojatno >1 km |

Blizu granice: ACI Rovinj (~0,9 km; moguća greška pretvorbe 45°04,6' = 45.0767, a ne 45.06767), Marina Pirovac (~0,6 do 0,85 km).
Nisu provjerene (nema službenih koordinata): Marina Betina, PŠD Špinut, Luka Gruž/Dubrovnik.

## 3. Nazivi i adrese

- **Marina Brodotrogir** danas posluje kao **Marina Trogir** (Marina 21), uz brodogradilište Brodotrogir.
- **Marina Pula (Pulešana)**: pretpostavljeno da je to Marina Polesana Pula (Marina 21).
- **Marina Puntica** danas posluje kao Marina Medulin; adresa u Medulinu je točna.
- **PŠD Špinut**: službena adresa je Lučica 7, Split, a ne Spinutska ulica.
- **Luka Gruž** i **Luka Dubrovnik** su ista luka (u aplikaciji jedan marker).
- U **Luka Vela Luka, lučki bazen 2** adresa ne sadrži „Korčula", pa je pretraga „korcula" ne nalazi (pronalazi je „vela luka").

## 4. Uočeno u postojećem kodu (nije mijenjano)

- `styles.css` nigdje ne skriva `.sidenav` ispod 860 px, pa se bočni izbornik vidi i na mobitelu na svim stranicama. Na stranici karte to je skriveno u `map.css`. Popravak za cijelu aplikaciju: na početak `styles.css` dodati `.sidenav{ display:none; }`.
- `styles.css` postavlja `html, body{ height:100% }`. Na svakoj stranici dužoj od prozora:
  - na računalu se gornja traka zgnječi na oko 28 px (logo i strelica natrag odrezani; u Firefoxu sadržaj ulazi ispod trake);
  - pozadinski prijelaz se ponavlja, pa se pri pomicanju vidi vodoravni rub.
  Na stranici karte popravljeno u `map.css` (`html, body{ height:auto }` i `.app{ align-self:flex-start }` na računalu). Isto bi trebalo i u `styles.css` za ostale stranice.
- Na računalu je gornja traka ljepljiva, a bočni izbornik ljepljiv 24 px od vrha, pa traka pri pomicanju prekrije izbornik. Na stranici karte traka nije ljepljiva (ni na mobitelu ni na računalu), nego stoji na vrhu i odlazi s pomicanjem.
- Boja `--text-muted` u temi „turquoise" ima kontrast 3,8:1 na bijeloj podlozi (preporuka je najmanje 4,5:1).
- `book.html` i `profile.html`, na koje vodi navigacija, još ne postoje.
