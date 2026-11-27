/* ČistoMore — prijevodi stranice „Nova prijava“ (report.html). Ključevi: report.* */
CM_i18n.add({
  hr: {
    report: {
      docTitle: "ČistoMore – Nova prijava",
      brandSub: "Obrazac za prijavu",
      back: "Natrag na početnu",
      title: "Nova prijava",
      sub: "Prijavite ispuštanje otpadnih voda ili fekalija",
      section: "Podaci o ispuštanju",
      choose: "Odaberite...",
      datetime: "Vrijeme i datum",
      wasteType: "Vrsta otpada",
      waste: { fekalna: "Fekalna", otpadna: "Otpadna", ostalo: "Ostalo" },
      shipType: "Vrsta broda",
      ship: {
        jahta: "Jahta", jedrilica: "Jedrilica", ribarski: "Ribarski brod", putnicki: "Putnički brod / trajekt",
        teretni: "Teretni brod", tanker: "Tanker", camac: "Mali čamac", ostalo: "Ostalo"
      },
      shipSize: "Veličina broda",
      size: {
        mali: "Mali (do 10 m)", srednji: "Srednji (10–24 m)", veliki: "Veliki (24–50 m)", vrlo: "Vrlo veliki (preko 50 m)"
      },
      shipColor: "Boja broda",
      shipColorHex: "Boja broda (heksadecimalni zapis)",
      registration: "Registracija",
      registrationPh: "npr. ST-1234-AB",
      notes: "Opis",
      notesPh: "Opišite što ste uočili...",
      files: "Fotografije / datoteke",
      filesDrop: "Dodirnite za učitavanje slika (.png, .jpg, .webp, .heic...)",
      fileRemove: "Ukloni datoteku {name}",
      gps: "GPS lokacija",
      gpsBtn: "Dohvati GPS lokaciju",
      gpsNone: "Lokacija nije dohvaćena",
      gpsLoading: "Dohvaćam lokaciju...",
      gpsFail: "Nije moguće dohvatiti lokaciju",
      lat: "Zemljopisna širina",
      latPh: "npr. N 43.5081",
      lon: "Zemljopisna dužina",
      lonPh: "npr. E 16.4402",
      land: "Promatram s kopna",
      landSub: "Nisam na moru — uključi kompas za smjer broda",
      compassHint: "Lokacija koju ste dohvatili nije na moru. Uperite telefon prema brodu i dohvatite smjer kompasa kako bismo mogli procijeniti gdje se brod nalazi.",
      compassBtn: "Dohvati smjer kompasa",
      compassDir: "Smjer kompasa",
      bearingManual: "Ili unesite smjer ručno (0–359°)",
      bearingPh: "npr. 135",
      submit: "Pošalji prijavu",
      saving: "Spremam...",
      toast: {
        noGeo: "Geolokacija nije podržana na ovom uređaju.",
        gpsFail: "Dohvaćanje GPS lokacije nije uspjelo. Unesite ručno.",
        onLand: "Lokacija je na kopnu — uključen je unos smjera kompasa.",
        compassHttps: "Kompas radi samo na HTTPS stranici (npr. na GitHub Pages), ne lokalno iz datoteke. Unesite smjer ručno.",
        compassOn: "Kompas aktivan — okrenite telefon prema brodu.",
        compassNoReading: "Nema očitanja sa senzora smjera na ovom uređaju. Unesite smjer ručno.",
        compassDenied: "Pristup senzoru smjera nije odobren. Unesite smjer ručno.",
        compassUnavailable: "Senzor smjera nije dostupan. Unesite smjer ručno.",
        compassNone: "Ovaj uređaj nema senzor smjera. Unesite smjer ručno.",
        saved: "Prijava {id} je uspješno poslana.",
        savedNoPhoto: "Prijava {id} je poslana, ali fotografija nije spremljena (nema mjesta).",
        saveFail: "Prijavu nije moguće spremiti na ovom uređaju."
      },
      val: {
        required: "Ispunite ovo polje.",
        select: "Odaberite jednu od ponuđenih mogućnosti.",
        lat: "Unesite širinu kao broj od -90 do 90 (npr. N 43.5081).",
        lon: "Unesite dužinu kao broj od -180 do 180 (npr. E 16.4402).",
        bearing: "Unesite smjer od 0 do 359°."
      },
      done: {
        title: "Prijava {id} je zaprimljena",
        text: "Spremljena je na ovom uređaju i vidljiva u obradi prijava. Status: zaprimljeno.",
        view: "Pogledaj u obradi",
        again: "Nova prijava"
      }
    }
  },
  en: {
    report: {
      docTitle: "ČistoMore – New report",
      brandSub: "Report form",
      back: "Back to home",
      title: "New report",
      sub: "Report a discharge of wastewater or sewage",
      section: "Discharge details",
      choose: "Choose...",
      datetime: "Date and time",
      wasteType: "Type of waste",
      waste: { fekalna: "Sewage (black water)", otpadna: "Wastewater (grey water)", ostalo: "Other" },
      shipType: "Vessel type",
      ship: {
        jahta: "Yacht", jedrilica: "Sailboat", ribarski: "Fishing boat", putnicki: "Passenger ship / ferry",
        teretni: "Cargo ship", tanker: "Tanker", camac: "Small boat", ostalo: "Other"
      },
      shipSize: "Vessel size",
      size: {
        mali: "Small (up to 10 m)", srednji: "Medium (10–24 m)", veliki: "Large (24–50 m)", vrlo: "Very large (over 50 m)"
      },
      shipColor: "Hull colour",
      shipColorHex: "Hull colour (hex code)",
      registration: "Registration",
      registrationPh: "e.g. ST-1234-AB",
      notes: "Description",
      notesPh: "Describe what you saw...",
      files: "Photos / files",
      filesDrop: "Tap to upload images (.png, .jpg, .webp, .heic...)",
      fileRemove: "Remove file {name}",
      gps: "GPS location",
      gpsBtn: "Get GPS location",
      gpsNone: "Location not retrieved",
      gpsLoading: "Getting location...",
      gpsFail: "Could not get location",
      lat: "Latitude",
      latPh: "e.g. N 43.5081",
      lon: "Longitude",
      lonPh: "e.g. E 16.4402",
      land: "Observing from land",
      landSub: "I'm not at sea — turn on the compass for the vessel's bearing",
      compassHint: "The location you retrieved is not at sea. Point your phone at the vessel and read the compass bearing so we can estimate where the vessel is.",
      compassBtn: "Read compass bearing",
      compassDir: "Compass bearing",
      bearingManual: "Or enter the bearing manually (0–359°)",
      bearingPh: "e.g. 135",
      submit: "Send report",
      saving: "Saving...",
      toast: {
        noGeo: "Geolocation is not supported on this device.",
        gpsFail: "Could not get your GPS location. Enter it manually.",
        onLand: "The location is on land — compass bearing input is turned on.",
        compassHttps: "The compass only works on an HTTPS page (e.g. GitHub Pages), not from a local file. Enter the bearing manually.",
        compassOn: "Compass active — point your phone at the vessel.",
        compassNoReading: "No readings from an orientation sensor on this device. Enter the bearing manually.",
        compassDenied: "Access to the orientation sensor was not granted. Enter the bearing manually.",
        compassUnavailable: "The orientation sensor is not available. Enter the bearing manually.",
        compassNone: "This device has no orientation sensor. Enter the bearing manually.",
        saved: "Report {id} was sent successfully.",
        savedNoPhoto: "Report {id} was sent, but the photo was not saved (out of space).",
        saveFail: "The report could not be saved on this device."
      },
      val: {
        required: "Please fill in this field.",
        select: "Please choose one of the options.",
        lat: "Enter latitude as a number from -90 to 90 (e.g. N 43.5081).",
        lon: "Enter longitude as a number from -180 to 180 (e.g. E 16.4402).",
        bearing: "Enter a bearing from 0 to 359°."
      },
      done: {
        title: "Report {id} received",
        text: "It is saved on this device and visible in report handling. Status: received.",
        view: "View in report handling",
        again: "New report"
      }
    }
  }
});
