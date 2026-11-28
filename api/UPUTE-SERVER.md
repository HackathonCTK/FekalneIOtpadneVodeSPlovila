# ČistoMore server: upute za postavljanje

Web-stranice su na GitHub Pagesu (`https://hackathonctk.github.io/FekalneIOtpadneVodeSPlovila/`).
Računi, prijave i rezultati kviza spremaju se na **računalo koje radi 24/7** (Windows 10).
Ono pokreće mali server (`api/server.js`, Node.js + ugrađena SQLite baza) i Cloudflare tunel
koji ga sigurno izlaže na internet, bez otvaranja portova na routeru.

```
github.io (stranice) ──HTTPS──> https://<nasumicno>.trycloudflare.com ──tunel──> računalo: api/server.js + api/data/cistomore.db
```

Tunel je „brzi tunel“: ne treba domenu ni prijavu u Cloudflare, ali pri svakom pokretanju
dobije **novu adresu**. Server je zato sam upiše u datoteku `api.json` na grani **`api-adresa`**
ovog repoa. Stranice prvo pročitaju tu datoteku, pa uvijek znaju gdje je server.
Nakon ponovnog pokretanja računala stranice se same spoje za 1–5 minuta.

---

## 1. Na računalu sa serverom (jednom)

1. Skini repo (Code → Download ZIP i raspakiraj, ili `git clone`) u stalnu mapu, npr. `C:\CistoMore\`.
   Mapu poslije ne premještaj, jer zadatak za automatsko pokretanje pamti putanju.
2. Dvoklik na **`api\windows\1-instaliraj.bat`** i dopusti administratorska prava. Skripta:
   - instalira **Node.js LTS** i **cloudflared** (preko `winget`);
   - napravi `api\config.json` iz predloška;
   - doda zadatak „CistoMore server“ u Task Scheduler, koji pokreće server minutu nakon paljenja računala, i bez prijave u Windows;
   - pita želiš li isključiti spavanje računala (preporučeno);
   - na kraju otvori `config.json` u Notepadu.
3. U `config.json` upiši (koraci 2 i 3 ispod objašnjavaju odakle što):
   ```json
   "adminEmails": ["tvoj.email@gmail.com"],
   "googleClientId": "1234567890-abc...apps.googleusercontent.com",
   "github": { "token": "github_pat_...", "repo": "HackathonCTK/FekalneIOtpadneVodeSPlovila", "branch": "api-adresa", "file": "api.json" }
   ```
   Spremi datoteku. `config.json` se **nikad ne pusha** na GitHub (u `.gitignore` je), jer sadrži token.
4. Dvoklik na **`api\windows\2-pokreni-sada.bat`**. Pokrene server odmah i ispiše javnu adresu.

Ostale skripte u `api\windows\`:

| Skripta | Što radi |
|---|---|
| `status.bat` | Radi li server, trenutna javna adresa i zadnji zapisi iz loga |
| `zaustavi-server.bat` | Zaustavi server (ponovno se pokreće pri paljenju računala ili s `2-pokreni-sada.bat`) |
| `pokreni-server.bat` | Ovo pokreće Task Scheduler; ako server padne, ponovno ga pokrene za 10 s |

## 2. Google prijava (Client ID, oko 5 minuta)

1. Otvori <https://console.cloud.google.com/> i prijavi se svojim Google računom.
2. Gore lijevo **Select a project → New project**, ime npr. `CistoMore`, pa **Create**.
3. Izbornik **APIs & Services → OAuth consent screen** (ili „Google Auth Platform“):
   - App name: `ČistoMore`; User support e-mail: tvoj e-mail;
   - Audience: **External**; Contact e-mail: tvoj e-mail; spremi.
   - Pod **Audience** klikni **Publish app**, da se može prijaviti bilo tko, a ne samo testni korisnici.
     Za prijavu se traže samo ime, e-mail i slika, pa Google ne traži dodatnu provjeru.
4. **Clients** (ili Credentials → Create credentials → OAuth client ID):
   - Application type: **Web application**, Name: `ČistoMore web`;
   - **Authorized JavaScript origins**: dodaj
     - `https://hackathonctk.github.io`
     - `http://localhost:8765` (za lokalno testiranje)
   - Authorized redirect URIs ostavi prazno; **Create**.
5. Kopiraj **Client ID** (završava s `.apps.googleusercontent.com`) u `googleClientId` u `config.json`.
   Client ID nije tajna. Client secret ne treba.

Gumb „Nastavi s Googleom“ pojavi se na Profilu čim server ima Client ID (nakon `2-pokreni-sada.bat`).

## 3. GitHub token (za objavu adrese, oko 2 minute)

1. GitHub → klikni svoju sliku → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Token name: `cistomore-server`; Expiration: npr. 90 dana.
   Pazi da token ne istekne prije prezentacije.
3. **Resource owner**: `HackathonCTK`. Ako organizacija traži odobrenje tokena, odobri ga ili ga zatraži od vlasnika organizacije.
4. **Repository access → Only select repositories →** `FekalneIOtpadneVodeSPlovila`.
5. **Permissions → Repository permissions → Contents: Read and write**. Ništa drugo.
6. **Generate token** i kopiraj ga (počinje s `github_pat_`) u `github.token` u `config.json`.

Server tim tokenom samo napravi granu `api-adresa` (ako je nema) i u njoj ažurira `api.json`.
Grana `main` i GitHub Pages se ne diraju.

## 4. Uloge

| Uloga | Tko | Može |
|---|---|---|
| Korisnik | svatko tko napravi račun (e-mail i lozinka ili Google) | slati prijave, pratiti svoje prijave, spremati kviz |
| Nadležna služba | račun koji admin označi na Profilu | vidjeti sve prijave i mijenjati status na stranici Obrada |
| Admin | e-mailovi u `adminEmails` u `config.json` | sve što i služba, plus označavanje službi na Profilu |

Prijava onečišćenja šalje se samo s računom. Ako server privremeno ne radi, prijava ostaje
na uređaju i automatski se pošalje kad server opet proradi.

## 5. Gdje su podaci

| Mapa ili datoteka | Sadržaj |
|---|---|
| `api\data\cistomore.db` | baza: računi (lozinke su sigurno hashirane, scrypt), prijave, kviz, sesije |
| `api\data\photos\` | fotografije prijava |
| `api\data\adresa.txt` | trenutna javna adresa tunela |
| `api\backup\` | automatska kopija baze svaki dan (čuva se 14 dana, `backupDays`) i kopija fotografija |
| `api\logs\server.log` | zapis rada servera |

Za prijenos na drugo računalo kopiraj cijelu mapu `api\data\` (i `config.json`).

## 6. Lokalno testiranje (na razvojnom računalu)

```powershell
node api/server.js
python -m http.server 8765
```

Na `http://localhost:8765` stranice same koriste server na `http://localhost:8787`.
Za lokalni test u `config.json` stavi `"tunnel": { "enabled": false }`.
Ručna adresa servera može se zadati u konzoli preglednika: `localStorage.setItem("cm-api", "https://...")`.

## 7. Česti problemi

- **Na Profilu piše „Server trenutno nije dostupan“**: pokreni `status.bat`.
  - Ako lokalna provjera ne radi, pogledaj log.
  - Ako radi, a adrese nema, provjeri da je cloudflared instaliran (`cloudflared --version`).
  - Ako adresa postoji, a stranice je ne vide, provjeri `github.token` i pričekaj do 5 minuta.
- **„Objava adrese na GitHubu nije uspjela (403/404)“** u logu: tokenu nedostaje pravo „Contents: Read and write“ na ovom repou ili ga organizacija još nije odobrila.
- **Google gumb se ne pojavljuje ili javlja grešku „origin“**: u Google Cloud Consoleu provjeri Authorized JavaScript origins (točno `https://hackathonctk.github.io`, bez `/` na kraju) i `googleClientId` u `config.json`.
- Brzi tunel je besplatan i bez jamstva rada. Za trajnu adresu kasnije treba domena na Cloudflareu (imenovani tunel); kod stranica se tada ne mijenja.
