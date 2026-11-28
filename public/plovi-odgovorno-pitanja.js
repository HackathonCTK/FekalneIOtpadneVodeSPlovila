/*
 * ČistoMore — Plovi odgovorno: dodatna pitanja za kviz (različiti tipovi).
 * Dodaje se na quiz.questions u PO_CONTENT (hr i en) u istom redoslijedu: indeks pitanja
 * mora biti isti u oba jezika. Učitava se nakon plovi-odgovorno-sadrzaj.js.
 *
 * Tipovi (polje "type"):
 *   (bez type)  jedan točan:  a: [...], c: indeks
 *   "tf"        točno / netočno:  c: true | false
 *   "multi"     više točnih:  a: [...], c: [indeksi]
 *   "order"     poredaj:  a: [...] navedeno u TOČNOM redoslijedu (kviz ih miješa)
 */
(function () {
  "use strict";
  var C = window.PO_CONTENT;
  if (!C) return;
  var P = [
    /* ---------- Točno / netočno ---------- */
    { type: "tf",
      hr: { q: "U sidrištu je noć i nitko ne gleda. Spremnik smiješ isprazniti u more.", c: false, e: "U lukama, marinama i sidrištima spremnik se prazni samo na prihvatnoj stanici. Noć ništa ne mijenja." },
      en: { q: "It's night at the anchorage and nobody is watching. You may empty the tank into the sea.", c: false, e: "In ports, marinas and anchorages the tank is emptied only at a pump-out station. Night makes no difference." } },
    { type: "tf",
      hr: { q: "Vlažne maramice smiju u brodski WC ako na pakiranju piše da se mogu ispirati.", c: false, e: "Vlažne maramice i ulošci ne idu u WC jer začepljuju sustav, bez obzira na natpis na pakiranju." },
      en: { q: "Wet wipes may go into the marine toilet if the packaging says they're flushable.", c: false, e: "Wet wipes and sanitary pads don't go into the toilet because they clog the system, whatever the packaging says." } },
    { type: "tf",
      hr: { q: "Sive vode su voda iz tuša, sudopera i umivaonika.", c: true, e: "Točno. Manje su opasne od crnih voda, ali nose deterdžente, masnoće i ostatke hrane." },
      en: { q: "Greywater is water from the shower, sink and washbasin.", c: true, e: "Correct. It's less hazardous than blackwater but carries detergents, grease and food scraps." } },
    { type: "tf",
      hr: { q: "Crne vode sadrže fekalne bakterije, viruse i hranjive tvari.", c: true, e: "Točno. Zato nikad ne smiju završiti u marini ili uvali." },
      en: { q: "Blackwater contains faecal bacteria, viruses and nutrients.", c: true, e: "Correct. That's why it must never end up in a marina or bay." } },
    { type: "tf",
      hr: { q: "Ventil za ispust u more treba držati zatvorenim i osiguranim.", c: true, e: "Točno. Y-ventil se drži prema spremniku, a ventil prema moru zatvoren i osiguran, da se ispust ne dogodi slučajno." },
      en: { q: "The valve to the sea should be kept closed and secured.", c: true, e: "Correct. The Y-valve stays set to the tank and the seacock closed and secured, so nothing is discharged by accident." } },
    { type: "tf",
      hr: { q: "Zamjena čepova WASTE i FUEL je sitna pogreška koja se lako ispravi.", c: false, e: "Zamjena čepova je česta i skupa pogreška. Pumpa bi isisala gorivo ili onečistila spremnik pitke vode." },
      en: { q: "Mixing up the WASTE and FUEL caps is a minor mistake that's easy to fix.", c: false, e: "Mixing up the caps is a common and costly mistake. The pump would suck out fuel or contaminate the drinking water tank." } },
    { type: "tf",
      hr: { q: "Posidonija se brzo oporavlja nakon što je sidro iščupa.", c: false, e: "Posidonija raste sporo i teško se oporavlja. Zaštićena je, zato ne sidri na njoj." },
      en: { q: "Posidonia quickly recovers after an anchor tears it up.", c: false, e: "Posidonia grows slowly and recovers with difficulty. It's protected, so don't anchor on it." } },
    { type: "tf",
      hr: { q: "Usitnjene i dezinficirane fekalne vode smiju se ispuštati tek dalje od 3 NM od najbližeg kopna.", c: true, e: "Točno, i to uz odobren uređaj dok brod plovi barem 4 čvora. U luci, marini ili sidrištu ne smiju." },
      en: { q: "Comminuted and disinfected sewage may be discharged only beyond 3 NM from the nearest land.", c: true, e: "Correct, using an approved device while the ship is making at least 4 knots. Never in a port, marina or anchorage." } },
    { type: "tf",
      hr: { q: "U marini smiješ ispustiti usitnjene i dezinficirane fekalne vode.", c: false, e: "Ne smiješ. Ni usitnjene i dezinficirane fekalne vode ne smiju u more u luci, marini ili sidrištu. Koristi prihvatnu stanicu." },
      en: { q: "In a marina you may discharge comminuted and disinfected sewage.", c: false, e: "You may not. Not even comminuted and disinfected sewage may go into the sea in a port, marina or anchorage. Use the pump-out station." } },
    { type: "tf",
      hr: { q: "Spremnik je dovoljno isprazniti tek kad je pun do vrha, planiranje unaprijed nije potrebno.", c: false, e: "Pražnjenje planiraj kao što planiraš gorivo: znaj zapremninu spremnika, prati pokazivač razine i isprazni prije nego što se napuni." },
      en: { q: "It's enough to empty the tank once it's full to the brim; no advance planning is needed.", c: false, e: "Plan the pump-out like you plan fuel: know the tank capacity, watch the level gauge and empty it before it fills up." } },
    { type: "tf",
      hr: { q: "Dagnje i kamenice mogu nakupljati bakterije i viruse iz onečišćenog mora.", c: true, e: "Točno. Filtriraju velike količine mora, zato se uzgajališta zatvaraju kad se more onečisti." },
      en: { q: "Mussels and oysters can accumulate bacteria and viruses from polluted water.", c: true, e: "Correct. They filter large volumes of seawater, which is why farms are closed when the water is polluted." } },
    { type: "tf",
      hr: { q: "Prije pražnjenja na stanici treba isključiti motor i pripremiti ključ za palubni čep.", c: true, e: "Točno. Pristani uz stanicu, ugasi motor, priveži brod i pripremi ključ prije otvaranja čepa WASTE." },
      en: { q: "Before pumping out at a station you should switch off the engine and have the deck-fill key ready.", c: true, e: "Correct. Come alongside, switch off the engine, tie up and have the key ready before opening the WASTE cap." } },

    /* ---------- Više točnih ---------- */
    { type: "multi",
      hr: { q: "Što NE smije u brodski WC?", a: ["Vlažne maramice", "Higijenski ulošci", "Toaletni papir koji se brzo razgrađuje", "Fekalije"], c: [0, 1], e: "Vlažne maramice i ulošci ne idu u WC jer začepljuju sustav. Fekalije i toaletni papir koji se brzo razgrađuje su ono za što je WC namijenjen." },
      en: { q: "What must NOT go into the marine toilet?", a: ["Wet wipes", "Sanitary pads", "Quickly dissolving toilet paper", "Human waste"], c: [0, 1], e: "Wet wipes and sanitary pads don't go into the toilet because they clog the system. Human waste and quickly dissolving toilet paper are what it's designed for." } },
    { type: "multi",
      hr: { q: "Što je dio sustava za fekalne vode na brodu?", a: ["WC", "Spremnik za fekalne vode", "Y-ventil", "Palubni čep WASTE", "Spremnik goriva"], c: [0, 1, 2, 3], e: "WC vodi preko Y-ventila u spremnik, a iz spremnika cijev ide do palubnog čepa WASTE. Spremnik goriva je zaseban sustav s čepom FUEL." },
      en: { q: "Which of these are part of the blackwater system on board?", a: ["Toilet", "Holding tank", "Y-valve", "WASTE deck fitting", "Fuel tank"], c: [0, 1, 2, 3], e: "The toilet runs through a Y-valve into the tank, and from the tank a pipe goes to the WASTE deck fitting. The fuel tank is a separate system with the FUEL cap." } },
    { type: "multi",
      hr: { q: "Što su sive vode?", a: ["Voda iz tuša", "Voda iz sudopera", "Voda iz WC-a", "Voda iz umivaonika"], c: [0, 1, 3], e: "Sive vode su voda iz tuša, sudopera i umivaonika. Voda iz WC-a su crne vode." },
      en: { q: "What counts as greywater?", a: ["Shower water", "Sink water", "Toilet water", "Washbasin water"], c: [0, 1, 3], e: "Greywater is water from the shower, sink and washbasin. Toilet water is blackwater." } },
    { type: "multi",
      hr: { q: "Što fekalne vode mogu donijeti u zatvorenu uvalu?", a: ["Bakterije i viruse", "Hranjive tvari (dušik i fosfor)", "Veću prozirnost mora", "Manjak kisika nakon cvjetanja algi"], c: [0, 1, 3], e: "Fekalne vode donose bakterije, viruse i hranjive tvari, a razgradnja algi troši kisik. Prozirnost mora se smanjuje, a ne povećava." },
      en: { q: "What can sewage bring into an enclosed bay?", a: ["Bacteria and viruses", "Nutrients (nitrogen and phosphorus)", "Clearer water", "Low oxygen after algal blooms"], c: [0, 1, 3], e: "Sewage brings bacteria, viruses and nutrients, and decaying algae use up oxygen. Water clarity falls, it doesn't rise." } },
    { type: "multi",
      hr: { q: "Što pomaže nadležnim službama kad prijaviš onečišćenje?", a: ["Fotografija", "Lokacija", "Vrijeme događaja", "Tvoj prijedlog kazne"], c: [0, 1, 2], e: "Fotografija, lokacija i vrijeme pomažu službama da reagiraju. Kaznu određuju nadležne službe." },
      en: { q: "What helps the authorities when you report pollution?", a: ["A photo", "The location", "The time of the event", "Your suggested fine"], c: [0, 1, 2], e: "A photo, location and time help the authorities respond. Fines are decided by the competent authorities." } },
    { type: "multi",
      hr: { q: "Koja su tri čepa obično na palubi?", a: ["FUEL", "WATER", "WASTE", "BILGE"], c: [0, 1, 2], e: "FUEL je gorivo, WATER pitka voda, a WASTE otpadne vode. Crijevo stanice spaja se samo na WASTE." },
      en: { q: "Which are the three caps usually on deck?", a: ["FUEL", "WATER", "WASTE", "BILGE"], c: [0, 1, 2], e: "FUEL is fuel, WATER is drinking water and WASTE is wastewater. The station hose connects to WASTE only." } },

    /* ---------- Poredaj ---------- */
    { type: "order",
      hr: { q: "Poredaj korake pražnjenja spremnika na prihvatnoj stanici.", a: ["Pronađi stanicu", "Pristani i pripremi se", "Otvori čep s oznakom WASTE", "Spoji crijevo i prazni", "Isperi spremnik", "Zatvori i zabilježi"], e: "Redoslijed je: stanica, pristajanje, čep WASTE, crijevo i pražnjenje, ispiranje, zatvaranje i bilješka." },
      en: { q: "Put the steps of emptying the tank at a pump-out station in order.", a: ["Find a station", "Moor and get ready", "Open the WASTE cap", "Connect the hose and pump out", "Rinse the tank", "Close up and log it"], e: "The order is: station, mooring, WASTE cap, hose and pumping, rinsing, closing up and logging." } },
    { type: "order",
      hr: { q: "Kojim putem ide sadržaj iz WC-a do prihvatne stanice?", a: ["WC", "Y-ventil", "Spremnik za fekalne vode", "Palubni čep WASTE", "Prihvatna stanica"], e: "WC vodi preko Y-ventila u spremnik, a iz spremnika se kroz palubni čep WASTE prazni pumpom stanice." },
      en: { q: "Which way does the toilet's content travel to the pump-out station?", a: ["Toilet", "Y-valve", "Holding tank", "WASTE deck fitting", "Pump-out station"], e: "The toilet runs through the Y-valve into the tank, and from the tank it's pumped out through the WASTE fitting by the station." } },
    { type: "order",
      hr: { q: "Vidiš brod koji ispušta fekalne vode. Poredaj što radiš.", a: ["Fotografiraj", "Zabilježi lokaciju i vrijeme", "Otvori Novu prijavu u aplikaciji", "Pošalji prijavu", "Prati status prijave"], e: "Prvo dokaz (fotografija, lokacija, vrijeme), zatim prijava u aplikaciji, a status pratiš na Profilu i preko zvona." },
      en: { q: "You see a boat discharging sewage. Put what you do in order.", a: ["Take a photo", "Note the location and time", "Open New report in the app", "Send the report", "Follow the report status"], e: "Evidence first (photo, location, time), then the report in the app, and you follow the status on your profile and through the bell." } },
    { type: "order",
      hr: { q: "Poredaj gdje se što smije, od luke prema pučini.", a: ["Luka, marina, sidrište: samo prihvatna stanica", "Do 3 NM od kopna: ništa se ne ispušta", "Od 3 do 12 NM: samo usitnjeno i dezinficirano", "Više od 12 NM: i neobrađene, u plovidbi"], e: "Što si dalje od kopna, više je dopušteno: u luci ništa, do 3 NM ništa, od 3 do 12 NM obrađene, a neobrađene tek preko 12 NM." },
      en: { q: "Put what's allowed where in order, from harbour out to open sea.", a: ["Port, marina, anchorage: pump-out station only", "Up to 3 NM from land: no discharge", "3 to 12 NM: only comminuted and disinfected", "Beyond 12 NM: untreated too, while under way"], e: "The farther from land, the more is allowed: nothing in port, nothing up to 3 NM, treated sewage from 3 to 12 NM, untreated only beyond 12 NM." } },
    { type: "order",
      hr: { q: "Poredaj lanac posljedica kad se hranjive tvari ispuste u zatvorenu uvalu.", a: ["Ispust dušika i fosfora", "Alge se namnože", "Alge odumru", "Razgradnja troši kisik", "Riba i školjke ostaju bez kisika"], e: "Dušik i fosfor potiču cvjetanje algi. Kad odumru, njihova razgradnja troši kisik, a njega nedostaje ribi i drugim organizmima." },
      en: { q: "Put the chain of consequences in order when nutrients enter an enclosed bay.", a: ["Nitrogen and phosphorus are released", "Algae multiply", "Algae die", "Decay uses up oxygen", "Fish and shellfish run short of oxygen"], e: "Nitrogen and phosphorus feed algal blooms. When algae die, their decay uses oxygen, which fish and other organisms then lack." } },
    { type: "order",
      hr: { q: "Poredaj planiranje pražnjenja prije plovidbe.", a: ["Saznaj zapremninu spremnika", "Prati pokazivač razine", "Nađi najbližu stanicu na karti", "Provjeri kontakt i radi li uređaj", "Isprazni prije nego što se napuni"], e: "Planiraj kao što planiraš gorivo: znaj kapacitet i razinu, nađi stanicu, provjeri radi li uređaj i isprazni na vrijeme." },
      en: { q: "Put planning a pump-out before a trip in order.", a: ["Find out the tank capacity", "Watch the level gauge", "Find the nearest station on the map", "Check the contact and whether the device works", "Empty it before it fills up"], e: "Plan like you plan fuel: know the capacity and level, find a station, check that the device works and empty on time." } },

    /* ---------- Jedan točan ---------- */
    { hr: { q: "Što radiš nakon prvog pražnjenja da ne ostanu talog i neugodni miris?", a: ["Isperem čistom vodom kroz WC i isprazni ponovno", "Dodam jači deterdžent u spremnik", "Ostavim poklopac čepa otvoren"], c: 0, e: "Pusti malo čiste vode kroz WC i isprazni ponovno. Tako ne ostaju talog i miris." },
      en: { q: "What do you do after the first pump-out so no sludge and bad smell are left?", a: ["Rinse with clean water through the toilet and pump out again", "Add a stronger detergent to the tank", "Leave the cap open"], c: 0, e: "Run some clean water through the toilet and pump out again. That way no sludge or smell is left." } },
    { hr: { q: "Što znači „pump-out“?", a: ["Pražnjenje spremnika na prihvatnoj stanici", "Pumpanje vode u tuš", "Ispuštanje kaljuže u more"], c: 0, e: "Pump-out je pražnjenje spremnika za fekalne vode pumpom prihvatne stanice, preko palubnog čepa WASTE." },
      en: { q: "What does “pump-out” mean?", a: ["Emptying the tank at a reception station", "Pumping water into the shower", "Discharging bilge water into the sea"], c: 0, e: "A pump-out is emptying the holding tank with the station's pump through the WASTE deck fitting." } },
    { hr: { q: "Kakve deterdžente i šampone treba koristiti na brodu?", a: ["Biorazgradive", "Najjače dostupne", "Svejedno koje"], c: 0, e: "Sive vode nose deterdžente i masnoće, zato koristi biorazgradive proizvode. Suđe peri na kopnu kad god možeš." },
      en: { q: "What kind of detergents and shampoos should you use on a boat?", a: ["Biodegradable ones", "The strongest available", "It doesn't matter"], c: 0, e: "Greywater carries detergents and grease, so use biodegradable products. Wash dishes ashore whenever you can." } },
    { hr: { q: "Zašto mutnije more škodi posidoniji?", a: ["Propušta manje svjetla, a posidonija raste sporo", "Posidonija voli mutnu vodu", "Mutno more je hladnije pa joj ne smeta"], c: 0, e: "Mutnije more propušta manje svjetla. Posidonija, „pluća Mediterana“, raste sporo i teško se oporavlja." },
      en: { q: "Why does murkier water harm Posidonia?", a: ["It lets in less light, and Posidonia grows slowly", "Posidonia likes murky water", "Murky water is colder so it doesn't matter"], c: 0, e: "Murkier water lets in less light. Posidonia, the “lungs of the Mediterranean”, grows slowly and recovers with difficulty." } },
    { hr: { q: "Gdje u aplikaciji pronalaziš najbližu prihvatnu stanicu?", a: ["Na stranici Karta", "Na stranici Profil", "Na stranici Nova prijava"], c: 0, e: "Karta prikazuje prihvatna mjesta s kontaktima i uslugama, a može pronaći i najbliže." },
      en: { q: "Where in the app do you find the nearest pump-out station?", a: ["On the Map page", "On the Profile page", "On the New report page"], c: 0, e: "The Map shows the reception stations with contacts and services, and can find the nearest one." } }
  ];

  P.forEach(function (p) {
    ["hr", "en"].forEach(function (l) {
      var src = p[l], q = { q: src.q, e: src.e };
      if (p.type) q.type = p.type;
      if (src.a) q.a = src.a;
      if (src.c !== undefined) q.c = src.c;
      C[l].quiz.questions.push(q);
    });
  });
  if (window.PO_EXTRA_QUESTIONS) window.PO_EXTRA_QUESTIONS.forEach(function (p) {
    ["hr", "en"].forEach(function (l) {
      var src = p[l], q = { q: src.q, e: src.e };
      if (p.type) q.type = p.type;
      if (src.a) q.a = src.a;
      if (src.c !== undefined) q.c = src.c;
      C[l].quiz.questions.push(q);
    });
  });
})();
