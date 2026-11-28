/*
 * ČistoMore — Dio 4: „Plovi odgovorno“ / "Sail responsibly"
 * Sav tekst stranice na hrvatskom (hr) i engleskom (en).
 * Mijenjajte tekst ovdje; plovi-odgovorno.js ga samo prikazuje.
 *
 * Napomena za tim: činjenice su pojednostavljene za edukaciju. Izvori su na dnu ("sources").
 *  - MARPOL Prilog IV (IMO): neobrađene fekalne vode > 12 NM od najbližeg kopna, usitnjene i
 *    dezinficirane > 3 NM, brod u plovidbi >= 4 čv. Izravno obvezuje brodove >= 400 GT ili
 *    s dozvolom za > 15 osoba.
 *  - NN 72/2021 (Pravilnik o redu u lukama), čl. 56–57: primjenjuje MARPOL priloge i u
 *    poglavlju o otpadu jahte i brodice smatra brodom. Udaljenost se računa od polazne crte.
 *  - Primjeri prihvatnih stanica su stvarna mjesta s karte grupe 2: naziv, regija, adresa i
 *    telefon čitaju se iz data/stations.js, kontakti.js i regije.js prema polju "id"
 *    (isti id koristi map.html?station=<id>). Odabrana su mjesta za koja službena stranica
 *    potvrđuje prihvat fekalnih voda (docs/provjera-podataka.md).
 */
window.PO_CONTENT = {
  hr: {
    meta: { title: "ČistoMore – Plovi odgovorno" },
    ui: {
      skip: "Preskoči uvod",
      lang: "Jezik",
      brand: "ČistoMore",
      brandSub: "Plovi odgovorno",
      sections: "Sekcije stranice",
      toLight: "Uključi svijetli način",
      toDark: "Uključi tamni način"
    },
    nav: {
      main: "Glavna navigacija",
      home: "Početna",
      map: "Karta",
      report: "Nova prijava",
      log: "Dnevnik",
      profile: "Profil",
      plovi: "Plovi odgovorno",
      ploviShort: "Plovi",
      obrada: "Obrada prijava",
      impact: "Utjecaj",
      guide: "Vodič",
      pumpout: "Prihvat",
      howto: "U slikama",
      know: "Činjenice",
      quiz: "Kviz"
    },
    intro: {
      title: "Plovi <br>odgovorno",
      tagline: "More pamti.<br>Ono što ispustiš, ostaje.",
      scroll: "Skrolaj i zaroni",
      corner: "Vodič za nautičare o fekalnim i otpadnim vodama s plovila",
      lines: [
        "Jedno ispuštanje izgleda bezazleno.",
        "Ali uvala nije otvoreno more.",
        "Bakterije i hranjive tvari ostaju tamo gdje se kupamo, ronimo i uzgajamo školjke.",
        "Planiraj pražnjenje kao što planiraš gorivo."
      ],
      factsTitle: "Zapamti tri broja",
      facts: [
        { n: "12", u: "NM", t: "Neobrađene fekalne vode tek dalje od 12 NM od najbližeg kopna" },
        { n: "4", u: "čv", t: "Najmanja brzina dok se spremnik prazni u more. Nikad na sidru." },
        { n: "0", u: "L", t: "Neobrađenih fekalnih voda smiješ ispustiti u luci, marini ili sidrištu" }
      ]
    },
    impact: {
      eyebrow: "Zašto je važno",
      title: "Malo ispuštanje, puna uvala",
      lead: "Jedan brod ispusti malo. No ljeti se u istoj zatvorenoj uvali sidre deseci brodova, a more se tamo sporo izmjenjuje.",
      bay: {
        aria: "Ilustracija uvale s brodovima",
        label: "Brodova u uvali",
        mode: "Što rade sa spremnikom?",
        dump: "Ispuštaju u uvalu",
        pump: "Prazne na stanici",
        bacteria: "Fekalne bakterije",
        nutrients: "Hranjive tvari",
        clarity: "Prozirnost mora",
        levels: ["Nisko", "Umjereno", "Visoko", "Kritično"],
        clarityLevels: ["Odlična", "Dobra", "Smanjena", "Loša"],
        verdictDump: "Kupanje u ovoj uvali moglo bi postati rizično.",
        verdictDumpLow: "Već i nekoliko brodova ostavlja trag u zatvorenoj uvali.",
        verdictPump: "More ostaje čisto, bez obzira na broj brodova.",
        note: "Ilustracija za razumijevanje, ne mjerenje."
      },
      cards: [
        { icon: "bacteria", t: "Bakterije u moru za kupanje", d: "Fekalne vode nose E. coli i crijevne enterokoke. Po istim se pokazateljima ocjenjuje kakvoća mora za kupanje, a loši rezultati vode do upozorenja ili zabrane kupanja." },
        { icon: "algae", t: "Alge i manjak kisika", d: "Dušik i fosfor potiču cvjetanje algi. Kad alge odumru, njihova razgradnja troši kisik u zatvorenim uvalama." },
        { icon: "shell", t: "Školjke filtriraju sve", d: "Dagnje i kamenice filtriraju velike količine mora i nakupljaju bakterije i viruse. Zato se uzgajališta zatvaraju kad se more onečisti." },
        { icon: "grass", t: "Livade posidonije", d: "Mutnije more propušta manje svjetla. Posidonija, „pluća Mediterana” i dom mnogim ribama, raste sporo i teško se oporavlja. Zaštićena je, zato ne sidri na njoj." }
      ]
    },
    guide: {
      eyebrow: "Kratki vodič",
      title: "Što trebaš znati o otpadnim vodama na brodu",
      tabs: [
        {
          t: "Crne vode",
          h: "Crne vode su fekalne vode",
          p: "Sve što prođe kroz brodski WC. Sadrže fekalne bakterije, viruse i hranjive tvari i nikad ne smiju završiti u marini ili uvali.",
          pts: [
            "Skupljaju se u spremniku za fekalne vode",
            "Prazne se na prihvatnoj stanici (pump-out)",
            "Vlažne maramice i ulošci ne idu u WC jer začepljuju sustav"
          ]
        },
        {
          t: "Sive vode",
          h: "Sive vode su voda iz tuša, sudopera i umivaonika",
          p: "Manje su opasne od crnih, ali nose deterdžente, masnoće i ostatke hrane.",
          pts: [
            "Koristi biorazgradive deterdžente i šampone",
            "Suđe peri na kopnu kad god možeš",
            "Ako brod ima spremnik za sive vode, prazni ga na stanici"
          ]
        },
        {
          t: "Spremnik",
          h: "Spremnik za fekalne vode",
          p: "Zatvoreni spremnik čuva fekalne vode dok ne stigneš do prihvatne stanice. Što ga bolje poznaješ, to lakše planiraš plovidbu.",
          pts: [
            "Znaj zapremninu spremnika i planiraj pražnjenje prije nego što se napuni",
            "Prati pokazivač razine",
            "Y-ventil drži prema spremniku, a ventil za ispust u more zatvoren i osiguran"
          ]
        },
        {
          t: "Pravila",
          h: "Što kažu propisi",
          p: "MARPOL (Prilog IV) izravno obvezuje veće brodove, a hrvatski Pravilnik (NN 72/2021) ista pravila primjenjuje i na jahte i brodice. Luke moraju osigurati prihvat otpada s brodova.",
          pts: [
            "Neobrađene fekalne vode tek više od 12 NM od najbližeg kopna (računa se od polazne crte, uključujući otoke), u plovidbi od barem 4 čv",
            "Usitnjene i dezinficirane fekalne vode (odobreni uređaj) tek više od 3 NM od najbližeg kopna, također u plovidbi od barem 4 čv",
            "U lukama, marinama i sidrištima prazni se samo na prihvatnoj stanici"
          ]
        }
      ],
      checker: {
        title: "Smijem li ispustiti?",
        sub: "Odaberi gdje si i kakav sustav imaš.",
        whereLabel: "Gdje si?",
        sysLabel: "Kakav sustav imaš?",
        where: ["Luka, marina ili sidrište", "Do 3 NM od kopna", "3 do 12 NM", "Više od 12 NM"],
        sys: ["Samo spremnik (neobrađeno)", "Uređaj za usitnjavanje i dezinfekciju", "Odobreni uređaj za obradu"],
        verdict: { yes: "Dopušteno", cond: "Uvjetno", no: "Nije dopušteno" },
        results: {
          port: [
            "U lukama, marinama i sidrištima spremnik se prazni samo na prihvatnoj stanici.",
            "Ni usitnjene i dezinficirane fekalne vode ne smiju u more u luci, marini ili sidrištu. Koristi prihvatnu stanicu.",
            "Ispust iz odobrenog uređaja za obradu MARPOL načelno dopušta, ali ga mnoge luke i marine zabranjuju. Provjeri pravila marine. Najsigurnije je prihvatna stanica."
          ],
          near: [
            "Preblizu si obale. Neobrađene fekalne vode smiju se ispuštati tek više od 12 NM od najbližeg kopna.",
            "Preblizu si obale. Usitnjene i dezinficirane fekalne vode smiju se ispuštati tek više od 3 NM od najbližeg kopna.",
            "MARPOL to dopušta ako je uređaj odobren i ispravan te ako ispust ne ostavlja vidljive krute tvari i ne mijenja boju mora. Provjeri i lokalna pravila."
          ],
          mid: [
            "Neobrađene fekalne vode smiju se ispuštati tek više od 12 NM od najbližeg kopna.",
            "Dopušteno ako je uređaj odobren i ploviš barem 4 čvora.",
            "Dopušteno uz odobren i ispravan uređaj za obradu."
          ],
          far: [
            "Dopušteno ako ploviš barem 4 čvora i spremnik prazniš postupno, a ne odjednom.",
            "Dopušteno ako je uređaj odobren i ploviš barem 4 čvora.",
            "Dopušteno uz odobren i ispravan uređaj za obradu."
          ]
        },
        note: "Pojednostavljeno. MARPOL Prilog IV izravno obvezuje brodove na međunarodnim putovanjima od 400 GT ili s dozvolom za više od 15 osoba, a hrvatski Pravilnik (NN 72/2021, čl. 56–57) ista pravila primjenjuje i na jahte i brodice. Udaljenost se računa od polazne crte, uključujući otoke. Kad nisi siguran, koristi prihvatnu stanicu."
      }
    },
    pump: {
      eyebrow: "Prihvatne stanice",
      title: "Kako isprazniti spremnik na prihvatnoj stanici",
      lead: "Cijeli postupak traje nekoliko minuta. Ovo je redoslijed.",
      steps: [
        { t: "Pronađi stanicu", d: "Na karti prihvatnih stanica pronađi najbližu stanicu i provjeri kontakt te kada uređaj radi." },
        { t: "Pristani i pripremi se", d: "Priveži brod uz stanicu, ugasi motor i pripremi ključ za palubni čep." },
        { t: "Otvori čep s oznakom WASTE", d: "Nije FUEL ni WATER. Zamjena čepova česta je i skupa pogreška." },
        { t: "Spoji crijevo i prazni", d: "Čvrsto prisloni nastavak, uključi pumpu i prati kako se spremnik prazni." },
        { t: "Isperi spremnik", d: "Pusti malo čiste vode kroz WC i isprazni ponovno, da ne ostanu talog i neugodni mirisi." },
        { t: "Zatvori i zabilježi", d: "Zatvori čep, isperi nastavak, vrati crijevo i zabilježi pražnjenje u brodski dnevnik." }
      ],
      caps: {
        title: "Koji čep?",
        sub: "Dodirni čep na koji se spaja crijevo prihvatne stanice.",
        labels: ["FUEL", "WATER", "WASTE"],
        hints: ["gorivo", "pitka voda", "otpadne vode"],
        feedback: [
          "Ne! FUEL je spremnik goriva. Pumpa bi isisala gorivo, a to je opasno za more i za stanicu.",
          "Ne! WATER je pitka voda. Prljavi nastavak onečistio bi spremnik pitke vode.",
          "Točno! WASTE je priključak spremnika za fekalne vode."
        ]
      },
      stations: {
        title: "Primjeri stanica",
        demo: "Četiri mjesta s karte prihvatnih stanica za koja službena stranica potvrđuje prihvat fekalnih voda. Prije dolaska provjerite kod operatora radi li uređaj.",
        items: [
          { id: "HR-ROVINJ-ACI" },
          { id: "HR-PUNAT-MARINA" },
          { id: "HR-SUKOSAN-DALMACIJA" },
          { id: "HR-DUBROVNIK-ACI" }
        ],
        open: "Otvori kartu stanica",
        onMap: "Prikaži na karti"
      }
    },
    howto: {
      eyebrow: "Kako to izgleda",
      title: "Pražnjenje spremnika korak po korak",
      lead: "Kako je sustav spojen na brodu i što točno radiš na prihvatnoj stanici, u slikama.",
      steps: [
        { t: "Kako je spojen sustav na brodu", d: "WC vodi preko Y-ventila u spremnik. Iz spremnika cijev ide do palubnog čepa WASTE, gdje ga prazni prihvatna stanica. Ventil prema moru drži zatvorenim." },
        { t: "Prihvatna stanica u marini", d: "Na gatu ili uz benzinsku postaju stoji pumpa s crijevom i oznakom pump-out. Pristani uz nju, ugasi motor i priveži brod." },
        { t: "Nađi pravi čep na palubi", d: "Obično su na palubi tri čepa: FUEL (gorivo), WATER (pitka voda) i WASTE (otpadne vode). Crijevo stanice spaja se samo na WASTE." },
        { t: "Spoji crijevo i isprazni", d: "Otvori čep ključem, čvrsto prisloni nastavak i uključi pumpu. Kad kroz prozirni dio crijeva više ništa ne teče, spremnik je prazan." },
        { t: "Isperi spremnik", d: "Pusti malo čiste vode kroz WC i isprazni još jednom. Tako ne ostaju talog i neugodni miris." },
        { t: "Zatvori i zabilježi", d: "Zatvori čep, isperi nastavak i vrati crijevo. Potvrdu o isporuci otpada čuvaj na brodu dvije godine, a pražnjenje upiši u brodski dnevnik." }
      ],
      photosTitle: "Kako to izgleda u marini",
      photosNote: "Primjeri iz stvarnih marina. Izgled stanice i čepova razlikuje se od marine do marine.",
      photos: [
        { src: "img/pumpout-neumagen.jpg", c: "Prihvatna stanica uz riječni gat (Njemačka): pumpa i namotano crijevo", alt: "Plava prihvatna stanica za fekalne vode s namotanim crijevom uz rijeku", author: "Gmbo 2013", license: "CC0 1.0", lu: "https://creativecommons.org/publicdomain/zero/1.0/deed.hr", page: "https://commons.wikimedia.org/wiki/File:F%C3%A4kalienabsaugung_Neumagen-Dhron.JPG" },
        { src: "img/pumpout-san-diego.jpg", c: "Stanica na gatu marine s uputama i nastavkom za palubni čep (SAD)", alt: "Inox prihvatna stanica na drvenom gatu, s naljepnicom s uputama i crijevom", author: "Mds08011", license: "CC BY 4.0", lu: "https://creativecommons.org/licenses/by/4.0/deed.hr", page: "https://commons.wikimedia.org/wiki/File:Boat_pump_out_location.jpg" },
        { src: "img/pumpout-kuca-brod-1970.jpg", c: "Crijevo stanice spojeno na palubni čep tijekom pražnjenja spremnika (SAD, 1970-e)", alt: "Čovjek na palubi kuće-broda drži crijevo spojeno na palubni čep dok se prazni spremnik", author: "Bill Kuykendall / U.S. National Archives", license: "javno vlasništvo", lu: "https://commons.wikimedia.org/wiki/Help:Public_domain", page: "https://commons.wikimedia.org/wiki/File:A_MEMBER_OF_THE_MISSOURI_WATER_PATROL_WATCHES_AS_HOUSEBOAT%27S_TOILET_HOLDING_TANK_IS_PUMPED_OUT_AT_LINK%27S_LANDING_IN..._-_NARA_-_551228.jpg" },
        { src: "img/pumpout-enkhuizen.jpg", c: "Moderna samoposlužna prihvatna stanica s piktogramom (Nizozemska)", alt: "Siva samoposlužna prihvatna stanica s piktogramom pražnjenja spremnika, uz vezane brodove", author: "S.J. de Waard", license: "CC BY-SA", lu: "https://creativecommons.org/licenses/by-sa/3.0/deed.hr", page: "https://commons.wikimedia.org/wiki/File:Pump-out_station_in_Enkhuizen_(01).JPG" }
      ]
    },
    know: {
      eyebrow: "Jesi li znao?",
      title: "Brojke i pravila koja se isplati znati",
      lead: "Kratke činjenice iz propisa, mjerenja kakvoće mora i nautičke prakse. Uz svaku je izvor.",
      src: "Izvor",
      items: [
        { n: "1 %", t: "Prihvat otpada već si platio", d: "Brod s ugovorom o vezu u marini plaća neizravnu naknadu za otpad od 1 % cijene veza, bez obzira predaje li otpad. Zato iskoristi prihvatnu stanicu.", s: "NN 72/2021, čl. 77", u: "https://narodne-novine.nn.hr/clanci/sluzbeni/full/2021_06_72_1358.html" },
        { n: "2 god.", t: "Čuvaj potvrdu o predaji otpada", d: "Nakon predaje otpada dobivaš „Potvrdu o isporuci otpada”. Čuva se na brodu najmanje dvije godine.", s: "NN 72/2021, čl. 66", u: "https://narodne-novine.nn.hr/clanci/sluzbeni/full/2021_06_72_1358.html" },
        { n: "100 / 250", t: "Granice za izvrsno more", d: "More za kupanje je izvrsno ako ima najviše 100 crijevnih enterokoka i 250 E. coli na 100 ml. Upravo te bakterije donose fekalne vode.", s: "Direktiva 2006/7/EZ, Prilog I", u: "https://www.legislation.gov.uk/eudr/2006/7/annexes/adopted" },
        { n: "15 dana", t: "More se redovito ispituje", d: "Od sredine svibnja do početka listopada zavodi za javno zdravstvo uzorkuju more na plažama, a rezultati se objavljuju svakih 15 dana. Plava oznaka znači izvrsno, crvena nezadovoljavajuće.", s: "gov.hr: Kakvoća mora", u: "https://www.gov.hr/hr/kakvoca-mora/1580" },
        { n: "Prijavi", t: "Prijava onečišćenja je obveza", d: "Zapovjednik koji onečisti more ili primijeti onečišćenje mora to bez odgađanja prijaviti. U aplikaciji to radiš na stranici Nova prijava.", s: "Pomorski zakonik, čl. 49.f", u: "https://www.zakon.hr/z/310/Pomorski-zakonik" },
        { n: "90 bova", t: "Kornati čuvaju posidoniju", d: "NP Kornati od 2024. postavlja eko-bove umjesto sidrenja: prvo 90 bova u 8 uvala, a planira ih više od 200. Sidro trga livade posidonije.", s: "Yacht.de, 2025.", u: "https://www.yacht.de/en/travel-and-charter/croatia/croatia-kornati-national-park-murings-for-marine-conservation/" },
        { n: "Bez formaldehida", t: "Biraj sredstvo za spremnik", d: "Formaldehid iz nekih sredstava za spremnik sumnja se da je kancerogen. Enzimska ili nitratna sredstva i dobro prozračivanje spremnika uklanjaju miris bez njega.", s: "Practical Sailor", u: "https://www.practical-sailor.com/systems-propulsion/solutions-for-a-stinky-holding-tank/" },
        { n: "Crijevo", t: "Smrdi, a spremnik je u redu?", d: "Plinovi poput sumporovodika prolaze kroz stijenke mekih crijeva. Prozirna meka PVC crijeva ne smiju se koristiti za fekalne vode.", s: "Practical Sailor", u: "https://www.practical-sailor.com/systems-propulsion/marine-sanitation-hose-test" },
        { n: "12 NM", t: "Neke zemlje su strože", d: "Švedska od 2015. zabranjuje ispuštanje fekalnih voda sa svih rekreativnih brodova unutar 12 NM, a Nizozemska od 2009. Međunarodna obveza spremnika za male brodove još ne postoji.", s: "RYA: Holding tanks", u: "https://www.rya.org.uk/boating-abroad/holding-tanks/" }
      ]
    },
    quiz: {
      eyebrow: "Kviz",
      title: "Koliko znaš o odgovornoj plovidbi?",
      lead: "Deset nasumičnih pitanja iz baze od sedamnaest, nakon svakog kratko objašnjenje. Uz barem 8 točnih dobivaš certifikat.",
      size: 10,
      progress: "Pitanje {i} od {n}",
      next: "Sljedeće pitanje",
      finish: "Pogledaj rezultat",
      again: "Ponovi kviz",
      best: "Najbolji rezultat: {b} od {n}",
      correct: "Točno.",
      wrong: "Netočno.",
      srCorrect: "točan odgovor",
      srYours: "tvoj odgovor",
      result: "{s} od {n} točnih",
      tiers: [
        { min: 10, t: "Kapetan za primjer! Znaš sve što treba." },
        { min: 7, t: "Dobar rezultat. Pročitaj vodič još jednom i znat ćeš sve." },
        { min: 0, t: "More ti daje još jednu priliku. Prođi vodič i pokušaj ponovno." }
      ],
      cert: {
        min: 8,
        earned: "Certifikat „Odgovorni nautičar” je tvoj.",
        needMore: "Za certifikat trebaš barem {m} od {n} točnih.",
        nameLabel: "Ime na certifikatu",
        namePh: "Ana Horvat",
        nameErr: "Upiši ime koje će pisati na certifikatu.",
        create: "Izradi certifikat",
        busy: "Izrađujem certifikat…",
        download: "Preuzmi PNG",
        share: "Podijeli",
        shareText: "Moj certifikat „Odgovorni nautičar” iz aplikacije ČistoMore.",
        imgAlt: "Certifikat Odgovorni nautičar za {name}, {s} od {n} točnih, {date}",
        heading: "Odgovorni nautičar",
        kicker: "Certifikat",
        sub: "zna kako pravilno zbrinuti fekalne i otpadne vode s plovila",
        scoreLabel: "Kviz",
        dateLabel: "Datum",
        issuer: "ČistoMore · Plovi odgovorno",
        pledge: "Prazni na stanici, ne u uvali.",
        file: "odgovorni-nauticar.png",
        error: "Certifikat se nije uspio izraditi. Pokušaj ponovno."
      },
      questions: [
        { q: "Usidren si u uvali i spremnik je skoro pun. Što radiš?", a: ["Ispraznim ga noću, nitko ne vidi", "Doplovim do prihvatne stanice, a dotad štedim WC", "Ispraznim ga malo po malo"], c: 1, e: "Uvale i sidrišta su zatvorena područja i onečišćenje tamo ostaje. Spremnik se prazni na prihvatnoj stanici." },
        { q: "Što su crne vode?", a: ["Voda iz tuša i sudopera", "Otpadne vode iz brodskog WC-a", "Kaljužne vode iz strojarnice"], c: 1, e: "Crne vode su fekalne vode iz WC-a. Voda iz tuša i sudopera su sive vode, a kaljuža s uljem posebna je vrsta otpada." },
        { q: "Na kojoj udaljenosti od najbližeg kopna MARPOL dopušta ispuštanje neobrađenih fekalnih voda?", a: ["Više od 1 NM", "Više od 3 NM", "Više od 12 NM"], c: 2, e: "Neobrađene fekalne vode smiju se ispuštati tek više od 12 NM od najbližeg kopna, i to dok brod plovi. U Hrvatskoj se udaljenost računa od polazne crte, uključujući otoke." },
        { q: "Kojom brzinom brod mora ploviti dok prazni spremnik fekalnih voda u more, tamo gdje je to dopušteno?", a: ["Barem 4 čvora", "Brzina nije važna", "Brod mora biti usidren"], c: 0, e: "Barem 4 čvora, kako bi se ispust razrijedio u što većoj količini mora. Na sidru nikad." },
        { q: "Na palubi su tri čepa. Na koji se spaja crijevo prihvatne stanice?", a: ["WATER", "WASTE", "FUEL"], c: 1, e: "WASTE je priključak spremnika fekalnih voda. Zamjena s WATER ili FUEL česta je i skupa pogreška." },
        { q: "Zašto su uzgajališta školjaka posebno osjetljiva na fekalne vode?", a: ["Školjke filtriraju more i nakupljaju bakterije i viruse", "Školjke ne podnose slatku vodu", "Fekalne vode otapaju ljušture"], c: 0, e: "Dagnje i kamenice filtriraju velike količine mora. Ako je more onečišćeno, postaju opasne za jelo." },
        { q: "Što hranjive tvari iz fekalnih voda uzrokuju u zatvorenim uvalama?", a: ["Bistrije more", "Cvjetanje algi i manjak kisika", "Više ribe"], c: 1, e: "Dušik i fosfor „gnoje” more. Alge se namnože, a njihova razgradnja troši kisik potreban ribama i drugim organizmima." },
        { q: "Vidiš brod koji ispušta fekalne vode u uvali. Što je najkorisnije?", a: ["Viknem na posadu i odem", "Fotografiram ga, zabilježim lokaciju i vrijeme te ga prijavim", "Ništa, to nije moj problem"], c: 1, e: "Prijava s fotografijom, lokacijom i vremenom pomaže nadležnim službama da reagiraju. U aplikaciji je to stranica Nova prijava." },
        { q: "Koja je EU granica za crijevne enterokoke da bi obalno more za kupanje bilo „izvrsno”?", a: ["100 na 100 ml", "500 na 100 ml", "1000 na 100 ml"], c: 0, e: "Direktiva 2006/7/EZ za izvrsno obalno more traži najviše 100 crijevnih enterokoka na 100 ml. Fekalne vode s brodova povećavaju upravo taj pokazatelj." },
        { q: "Na hrvatskoj karti kakvoće mora za kupanje, što znači plava oznaka?", a: ["Izvrsna kakvoća", "Kupanje zabranjeno", "Još nije ispitano"], c: 0, e: "Plava je izvrsno, zelena dobro, žuta zadovoljavajuće, a crvena nezadovoljavajuće." },
        { q: "Kada se u Hrvatskoj ispituje kakvoća mora za kupanje?", a: ["Cijele godine", "Samo u srpnju i kolovozu", "Od sredine svibnja do početka listopada"], c: 2, e: "Zavodi za javno zdravstvo uzorkuju more tijekom sezone kupanja, a novi rezultati objavljuju se svakih 15 dana." },
        { q: "Imaš ugovor o vezu u hrvatskoj marini. Koliko plaćaš prihvat otpada?", a: ["Ništa ako ne predaš otpad", "1 % cijene veza, predao otpad ili ne", "Po litri ispražnjenog spremnika"], c: 1, e: "Pravilnik NN 72/2021 (čl. 77) propisuje neizravnu naknadu od 1 % bez obzira na stvarnu predaju. Već si platio, zato koristi prihvatnu stanicu." },
        { q: "Koliko dugo na brodu treba čuvati potvrdu o isporuci otpada?", a: ["24 sata", "Do kraja sezone", "Najmanje dvije godine"], c: 2, e: "Pravilnik NN 72/2021 (čl. 66) traži da se potvrda čuva na brodu najmanje dvije godine." },
        { q: "Zašto izbjegavati sredstva za spremnik s formaldehidom?", a: ["Spremnik se brže puni", "Sumnja se da je kancerogen i ubija korisne bakterije", "Zabranjena su samo na jedrilicama"], c: 1, e: "Formaldehid je na popisu mogućih kancerogena. Enzimska ili nitratna sredstva i dobro prozračivanje spremnika rješavaju miris bez njega." },
        { q: "WC smrdi iako je spremnik ispražnjen. Što je čest uzrok?", a: ["Plinovi prolaze kroz stijenke crijeva", "Previše slatke vode u spremniku", "Pun spremnik goriva"], c: 0, e: "Sumporovodik i drugi plinovi prolaze kroz stijenke crijeva, brže kroz meke materijale. Prozirno meko PVC crijevo nije za fekalne vode." },
        { q: "Zašto NP Kornati postavlja eko-bove u uvale za sidrenje?", a: ["Da naplati veće naknade", "Da zaštiti livade posidonije od sidara", "Da označi ribolovne zone"], c: 1, e: "Bove za brodove do 16 m trebaju zamijeniti sidrenje u 19 uvala i sačuvati livade posidonije." },
        { q: "U kojem moru MARPOL putničkim brodovima zabranjuje ispuštanje neobrađenih fekalnih voda kao posebnom području?", a: ["Jadransko more", "Baltičko more", "Crno more"], c: 1, e: "Baltik je posebno područje, a zabrana je potpuno stupila na snagu između 2019. i 2023. Sredozemlje i Jadran zasad nisu takvo područje za fekalne vode." }
      ]
    },
    final: {
      title: "Prazni na stanici, ne u uvali.",
      lead: "Svaki spremnik ispražnjen na prihvatnoj stanici znači jednu čistu uvalu više.",
      map: "Otvori kartu stanica",
      report: "Prijavi onečišćenje",
      log: "Moj dnevnik"
    },
    sources: {
      title: "Izvori",
      note: "Sadržaj je edukativan i pojednostavljen. Službena pravila provjeri kod lučke kapetanije ili uprave marine.",
      items: [
        { t: "IMO: Prevention of Pollution by Sewage from Ships (MARPOL, Prilog IV)", u: "https://www.imo.org/en/OurWork/Environment/Pages/Sewage-Default.aspx" },
        { t: "Narodne novine 72/2021: Pravilnik o uvjetima i načinu održavanja reda u lukama i na ostalim dijelovima unutarnjih morskih voda i teritorijalnog mora RH", u: "https://narodne-novine.nn.hr/clanci/sluzbeni/2021_06_72_1358.html" },
        { t: "MMPI: Prevencija onečišćenja fekalijama s jahti u lukama nautičkog turizma, pravni okvir", u: "https://mmpi.gov.hr/UserDocsImages/arhiva/PREVENCIJA%20ONE%C4%8CI%C5%A0%C4%86ENJA%20FEKALIJAMA%20S%20JAHTI%20U%20LUKAMA%20NAUTI%C4%8CKOG%20TURIZMA%20%E2%80%93%20PRAVNI%20OKVIR.pdf" },
        { t: "Pomorski zakonik (pročišćeni tekst), čl. 49.a–49.f", u: "https://www.zakon.hr/z/310/Pomorski-zakonik" },
        { t: "Direktiva 2006/7/EZ o upravljanju kakvoćom vode za kupanje, prilozi", u: "https://www.legislation.gov.uk/eudr/2006/7/annexes/adopted" },
        { t: "gov.hr: Kakvoća mora za kupanje", u: "https://www.gov.hr/hr/kakvoca-mora/1580" },
        { t: "RYA: Holding tanks (pravila u drugim zemljama)", u: "https://www.rya.org.uk/boating-abroad/holding-tanks/" },
        { t: "Practical Sailor: sredstva za spremnik i test crijeva", u: "https://www.practical-sailor.com/systems-propulsion/solutions-for-a-stinky-holding-tank/" },
        { t: "Yacht.de: eko-bove u NP Kornati (2025.)", u: "https://www.yacht.de/en/travel-and-charter/croatia/croatia-kornati-national-park-murings-for-marine-conservation/" }
      ]
    },
    footer: "ČistoMore · Hackathon 2026 · Grupa 4: Plovi odgovorno"
  },

  en: {
    meta: { title: "ČistoMore – Sail responsibly" },
    ui: {
      skip: "Skip intro",
      lang: "Language",
      brand: "ČistoMore",
      brandSub: "Sail responsibly",
      sections: "Page sections",
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode"
    },
    nav: {
      main: "Main navigation",
      home: "Home",
      map: "Map",
      report: "New report",
      log: "Logbook",
      profile: "Profile",
      plovi: "Sail responsibly",
      ploviShort: "Sail",
      obrada: "Report handling",
      impact: "Impact",
      guide: "Guide",
      pumpout: "Pump-out",
      howto: "In pictures",
      know: "Facts",
      quiz: "Quiz"
    },
    intro: {
      title: "Sail <br>responsibly",
      tagline: "The sea remembers.<br>What you dump here stays here.",
      scroll: "Scroll to dive in",
      corner: "A guide for boaters on sewage and wastewater from vessels",
      lines: [
        "One discharge looks harmless.",
        "But a bay is not the open sea.",
        "Bacteria and nutrients stay where we swim, dive and farm shellfish.",
        "Plan your pump-out the way you plan your fuel."
      ],
      factsTitle: "Remember three numbers",
      facts: [
        { n: "12", u: "NM", t: "Untreated sewage only beyond 12 NM from the nearest land" },
        { n: "4", u: "kn", t: "Minimum speed when emptying a holding tank at sea. Never at anchor." },
        { n: "0", u: "L", t: "Untreated sewage you may release in a port, marina or anchorage" }
      ]
    },
    impact: {
      eyebrow: "Why it matters",
      title: "A small discharge, a crowded bay",
      lead: "One boat releases a little. But in summer dozens of boats anchor in the same enclosed bay, and the water there is slow to renew.",
      bay: {
        aria: "Illustration of a bay with boats",
        label: "Boats in the bay",
        mode: "What do they do with the tank?",
        dump: "Discharge into the bay",
        pump: "Empty at a station",
        bacteria: "Faecal bacteria",
        nutrients: "Nutrients",
        clarity: "Water clarity",
        levels: ["Low", "Moderate", "High", "Critical"],
        clarityLevels: ["Excellent", "Good", "Reduced", "Poor"],
        verdictDump: "Swimming in this bay could become risky.",
        verdictDumpLow: "Even a few boats leave a mark in an enclosed bay.",
        verdictPump: "The water stays clean, however many boats there are.",
        note: "An illustration to explain the idea, not a measurement."
      },
      cards: [
        { icon: "bacteria", t: "Bacteria in bathing water", d: "Sewage carries E. coli and intestinal enterococci. Bathing water quality is graded on these same indicators, and poor results lead to warnings or swimming bans." },
        { icon: "algae", t: "Algae and low oxygen", d: "Nitrogen and phosphorus feed algal blooms. When the algae die, their decay uses up oxygen in enclosed bays." },
        { icon: "shell", t: "Shellfish filter everything", d: "Mussels and oysters filter large volumes of seawater and accumulate bacteria and viruses. That's why shellfish farms close when the water is polluted." },
        { icon: "grass", t: "Posidonia meadows", d: "Murkier water lets less light through. Posidonia, the “lungs of the Mediterranean” and home to many fish, grows slowly and recovers slowly. It's protected, so don't anchor on it." }
      ]
    },
    guide: {
      eyebrow: "Quick guide",
      title: "What to know about wastewater on board",
      tabs: [
        {
          t: "Blackwater",
          h: "Blackwater is sewage",
          p: "Everything that goes through the marine toilet. It carries faecal bacteria, viruses and nutrients and must never end up in a marina or bay.",
          pts: [
            "It collects in the holding tank",
            "It's emptied at a pump-out station",
            "Wet wipes and sanitary pads don't go in the toilet: they clog the system"
          ]
        },
        {
          t: "Greywater",
          h: "Greywater comes from the shower, galley sink and washbasin",
          p: "It's less dangerous than blackwater, but it carries detergents, grease and food scraps.",
          pts: [
            "Use biodegradable detergents and shampoos",
            "Wash dishes ashore whenever you can",
            "If the boat has a greywater tank, empty it at a station"
          ]
        },
        {
          t: "Holding tank",
          h: "The holding tank",
          p: "A sealed tank keeps sewage on board until you reach a pump-out station. The better you know it, the easier it is to plan your trip.",
          pts: [
            "Know the tank's capacity and plan to empty it before it fills up",
            "Watch the level gauge",
            "Set the Y-valve to the holding tank and keep the overboard seacock closed and secured"
          ]
        },
        {
          t: "Rules",
          h: "What the rules say",
          p: "MARPOL (Annex IV) binds larger ships directly, and the Croatian ordinance (Official Gazette 72/2021) applies the same rules to yachts and small boats. Ports must provide reception facilities for ship waste.",
          pts: [
            "Untreated sewage only beyond 12 NM from the nearest land (measured from the baseline, islands included), under way at 4 kn or more",
            "Comminuted and disinfected sewage (approved system) only beyond 3 NM from the nearest land, also under way at 4 kn or more",
            "In ports, marinas and anchorages, empty only at a pump-out station"
          ]
        }
      ],
      checker: {
        title: "Can I discharge here?",
        sub: "Choose where you are and what system you have.",
        whereLabel: "Where are you?",
        sysLabel: "What system do you have?",
        where: ["Port, marina or anchorage", "Within 3 NM of land", "3 to 12 NM", "Beyond 12 NM"],
        sys: ["Holding tank only (untreated)", "Comminuting and disinfecting system", "Approved sewage treatment plant"],
        verdict: { yes: "Allowed", cond: "Conditional", no: "Not allowed" },
        results: {
          port: [
            "In ports, marinas and anchorages the tank is emptied only at a pump-out station.",
            "Comminuted and disinfected sewage can't go overboard in a port, marina or anchorage either. Use a pump-out station.",
            "MARPOL generally allows effluent from an approved treatment plant, but many ports and marinas ban it. Check the marina's rules. A pump-out station is the safest choice."
          ],
          near: [
            "You're too close to shore. Untreated sewage may only be discharged beyond 12 NM from the nearest land.",
            "You're too close to shore. Comminuted and disinfected sewage may only be discharged beyond 3 NM from the nearest land.",
            "MARPOL allows it if the plant is approved and working, and the effluent leaves no visible solids or discolouration. Check local rules too."
          ],
          mid: [
            "Untreated sewage may only be discharged beyond 12 NM from the nearest land.",
            "Allowed if the system is approved and you're under way at 4 kn or more.",
            "Allowed with an approved, working treatment plant."
          ],
          far: [
            "Allowed if you're under way at 4 kn or more and empty the tank gradually, not all at once.",
            "Allowed if the system is approved and you're under way at 4 kn or more.",
            "Allowed with an approved, working treatment plant."
          ]
        },
        note: "Simplified. MARPOL Annex IV directly binds ships on international voyages that are 400 GT or more or certified to carry more than 15 persons, and the Croatian ordinance (Official Gazette 72/2021, art. 56–57) applies the same rules to yachts and small boats. Distances are measured from the baseline, islands included. When in doubt, use a pump-out station."
      }
    },
    pump: {
      eyebrow: "Pump-out stations",
      title: "How to empty your tank at a pump-out station",
      lead: "The whole job takes a few minutes. Here's the order.",
      steps: [
        { t: "Find a station", d: "Use the pump-out station map to find the nearest one and check its contact details and when the device is available." },
        { t: "Moor and get ready", d: "Tie up alongside the station, switch off the engine and have the deck-fill key ready." },
        { t: "Open the WASTE cap", d: "Not FUEL and not WATER. Mixing up the caps is a common and costly mistake." },
        { t: "Connect and pump", d: "Press the nozzle on firmly, start the pump and watch the tank empty." },
        { t: "Rinse the tank", d: "Flush some clean water through the toilet and pump out again so no sludge or smell is left." },
        { t: "Close up and log it", d: "Close the cap, rinse the nozzle, put the hose back and record the pump-out in the ship's log." }
      ],
      caps: {
        title: "Which cap?",
        sub: "Tap the cap the pump-out hose connects to.",
        labels: ["FUEL", "WATER", "WASTE"],
        hints: ["fuel", "drinking water", "wastewater"],
        feedback: [
          "No! FUEL is the fuel tank. The pump would suck the fuel out, which is dangerous for the sea and the station.",
          "No! WATER is drinking water. A dirty nozzle would contaminate the water tank.",
          "Correct! WASTE is the holding tank connection."
        ]
      },
      stations: {
        title: "Example stations",
        demo: "Four places from the pump-out station map whose official websites confirm they take sewage. Before you go, check with the operator that the device works.",
        items: [
          { id: "HR-ROVINJ-ACI" },
          { id: "HR-PUNAT-MARINA" },
          { id: "HR-SUKOSAN-DALMACIJA" },
          { id: "HR-DUBROVNIK-ACI" }
        ],
        open: "Open the station map",
        onMap: "Show on map"
      }
    },
    howto: {
      eyebrow: "What it looks like",
      title: "Emptying the tank step by step",
      lead: "How the system is connected on board and exactly what you do at a pump-out station, in pictures.",
      steps: [
        { t: "How the system is connected on board", d: "The toilet runs through a Y-valve into the holding tank. From the tank a pipe goes up to the WASTE deck fitting, where the pump-out station empties it. Keep the seacock to the sea closed." },
        { t: "The pump-out station in the marina", d: "On the pontoon or next to the fuel dock there's a pump with a hose and a pump-out sign. Come alongside, switch off the engine and tie up." },
        { t: "Find the right deck cap", d: "There are usually three caps on deck: FUEL, WATER (drinking water) and WASTE. The station hose connects to WASTE only." },
        { t: "Connect the hose and pump out", d: "Open the cap with the key, press the nozzle on firmly and start the pump. When nothing more flows through the clear part of the hose, the tank is empty." },
        { t: "Rinse the tank", d: "Run some clean water through the toilet and pump out once more. That way no sludge or bad smell is left behind." },
        { t: "Close up and log it", d: "Close the cap, rinse the nozzle and put the hose back. Keep the waste delivery receipt on board for two years and note the pump-out in the logbook." }
      ],
      photosTitle: "What it looks like in a marina",
      photosNote: "Examples from real marinas. Stations and deck caps look different from marina to marina.",
      photos: [
        { c: "Pump-out station on a river pontoon (Germany): pump and coiled hose", alt: "Blue sewage pump-out station with a coiled hose by a river" },
        { c: "Station on a marina dock with instructions and the deck-fitting nozzle (USA)", alt: "Stainless pump-out station on a wooden dock, with an instruction label and hose" },
        { c: "The station hose connected to the deck fitting while the tank is pumped out (USA, 1970s)", license: "public domain", alt: "A man on a houseboat deck holds the hose connected to the deck fitting while the tank is emptied" },
        { c: "Modern self-service pump-out station with a pictogram (Netherlands)", alt: "Grey self-service pump-out station with a tank-emptying pictogram, next to moored boats" }
      ]
    },
    know: {
      eyebrow: "Did you know?",
      title: "Numbers and rules worth knowing",
      lead: "Short facts from regulations, bathing water monitoring and boating practice, each with its source.",
      src: "Source",
      items: [
        { n: "1%", t: "You've already paid for waste reception", d: "A boat with a marina berth contract pays an indirect waste fee of 1% of the berth price, whether or not it hands over any waste. So use the pump-out station.", s: "Official Gazette 72/2021, Art. 77 (HR)" },
        { n: "2 yrs", t: "Keep the waste delivery receipt", d: "After handing over waste you get a waste delivery receipt. Keep it on board for at least two years.", s: "Official Gazette 72/2021, Art. 66 (HR)" },
        { n: "100 / 250", t: "Limits for excellent water", d: "Bathing water is excellent with at most 100 intestinal enterococci and 250 E. coli per 100 ml. Those are exactly the bacteria that sewage brings.", s: "Directive 2006/7/EC, Annex I" },
        { n: "15 days", t: "The sea is tested regularly", d: "From mid-May to early October, public health institutes sample beaches and publish results every 15 days. Blue means excellent, red means poor.", s: "gov.hr: Bathing water quality (HR)" },
        { n: "Report", t: "Reporting pollution is a duty", d: "A skipper who pollutes the sea or sees pollution must report it without delay. In the app, use the New report page.", s: "Croatian Maritime Code, Art. 49.f (HR)" },
        { n: "90 buoys", t: "Kornati protects Posidonia", d: "Since 2024 Kornati National Park has been installing eco-moorings instead of anchoring: first 90 buoys in 8 bays, with more than 200 planned. Anchors tear up Posidonia meadows.", s: "Yacht.de, 2025" },
        { n: "No formaldehyde", t: "Choose your tank treatment", d: "Formaldehyde, found in some tank treatments, is a suspected carcinogen. Enzyme or nitrate products and good tank ventilation control odour without it.", s: "Practical Sailor" },
        { n: "Hose", t: "Smells, but the tank is fine?", d: "Gases like hydrogen sulfide seep through the walls of soft hoses. Clear soft vinyl tubing should never be used for sewage.", s: "Practical Sailor" },
        { n: "12 NM", t: "Some countries are stricter", d: "Sweden has banned sewage discharge from all pleasure boats within 12 NM since 2015, and the Netherlands since 2009. There is still no international holding-tank rule for small craft.", s: "RYA: Holding tanks" }
      ]
    },
    quiz: {
      eyebrow: "Quiz",
      title: "How much do you know about sailing responsibly?",
      lead: "Ten random questions from a pool of seventeen, with a short explanation after each one. Get at least 8 right to earn a certificate.",
      size: 10,
      progress: "Question {i} of {n}",
      next: "Next question",
      finish: "See your result",
      again: "Retake the quiz",
      best: "Best score: {b} of {n}",
      correct: "Correct.",
      wrong: "Not quite.",
      srCorrect: "correct answer",
      srYours: "your answer",
      result: "{s} of {n} correct",
      tiers: [
        { min: 10, t: "A model skipper! You know everything that matters." },
        { min: 7, t: "Good score. Read the guide once more and you'll know it all." },
        { min: 0, t: "The sea gives you another chance. Go through the guide and try again." }
      ],
      cert: {
        min: 8,
        earned: "The “Responsible skipper” certificate is yours.",
        needMore: "You need at least {m} of {n} correct for the certificate.",
        nameLabel: "Name on the certificate",
        namePh: "Anna Weber",
        nameErr: "Enter the name to print on the certificate.",
        create: "Create certificate",
        busy: "Creating certificate…",
        download: "Download PNG",
        share: "Share",
        shareText: "My “Responsible skipper” certificate from the ČistoMore app.",
        imgAlt: "Responsible skipper certificate for {name}, {s} of {n} correct, {date}",
        heading: "Responsible skipper",
        kicker: "Certificate",
        sub: "knows how to handle sewage and wastewater from vessels properly",
        scoreLabel: "Quiz",
        dateLabel: "Date",
        issuer: "ČistoMore · Sail responsibly",
        pledge: "Pump out, don't dump.",
        file: "responsible-skipper.png",
        error: "The certificate couldn't be created. Try again."
      },
      questions: [
        { q: "You're anchored in a bay and the tank is nearly full. What do you do?", a: ["Empty it at night when no one is looking", "Sail to a pump-out station and use the toilet sparingly until then", "Empty it a little at a time"], c: 1, e: "Bays and anchorages are enclosed areas, so pollution stays there. Empty the tank at a pump-out station." },
        { q: "What is blackwater?", a: ["Water from the shower and sink", "Wastewater from the marine toilet", "Bilge water from the engine room"], c: 1, e: "Blackwater is sewage from the toilet. Shower and sink water is greywater, and oily bilge water is a separate kind of waste." },
        { q: "How far from the nearest land does MARPOL allow untreated sewage to be discharged?", a: ["Beyond 1 NM", "Beyond 3 NM", "Beyond 12 NM"], c: 2, e: "Untreated sewage may only be discharged more than 12 NM from the nearest land, and only while under way. In Croatia the distance is measured from the baseline, islands included." },
        { q: "How fast must a vessel be moving while emptying its holding tank at sea, where that's allowed?", a: ["At least 4 knots", "Speed doesn't matter", "It must be at anchor"], c: 0, e: "At least 4 knots, so the discharge is diluted in as much water as possible. Never at anchor." },
        { q: "There are three caps on deck. Which one does the pump-out hose connect to?", a: ["WATER", "WASTE", "FUEL"], c: 1, e: "WASTE is the holding tank connection. Mixing it up with WATER or FUEL is a common and costly mistake." },
        { q: "Why are shellfish farms especially sensitive to sewage?", a: ["Shellfish filter seawater and accumulate bacteria and viruses", "Shellfish can't tolerate fresh water", "Sewage dissolves their shells"], c: 0, e: "Mussels and oysters filter large volumes of seawater. If the water is polluted, they become unsafe to eat." },
        { q: "What do nutrients from sewage cause in enclosed bays?", a: ["Clearer water", "Algal blooms and low oxygen", "More fish"], c: 1, e: "Nitrogen and phosphorus fertilise the sea. Algae multiply, and their decay uses up oxygen that fish and other organisms need." },
        { q: "You see a boat discharging sewage in a bay. What helps most?", a: ["Shout at the crew and leave", "Photograph it, note the location and time, and report it", "Nothing, it's not my problem"], c: 1, e: "A report with a photo, location and time helps the authorities act. In the app, that's the New report page." },
        { q: "What is the EU limit for intestinal enterococci for coastal bathing water to count as “excellent”?", a: ["100 per 100 ml", "500 per 100 ml", "1,000 per 100 ml"], c: 0, e: "Directive 2006/7/EC sets at most 100 intestinal enterococci per 100 ml for excellent coastal water. Sewage from boats raises exactly this indicator." },
        { q: "On the Croatian bathing water quality map, what does a blue marker mean?", a: ["Excellent quality", "Bathing forbidden", "Not yet tested"], c: 0, e: "Blue is excellent, green good, yellow satisfactory and red poor." },
        { q: "When is bathing water tested in Croatia?", a: ["All year round", "Only in July and August", "From mid-May to early October"], c: 2, e: "Public health institutes sample the sea throughout the bathing season, and new results are published every 15 days." },
        { q: "You have a berth contract in a Croatian marina. What do you pay for waste reception?", a: ["Nothing unless you hand over waste", "1% of the berth price, whether or not you hand over waste", "A fee per litre pumped out"], c: 1, e: "The Croatian ordinance (Official Gazette 72/2021, Art. 77) sets an indirect fee of 1% regardless of actual delivery. You've already paid, so use the pump-out station." },
        { q: "How long must the waste delivery receipt be kept on board?", a: ["24 hours", "Until the end of the season", "At least two years"], c: 2, e: "The Croatian ordinance (Art. 66) requires the receipt to be kept on board for at least two years." },
        { q: "Why avoid holding-tank treatments with formaldehyde?", a: ["They make the tank fill faster", "It's a suspected carcinogen and kills useful bacteria", "They're banned on sailboats only"], c: 1, e: "Formaldehyde is listed as a suspected carcinogen. Enzyme or nitrate products and good tank ventilation control odour without it." },
        { q: "The head smells even though the tank was just pumped out. What's a common cause?", a: ["Gases seeping through the hose walls", "Too much fresh water in the tank", "A full fuel tank"], c: 0, e: "Hydrogen sulfide and other gases seep through hose walls, faster through soft materials. Clear soft vinyl tubing is not for sewage." },
        { q: "Why is Kornati National Park installing eco-mooring buoys in its anchoring bays?", a: ["To charge higher fees", "To protect Posidonia meadows from anchors", "To mark fishing zones"], c: 1, e: "The buoys, for boats up to 16 m, are meant to replace anchoring in 19 bays and protect the Posidonia meadows." },
        { q: "In which sea does MARPOL ban passenger ships from discharging untreated sewage as a special area?", a: ["Adriatic Sea", "Baltic Sea", "Black Sea"], c: 1, e: "The Baltic is a special area, and the ban came fully into force between 2019 and 2023. The Mediterranean and Adriatic are not such an area for sewage so far." }
      ]
    },
    final: {
      title: "Pump out, don't dump.",
      lead: "Every tank emptied at a pump-out station means one more clean bay.",
      map: "Open the station map",
      report: "Report pollution",
      log: "My logbook"
    },
    sources: {
      title: "Sources",
      note: "This content is educational and simplified. Check official rules with the harbour master or marina management.",
      items: [
        { t: "IMO: Prevention of Pollution by Sewage from Ships (MARPOL Annex IV)", u: "https://www.imo.org/en/OurWork/Environment/Pages/Sewage-Default.aspx" },
        { t: "Official Gazette 72/2021: Ordinance on maintaining order in ports and other parts of Croatian internal waters and territorial sea (HR)", u: "https://narodne-novine.nn.hr/clanci/sluzbeni/2021_06_72_1358.html" },
        { t: "Croatian Ministry of the Sea: preventing sewage pollution from yachts in nautical ports, legal framework (HR)", u: "https://mmpi.gov.hr/UserDocsImages/arhiva/PREVENCIJA%20ONE%C4%8CI%C5%A0%C4%86ENJA%20FEKALIJAMA%20S%20JAHTI%20U%20LUKAMA%20NAUTI%C4%8CKOG%20TURIZMA%20%E2%80%93%20PRAVNI%20OKVIR.pdf" },
        { t: "Croatian Maritime Code (consolidated), Art. 49.a–49.f (HR)", u: "https://www.zakon.hr/z/310/Pomorski-zakonik" },
        { t: "Directive 2006/7/EC on bathing water quality, annexes", u: "https://www.legislation.gov.uk/eudr/2006/7/annexes/adopted" },
        { t: "gov.hr: Bathing water quality (HR)", u: "https://www.gov.hr/hr/kakvoca-mora/1580" },
        { t: "RYA: Holding tanks (rules in other countries)", u: "https://www.rya.org.uk/boating-abroad/holding-tanks/" },
        { t: "Practical Sailor: tank treatments and hose test", u: "https://www.practical-sailor.com/systems-propulsion/solutions-for-a-stinky-holding-tank/" },
        { t: "Yacht.de: eco-moorings in Kornati National Park (2025)", u: "https://www.yacht.de/en/travel-and-charter/croatia/croatia-kornati-national-park-murings-for-marine-conservation/" }
      ]
    },
    footer: "ČistoMore · Hackathon 2026 · Group 4: Sail responsibly"
  }
};
