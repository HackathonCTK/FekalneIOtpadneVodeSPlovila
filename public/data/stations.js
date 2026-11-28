// Generirano iz data/lokacije_fekalnih_voda_hrvatska_29_s_koordinatama.json.
// Ne uređivati ručno: ako se JSON promijeni, ponovo napraviti ovu datoteku (vidi docs/plan-karta.md).
window.CM_STATIONS = {
  "dataset_name": "Lokacije s dokumentiranim instalacijama za ispumpavanje crnih/fekalnih voda – Hrvatska",
  "generated_at": "2026-11-27",
  "record_count": 29,
  "coordinate_status": "Svih 29 zapisa sadrži WGS84 latitude/longitude.",
  "warning": "Ovo nisu 29 potvrđenih javno dostupnih i trenutačno operativnih stanica. Popis se temelji na referencama instalacija; koordinate označene approximate su približna središta marina/luka, ne točne pozicije pumpi. Operator mora potvrditi trenutačni rad, pristup i vrste prihvaćenih voda. Ne prikazivati kao sigurno legalno mjesto dok se to ne potvrdi.",
  "coordinate_sources": [
    {
      "name": "Nautical Information Croatia – coordinates",
      "url": "https://www.sailpro.ch/custom/data/Downloads/1/Nautische%20Informationen%20Kroatien%202018.pdf"
    },
    {
      "name": "Bootsboerse – Croatian harbors and marinas with coordinates",
      "url": "https://tipps.bootsboerse.at/we3/pages/laenderinfos/kroatien/haefen-faehren/koordinaten.php"
    },
    {
      "name": "Ministry of the Sea – official directory of Croatian marinas",
      "url": "https://mmpi.gov.hr/sea/nautics/marinas-of-the-adriatic-directory/8483"
    }
  ],
  "installation_source": {
    "name": "Antea d.o.o. – reference list",
    "url": "https://www.antea.hr/reference/"
  },
  "locations": [
    {
      "id": "HR-PUNAT-MARINA",
      "name": "Marina Punat",
      "country": "HR",
      "address": "Punat, otok Krk, Hrvatska",
      "latitude": 45.02167,
      "longitude": 14.62667,
      "coordinates": {
        "latitude": 45.02167,
        "longitude": 14.62667,
        "crs": "WGS84",
        "basis": "nautical_coordinate_reference",
        "precision_note": "Mobilni uređaj prema referentnom popisu; plan marine navodi mobilnu vakuumsku pumpu."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Mobilni uređaj prema referentnom popisu; plan marine navodi mobilnu vakuumsku pumpu.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-TROGIR-BRODOTROGIR",
      "name": "Marina Brodotrogir",
      "country": "HR",
      "address": "Trogir, Hrvatska",
      "latitude": 43.5167,
      "longitude": 16.245,
      "coordinates": {
        "latitude": 43.5167,
        "longitude": 16.245,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine; koordinata nije točna pozicija pumpe."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine; koordinata nije točna pozicija pumpe.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-DUBROVNIK-GRUZ-LUKA",
      "name": "Luka Gruž",
      "country": "HR",
      "address": "Gruž, Dubrovnik, Hrvatska",
      "latitude": 42.659,
      "longitude": 18.09,
      "coordinates": {
        "latitude": 42.659,
        "longitude": 18.09,
        "crs": "WGS84",
        "basis": "approximate_port_centroid",
        "precision_note": "Približno središte luke; koordinata nije točna pozicija pumpe."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte luke; koordinata nije točna pozicija pumpe.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-SLANO-ACI",
      "name": "ACI marina Veljko Barbieri Slano",
      "country": "HR",
      "address": "Slano, Hrvatska",
      "latitude": 42.78333,
      "longitude": 17.88717,
      "coordinates": {
        "latitude": 42.78333,
        "longitude": 17.88717,
        "crs": "WGS84",
        "basis": "nautical_coordinate_reference",
        "precision_note": "Približna/nautička koordinata marine; aktualni rad uređaja provjeriti."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približna/nautička koordinata marine; aktualni rad uređaja provjeriti.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-SIBENIK-MANDALINA",
      "name": "Marina Mandalina",
      "country": "HR",
      "address": "Šibenik, Hrvatska",
      "latitude": 43.727,
      "longitude": 15.907,
      "coordinates": {
        "latitude": 43.727,
        "longitude": 15.907,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-MEDULIN-PUNTICA",
      "name": "Marina Puntica",
      "country": "HR",
      "address": "Medulin, Hrvatska",
      "latitude": 44.819,
      "longitude": 13.933,
      "coordinates": {
        "latitude": 44.819,
        "longitude": 13.933,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-ROVINJ-ACI",
      "name": "ACI marina Rovinj",
      "country": "HR",
      "address": "Rovinj, Hrvatska",
      "latitude": 45.06767,
      "longitude": 13.634,
      "coordinates": {
        "latitude": 45.06767,
        "longitude": 13.634,
        "crs": "WGS84",
        "basis": "nautical_coordinate_reference",
        "precision_note": "Nautička koordinata marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Nautička koordinata marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-SPLIT-SPINUT",
      "name": "PŠD Špinut",
      "country": "HR",
      "address": "Spinutska ulica, Split, Hrvatska",
      "latitude": 43.516,
      "longitude": 16.425,
      "coordinates": {
        "latitude": 43.516,
        "longitude": 16.425,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte lučice."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte lučice.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-STROZANAC-DSR",
      "name": "DSR Strožanac",
      "country": "HR",
      "address": "Strožanac, Podstrana, Hrvatska",
      "latitude": 43.499,
      "longitude": 16.55,
      "coordinates": {
        "latitude": 43.499,
        "longitude": 16.55,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte lučice."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte lučice.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-PULA-PULESANA",
      "name": "Marina Pula (Pulešana)",
      "country": "HR",
      "address": "Pula, Hrvatska",
      "latitude": 44.866,
      "longitude": 13.84,
      "coordinates": {
        "latitude": 44.866,
        "longitude": 13.84,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-ROVINJ-VALALTA",
      "name": "Marina Valalta",
      "country": "HR",
      "address": "Valalta, Rovinj, Hrvatska",
      "latitude": 45.107,
      "longitude": 13.625,
      "coordinates": {
        "latitude": 45.107,
        "longitude": 13.625,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-VELA-LUKA-KORKYRA",
      "name": "Marina Korkyra",
      "country": "HR",
      "address": "Vela Luka, otok Korčula, Hrvatska",
      "latitude": 42.961,
      "longitude": 16.712,
      "coordinates": {
        "latitude": 42.961,
        "longitude": 16.712,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-BETINA-MARINA",
      "name": "Marina Betina",
      "country": "HR",
      "address": "Betina, otok Murter, Hrvatska",
      "latitude": 43.824,
      "longitude": 15.607,
      "coordinates": {
        "latitude": 43.824,
        "longitude": 15.607,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-PIROVAC-MARINA",
      "name": "Marina Pirovac",
      "country": "HR",
      "address": "Pirovac, Hrvatska",
      "latitude": 43.819,
      "longitude": 15.673,
      "coordinates": {
        "latitude": 43.819,
        "longitude": 15.673,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-PODSTRANA-LAV",
      "name": "Marina Lav",
      "country": "HR",
      "address": "Podstrana, Hrvatska",
      "latitude": 43.489,
      "longitude": 16.56,
      "coordinates": {
        "latitude": 43.489,
        "longitude": 16.56,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-SENJ-LUKA",
      "name": "Luka Senj",
      "country": "HR",
      "address": "Senj, Hrvatska",
      "latitude": 44.9903,
      "longitude": 14.89985,
      "coordinates": {
        "latitude": 44.9903,
        "longitude": 14.89985,
        "crs": "WGS84",
        "basis": "nautical_coordinate_reference",
        "precision_note": "Koordinata luke Senj iz nautičkog popisa."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Koordinata luke Senj iz nautičkog popisa.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-CRES-ACI",
      "name": "ACI marina Cres",
      "country": "HR",
      "address": "Cres, Hrvatska",
      "latitude": 44.95,
      "longitude": 14.4,
      "coordinates": {
        "latitude": 44.95,
        "longitude": 14.4,
        "crs": "WGS84",
        "basis": "nautical_coordinate_reference",
        "precision_note": "Nautička koordinata marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Nautička koordinata marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-DUBROVNIK-ACI",
      "name": "ACI marina Dubrovnik",
      "country": "HR",
      "address": "Komolac, Dubrovnik, Hrvatska",
      "latitude": 42.672,
      "longitude": 18.13,
      "coordinates": {
        "latitude": 42.672,
        "longitude": 18.13,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine u Komolcu."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine u Komolcu.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-KORCULA-ACI",
      "name": "ACI marina Korčula",
      "country": "HR",
      "address": "Korčula, Hrvatska",
      "latitude": 42.958,
      "longitude": 17.138,
      "coordinates": {
        "latitude": 42.958,
        "longitude": 17.138,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-UMAG-LUKA",
      "name": "Luka Umag",
      "country": "HR",
      "address": "Umag, Hrvatska",
      "latitude": 45.437,
      "longitude": 13.517,
      "coordinates": {
        "latitude": 45.437,
        "longitude": 13.517,
        "crs": "WGS84",
        "basis": "approximate_port_centroid",
        "precision_note": "Približno središte luke."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte luke.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-DRAGE-MARINA",
      "name": "Marina Drage",
      "country": "HR",
      "address": "Drage, Hrvatska",
      "latitude": 43.883,
      "longitude": 15.533,
      "coordinates": {
        "latitude": 43.883,
        "longitude": 15.533,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-DUBROVNIK-LUKA",
      "name": "Luka Dubrovnik",
      "country": "HR",
      "address": "Gruž, Dubrovnik, Hrvatska",
      "latitude": 42.659,
      "longitude": 18.09,
      "coordinates": {
        "latitude": 42.659,
        "longitude": 18.09,
        "crs": "WGS84",
        "basis": "approximate_port_centroid",
        "precision_note": "Približno središte luke; moguće preklapanje s lokacijom Luka Gruž."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte luke; moguće preklapanje s lokacijom Luka Gruž.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-SUKOSAN-DALMACIJA",
      "name": "Marina Dalmacija",
      "country": "HR",
      "address": "Sukošan, Hrvatska",
      "latitude": 44.047,
      "longitude": 15.31,
      "coordinates": {
        "latitude": 44.047,
        "longitude": 15.31,
        "crs": "WGS84",
        "basis": "approximate_marina_centroid",
        "precision_note": "Približno središte marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-ZADAR-BORIK",
      "name": "Marina Borik",
      "country": "HR",
      "address": "Zadar, Hrvatska",
      "latitude": 44.145,
      "longitude": 15.217,
      "coordinates": {
        "latitude": 44.145,
        "longitude": 15.217,
        "crs": "WGS84",
        "basis": "nautical_coordinate_reference",
        "precision_note": "Nautička koordinata marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Nautička koordinata marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-VELA-LUKA-PORT",
      "name": "Luka Vela Luka – lučki bazen 2, terminal",
      "country": "HR",
      "address": "Lučki bazen 2, terminal, Vela Luka, Hrvatska",
      "latitude": 42.96,
      "longitude": 16.716,
      "coordinates": {
        "latitude": 42.96,
        "longitude": 16.716,
        "crs": "WGS84",
        "basis": "approximate_terminal_centroid",
        "precision_note": "Približno središte terminala; službena lučka uprava navodi stacionarni uređaj za crne vode."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Približno središte terminala; službena lučka uprava navodi stacionarni uređaj za crne vode.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-ICICI-ACI-OPATIJA",
      "name": "ACI marina Opatija",
      "country": "HR",
      "address": "Ičići, Hrvatska",
      "latitude": 45.31667,
      "longitude": 14.295,
      "coordinates": {
        "latitude": 45.31667,
        "longitude": 14.295,
        "crs": "WGS84",
        "basis": "nautical_coordinate_reference",
        "precision_note": "Nautička koordinata marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Nautička koordinata marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-SIMUNI-ACI",
      "name": "ACI marina Šimuni",
      "country": "HR",
      "address": "Šimuni, otok Pag, Hrvatska",
      "latitude": 44.468,
      "longitude": 14.95898,
      "coordinates": {
        "latitude": 44.468,
        "longitude": 14.95898,
        "crs": "WGS84",
        "basis": "nautical_coordinate_reference",
        "precision_note": "Nautička koordinata marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Nautička koordinata marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-SUPETARSKA-DRAGA-ACI",
      "name": "ACI marina Supetarska Draga",
      "country": "HR",
      "address": "Supetarska Draga, otok Rab, Hrvatska",
      "latitude": 44.80333,
      "longitude": 14.73,
      "coordinates": {
        "latitude": 44.80333,
        "longitude": 14.73,
        "crs": "WGS84",
        "basis": "nautical_coordinate_reference",
        "precision_note": "Nautička koordinata marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Nautička koordinata marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    },
    {
      "id": "HR-RAB-ACI",
      "name": "ACI marina Rab",
      "country": "HR",
      "address": "Rab, Hrvatska",
      "latitude": 44.75667,
      "longitude": 14.76667,
      "coordinates": {
        "latitude": 44.75667,
        "longitude": 14.76667,
        "crs": "WGS84",
        "basis": "nautical_coordinate_reference",
        "precision_note": "Nautička koordinata marine."
      },
      "wastewater": {
        "black_water_fecal": "documented_pump_out_installation",
        "grey_water": "not_confirmed",
        "bilge_water": "not_included"
      },
      "equipment": {
        "installation_reference_year": null
      },
      "current_operational_status": "requires_confirmation_with_operator",
      "map_display": {
        "show_as_legal_discharge_location": false,
        "marker_status": "installation_documented_current_operation_unverified"
      },
      "verification_note": "Nautička koordinata marine.",
      "sources": [
        {
          "name": "Antea d.o.o. – reference list",
          "url": "https://www.antea.hr/reference/"
        }
      ]
    }
  ]
};
