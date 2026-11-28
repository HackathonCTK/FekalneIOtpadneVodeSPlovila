/*
 * ČistoMore — Plovi odgovorno: pitanja iz dodatnog istraživanja (provjereni izvori navedeni uz pitanje).
 * Isti format kao plovi-odgovorno-pitanja.js; učitava se nakon njega.
 */
(function () {
  "use strict";
  var C = window.PO_CONTENT;
  if (!C) return;
  var P = [
    /* Florida Sea Grant: https://www.flseagrant.org/clean-boating/sewage-solutions/ */
    { hr: { q: "Koliko hranjivih tvari može imati sirova fekalna voda s broda u odnosu na komunalnu otpadnu vodu?", a: ["Do 40 puta više", "Otprilike jednako", "Desetak puta manje"], c: 0, e: "Fekalne vode s brodova vrlo su koncentrirane: mogu imati do 40 puta više hranjivih tvari od sirove komunalne otpadne vode (Florida Sea Grant). Zato mala količina u zatvorenoj uvali već šteti." },
      en: { q: "How many nutrients can raw boat sewage contain compared with raw municipal sewage?", a: ["Up to 40 times as many", "About the same", "About ten times fewer"], c: 0, e: "Boat sewage is highly concentrated: it can have up to 40 times as many nutrients as raw municipal sewage (Florida Sea Grant). That's why even a small amount harms an enclosed bay." } },
    { type: "tf",
      hr: { q: "Maramice na kojima piše „flushable“ otapaju se i zato se mogu bezbrižno ispirati.", c: false, e: "Ne otapaju se i začepljuju cijevi, čak i kod kuće. Na brodu koristi toaletni papir koji se brzo otapa (Florida Sea Grant)." },
      en: { q: "Wipes labelled “flushable” dissolve, so they can safely be flushed.", c: false, e: "They don't dissolve and clog pipes, even at home. On a boat, use rapidly dissolving toilet paper (Florida Sea Grant)." } },
    { hr: { q: "Pri pumpanju tok ne krene ni nakon jedne minute. Što prvo napraviš?", a: ["Nastavak stavim u vodu na deset sekundi, pa provjerim crijevo i ventilaciju spremnika", "Pojačam pumpu do maksimuma", "Skinem čep WATER i pokušam ondje"], c: 0, e: "Savjet Florida Sea Granta: stavi nastavak u vodu na deset sekundi, a zatim provjeri ima li začepljenja ili zraka u crijevu i otvoru za zrak spremnika. Čep WATER je pitka voda." },
      en: { q: "The flow hasn't started after a minute of pumping. What do you try first?", a: ["Put the nozzle in water for ten seconds, then check the hose and tank vent", "Turn the pump up to maximum", "Remove the WATER cap and try there"], c: 0, e: "Florida Sea Grant advice: place the nozzle in water for ten seconds, then check the hose and the tank air vent for a clog or leak. The WATER cap is drinking water." } },
    /* Blue Flag marina criteria 2024: https://www.blueflag.global/s/Marina-Criteria-and-explanatory-notes-2024.pdf */
    { type: "tf",
      hr: { q: "Marina s Plavom zastavom mora imati uređaj za prihvat otpada iz brodskih WC spremnika.", c: true, e: "Točno. To je obvezni kriterij Plave zastave za marine: stalna stanica, pokretni uređaj ili cisterna za crne vode, uvijek dostupna dok marina radi." },
      en: { q: "A Blue Flag marina must have a facility for receiving waste from boat toilet tanks.", c: true, e: "Correct. It's an imperative Blue Flag marina criterion: a permanent station, mobile unit or black-water van, easily accessible whenever the marina operates." } },
    { type: "multi",
      hr: { q: "Što stručnjaci preporučuju za spremnik i sive vode?", a: ["Enzimska sredstva umjesto kemijskih dezodoransa", "Biorazgradive sapune bez fosfata", "Sredstva s formaldehidom", "Maramice „za ispiranje“ umjesto papira"], c: [0, 1], e: "Enzimska sredstva i biorazgradivi sapuni bez fosfata su preporuka. Formaldehid je sumnjiv kancerogen, a maramice začepljuju sustav." },
      en: { q: "What do experts recommend for the holding tank and greywater?", a: ["Enzyme-based treatments instead of chemical deodorisers", "Biodegradable, phosphate-free soaps", "Products with formaldehyde", "“Flushable” wipes instead of paper"], c: [0, 1], e: "Enzyme treatments and biodegradable, phosphate-free soaps are recommended. Formaldehyde is a suspected carcinogen and wipes clog the system." } },
    /* EC technical report 2008 (Posidonia beds): https://uicnmed.org/bibliotecavirtualposidonia/wp-content/uploads/2014/04/MANAGEMENT-of-Natura-2000-habitats-Posidonia-beds.pdf */
    { hr: { q: "Koliko posidonija otprilike naraste u godinu dana?", a: ["Oko 1 do 6 cm", "Oko 1 m", "Oko pola metra"], c: 0, e: "Prema izvješću Europske komisije posidonija raste izuzetno sporo, 1 do 6 cm godišnje, a potpuni oporavak livada mjeri se stoljećima. Zato sidro čini dugotrajnu štetu." },
      en: { q: "Roughly how much does Posidonia grow in a year?", a: ["About 1 to 6 cm", "About 1 m", "About half a metre"], c: 0, e: "According to the European Commission report, Posidonia grows extremely slowly, 1 to 6 cm a year, and full recovery of meadows takes centuries. That's why an anchor does lasting damage." } },
    /* Croatia Week o BIOPRESSADRIA: https://www.croatiaweek.com/croatia-posidonia-meadows-boat-anchoring-pressure/ */
    { type: "tf",
      hr: { q: "U nekim promatranim područjima u Hrvatskoj između četvrtine i dvije trećine plovila sidri se izravno iznad livada posidonije.", c: true, e: "Točno. Satelitsko praćenje (projekt BIOPRESSADRIA) pokazalo je 25 do 65 % plovila iznad posidonije, manje tamo gdje su ekološki vezovi, npr. u NP Kornati." },
      en: { q: "In some monitored areas in Croatia between a quarter and two thirds of vessels anchor directly on Posidonia meadows.", c: true, e: "Correct. Satellite monitoring (the BIOPRESSADRIA project) found 25 to 65% of vessels over Posidonia, fewer where ecological moorings exist, e.g. in Kornati National Park." } },
    /* beaches.ie (irska agencija): https://www.beaches.ie/?p=462 */
    { hr: { q: "Nakon jake kiše kupanje se preporučuje izbjegavati barem koliko dugo (preporuka irske agencije za okoliš)?", a: ["Najmanje 48 sati", "Oko sat vremena", "Nije potrebno"], c: 0, e: "Jaka kiša može u more potisnuti neobrađene otpadne vode. Irska agencija savjetuje čekati najmanje 48 sati, jer rezultati ispitivanja kasne nekoliko dana." },
      en: { q: "After heavy rain, how long should you avoid bathing at least (Irish EPA advice)?", a: ["At least 48 hours", "About an hour", "No need to wait"], c: 0, e: "Heavy rain can wash untreated sewage into the sea. The Irish EPA advises waiting at least 48 hours, as test results lag by several days." } },
    /* US EPA, indikator enterokoki */
    { hr: { q: "Zašto se u ispitivanju mora mjere crijevni enterokoki?", a: ["Pokazuju moguće fekalno onečišćenje, a s njim i uzročnike bolesti", "Svjetlucaju pa pokazuju cvjetanje algi", "Oni su glavna hranjiva tvar za alge"], c: 0, e: "Enterokoki žive u crijevima toplokrvnih životinja. Sami obično nisu štetni, ali njihova prisutnost upućuje da bi mogli biti i virusi, bakterije i praživotinje koje uzrokuju bolesti (US EPA)." },
      en: { q: "Why are intestinal enterococci measured when testing seawater?", a: ["They indicate possible faecal contamination, and so possible disease-causing organisms", "They glow, showing an algal bloom", "They are the main nutrient for algae"], c: 0, e: "Enterococci live in the intestines of warm-blooded animals. They're usually not harmful themselves, but their presence suggests that disease-causing viruses, bacteria and protozoa may be there too (US EPA)." } },
    /* IMO: https://imo.org/en/OurWork/Environment/Pages/Sewage-Default.aspx */
    { type: "tf",
      hr: { q: "MARPOL Prilog IV izravno se odnosi na brodove u međunarodnoj plovidbi od 400 GT ili s dozvolom za više od 15 osoba.", c: true, e: "Točno. Manje brodice u Hrvatskoj obvezuju nacionalna pravila (Pravilnik NN 72/2021), koja primjenjuju ista pravila na jahte i brodice." },
      en: { q: "MARPOL Annex IV applies directly to ships on international voyages of 400 GT or certified for more than 15 persons.", c: true, e: "Correct. Smaller boats in Croatia are covered by national rules (Ordinance NN 72/2021), which apply the same rules to yachts and boats." } }
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
})();
