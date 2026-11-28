// Regije za grupiranje popisa prihvatnih mjesta, od sjevera prema jugu.
// Podjela po županijama:
//   Istra              = Istarska županija
//   Kvarner            = Primorsko-goranska županija i Senj (Ličko-senjska županija, na obali Kvarnera)
//   Sjeverna Dalmacija = Zadarska i Šibensko-kninska županija
//   Srednja Dalmacija  = Splitsko-dalmatinska županija
//   Južna Dalmacija    = Dubrovačko-neretvanska županija
// Ključ je "id" lokacije iz JSON-a. Lokacija koje ovdje nema prikazuje se pod "Ostalo".
window.CM_REGIONS = {
  redoslijed: ["Istra", "Kvarner", "Sjeverna Dalmacija", "Srednja Dalmacija", "Južna Dalmacija"],
  lokacije: {
    "HR-UMAG-LUKA": "Istra",
    "HR-ROVINJ-VALALTA": "Istra",
    "HR-ROVINJ-ACI": "Istra",
    "HR-PULA-PULESANA": "Istra",
    "HR-MEDULIN-PUNTICA": "Istra",

    "HR-ICICI-ACI-OPATIJA": "Kvarner",
    "HR-CRES-ACI": "Kvarner",
    "HR-PUNAT-MARINA": "Kvarner",
    "HR-SENJ-LUKA": "Kvarner",
    "HR-RAB-ACI": "Kvarner",
    "HR-SUPETARSKA-DRAGA-ACI": "Kvarner",

    "HR-SIMUNI-ACI": "Sjeverna Dalmacija",
    "HR-ZADAR-BORIK": "Sjeverna Dalmacija",
    "HR-SUKOSAN-DALMACIJA": "Sjeverna Dalmacija",
    "HR-DRAGE-MARINA": "Sjeverna Dalmacija",
    "HR-BETINA-MARINA": "Sjeverna Dalmacija",
    "HR-PIROVAC-MARINA": "Sjeverna Dalmacija",
    "HR-SIBENIK-MANDALINA": "Sjeverna Dalmacija",

    "HR-TROGIR-BRODOTROGIR": "Srednja Dalmacija",
    "HR-SPLIT-SPINUT": "Srednja Dalmacija",
    "HR-STROZANAC-DSR": "Srednja Dalmacija",
    "HR-PODSTRANA-LAV": "Srednja Dalmacija",

    "HR-VELA-LUKA-KORKYRA": "Južna Dalmacija",
    "HR-VELA-LUKA-PORT": "Južna Dalmacija",
    "HR-KORCULA-ACI": "Južna Dalmacija",
    "HR-SLANO-ACI": "Južna Dalmacija",
    "HR-DUBROVNIK-ACI": "Južna Dalmacija",
    "HR-DUBROVNIK-GRUZ-LUKA": "Južna Dalmacija",
    "HR-DUBROVNIK-LUKA": "Južna Dalmacija"
  }
};
