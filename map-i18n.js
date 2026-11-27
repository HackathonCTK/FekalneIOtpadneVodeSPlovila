// ČistoMore: prijevodi stranice karte (map.html), HR i EN.
// Učitava se nakon app.js (CM_i18n), a prije map.js.
// Podaci o mjestima (nazivi, adrese, napomene iz izvora) ostaju kakvi jesu; ovdje su samo tekstovi sučelja,
// nazivi regija i nazivi dodatnih usluga (window.CM_MAP_SVC_EN, ključ je hrvatski naziv iz data/kontakti.js).
(function(){
  "use strict";

  window.CM_MAP_I18N = {
    hr: { map: {
      title: "ČistoMore – Pražnjenje spremnika",
      brandSub: "Prihvatna mjesta",
      back: "Natrag na početnu",
      pageTitle: "Pražnjenje spremnika",
      pageSub: "Mjesta za prihvat fekalnih i otpadnih voda s plovila",
      searchLabel: "Pretraži prihvatna mjesta",
      searchPlaceholder: "Marina ili mjesto",
      suggestAria: "Prijedlozi",
      nearest: "Najbliže meni",
      nearestAria: "Pronađi najbliže prihvatno mjesto",
      locating: "Tražim lokaciju…",
      cancel: "Odustani",
      close: "Zatvori",
      mapAria: "Karta prihvatnih mjesta",
      zoomIn: "Približi",
      zoomOut: "Udalji",
      osmContrib: "suradnici",
      legend: {
        station: "Prihvatno mjesto (približna lokacija)",
        cluster: "Skupina mjesta",
        user: "Vaša lokacija"
      },
      notice: "Popis se temelji na referencama ugrađenih uređaja. Prije dolaska provjerite kod operatora radi li uređaj i koje vode prima.",
      cluster: "{n} prihvatnih mjesta, približi kartu",
      yourLocation: "Vaša lokacija",

      fallbackNoLeaflet: "Karta se ne može učitati bez internetske veze. Popis i pretraga i dalje rade.",
      fallbackFile: "Karta se ne prikazuje kad se stranica otvori dvoklikom. Pokrenite aplikaciju preko servera (npr. Live Server u VS Codeu ili hosting). Popis, pretraga i najbliže mjesto preko GPS-a i dalje rade.",
      tileError: "Podloga karte se ne učitava. Provjerite internetsku vezu.",

      list: {
        title: "Prihvatna mjesta",
        titleByDistance: "Prihvatna mjesta po udaljenosti",
        one: "{n} mjesto",
        many: "{n} mjesta",
        of: "{n} od {total}",
        similar: "slični nazivi, ",
        notMapped: "Lokacija još nije ucrtana",
        straight: "zračna linija",
        empty: "Nema prihvatnih mjesta za upit „{q}“.",
        clear: "Očisti pretragu"
      },
      suggest: {
        none: "Nema prihvatnih mjesta za „{q}“.",
        fuzzy: "Nema točnog podudaranja. Možda ste mislili:"
      },
      regions: {
        "Istra": "Istra",
        "Kvarner": "Kvarner",
        "Sjeverna Dalmacija": "Sjeverna Dalmacija",
        "Srednja Dalmacija": "Srednja Dalmacija",
        "Južna Dalmacija": "Južna Dalmacija",
        "Ostalo": "Ostalo"
      },

      detail: {
        status: "Status",
        statusConfirm: "Rad uređaja potvrdite kod operatora prije dolaska.",
        noNote: "Bez dodatne napomene.",
        records: "Izvor navodi {n} zapisa na istoj lokaciji.",
        official: "Prema službenoj stranici: ",
        hrNotes: "",
        water: "Prihvat voda",
        waterBlack: "Crne (fekalne) vode",
        waterGrey: "Sive vode",
        waterBilge: "Kaljužne vode",
        waterVal: {
          documented_pump_out_installation: "Dokumentiran uređaj za ispumpavanje",
          not_confirmed: "Nije potvrđeno",
          not_included: "Nije uključeno"
        },
        contact: "Kontakt",
        phone: "Telefon",
        email: "E-pošta",
        vhf: "VHF kanal",
        web: "Web",
        noContact: "Kontakt nije dostupan.",
        services: "Dodatne usluge",
        noData: "Podatak nije dostupan.",
        location: "Lokacija",
        address: "Adresa",
        coords: "Koordinate",
        noCoords: "Nisu dostupne",
        distance: "Udaljenost",
        distanceVal: "{d} zračne linije",
        sources: "Izvori",
        howTo: "Kako koristiti uslugu",
        howToText: "Opći koraci od najave do potvrde o predaji otpada.",
        guideLink: "Upute za pražnjenje",
        directions: "Navigacija",
        directionsAria: "Navigacija do {name} (Google Maps, otvara se u novoj kartici)",
        showOnMap: "Prikaži na karti"
      },

      guide: {
        title: "Kako koristiti uslugu pražnjenja",
        cardSub: "Sedam koraka, od najave do potvrde o predaji otpada",
        sub: "Opći koraci. Postupak se razlikuje od luke do luke, zato uvijek slijedite upute osoblja.",
        steps: "Koraci",
        important: "Važno",
        sources: "Izvori",
        unavailable: "Upute trenutačno nisu dostupne.",
        interactive: "Interaktivni vodič i kviz"
      },

      near: {
        title: "Najbliže: ",
        clear: "Poništi",
        clearAria: "Poništi moju lokaciju",
        sub: "{d} zračne linije · {addr}",
        details: "Detalji"
      },
      pick: {
        click: "Kliknite na kartu na mjestu gdje se nalazite.",
        tap: "Dodirnite kartu na mjestu gdje se nalazite."
      },
      geo: {
        noMap: "Lokacija nije dostupna, a karta nije učitana.",
        unsupported: "Preglednik ne podržava lokaciju.",
        silent: "Lokacija se ne javlja.",
        https: "Lokacija radi samo na https stranicama.",
        denied: "Pristup lokaciji nije dopušten.",
        unavailable: "Lokacija nije dostupna."
      }
    } },

    en: { map: {
      title: "ČistoMore – Holding tank pump-out",
      brandSub: "Pump-out stations",
      back: "Back to home",
      pageTitle: "Holding tank pump-out",
      pageSub: "Reception points for sewage and waste water from vessels",
      searchLabel: "Search pump-out stations",
      searchPlaceholder: "Marina or town",
      suggestAria: "Suggestions",
      nearest: "Nearest to me",
      nearestAria: "Find the nearest pump-out station",
      locating: "Locating…",
      cancel: "Cancel",
      close: "Close",
      mapAria: "Map of pump-out stations",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      osmContrib: "contributors",
      legend: {
        station: "Pump-out station (approximate location)",
        cluster: "Group of stations",
        user: "Your location"
      },
      notice: "The list is based on references to installed equipment. Before you arrive, check with the operator that the equipment is working and which waste water it accepts.",
      cluster: "{n} pump-out stations, zoom in",
      yourLocation: "Your location",

      fallbackNoLeaflet: "The map can't load without an internet connection. The list and search still work.",
      fallbackFile: "The map isn't shown when the page is opened by double-clicking the file. Run the app from a server (e.g. Live Server in VS Code, or a web host). The list, search and nearest station via GPS still work.",
      tileError: "Map tiles aren't loading. Check your internet connection.",

      list: {
        title: "Pump-out stations",
        titleByDistance: "Pump-out stations by distance",
        one: "{n} place",
        many: "{n} places",
        of: "{n} of {total}",
        similar: "similar names, ",
        notMapped: "Location not yet on the map",
        straight: "straight line",
        empty: "No pump-out stations match “{q}”.",
        clear: "Clear search"
      },
      suggest: {
        none: "No pump-out stations match “{q}”.",
        fuzzy: "No exact match. Did you mean:"
      },
      regions: {
        "Istra": "Istria",
        "Kvarner": "Kvarner",
        "Sjeverna Dalmacija": "Northern Dalmatia",
        "Srednja Dalmacija": "Central Dalmatia",
        "Južna Dalmacija": "Southern Dalmatia",
        "Ostalo": "Other"
      },

      detail: {
        status: "Status",
        statusConfirm: "Confirm with the operator that the equipment is working before you arrive.",
        noNote: "No additional note.",
        records: "The source lists {n} records at this location.",
        official: "According to the official website: ",
        hrNotes: "Notes from the sources are shown in Croatian.",
        water: "Accepted waste water",
        waterBlack: "Black water (sewage)",
        waterGrey: "Grey water",
        waterBilge: "Bilge water",
        waterVal: {
          documented_pump_out_installation: "Documented pump-out installation",
          not_confirmed: "Not confirmed",
          not_included: "Not included"
        },
        contact: "Contact",
        phone: "Phone",
        email: "Email",
        vhf: "VHF channel",
        web: "Website",
        noContact: "No contact details available.",
        services: "Additional services",
        noData: "No information available.",
        location: "Location",
        address: "Address",
        coords: "Coordinates",
        noCoords: "Not available",
        distance: "Distance",
        distanceVal: "{d} in a straight line",
        sources: "Sources",
        howTo: "How to use the service",
        howToText: "General steps from booking to the waste delivery receipt.",
        guideLink: "Pump-out guide",
        directions: "Directions",
        directionsAria: "Directions to {name} (Google Maps, opens in a new tab)",
        showOnMap: "Show on map"
      },

      guide: {
        title: "How to use the pump-out service",
        cardSub: "Seven steps, from booking to the waste delivery receipt",
        sub: "General steps. The procedure differs from port to port, so always follow the staff's instructions.",
        steps: "Steps",
        important: "Important",
        sources: "Sources",
        unavailable: "The guide is currently unavailable.",
        interactive: "Interactive guide and quiz"
      },

      near: {
        title: "Nearest: ",
        clear: "Clear",
        clearAria: "Clear my location",
        sub: "{d} in a straight line · {addr}",
        details: "Details"
      },
      pick: {
        click: "Click the map where you are.",
        tap: "Tap the map where you are."
      },
      geo: {
        noMap: "Location is unavailable and the map hasn't loaded.",
        unsupported: "Your browser doesn't support location.",
        silent: "No response from location services.",
        https: "Location only works on https pages.",
        denied: "Location access was denied.",
        unavailable: "Location is unavailable."
      }
    } }
  };

  // Nazivi dodatnih usluge iz data/kontakti.js na engleskom (hrvatski je izvorni tekst).
  window.CM_MAP_SVC_EN = {
    "Bankomat": "ATM",
    "Bar": "Bar",
    "Bazen": "Swimming pool",
    "Brodogradilište": "Shipyard",
    "Carina": "Customs",
    "Charter": "Charter",
    "Charter agencije": "Charter agencies",
    "Dizalica": "Crane",
    "Dizanje i spuštanje plovila": "Boat lifting and launching",
    "Fitness": "Gym",
    "Gorivo": "Fuel",
    "Granični prijelaz": "Border crossing",
    "Hotel": "Hotel",
    "Istezalište": "Slipway",
    "Istezalište za brodice": "Slipway for small boats",
    "Izvlačenje i spuštanje brodica": "Hauling out and launching boats",
    "Kafić": "Café",
    "Komunalni vezovi": "Municipal berths",
    "Lučka kapetanija": "Harbour master's office",
    "Manji popravci brodova": "Minor boat repairs",
    "Mjenjačnica": "Currency exchange",
    "Najam automobila": "Car rental",
    "Najam bicikala": "Bicycle rental",
    "Najam e-bicikala": "E-bike rental",
    "Najam plovila": "Boat rental",
    "Nautička trgovina": "Chandlery",
    "Parkiralište": "Parking",
    "Praonica rublja": "Laundry",
    "Pranje brodova": "Boat washing",
    "Prihvat fekalnih voda": "Sewage (black water) reception",
    "Prihvat otpada": "Waste reception",
    "Prihvat zauljenih voda": "Oily water reception",
    "Prihvat zauljenog otpada": "Oily waste reception",
    "Punionica za električna vozila": "EV charging station",
    "Punjenje baterija": "Battery charging",
    "Recepcija 0 do 24 h": "24-hour reception",
    "Restoran": "Restaurant",
    "Samohodna kolica": "Self-propelled boat trailer",
    "Sanitarni čvor": "Toilets",
    "Servis": "Repair service",
    "Spremnici za reciklažu": "Recycling bins",
    "Struja": "Electricity",
    "Suhi vez": "Dry berth",
    "Suvenirnica": "Souvenir shop",
    "Travel lift": "Travel lift",
    "Trgovina": "Shop",
    "Tuševi": "Showers",
    "Vez za članove": "Berths for members",
    "Vez za članove (brodice do 15 m)": "Berths for members (boats up to 15 m)",
    "Video nadzor": "CCTV",
    "Voda": "Water",
    "Wellness": "Wellness",
    "Wi-Fi": "Wi-Fi"
  };

  if(window.CM_i18n) window.CM_i18n.add(window.CM_MAP_I18N);
})();
