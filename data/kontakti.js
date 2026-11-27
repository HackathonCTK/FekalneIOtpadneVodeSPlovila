// Kontakti i dodatne usluge po id-u lokacije iz JSON-a.
// Prikupljeno sa službenih stranica marina, ACI-ja, D-Marina i lučkih uprava (vidi "izvori" uz svaku lokaciju).
// null = podatak nije naveden na službenoj stranici. "prihvat" = što službena stranica kaže o samom
// prihvatu fekalnih voda (prikazuje se u detaljima). Provjera koordinata: docs/provjera-podataka.md.
window.CM_CONTACTS = {
  "HR-UMAG-LUKA": {
    telefon: "+385 52 743 266", email: "info@luun.hr", vhf: "10", web: "https://luun.hr/",
    usluge: ["Granični prijelaz", "Prihvat otpada"],
    prihvat: null,
    izvori: [
      { naziv: "Županijska lučka uprava Umag-Novigrad", url: "https://luun.hr/" },
      { naziv: "ŽLU Umag-Novigrad: Luka Umag", url: "https://luun.hr/luka/umag/" },
      { naziv: "ŽLU Umag-Novigrad: Gospodarenje otpadom", url: "https://luun.hr/dokumenti/gospodarenje-otpadom/" }
    ]
  },
  "HR-ROVINJ-VALALTA": {
    telefon: "+385 52 804 800", email: "valalta@valalta.hr", vhf: null, web: "https://valalta.hr/page/marina",
    usluge: ["Voda", "Struja", "Sanitarni čvor", "Servis", "Dizanje i spuštanje plovila", "Istezalište", "Parkiralište"],
    prihvat: null,
    izvori: [
      { naziv: "Valalta: Marina", url: "https://valalta.hr/page/marina" },
      { naziv: "Valalta: naslovnica i kontakt", url: "https://www.valalta.hr/" }
    ]
  },
  "HR-ROVINJ-ACI": {
    telefon: "+385 52 813 133", email: null, vhf: "17", web: "https://aci-marinas.com/hr/marina/aci-rovinj/",
    usluge: ["Sanitarni čvor", "Restoran", "Servis", "Praonica rublja", "Najam plovila", "Parkiralište", "Wi-Fi", "Wellness", "Najam automobila", "Punionica za električna vozila", "Prihvat otpada", "Prihvat fekalnih voda", "Prihvat zauljenih voda", "Benzinska crpka u blizini (0,5 NM)"],
    prihvat: "ACI navodi prihvat fekalnih voda u ovoj marini.",
    izvori: [
      { naziv: "ACI marina Rovinj", url: "https://aci-marinas.com/hr/marina/aci-rovinj/" },
      { naziv: "ACI: Sažetak plana za prihvat otpada, Rovinj (EN)", url: "https://aci-marinas.com/wp-content/uploads/2026/09/EN-sazetak-Rovinj.pdf" }
    ]
  },
  "HR-PULA-PULESANA": {
    telefon: "+385 52 378 400", email: "polesana@marina21.com", vhf: "17", web: "https://marina21.com/hr/marina-polesana-pula/",
    usluge: ["Dizalica", "Samohodna kolica", "Servis", "Praonica rublja", "Parkiralište", "Restoran", "Kafić", "Trgovina", "Hotel", "Charter agencije", "Najam e-bicikala"],
    prihvat: null,
    izvori: [
      { naziv: "Marina21: Marina Polesana Pula", url: "https://marina21.com/hr/marina-polesana-pula/" }
    ]
  },
  "HR-MEDULIN-PUNTICA": {
    telefon: "+385 52 633 547", email: "marina.medulin@ayc.hr", vhf: "17", web: "https://www.marina-medulin.hr/",
    usluge: ["Voda", "Struja", "Wi-Fi", "Sanitarni čvor", "Tuševi", "Gorivo", "Dizalica", "Servis", "Parkiralište", "Prihvat otpada", "Bar", "Bankomat", "Najam plovila"],
    prihvat: null,
    izvori: [
      { naziv: "Marina Medulin", url: "https://www.marina-medulin.hr/" },
      { naziv: "Marina Medulin: usluge", url: "https://www.marina-medulin.hr/services/" },
      { naziv: "Marina Medulin: kontakt", url: "https://www.marina-medulin.hr/contact/" }
    ]
  },
  "HR-ICICI-ACI-OPATIJA": {
    telefon: "+385 98 398 840", email: null, vhf: "17", web: "https://aci-marinas.com/hr/marina/aci-opatija/",
    usluge: ["Sanitarni čvor", "Restoran", "Trgovina", "Servis", "Dizalica", "Najam plovila", "Bankomat", "Istezalište", "Punionica za električna vozila", "Parkiralište", "Wi-Fi", "Prihvat otpada", "Prihvat fekalnih voda", "Benzinska crpka u blizini (2 NM)"],
    prihvat: "ACI navodi prihvat fekalnih voda u ovoj marini.",
    izvori: [
      { naziv: "ACI marina Opatija", url: "https://aci-marinas.com/hr/marina/aci-opatija/" },
      { naziv: "ACI: Sažetak plana za prihvat otpada, Opatija (EN)", url: "https://aci-marinas.com/wp-content/uploads/2026/09/EN-sazetak-Opatija.pdf" }
    ]
  },
  "HR-CRES-ACI": {
    telefon: "+385 98 398 839", email: null, vhf: "17", web: "https://aci-marinas.com/hr/marina/aci-cres/",
    usluge: ["Sanitarni čvor", "Restoran", "Trgovina", "Servis", "Dizalica", "Travel lift", "Praonica rublja", "Parkiralište", "Wi-Fi", "Punionica za električna vozila", "Gorivo", "Nautička trgovina", "Prihvat otpada", "Prihvat fekalnih voda", "Prihvat zauljenih voda"],
    prihvat: "ACI navodi prihvat fekalnih voda. Prema sažetku plana predaja otpada je besplatna, a pražnjenje spremnika sivih voda naplaćuje se po cjeniku.",
    izvori: [
      { naziv: "ACI marina Cres", url: "https://aci-marinas.com/hr/marina/aci-cres/" },
      { naziv: "ACI: Sažetak plana za prihvat otpada, Cres (EN)", url: "https://aci-marinas.com/wp-content/uploads/2026/09/EN-sazetak-Cres.pdf" }
    ]
  },
  "HR-PUNAT-MARINA": {
    telefon: "+385 51 654 111", email: "info@marina-punat.hr", vhf: "17", web: "https://www.marina-punat.hr/",
    usluge: ["Voda", "Struja", "Wi-Fi", "Sanitarni čvor", "Praonica rublja", "Travel lift", "Servis", "Trgovina", "Restoran", "Parkiralište", "Prihvat otpada", "Prihvat fekalnih voda", "Bankomat", "Punionica za električna vozila", "Hotel"],
    prihvat: "Pražnjenje spremnika crnih i sivih voda je besplatno, uz najavu najmanje dan unaprijed. Termini: ponedjeljak do petak u 9 i 13 sati.",
    izvori: [
      { naziv: "Marina Punat", url: "https://www.marina-punat.hr/" },
      { naziv: "Marina Punat: kontakt", url: "https://www.marina-punat.hr/kontakt/48" },
      { naziv: "Marina Punat: ostale usluge", url: "https://www.marina-punat.hr/vezovi-za-plovila/ostale-usluge/1630" },
      { naziv: "Marina Punat: česta pitanja", url: "https://www.marina-punat.hr/cesta-pitanja/78" }
    ]
  },
  "HR-SENJ-LUKA": {
    telefon: "+385 53 686 155", email: "lucka.uprava.senj@lusenj.tcloud.hr", vhf: null, web: "https://lucka-uprava-senj.hr/",
    usluge: ["Voda", "Dizalica", "Granični prijelaz", "Carina", "Lučka kapetanija", "Trgovina", "Restoran"],
    prihvat: null,
    izvori: [
      { naziv: "Lučka uprava Senj: kontakt", url: "https://lucka-uprava-senj.hr/kontakt/" },
      { naziv: "Lučka uprava Senj: Luka Senj", url: "https://lucka-uprava-senj.hr/places/croatia/licko-senjska-zupanija/senj/luke/luka-senj/" },
      { naziv: "Lučka uprava Senj: nautički vezovi", url: "https://lucka-uprava-senj.hr/nauticki-vezovi/" }
    ]
  },
  "HR-SUPETARSKA-DRAGA-ACI": {
    telefon: "+385 98 398 841", email: null, vhf: "17", web: "https://aci-marinas.com/hr/marina/aci-supetarska-draga/",
    usluge: ["Sanitarni čvor", "Restoran", "Servis", "Punionica za električna vozila", "Istezalište", "Parkiralište", "Wi-Fi", "Dizalica", "Prihvat otpada", "Prihvat fekalnih voda", "Benzinska crpka u blizini (11 NM)"],
    prihvat: "ACI navodi prihvat fekalnih voda u ovoj marini.",
    izvori: [
      { naziv: "ACI marina Supetarska Draga", url: "https://aci-marinas.com/hr/marina/aci-supetarska-draga/" },
      { naziv: "ACI: Sažetak plana za prihvat otpada, Supetarska Draga (EN)", url: "https://aci-marinas.com/wp-content/uploads/2026/09/EN-sazetak-S.-Draga.pdf" }
    ]
  },
  "HR-RAB-ACI": {
    telefon: "+385 98 399 482", email: null, vhf: "17", web: "https://aci-marinas.com/hr/marina/aci-rab/",
    usluge: ["Wi-Fi", "Servis", "Restoran", "Istezalište", "Sanitarni čvor", "Dizalica", "Nautička trgovina", "Prihvat otpada", "Prihvat fekalnih voda", "Benzinska crpka u blizini"],
    prihvat: "ACI navodi prihvat fekalnih voda u ovoj marini.",
    izvori: [
      { naziv: "ACI marina Rab", url: "https://aci-marinas.com/hr/marina/aci-rab/" },
      { naziv: "ACI: Sažetak plana za prihvat otpada, Rab (EN)", url: "https://aci-marinas.com/wp-content/uploads/2026/09/EN-sazetak-Rab.pdf" }
    ]
  },
  "HR-SIMUNI-ACI": {
    telefon: "+385 98 398 843", email: null, vhf: "17", web: "https://aci-marinas.com/hr/marina/aci-simuni/",
    usluge: ["Wi-Fi", "Sanitarni čvor", "Restoran", "Servis", "Dizalica", "Istezalište", "Parkiralište", "Prihvat otpada", "Prihvat fekalnih voda", "Benzinska crpka u blizini (7 NM)"],
    prihvat: "ACI navodi prihvat fekalnih voda u ovoj marini.",
    izvori: [
      { naziv: "ACI marina Šimuni", url: "https://aci-marinas.com/hr/marina/aci-simuni/" },
      { naziv: "ACI: Sažetak plana za prihvat otpada, Šimuni (EN)", url: "https://aci-marinas.com/wp-content/uploads/2026/09/EN-sazetak-Simuni.pdf" }
    ]
  },
  "HR-ZADAR-BORIK": {
    telefon: "+385 23 333 036", email: "borik@d-marin.com", vhf: "17", web: "https://www.d-marin.com/en/marinas/borik/",
    usluge: ["Voda", "Struja", "Wi-Fi", "Sanitarni čvor", "Tuševi", "Praonica rublja", "Dizalica", "Servis", "Parkiralište", "Prihvat otpada", "Kafić", "Gorivo u blizini (1 NM)"],
    prihvat: "Pozor: prema službenim čestim pitanjima D-Marina ova marina nema uređaj za ispumpavanje. Najbliža pump-out stanica (INA) udaljena je oko 1 NM.",
    izvori: [
      { naziv: "D-Marin Borik (s čestim pitanjima, EN)", url: "https://www.d-marin.com/en/marinas/borik/" }
    ]
  },
  "HR-SUKOSAN-DALMACIJA": {
    telefon: "+385 23 200 300", email: "dalmacija@d-marin.com", vhf: "17", web: "https://www.d-marin.com/en/marinas/dalmacija/",
    usluge: ["Gorivo", "Trgovina", "Praonica rublja", "Dizalica", "Travel lift", "Servis", "Restoran", "Parkiralište", "Sanitarni čvor", "Tuševi", "Wi-Fi", "Voda", "Struja", "Punionica za električna vozila", "Prihvat fekalnih voda", "Spremnici za reciklažu"],
    prihvat: "Pump-out stanica radi od 8 do 16 sati; nedjeljom i praznikom ne radi.",
    izvori: [
      { naziv: "D-Marin Dalmacija (s čestim pitanjima, EN)", url: "https://www.d-marin.com/en/marinas/dalmacija/" }
    ]
  },
  "HR-DRAGE-MARINA": {
    telefon: "+385 91 609 8420", email: "info@marinadrage.hr", vhf: null, web: "https://marinadrage.hr/",
    usluge: ["Struja", "Voda", "Sanitarni čvor", "Tuševi", "Parkiralište", "Restoran", "Bar", "Trgovina", "Dizalica", "Bazen", "Recepcija 0 do 24 h"],
    prihvat: null,
    izvori: [
      { naziv: "Marina Drage", url: "https://marinadrage.hr/" },
      { naziv: "Marina Drage: sadržaj", url: "https://marinadrage.hr/sadrzaj/" },
      { naziv: "Marina Drage: kontakt", url: "https://marinadrage.hr/kontakt/" }
    ]
  },
  "HR-BETINA-MARINA": {
    telefon: "+385 22 434 497", email: "info@marina-betina.com", vhf: null, web: "https://marina-betina.com/",
    usluge: ["Voda", "Struja", "Wi-Fi", "Sanitarni čvor", "Tuševi", "Praonica rublja", "Dizalica", "Servis", "Nautička trgovina", "Restoran", "Parkiralište", "Prihvat otpada", "Prihvat fekalnih voda", "Prihvat zauljenog otpada", "Mjenjačnica", "Fitness"],
    prihvat: "Vakuumski sustav s 5 priključaka na lukobranu. Prije pražnjenja crnog spremnika javite se mornarskoj službi.",
    izvori: [
      { naziv: "Marina Betina", url: "https://www.marina-betina.com/" },
      { naziv: "Marina Betina: kontakt", url: "https://marina-betina.com/kontakt/" },
      { naziv: "Marina Betina: prihvat brodskog otpada", url: "https://marina-betina.com/prihvat-brodskog-otpada/" }
    ]
  },
  "HR-PIROVAC-MARINA": {
    telefon: "+385 99 702 8261", email: "info@marina-pirovac.hr", vhf: "9", web: "https://www.marinapirovac.com/",
    usluge: ["Voda", "Struja", "Sanitarni čvor", "Tuševi", "Wi-Fi", "Servis", "Trgovina", "Travel lift", "Parkiralište", "Pranje brodova", "Punjenje baterija", "Najam plovila", "Prihvat fekalnih voda"],
    prihvat: "Pražnjenje fekalnog spremnika je naplatna usluga prema cjeniku servisa.",
    izvori: [
      { naziv: "Marina Pirovac", url: "https://www.marinapirovac.com/hr/home.html" },
      { naziv: "Marina Pirovac: kontakt", url: "https://www.marinapirovac.com/hr/kontakt.html" },
      { naziv: "Marina Pirovac: servis i cjenik", url: "https://www.marinapirovac.com/hr/servis.html" }
    ]
  },
  "HR-SIBENIK-MANDALINA": {
    telefon: "+385 22 460 800", email: "mandalina@d-marin.com", vhf: "17", web: "https://www.d-marin.com/hr/marinas/mandalina/",
    usluge: ["Voda", "Struja", "Sanitarni čvor", "Tuševi", "Praonica rublja", "Travel lift", "Dizalica", "Servis", "Brodogradilište", "Trgovina", "Nautička trgovina", "Restoran", "Parkiralište", "Prihvat otpada", "Prihvat fekalnih voda", "Bankomat", "Mjenjačnica"],
    prihvat: "D-Marin u čestim pitanjima potvrđuje da marina ima pumpu za crni spremnik.",
    izvori: [
      { naziv: "D-Marin Mandalina", url: "https://www.d-marin.com/hr/marinas/mandalina/" },
      { naziv: "D-Marin Mandalina (s čestim pitanjima, EN)", url: "https://www.d-marin.com/en/marinas/mandalina/" },
      { naziv: "D-Marin Mandalina: pravilnik o redu u marini", url: "https://cdn.d-marin.com/site/media/uploads/marina_mandalina_regulations.pdf" }
    ]
  },
  "HR-TROGIR-BRODOTROGIR": {
    telefon: "+385 21 444 600", email: "trogir@marina21.com", vhf: "17", web: "https://marina21.com/hr/marina-trogir/",
    usluge: ["Voda", "Struja", "Sanitarni čvor", "Tuševi", "Praonica rublja", "Travel lift", "Dizalica", "Servis", "Trgovina", "Nautička trgovina", "Restoran", "Parkiralište", "Prihvat otpada", "Prihvat fekalnih voda", "Prihvat zauljenih voda", "Bankomat"],
    prihvat: "Marina danas posluje pod imenom Marina Trogir (Marina 21), uz brodogradilište Brodotrogir. Pražnjenje spremnika sivih i crnih voda je naplatna usluga prema cjeniku.",
    izvori: [
      { naziv: "Marina21: Marina Trogir", url: "https://marina21.com/hr/marina-trogir/" },
      { naziv: "Marina Trogir: cjenik 2027.", url: "https://marina21.com/wp-content/uploads/2026/11/MARINA-TROGIR-CJENIK-HRVATSKI-2027.pdf" },
      { naziv: "Brodotrogir: otvorenje Marine Trogir (2014., EN)", url: "https://brodotrogir.hr/en/index.php/lista-vijesti/item/461-marina-trogir-opened-marina-for-the-21st-century" }
    ]
  },
  "HR-SPLIT-SPINUT": {
    telefon: "+385 21 386 813", email: "psd-spinut@st.t-com.hr", vhf: null, web: "https://www.psd-spinut.hr/",
    usluge: ["Vez za članove (brodice do 15 m)", "Suhi vez", "Izvlačenje i spuštanje brodica"],
    prihvat: "Uređaj za ispumpavanje fekalnih voda najavljen je 2019. kroz projekt ECOMAP; stranica ne potvrđuje da danas radi. Lučica je namijenjena članovima.",
    izvori: [
      { naziv: "PŠD Špinut", url: "https://www.psd-spinut.hr/" },
      { naziv: "PŠD Špinut: usluge i kontakt", url: "https://www.psd-spinut.hr/usluge/" },
      { naziv: "PŠD Špinut: ekologija (ECOMAP)", url: "https://www.psd-spinut.hr/ekologija/" }
    ]
  },
  "HR-STROZANAC-DSR": {
    telefon: null, email: "lucica.strozanac@gmail.com", vhf: null, web: null,
    usluge: ["Vez za članove", "Dizalica", "Suhi vez", "Prihvat fekalnih voda"],
    prihvat: "Prema Strateškom planu Općine Podstrana, kroz projekt ECOMAP nabavljen je uređaj za ispumpavanje fekalnih voda. Usluge lučice namijenjene su članovima društva.",
    izvori: [
      { naziv: "Općina Podstrana: šport i rekreacija", url: "https://www.podstrana.hr/teme-za-mjestane/sport-i-rekreacija/" },
      { naziv: "Općina Podstrana: Strateški plan razvoja 2021. do 2025.", url: "https://www.podstrana.hr/novo/wp-content/uploads/2024/02/Strateski-plan-razvoja-opcine-Podstrana-2021.-2025.pdf" }
    ]
  },
  "HR-PODSTRANA-LAV": {
    telefon: "+385 21 500 388", email: "info@marinalav.hr", vhf: "17", web: "https://marinalav.hr/",
    usluge: ["Voda", "Struja", "Wi-Fi", "Sanitarni čvor", "Parkiralište", "Praonica rublja", "Restoran", "Mjenjačnica", "Najam automobila", "Charter", "Video nadzor"],
    prihvat: null,
    izvori: [
      { naziv: "Marina Lav", url: "https://www.marinalav.hr/" },
      { naziv: "Marina Lav: kontakt", url: "https://marinalav.hr/kontakt/" },
      { naziv: "Marina Lav: ostale usluge", url: "https://marinalav.hr/usluge/ostale-usluge/" }
    ]
  },
  "HR-VELA-LUKA-KORKYRA": {
    telefon: "+385 91 141 4700", email: "korkyra@marina21.com", vhf: "17", web: "https://marina21.com/hr/marina-korkyra/",
    usluge: ["Voda", "Struja", "Wi-Fi", "Sanitarni čvor", "Tuševi", "Prihvat otpada", "Restoran", "Suvenirnica", "Bankomat"],
    prihvat: "Pravilnik marine zabranjuje pražnjenje crnog spremnika u marini; fekalije se predaju na uređaje za prihvat u marini ili izvan nje. Vlastiti uređaj nije izričito naveden.",
    izvori: [
      { naziv: "Marina21: Marina Korkyra", url: "https://marina21.com/hr/marina-korkyra/" },
      { naziv: "Marina Korkyra: pravilnik o redu u luci", url: "https://marina21.com/wp-content/uploads/2026/03/NAJNOVIJE-Pravilnik-o-redu-u-luci-Marina-Korkyra-1.pdf" }
    ]
  },
  "HR-VELA-LUKA-PORT": {
    telefon: "+385 20 813 520", email: null, vhf: "9", web: "https://www.zluvl.hr/",
    usluge: ["Prihvat otpada", "Prihvat fekalnih voda", "Prihvat zauljenih voda", "Voda", "Struja", "Gorivo", "Komunalni vezovi", "Istezalište za brodice"],
    prihvat: "Stacionarni uređaj za ispumpavanje crnih voda u lučkom bazenu 2 (terminal). Predaju dogovorite telefonom ili e-poštom s koncesionarom Komunalne djelatnosti d.o.o., tel. +385 20 812 438.",
    izvori: [
      { naziv: "ŽLU Vela Luka: kontakti", url: "https://www.zluvl.hr/hr/kontakti" },
      { naziv: "ŽLU Vela Luka: predaja brodskog otpada", url: "https://www.zluvl.hr/hr/predaja-brodskog-otpada" },
      { naziv: "ŽLU Vela Luka: lučki bazen 2", url: "https://www.zluvl.hr/hr/lucki-bazen-2" }
    ]
  },
  "HR-KORCULA-ACI": {
    telefon: "+385 98 398 854", email: "m.korcula@aci-club.hr", vhf: "17", web: "https://aci-marinas.com/marina/aci-korcula/",
    usluge: ["Wi-Fi", "Sanitarni čvor", "Tuševi", "Praonica rublja", "Dizalica", "Restoran", "Parkiralište", "Bankomat", "Punionica za električna vozila", "Prihvat otpada", "Prihvat fekalnih voda"],
    prihvat: "ACI navodi uređaj za ispuštanje fekalnih voda; predaju tekućeg otpada treba najaviti unaprijed.",
    izvori: [
      { naziv: "ACI marina Korčula (EN)", url: "https://aci-marinas.com/marina/aci-korcula/" },
      { naziv: "ACI: Sažetak plana za prihvat otpada, Korčula (EN)", url: "https://aci-marinas.com/wp-content/uploads/2026/09/EN-sazetak-Korcula.pdf" },
      { naziv: "ACI Korčula: cjenik (2023.)", url: "https://aci-marinas.com/wp-content/uploads/2023/04/ACI_Korcula_prices.pdf" }
    ]
  },
  "HR-SLANO-ACI": {
    telefon: "+385 99 478 8059", email: "m.slano@aci-club.hr", vhf: "17", web: "https://aci-marinas.com/marina/aci-veljko-barbieri-slano/",
    usluge: ["Sanitarni čvor", "Tuševi", "Praonica rublja", "Wi-Fi", "Servis", "Nautička trgovina", "Restoran", "Bazen", "Parkiralište", "Bankomat", "Najam automobila", "Najam bicikala", "Punionica za električna vozila", "Prihvat otpada", "Prihvat fekalnih voda", "Prihvat zauljenih voda"],
    prihvat: "ACI navodi uređaje za prihvat fekalnih i zauljenih voda.",
    izvori: [
      { naziv: "ACI marina Veljko Barbieri Slano (EN)", url: "https://aci-marinas.com/marina/aci-veljko-barbieri-slano/" },
      { naziv: "ACI: Sažetak plana za prihvat otpada, Slano (EN)", url: "https://aci-marinas.com/wp-content/uploads/2026/09/EN-sazetak-Slano.pdf" },
      { naziv: "ACI Slano: cjenik (2023.)", url: "https://aci-marinas.com/wp-content/uploads/2023/04/ACI_Slano_prices.pdf" }
    ]
  },
  "HR-DUBROVNIK-ACI": {
    telefon: "+385 98 398 813", email: "m.dubrovnik@aci-club.hr", vhf: "17", web: "https://aci-marinas.com/marina/aci-dubrovnik/",
    usluge: ["Gorivo", "Sanitarni čvor", "Tuševi", "Praonica rublja", "Wi-Fi", "Travel lift", "Dizalica", "Servis", "Nautička trgovina", "Trgovina", "Restoran", "Bazen", "Parkiralište", "Bankomat", "Najam plovila", "Punionica za električna vozila", "Prihvat otpada", "Prihvat fekalnih voda", "Prihvat zauljenih voda"],
    prihvat: "ACI navodi uređaje za prihvat fekalnih i zauljenih voda.",
    izvori: [
      { naziv: "ACI marina Dubrovnik (EN)", url: "https://aci-marinas.com/marina/aci-dubrovnik/" },
      { naziv: "ACI: Sažetak plana za prihvat otpada, Dubrovnik (EN)", url: "https://aci-marinas.com/wp-content/uploads/2026/09/EN-sazetak-Dubrovnik.pdf" },
      { naziv: "ACI Dubrovnik: cjenik (2023.)", url: "https://aci-marinas.com/wp-content/uploads/2023/04/ACI_Dubrovnik_prices.pdf" }
    ]
  },
  // Luka Gruž i Luka Dubrovnik su ista luka (u aplikaciji jedan marker); kontakt je Lučka uprava Dubrovnik.
  "HR-DUBROVNIK-GRUZ-LUKA": {
    telefon: "+385 20 313 333", email: "padubrovnik@portdubrovnik.hr", vhf: "9", web: "https://www.portdubrovnik.hr/",
    usluge: ["Voda", "Gorivo", "Prihvat otpada", "Prihvat fekalnih voda", "Prihvat zauljenih voda", "Manji popravci brodova"],
    prihvat: "Odvoz fekalnih voda na području luke Gruž obavljaju koncesionari; fiksni uređaj za nautičare nije naveden. Predaju dogovorite preko Lučke uprave Dubrovnik.",
    izvori: [
      { naziv: "Lučka uprava Dubrovnik: informacije za brodove (EN)", url: "https://www.portdubrovnik.hr/index.php/en/about-port/information-for-vessel" },
      { naziv: "Lučka uprava Dubrovnik: kontakt", url: "https://www.portdubrovnik.hr/index.php/hr/kontakt" },
      { naziv: "Lučka uprava Dubrovnik: Plan rada za 2024.", url: "https://www.portdubrovnik.hr/images/Plan_2024/Godis%CC%8Cnji%20Plan%20rada%202024.%20godinu.pdf" }
    ]
  },
  "HR-DUBROVNIK-LUKA": {
    telefon: "+385 20 313 333", email: "padubrovnik@portdubrovnik.hr", vhf: "9", web: "https://www.portdubrovnik.hr/",
    usluge: ["Voda", "Gorivo", "Prihvat otpada", "Prihvat fekalnih voda", "Prihvat zauljenih voda", "Manji popravci brodova"],
    prihvat: "Odvoz fekalnih voda na području luke Gruž obavljaju koncesionari; fiksni uređaj za nautičare nije naveden. Predaju dogovorite preko Lučke uprave Dubrovnik.",
    izvori: [
      { naziv: "Lučka uprava Dubrovnik: informacije za brodove (EN)", url: "https://www.portdubrovnik.hr/index.php/en/about-port/information-for-vessel" },
      { naziv: "Lučka uprava Dubrovnik: kontakt", url: "https://www.portdubrovnik.hr/index.php/hr/kontakt" },
      { naziv: "Lučka uprava Dubrovnik: Plan rada za 2024.", url: "https://www.portdubrovnik.hr/images/Plan_2024/Godis%CC%8Cnji%20Plan%20rada%202024.%20godinu.pdf" }
    ]
  }
};
