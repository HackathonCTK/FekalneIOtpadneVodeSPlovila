/*
 * ČistoMore — Dio 4: „Plovi odgovorno“ / "Sail responsibly"
 * Sav tekst stranice na hrvatskom (hr) i engleskom (en).
 * Mijenjajte tekst ovdje; plovi-odgovorno.js ga samo prikazuje.
 *
 * Napomena za tim: činjenice su pojednostavljene za edukaciju.
 * PROVJERITI prije predstavljanja (izvori na dnu, u "sources"):
 *  - MARPOL Prilog IV: neobrađene fekalne vode > 12 NM, usitnjene i dezinficirane > 3 NM,
 *    brod u plovidbi >= 4 čv (IMO).
 *  - Hrvatska: opća zabrana ispuštanja u lukama/marinama/sidrištima i obveza predaje
 *    otpada u lučke prihvatne uređaje (MMPI prezentacija; NN 72/2021).
 *  - Primjeri prihvatnih stanica su DEMO podaci; prave podatke daje karta (grupa 2).
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
      impact: "Utjecaj",
      guide: "Vodič",
      pumpout: "Prihvat",
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
        "Rješenje je kratka plovidba do prihvatne stanice."
      ],
      factsTitle: "Zapamti tri broja",
      facts: [
        { n: "12", u: "NM", t: "Najmanja udaljenost od kopna za ispuštanje neobrađenih fekalnih voda (MARPOL, Prilog IV)" },
        { n: "4", u: "čv", t: "Najmanja brzina plovidbe dok se ispušta. Nikad na sidru." },
        { n: "0", u: "L", t: "Dopušteno ispuštanje u lukama, marinama i sidrištima. Tamo se prazni samo na prihvatnoj stanici." }
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
        { icon: "bacteria", t: "Bakterije u moru za kupanje", d: "Fekalne vode nose E. coli i crijevne enterokoke. Po istim se pokazateljima ocjenjuje kakvoća mora za kupanje, a loši rezultati znače zabranu kupanja." },
        { icon: "algae", t: "Alge i manjak kisika", d: "Dušik i fosfor potiču cvjetanje algi. Kad alge odumru, njihova razgradnja troši kisik u zatvorenim uvalama." },
        { icon: "shell", t: "Školjke filtriraju sve", d: "Dagnje i kamenice filtriraju velike količine mora i nakupljaju bakterije i viruse. Zato se uzgajališta zatvaraju kad se more onečisti." },
        { icon: "grass", t: "Livade posidonije", d: "Mutnije more propušta manje svjetla. Posidonija, „pluća Mediterana” i dom mnogim ribama, raste sporo i teško se oporavlja." }
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
            "Ventil prema moru (Y-ventil) u priobalju drži zatvorenim"
          ]
        },
        {
          t: "Pravila",
          h: "Što kažu propisi",
          p: "MARPOL (Prilog IV) i hrvatski propisi ograničavaju ispuštanje, a luke moraju osigurati prihvat otpada s brodova.",
          pts: [
            "Neobrađene fekalne vode tek više od 12 NM od kopna, u plovidbi od barem 4 čv",
            "Usitnjene i dezinficirane fekalne vode tek više od 3 NM od kopna",
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
            "Ni usitnjene ni dezinficirane vode ne smiju u more u luci, marini ili sidrištu. Koristi prihvatnu stanicu.",
            "Ispust iz odobrenog uređaja za obradu MARPOL načelno dopušta, ali ga mnoge luke i marine zabranjuju. Provjeri pravila marine. Najsigurnije je prihvatna stanica."
          ],
          near: [
            "Preblizu si obale. Neobrađene fekalne vode smiju se ispuštati tek više od 12 NM od kopna.",
            "Preblizu si obale. Usitnjene i dezinficirane vode smiju se ispuštati tek više od 3 NM od kopna.",
            "MARPOL to dopušta ako je uređaj odobren i ispravan i ako ispust ne ostavlja vidljive krute tvari ni ne mijenja boju mora. Provjeri i lokalna pravila."
          ],
          mid: [
            "Neobrađene fekalne vode smiju se ispuštati tek više od 12 NM od kopna.",
            "Dopušteno ako je uređaj odobren i ploviš barem 4 čvora.",
            "Dopušteno uz odobren i ispravan uređaj za obradu."
          ],
          far: [
            "Dopušteno ako ploviš barem 4 čvora i spremnik prazniš postupno, a ne odjednom.",
            "Dopušteno ako je uređaj odobren i ploviš barem 4 čvora.",
            "Dopušteno uz odobren i ispravan uređaj za obradu."
          ]
        },
        note: "Pojednostavljeno prema MARPOL-u, Prilog IV. Za jahte i brodice vrijede i hrvatski propisi i pravila lučke kapetanije. Kad nisi siguran, koristi prihvatnu stanicu."
      }
    },
    pump: {
      eyebrow: "Prihvatne stanice",
      title: "Kako isprazniti spremnik na prihvatnoj stanici",
      lead: "Cijeli postupak traje nekoliko minuta. Ovo je redoslijed.",
      steps: [
        { t: "Pronađi stanicu", d: "Na karti prihvatnih stanica pronađi najbližu stanicu i provjeri radno vrijeme i kontakt." },
        { t: "Pristani i pripremi se", d: "Priveži brod uz stanicu, ugasi motor i pripremi ključ za palubni čep." },
        { t: "Otvori čep s oznakom WASTE", d: "Ne FUEL i ne WATER. Zamjena čepova najčešća je i najskuplja pogreška." },
        { t: "Spoji crijevo i prazni", d: "Čvrsto prisloni nastavak, uključi pumpu i prati kako se spremnik prazni." },
        { t: "Isperi spremnik", d: "Pusti malo čiste vode kroz WC i isprazni ponovo, da ne ostanu talog i neugodni mirisi." },
        { t: "Zatvori i zabilježi", d: "Zatvori čep, isperi nastavak, vrati crijevo i zabilježi pražnjenje u dnevnik." }
      ],
      caps: {
        title: "Koji čep?",
        sub: "Dodirni čep u koji ide crijevo prihvatne stanice.",
        labels: ["FUEL", "WATER", "WASTE"],
        hints: ["gorivo", "pitka voda", "otpadne vode"],
        feedback: [
          "Ne! FUEL je gorivo. Fekalne vode u spremniku goriva znače skup popravak.",
          "Ne! WATER je pitka voda. Onečišćen spremnik pitke vode opasan je za zdravlje.",
          "Točno! WASTE je priključak spremnika za fekalne vode."
        ]
      },
      stations: {
        title: "Primjeri stanica",
        demo: "Demo podaci. Stvarne stanice i radno vrijeme prikazuje karta prihvatnih stanica.",
        items: [
          { n: "Prihvatna stanica Split", p: "Gradska luka", h: "08–20 h" },
          { n: "Prihvatna stanica Zadar", p: "Marina", h: "07–21 h" },
          { n: "Prihvatna stanica Rijeka", p: "Putnička luka", h: "08–18 h" },
          { n: "Prihvatna stanica Pula", p: "Marina", h: "08–19 h" }
        ],
        open: "Otvori kartu stanica",
        onMap: "Prikaži na karti"
      }
    },
    quiz: {
      eyebrow: "Kviz",
      title: "Koliko znaš o odgovornoj plovidbi?",
      lead: "Osam pitanja, nakon svakog kratko objašnjenje.",
      progress: "Pitanje {i} od {n}",
      next: "Sljedeće pitanje",
      finish: "Pogledaj rezultat",
      again: "Ponovi kviz",
      best: "Najbolji rezultat: {b} od {n}",
      correct: "Točno.",
      wrong: "Netočno.",
      result: "{s} od {n} točnih",
      tiers: [
        { min: 8, t: "Kapetan za primjer! Znaš sve što treba." },
        { min: 5, t: "Dobar rezultat. Pročitaj vodič još jednom i znat ćeš sve." },
        { min: 0, t: "More ti oprašta. Prođi vodič i pokušaj ponovo." }
      ],
      questions: [
        { q: "Usidren si u uvali i spremnik je skoro pun. Što radiš?", a: ["Ispraznim ga noću, nitko ne vidi", "Doplovim do prihvatne stanice, a dotad štedim WC", "Ispraznim ga malo po malo"], c: 1, e: "Uvale i sidrišta su zatvorena područja i onečišćenje tamo ostaje. Spremnik se prazni na prihvatnoj stanici." },
        { q: "Što su crne vode?", a: ["Voda iz tuša i sudopera", "Otpadne vode iz brodskog WC-a", "Kaljužne vode iz strojarnice"], c: 1, e: "Crne vode su fekalne vode iz WC-a. Voda iz tuša i sudopera su sive vode, a kaljuža s uljem posebna je vrsta otpada." },
        { q: "Na kojoj udaljenosti od kopna MARPOL dopušta ispuštanje neobrađenih fekalnih voda?", a: ["Više od 1 NM", "Više od 3 NM", "Više od 12 NM"], c: 2, e: "Neobrađene fekalne vode smiju se ispuštati tek više od 12 NM od najbližeg kopna, i to dok brod plovi." },
        { q: "Kojom brzinom brod mora ploviti dok ispušta dopuštene otpadne vode?", a: ["Barem 4 čvora", "Brzina nije važna", "Brod mora biti usidren"], c: 0, e: "Barem 4 čvora, kako bi se ispust razrijedio u što većoj količini mora. Na sidru nikad." },
        { q: "Na palubi su tri čepa. Koji koristiš na prihvatnoj stanici?", a: ["WATER", "WASTE", "FUEL"], c: 1, e: "WASTE je priključak spremnika fekalnih voda. Zamjena s WATER ili FUEL skupa je i opasna pogreška." },
        { q: "Zašto su uzgajališta školjaka posebno osjetljiva na fekalne vode?", a: ["Školjke filtriraju more i nakupljaju bakterije i viruse", "Školjke ne podnose slatku vodu", "Fekalne vode otapaju ljušture"], c: 0, e: "Dagnje i kamenice filtriraju velike količine mora. Ako je more onečišćeno, postaju opasne za jelo." },
        { q: "Što hranjive tvari iz fekalnih voda uzrokuju u zatvorenim uvalama?", a: ["Bistrije more", "Cvjetanje algi i manjak kisika", "Više ribe"], c: 1, e: "Dušik i fosfor „gnoje” more. Alge se namnože, a njihova razgradnja troši kisik potreban ribama i drugim organizmima." },
        { q: "Što ne smiješ bacati u brodski WC?", a: ["Toaletni papir za brodove", "Vlažne maramice i higijenske uloške", "Vodu za ispiranje"], c: 1, e: "Vlažne maramice i ulošci ne raspadaju se, nego začepljuju pumpu i spremnik. Bacaj ih u kantu za otpad." }
      ]
    },
    final: {
      title: "Prazni u luci, ne u uvali.",
      lead: "Svaki spremnik ispražnjen na prihvatnoj stanici znači jednu čistu uvalu više.",
      map: "Otvori kartu stanica",
      report: "Prijavi onečišćenje",
      log: "Zabilježi pražnjenje"
    },
    sources: {
      title: "Izvori",
      note: "Sadržaj je edukativan i pojednostavljen. Službena pravila provjeri kod lučke kapetanije ili uprave marine.",
      items: [
        { t: "IMO: Prevention of Pollution by Sewage from Ships (MARPOL, Prilog IV)", u: "https://www.imo.org/en/OurWork/Environment/Pages/Sewage-Default.aspx" },
        { t: "MMPI: Prevencija onečišćenja fekalijama s jahti u lukama nautičkog turizma, pravni okvir", u: "https://mmpi.gov.hr/UserDocsImages/arhiva/PREVENCIJA%20ONE%C4%8CI%C5%A0%C4%86ENJA%20FEKALIJAMA%20S%20JAHTI%20U%20LUKAMA%20NAUTI%C4%8CKOG%20TURIZMA%20%E2%80%93%20PRAVNI%20OKVIR.pdf" },
        { t: "Narodne novine 72/2021: pravilnik o redu u lukama i prihvatu otpada", u: "https://narodne-novine.nn.hr/clanci/sluzbeni/2021_06_72_1358.html" }
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
      impact: "Impact",
      guide: "Guide",
      pumpout: "Pump-out",
      quiz: "Quiz"
    },
    intro: {
      title: "Sail <br>responsibly",
      tagline: "The sea remembers.<br>What you release, stays.",
      scroll: "Scroll to dive in",
      corner: "A guide for boaters on sewage and wastewater from vessels",
      lines: [
        "One discharge looks harmless.",
        "But a bay is not the open sea.",
        "Bacteria and nutrients stay where we swim, dive and farm shellfish.",
        "The fix is a short trip to a pump-out station."
      ],
      factsTitle: "Remember three numbers",
      facts: [
        { n: "12", u: "NM", t: "Minimum distance from land for discharging untreated sewage (MARPOL, Annex IV)" },
        { n: "4", u: "kn", t: "Minimum speed while discharging. Never at anchor." },
        { n: "0", u: "L", t: "Allowed discharge in ports, marinas and anchorages. There, empty only at a pump-out station." }
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
        { icon: "bacteria", t: "Bacteria in bathing water", d: "Sewage carries E. coli and intestinal enterococci. Bathing water quality is graded on these same indicators, and poor results mean swimming bans." },
        { icon: "algae", t: "Algae and low oxygen", d: "Nitrogen and phosphorus feed algal blooms. When the algae die, their decay uses up oxygen in enclosed bays." },
        { icon: "shell", t: "Shellfish filter everything", d: "Mussels and oysters filter large volumes of seawater and accumulate bacteria and viruses. That's why shellfish farms close when the water is polluted." },
        { icon: "grass", t: "Posidonia meadows", d: "Murkier water lets less light through. Posidonia, the “lungs of the Mediterranean” and home to many fish, grows slowly and recovers poorly." }
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
            "Keep the overboard valve (Y-valve) closed near the coast"
          ]
        },
        {
          t: "Rules",
          h: "What the rules say",
          p: "MARPOL (Annex IV) and Croatian regulations restrict discharges, and ports must provide reception facilities for ship waste.",
          pts: [
            "Untreated sewage only beyond 12 NM from land, under way at 4 kn or more",
            "Comminuted and disinfected sewage only beyond 3 NM from land",
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
            "Comminuted or disinfected sewage can't go overboard in a port, marina or anchorage either. Use a pump-out station.",
            "MARPOL generally allows effluent from an approved treatment plant, but many ports and marinas ban it. Check the marina's rules. A pump-out station is the safest choice."
          ],
          near: [
            "You're too close to shore. Untreated sewage may only be discharged beyond 12 NM from land.",
            "You're too close to shore. Comminuted and disinfected sewage may only be discharged beyond 3 NM from land.",
            "MARPOL allows it if the plant is approved and working, and the effluent leaves no visible solids or discolouration. Check local rules too."
          ],
          mid: [
            "Untreated sewage may only be discharged beyond 12 NM from land.",
            "Allowed if the system is approved and you're under way at 4 kn or more.",
            "Allowed with an approved, working treatment plant."
          ],
          far: [
            "Allowed if you're under way at 4 kn or more and empty the tank gradually, not all at once.",
            "Allowed if the system is approved and you're under way at 4 kn or more.",
            "Allowed with an approved, working treatment plant."
          ]
        },
        note: "Simplified from MARPOL Annex IV. Yachts and small boats are also bound by Croatian regulations and harbour master rules. When in doubt, use a pump-out station."
      }
    },
    pump: {
      eyebrow: "Pump-out stations",
      title: "How to empty your tank at a pump-out station",
      lead: "The whole job takes a few minutes. Here's the order.",
      steps: [
        { t: "Find a station", d: "Use the pump-out station map to find the nearest one and check its opening hours and contact." },
        { t: "Moor and get ready", d: "Tie up alongside the station, switch off the engine and have the deck-fill key ready." },
        { t: "Open the WASTE cap", d: "Not FUEL and not WATER. Mixing up the caps is the most common and most expensive mistake." },
        { t: "Connect and pump", d: "Press the nozzle on firmly, start the pump and watch the tank empty." },
        { t: "Rinse the tank", d: "Flush some clean water through the toilet and pump out again so no sludge or smell is left." },
        { t: "Close up and log it", d: "Close the cap, rinse the nozzle, put the hose back and record the pump-out in your logbook." }
      ],
      caps: {
        title: "Which cap?",
        sub: "Tap the cap the pump-out hose goes into.",
        labels: ["FUEL", "WATER", "WASTE"],
        hints: ["fuel", "drinking water", "wastewater"],
        feedback: [
          "No! FUEL is for fuel. Sewage in the fuel tank means an expensive repair.",
          "No! WATER is drinking water. A contaminated water tank is a health hazard.",
          "Correct! WASTE is the holding tank connection."
        ]
      },
      stations: {
        title: "Example stations",
        demo: "Demo data. The pump-out station map shows real stations and opening hours.",
        items: [
          { n: "Pump-out station Split", p: "City harbour", h: "08–20" },
          { n: "Pump-out station Zadar", p: "Marina", h: "07–21" },
          { n: "Pump-out station Rijeka", p: "Passenger port", h: "08–18" },
          { n: "Pump-out station Pula", p: "Marina", h: "08–19" }
        ],
        open: "Open the station map",
        onMap: "Show on map"
      }
    },
    quiz: {
      eyebrow: "Quiz",
      title: "How much do you know about sailing responsibly?",
      lead: "Eight questions, with a short explanation after each one.",
      progress: "Question {i} of {n}",
      next: "Next question",
      finish: "See your result",
      again: "Retake the quiz",
      best: "Best score: {b} of {n}",
      correct: "Correct.",
      wrong: "Not quite.",
      result: "{s} of {n} correct",
      tiers: [
        { min: 8, t: "A model skipper! You know everything that matters." },
        { min: 5, t: "Good score. Read the guide once more and you'll know it all." },
        { min: 0, t: "The sea forgives you. Go through the guide and try again." }
      ],
      questions: [
        { q: "You're anchored in a bay and the tank is nearly full. What do you do?", a: ["Empty it at night when no one is looking", "Sail to a pump-out station and use the toilet sparingly until then", "Empty it a little at a time"], c: 1, e: "Bays and anchorages are enclosed areas, so pollution stays there. Empty the tank at a pump-out station." },
        { q: "What is blackwater?", a: ["Water from the shower and sink", "Wastewater from the marine toilet", "Bilge water from the engine room"], c: 1, e: "Blackwater is sewage from the toilet. Shower and sink water is greywater, and oily bilge water is a separate kind of waste." },
        { q: "How far from land does MARPOL allow untreated sewage to be discharged?", a: ["Beyond 1 NM", "Beyond 3 NM", "Beyond 12 NM"], c: 2, e: "Untreated sewage may only be discharged more than 12 NM from the nearest land, and only while under way." },
        { q: "How fast must a vessel be moving while making a permitted discharge?", a: ["At least 4 knots", "Speed doesn't matter", "It must be at anchor"], c: 0, e: "At least 4 knots, so the discharge is diluted in as much water as possible. Never at anchor." },
        { q: "There are three caps on deck. Which one do you use at a pump-out station?", a: ["WATER", "WASTE", "FUEL"], c: 1, e: "WASTE is the holding tank connection. Mixing it up with WATER or FUEL is a costly and dangerous mistake." },
        { q: "Why are shellfish farms especially sensitive to sewage?", a: ["Shellfish filter seawater and accumulate bacteria and viruses", "Shellfish can't tolerate fresh water", "Sewage dissolves their shells"], c: 0, e: "Mussels and oysters filter large volumes of seawater. If the water is polluted, they become unsafe to eat." },
        { q: "What do nutrients from sewage cause in enclosed bays?", a: ["Clearer water", "Algal blooms and low oxygen", "More fish"], c: 1, e: "Nitrogen and phosphorus fertilise the sea. Algae multiply, and their decay uses up oxygen that fish and other organisms need." },
        { q: "What must never go into a marine toilet?", a: ["Marine toilet paper", "Wet wipes and sanitary pads", "Flushing water"], c: 1, e: "Wet wipes and pads don't break down: they clog the pump and the tank. Put them in the bin." }
      ]
    },
    final: {
      title: "Empty in port, not in the bay.",
      lead: "Every tank emptied at a pump-out station means one more clean bay.",
      map: "Open the station map",
      report: "Report pollution",
      log: "Log a pump-out"
    },
    sources: {
      title: "Sources",
      note: "This content is educational and simplified. Check official rules with the harbour master or marina management.",
      items: [
        { t: "IMO: Prevention of Pollution by Sewage from Ships (MARPOL Annex IV)", u: "https://www.imo.org/en/OurWork/Environment/Pages/Sewage-Default.aspx" },
        { t: "Croatian Ministry of the Sea: preventing sewage pollution from yachts in nautical ports, legal framework (HR)", u: "https://mmpi.gov.hr/UserDocsImages/arhiva/PREVENCIJA%20ONE%C4%8CI%C5%A0%C4%86ENJA%20FEKALIJAMA%20S%20JAHTI%20U%20LUKAMA%20NAUTI%C4%8CKOG%20TURIZMA%20%E2%80%93%20PRAVNI%20OKVIR.pdf" },
        { t: "Official Gazette 72/2021: regulation on port order and waste reception (HR)", u: "https://narodne-novine.nn.hr/clanci/sluzbeni/2021_06_72_1358.html" }
      ]
    },
    footer: "ČistoMore · Hackathon 2026 · Group 4: Sail responsibly"
  }
};
