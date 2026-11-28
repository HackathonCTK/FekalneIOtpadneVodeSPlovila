// ČistoMore: karta prihvatnih mjesta za pražnjenje spremnika (map.html), grupa 2.
// Podaci:  window.CM_STATIONS (data/stations.js, iz JSON-a)
//          window.CM_CONTACTS (data/kontakti.js, istraženi kontakti i usluge)
//          window.CM_GUIDE    (data/upute.js, opće upute)
//          window.CM_REGIONS  (data/regije.js, regija za svaku lokaciju)
//          window.CM_DATA_EN  (data/i18n-en.js, engleski prijevod tih podataka)
// Spojena aplikacija: tekstovi HR/EN (CM.t), podloga karte iz lokalne baze ili OpenStreetMapa (basemap.js),
// a map.html?station=<id> otvara i ističe to mjesto (dogovor iz INTEGRACIJA.md, točka D).
(function(){
  "use strict";

  var DATA = window.CM_STATIONS || { locations: [] };
  var CONTACTS = window.CM_CONTACTS || {};
  var GUIDE = window.CM_GUIDE || null;
  var REGIONS = window.CM_REGIONS || { redoslijed: [], lokacije: {} };
  var EN = window.CM_DATA_EN || {};
  var OTHER_REGION = "Ostalo";

  /* ---------- tekstovi (HR/EN) ---------- */
  CM.addI18n({
    hr: {
      "map.docTitle": "ČistoMore – Pražnjenje spremnika", "map.eyebrow": "Prihvatna mjesta", "map.title": "Pražnjenje spremnika",
      "map.lead": "Mjesta za prihvat fekalnih i otpadnih voda s plovila",
      "map.searchLabel": "Pretraži prihvatna mjesta", "map.searchPh": "Marina ili mjesto", "map.suggestAria": "Prijedlozi",
      "map.nearest": "Najbliže meni", "map.nearestAria": "Pronađi najbliže prihvatno mjesto", "map.searching": "Tražim lokaciju…",
      "map.pickClick": "Kliknite na kartu na mjestu gdje se nalazite.", "map.pickTouch": "Dodirnite kartu na mjestu gdje se nalazite.",
      "map.cancel": "Odustani", "map.mapAria": "Karta prihvatnih mjesta", "map.close": "Zatvori",
      "map.legendPlace": "Prihvatno mjesto (približna lokacija)", "map.legendCluster": "Skupina mjesta", "map.legendUser": "Vaša lokacija",
      "map.notice": "Popis se temelji na referencama ugrađenih uređaja. Prije dolaska provjerite kod operatora radi li uređaj i koje vode prima.",
      "map.guideTitle": "Kako koristiti uslugu pražnjenja", "map.guideSub": "Sedam koraka, od najave do potvrde o predaji otpada",
      "map.guideSheetSub": "Opći koraci. Postupak se razlikuje od luke do luke, zato uvijek slijedite upute osoblja.",
      "map.status": "Rad uređaja potvrdite kod operatora prije dolaska.",
      "map.fallbackOffline": "Karta se ne može učitati bez internetske veze. Popis i pretraga i dalje rade.",
      "map.fallbackFile": "Karta se ne prikazuje kad se stranica otvori dvoklikom. Pokrenite aplikaciju preko servera (npm start). Popis, pretraga i najbliže mjesto preko GPS-a i dalje rade.",
      "map.tileError": "Podloga karte se ne učitava. Provjerite internetsku vezu.",
      "map.clusterSr": "{n} prihvatnih mjesta, približi kartu",
      "map.notDrawn": "Lokacija još nije ucrtana", "map.airline": "zračna linija", "map.airlineGen": "zračne linije",
      "map.listTitle": "Prihvatna mjesta", "map.listTitleDist": "Prihvatna mjesta po udaljenosti",
      "map.similar": "slični nazivi, ", "map.of": "{a} od {b}",
      "map.noneFor": "Nema prihvatnih mjesta za upit „{q}“.", "map.noneForShort": "Nema prihvatnih mjesta za „{q}“.",
      "map.clearSearch": "Očisti pretragu", "map.didYouMean": "Nema točnog podudaranja. Možda ste mislili:",
      "map.secStatus": "Status", "map.secContact": "Kontakt", "map.secServices": "Dodatne usluge", "map.secLocation": "Lokacija",
      "map.secSources": "Izvori", "map.secSteps": "Koraci", "map.secImportant": "Važno",
      "map.recordsNote": "Izvor navodi {n} zapisa na istoj lokaciji.", "map.noNote": "Bez dodatne napomene.",
      "map.official": "Prema službenoj stranici: ",
      "map.phone": "Telefon", "map.email": "E-pošta", "map.vhf": "VHF kanal", "map.web": "Web",
      "map.noContact": "Kontakt nije dostupan.", "map.noData": "Podatak nije dostupan.",
      "map.address": "Adresa", "map.coords": "Koordinate", "map.coordsNone": "Nisu dostupne", "map.distance": "Udaljenost",
      "map.navigate": "Navigacija", "map.showOnMap": "Prikaži na karti", "map.details": "Detalji",
      "map.guideNone": "Upute trenutačno nisu dostupne.",
      "map.nearestTitle": "Najbliže: ", "map.reset": "Poništi", "map.resetAria": "Poništi moju lokaciju", "map.you": "Vaša lokacija",
      "map.noMap": "Lokacija nije dostupna, a karta nije učitana.", "map.noGeo": "Preglednik ne podržava lokaciju.",
      "map.geoSilent": "Lokacija se ne javlja.", "map.geoHttps": "Lokacija radi samo na https stranicama.",
      "map.geoDenied": "Pristup lokaciji nije dopušten.", "map.geoNone": "Lokacija nije dostupna.",
      "map.stationUnknown": "Prihvatno mjesto „{id}“ nije pronađeno. Prikazani su rezultati pretrage."
    },
    en: {
      "map.docTitle": "ČistoMore – Pump-out", "map.eyebrow": "Pump-out stations", "map.title": "Emptying your holding tank",
      "map.lead": "Places that take sewage and wastewater from boats",
      "map.searchLabel": "Search pump-out stations", "map.searchPh": "Marina or town", "map.suggestAria": "Suggestions",
      "map.nearest": "Nearest to me", "map.nearestAria": "Find the nearest pump-out station", "map.searching": "Finding you…",
      "map.pickClick": "Click the map where you are.", "map.pickTouch": "Tap the map where you are.",
      "map.cancel": "Cancel", "map.mapAria": "Map of pump-out stations", "map.close": "Close",
      "map.legendPlace": "Pump-out station (approximate location)", "map.legendCluster": "Group of stations", "map.legendUser": "Your location",
      "map.notice": "The list is based on references to installed devices. Before you go, check with the operator that the device works and which water it takes.",
      "map.guideTitle": "How to use the pump-out service", "map.guideSub": "Seven steps, from booking to the waste delivery receipt",
      "map.guideSheetSub": "General steps. The procedure differs from port to port, so always follow the staff’s instructions.",
      "map.status": "Confirm with the operator that the device is working before you arrive.",
      "map.fallbackOffline": "The map can’t load without an internet connection. The list and search still work.",
      "map.fallbackFile": "The map isn’t shown when the page is opened as a file. Start the app through the server (npm start). The list, search and nearest station by GPS still work.",
      "map.tileError": "The map background isn’t loading. Check your internet connection.",
      "map.clusterSr": "{n} pump-out stations, zoom in",
      "map.notDrawn": "Location not on the map yet", "map.airline": "as the crow flies", "map.airlineGen": "as the crow flies",
      "map.listTitle": "Pump-out stations", "map.listTitleDist": "Pump-out stations by distance",
      "map.similar": "similar names, ", "map.of": "{a} of {b}",
      "map.noneFor": "No pump-out stations match “{q}”.", "map.noneForShort": "No pump-out stations match “{q}”.",
      "map.clearSearch": "Clear search", "map.didYouMean": "No exact match. Did you mean:",
      "map.secStatus": "Status", "map.secContact": "Contact", "map.secServices": "Other services", "map.secLocation": "Location",
      "map.secSources": "Sources", "map.secSteps": "Steps", "map.secImportant": "Important",
      "map.recordsNote": "The source lists {n} records at the same location.", "map.noNote": "No extra note.",
      "map.official": "According to the official website: ",
      "map.phone": "Phone", "map.email": "Email", "map.vhf": "VHF channel", "map.web": "Website",
      "map.noContact": "No contact details available.", "map.noData": "No information available.",
      "map.address": "Address", "map.coords": "Coordinates", "map.coordsNone": "Not available", "map.distance": "Distance",
      "map.navigate": "Directions", "map.showOnMap": "Show on map", "map.details": "Details",
      "map.guideNone": "Instructions aren’t available right now.",
      "map.nearestTitle": "Nearest: ", "map.reset": "Clear", "map.resetAria": "Clear my location", "map.you": "Your location",
      "map.noMap": "Your location isn’t available and the map hasn’t loaded.", "map.noGeo": "This browser doesn’t support location.",
      "map.geoSilent": "The location isn’t responding.", "map.geoHttps": "Location only works on https pages.",
      "map.geoDenied": "Location access isn’t allowed.", "map.geoNone": "Location isn’t available.",
      "map.stationUnknown": "Pump-out station “{id}” wasn’t found. Showing search results instead."
    }
  });
  CM.applyI18n();
  function T(k, vars){ return CM.t("map." + k, vars); }
  function isEn(){ return CM.lang === "en"; }
  function regionName(r){ return isEn() && EN.regije && EN.regije[r] ? EN.regije[r] : r; }
  function serviceName(u){ return isEn() && EN.usluge && EN.usluge[u] ? EN.usluge[u] : u; }

  // Miš na računalu ili dodir na mobitelu, za tekst uputa ("Kliknite" / "Dodirnite").
  var finePointer = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);

  // ---------- Pomoćne funkcije ----------
  function $(id){ return document.getElementById(id); }

  // Gradi DOM bez innerHTML, tako da tekst iz podataka nikad ne postane HTML.
  function el(tag, props){
    var node = document.createElement(tag);
    if(props){
      Object.keys(props).forEach(function(k){
        var v = props[k];
        if(v === null || v === undefined || v === false) return;
        if(k === "text") node.textContent = v;
        else if(k === "className") node.className = v;
        else if(k === "on") Object.keys(v).forEach(function(ev){ node.addEventListener(ev, v[ev]); });
        else node.setAttribute(k, v);
      });
    }
    for(var i = 2; i < arguments.length; i++){
      var c = arguments[i];
      if(c === null || c === undefined || c === false) continue;
      if(Array.isArray(c)) c.forEach(function(cc){ if(cc) node.appendChild(typeof cc === "string" ? document.createTextNode(cc) : cc); });
      else node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  function chevron(){
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "station-chevron");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", "m9 18 6-6-6-6");
    svg.appendChild(path);
    return svg;
  }

  function normalize(s){
    return String(s || "").toLowerCase().replace(/đ/g, "d")
      .normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function safeUrl(u){
    return typeof u === "string" && /^(https?:|mailto:|tel:)/i.test(u.trim()) ? u.trim() : null;
  }

  function isNum(n){ return typeof n === "number" && isFinite(n); }

  function shortAddress(a){ return String(a || "").replace(/,\s*Hrvatska\s*$/i, ""); }

  // Udaljenost zračnom linijom (haversine), u km.
  function distanceKm(lat1, lon1, lat2, lon2){
    var R = 6371, toRad = Math.PI / 180;
    var dLat = (lat2 - lat1) * toRad, dLon = (lon2 - lon1) * toRad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function fmtKm(d){
    return d.toLocaleString(isEn() ? "en-GB" : "hr-HR", { maximumFractionDigits: d < 10 ? 1 : 0 }) + " km";
  }

  // 1 mjesto, 21 mjesto; 2, 5, 28 mjesta  |  1 place, 28 places
  function placesWord(n){
    if(isEn()) return n === 1 ? "place" : "places";
    return n % 10 === 1 && n % 100 !== 11 ? "mjesto" : "mjesta";
  }

  function unique(arr){
    var seen = {};
    return arr.filter(function(x){ if(!x || seen[x]) return false; seen[x] = true; return true; });
  }

  function navUrl(p){ return "https://www.google.com/maps/dir/?api=1&destination=" + p.lat + "," + p.lon; }

  function tokenize(s){ return s.split(/[^a-z0-9]+/).filter(Boolean); }

  function startsAny(list, w){
    for(var i = 0; i < list.length; i++) if(list[i].indexOf(w) === 0) return true;
    return false;
  }

  // Broj izmjena (umetanje, brisanje, zamjena) između dvije riječi; za tipfelere u pretrazi.
  function editDistance(a, b){
    var prev = [], cur, i, j;
    for(j = 0; j <= b.length; j++) prev[j] = j;
    for(i = 1; i <= a.length; i++){
      cur = [i];
      for(j = 1; j <= b.length; j++){
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  // ---------- Mjesta: zapisi s istim koordinatama čine jedno mjesto ----------
  var places = [];
  (function buildPlaces(){
    var byKey = {};
    (DATA.locations || []).forEach(function(rec, i){
      var hasPos = isNum(rec.latitude) && isNum(rec.longitude);
      var key = hasPos ? rec.latitude.toFixed(5) + "," + rec.longitude.toFixed(5) : "nopos-" + i;
      if(!byKey[key]){
        byKey[key] = { key: key, records: [], lat: hasPos ? rec.latitude : null, lon: hasPos ? rec.longitude : null };
        places.push(byKey[key]);
      }
      byKey[key].records.push(rec);
    });
    places.forEach(function(p){
      p.name = p.records.map(function(r){ return r.name; }).join(" / ");
      p.address = unique(p.records.map(function(r){ return r.address; })).join(" / ");
      p.region = REGIONS.lokacije[p.records[0].id] || OTHER_REGION;
      p.nName = normalize(p.name);
      p.nAddr = normalize(shortAddress(p.address));
      // pretraga po regiji radi na oba jezika („dalmacija“ i „dalmatia“)
      p.nRegion = normalize(p.region + " " + ((EN.regije && EN.regije[p.region]) || ""));
      p.nameTokens = tokenize(p.nName);
      p.addrTokens = tokenize(p.nAddr);
      p.allTokens = p.nameTokens.concat(p.addrTokens, tokenize(p.nRegion));
      p.hasPos = p.lat !== null;
      p.dist = null;
      p.contact = mergeContacts(p.records);
    });
    places.sort(function(a, b){ return a.name.localeCompare(b.name, "hr"); });
  })();

  var regionOrder = REGIONS.redoslijed.slice();
  places.forEach(function(p){ if(regionOrder.indexOf(p.region) === -1) regionOrder.push(p.region); });

  function mergeContacts(records){
    var out = { telefon: null, email: null, vhf: null, web: null, prihvat: null, prihvatId: null, usluge: [], izvori: [] };
    records.forEach(function(r){
      var c = CONTACTS[r.id];
      if(!c) return;
      ["telefon", "email", "vhf", "web"].forEach(function(k){ if(!out[k] && c[k]) out[k] = c[k]; });
      if(!out.prihvat && c.prihvat){ out.prihvat = c.prihvat; out.prihvatId = r.id; }
      out.usluge = unique(out.usluge.concat(c.usluge || []));
      out.izvori = out.izvori.concat(c.izvori || []);
    });
    return out;
  }

  // ---------- Stanje ----------
  var filtered = places.slice();
  var selectedKey = null;
  var nearestKey = null;
  var userPos = null;
  var picking = false;
  var map = null, markerLayer = null, userMarker = null;
  var sheetState = null;   // što je otvoreno u panelu (da se prevede pri promjeni jezika)

  // ---------- Karta ----------
  // Markeri su HTML elementi (divIcon), pa im boje dolaze iz CSS varijabli teme.
  var icons = null;
  function makeIcons(){
    icons = {
      normal: L.divIcon({ className: "cm-marker", html: '<span class="cm-dot"></span>', iconSize: [26, 26] }),
      selected: L.divIcon({ className: "cm-marker is-selected", html: '<span class="cm-dot"></span>', iconSize: [26, 26] }),
      user: L.divIcon({ className: "cm-user", html: '<span class="cm-user-dot"></span>', iconSize: [36, 36] })
    };
  }

  function clusterIcon(cluster){
    var n = cluster.getChildCount();
    var size = n < 5 ? 36 : n < 10 ? 42 : 48;
    return L.divIcon({
      className: "cm-cluster",
      html: '<span aria-hidden="true">' + n + '</span><span class="visually-hidden">' + CM.esc(T("clusterSr", { n: n })) + '</span>',
      iconSize: [size, size]
    });
  }

  function initMap(){
    var box = $("map");
    if(typeof window.L === "undefined"){
      box.appendChild(el("div", { className: "map-fallback", "data-t": "map.fallbackOffline", text: T("fallbackOffline") }));
      return;
    }
    // Pločice se ne učitavaju kad je stranica otvorena dvoklikom (file://).
    if(location.protocol === "file:"){
      box.appendChild(el("div", { className: "map-fallback", "data-t": "map.fallbackFile", text: T("fallbackFile") }));
      return;
    }
    makeIcons();
    map = L.map(box, { scrollWheelZoom: false, zoomSnap: 0.5, maxZoom: 18 });
    // Zumiranje kotačićem tek kad korisnik klikne na kartu, da ne smeta pomicanju stranice.
    map.on("focus", function(){ map.scrollWheelZoom.enable(); });
    map.on("blur", function(){ map.scrollWheelZoom.disable(); });

    // Podloga: lokalna baza karata grupe 3 (radi i bez signala) ili OpenStreetMap preko interneta.
    var noteShown = false;
    CM_BASEMAP.add(map, {
      onNote: function(why){
        if(noteShown || why === "local-missing") return;
        noteShown = true;
        notice(why === "offline" ? T("fallbackOffline") : T("tileError"));
      }
    });

    // Bliska mjesta spajaju se u skupinu s brojem (Leaflet.markercluster). Bez dodatka markeri idu izravno na kartu.
    markerLayer = typeof L.markerClusterGroup === "function"
      ? L.markerClusterGroup({
          maxClusterRadius: 44,
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          iconCreateFunction: clusterIcon
        })
      : L.layerGroup();
    markerLayer.addTo(map);
    // Dok korisnik bira svoju lokaciju, klik na skupinu postavlja lokaciju umjesto zumiranja.
    markerLayer.on("clusterclick", function(e){
      if(picking) pickFromEvent(e);
    });

    places.forEach(function(p){
      if(!p.hasPos) return;
      p.marker = L.marker([p.lat, p.lon], { icon: icons.normal, riseOnHover: true })
        .bindTooltip(p.name, { direction: "top", offset: [0, -10] })
        .on("add", function(){
          var node = this.getElement();
          if(node) node.setAttribute("aria-label", p.name);
        })
        .on("click", function(e){
          if(picking){ pickFromEvent(e); return; }
          selectPlace(p, { openDetails: true, pan: false });
        });
    });
    updateMarkers();
    fitTo(places);

    map.on("click", function(e){
      if(picking) pickAt(e.latlng.lat, e.latlng.lng);
    });
    // Za map-zone.js (zone zabrane, crte 3/12 NM, provjera dodirom, nevrijeme)
    window.CM_MAP = {
      map: map, places: places,
      isPicking: function(){ return picking; },
      select: function(p){ selectPlace(p, { openDetails: true, pan: true }); showOnMap(p, 12); }
    };
  }

  function fitTo(list, extra){
    if(!map) return;
    var pts = list.filter(function(p){ return p.hasPos; }).map(function(p){ return [p.lat, p.lon]; });
    if(extra) pts.push(extra);
    if(!pts.length) return;
    if(pts.length === 1) map.setView(pts[0], 12);
    else map.fitBounds(pts, { padding: [32, 32], maxZoom: 12 });
  }

  // Približi kartu mjestu; ako je u skupini, dodatak je otvori.
  function showOnMap(p, minZoom){
    if(!map || !p.hasPos) return;
    map.setView([p.lat, p.lon], Math.max(map.getZoom(), minZoom), { animate: false });
    if(p.marker && markerLayer.zoomToShowLayer && markerLayer.hasLayer(p.marker)) markerLayer.zoomToShowLayer(p.marker);
  }

  function updateMarkers(){
    if(!markerLayer) return;
    var visible = {};
    filtered.forEach(function(p){ visible[p.key] = true; });
    var wanted = places.filter(function(p){ return p.marker && visible[p.key]; });

    places.forEach(function(p){
      if(!p.marker) return;
      var sel = p.key === selectedKey;
      if(p.isSelected !== sel){
        p.marker.setIcon(sel ? icons.selected : icons.normal);
        p.marker.setZIndexOffset(sel ? 1000 : 0);
        p.isSelected = sel;
      }
    });

    var current = markerLayer.getLayers().length;
    var same = current === wanted.length && wanted.every(function(p){ return markerLayer.hasLayer(p.marker); });
    if(same) return;
    markerLayer.clearLayers();
    var markers = wanted.map(function(p){ return p.marker; });
    if(markerLayer.addLayers) markerLayer.addLayers(markers);
    else markers.forEach(function(m){ markerLayer.addLayer(m); });
  }

  // ---------- Popis ----------
  function stationRow(p){
    var sub = shortAddress(p.address);
    if(userPos) sub = regionName(p.region) + " · " + sub;
    if(!p.hasPos) sub += " · " + T("notDrawn");
    return el("button", {
        type: "button",
        className: "station-row" + (p.key === selectedKey ? " selected" : ""),
        "data-key": p.key,
        on: { click: function(){ selectPlace(p, { openDetails: true, pan: true }); } }
      },
      el("span", { className: "station-main" },
        el("span", { className: "station-name", text: p.name }),
        el("span", { className: "station-sub", text: sub })
      ),
      userPos && p.dist !== null
        ? el("span", { className: "station-dist" }, el("strong", { text: fmtKm(p.dist) }), el("span", { text: T("airline") }))
        : null,
      chevron()
    );
  }

  function renderList(){
    var box = $("stationList");
    $("listTitle").textContent = userPos ? T("listTitleDist") : T("listTitle");
    $("listCount").textContent = filtered.length === places.length
      ? places.length + " " + placesWord(places.length)
      : (fuzzyResults ? T("similar") : "") + T("of", { a: filtered.length, b: places.length });

    box.textContent = "";
    if(!filtered.length){
      box.appendChild(el("div", { className: "card station-empty" },
        el("p", { text: T("noneFor", { q: $("searchInput").value.trim() }) }),
        el("button", { type: "button", className: "link-btn", text: T("clearSearch"),
          on: { click: function(){
            $("searchInput").value = "";
            applyFilter();
            fitTo(places);
            $("searchInput").focus();
          } } })
      ));
      return;
    }

    // S poznatom lokacijom popis ide po udaljenosti, bez regija.
    if(userPos){
      var rows = filtered.slice().sort(function(a, b){
        if(a.dist === null) return 1;
        if(b.dist === null) return -1;
        return a.dist - b.dist;
      });
      box.appendChild(el("div", { className: "card station-list" }, rows.map(stationRow)));
      return;
    }

    // Unutar regije abecedno (places je već poredan po nazivu).
    var shown = {};
    filtered.forEach(function(p){ shown[p.key] = true; });
    regionOrder.forEach(function(region, i){
      var inRegion = places.filter(function(p){ return shown[p.key] && p.region === region; });
      if(!inRegion.length) return;
      var id = "region-" + i;
      box.appendChild(el("section", { className: "station-group", "aria-labelledby": id },
        el("h3", { className: "group-title", id: id }, regionName(region),
          el("span", { className: "group-count", text: String(inRegion.length) })),
        el("div", { className: "card station-list" }, inRegion.map(stationRow))
      ));
    });
  }

  // ---------- Pretraga ----------
  // Bodovanje jedne riječi upita: početak naziva > početak riječi u nazivu > dio naziva > mjesto > regija.
  function wordScore(p, w){
    if(p.nName.indexOf(w) === 0) return 90;
    if(startsAny(p.nameTokens, w)) return 70;
    if(p.nName.indexOf(w) !== -1) return 50;
    if(startsAny(p.addrTokens, w)) return 40;
    if(p.nAddr.indexOf(w) !== -1) return 30;
    if(p.nRegion.indexOf(w) !== -1) return 20;
    return 0;
  }

  // Tipfeler: riječ (ili njezin početak) razlikuje se za 1 slovo, a kod dužih riječi za 2.
  function fuzzyScore(p, w){
    if(w.length < 4) return 0;
    var max = w.length >= 7 ? 2 : 1, best = 0;
    p.allTokens.forEach(function(t){
      var d = editDistance(w, t);
      if(t.length > w.length) d = Math.min(d, editDistance(w, t.slice(0, w.length)));
      if(d <= max){
        var s = (p.nameTokens.indexOf(t) !== -1 ? 12 : 6) - d;
        if(s > best) best = s;
      }
    });
    return best;
  }

  // Vraća mjesta poredana po podudaranju. Ako nema točnog podudaranja, traže se slični nazivi.
  function rankPlaces(query){
    var nq = normalize(query.trim());
    var words = nq.split(/\s+/).filter(Boolean);
    if(!words.length) return { list: places.slice(), fuzzy: false, words: [] };
    function run(scoreFn){
      var scored = [];
      places.forEach(function(p){
        var total = 0;
        for(var i = 0; i < words.length; i++){
          var s = scoreFn(p, words[i]);
          if(!s){ total = 0; break; }
          total += s;
        }
        if(total){
          if(p.nName === nq) total += 50;
          scored.push({ p: p, s: total });
        }
      });
      scored.sort(function(a, b){ return b.s - a.s || a.p.name.localeCompare(b.p.name, "hr"); });
      return scored.map(function(x){ return x.p; });
    }
    var list = run(wordScore);
    if(list.length) return { list: list, fuzzy: false, words: words };
    list = run(function(p, w){ return wordScore(p, w) || fuzzyScore(p, w); });
    return { list: list, fuzzy: list.length > 0, words: words };
  }

  var fuzzyResults = false;
  var lastRank = null;

  function applyFilter(){
    lastRank = rankPlaces($("searchInput").value);
    filtered = lastRank.list;
    fuzzyResults = lastRank.fuzzy;
    renderList();
    updateMarkers();
    renderSuggest();
  }

  // ---------- Prijedlozi ispod pretrage (3 najbolja podudaranja) ----------
  var input = $("searchInput");
  var sugBox = $("searchSuggest");
  var sugItems = [];
  var sugActive = -1;

  // Podebljava dio naziva koji odgovara upitu (zanemarujući kvačice i velika slova).
  function highlight(text, words){
    var norm = "", map = [], marks = [], i, j;
    for(i = 0; i < text.length; i++){
      var n = normalize(text.charAt(i));
      for(j = 0; j < n.length; j++){ norm += n.charAt(j); map.push(i); }
      marks.push(false);
    }
    words.forEach(function(w){
      var at = -1, re = new RegExp("(^|[^a-z0-9])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      var m = re.exec(norm);
      if(m) at = m.index + m[1].length;
      else at = norm.indexOf(w);
      if(at === -1) return;
      for(var k = at; k < at + w.length && k < map.length; k++) marks[map[k]] = true;
    });
    var out = [], buf = "", cur = false;
    function flush(){
      if(!buf) return;
      out.push(cur ? el("strong", { text: buf }) : buf);
      buf = "";
    }
    for(i = 0; i < text.length; i++){
      if(marks[i] !== cur){ flush(); cur = marks[i]; }
      buf += text.charAt(i);
    }
    flush();
    return out;
  }

  function hideSuggest(){
    sugBox.hidden = true;
    sugBox.textContent = "";
    sugItems = [];
    sugActive = -1;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  }

  function setActive(i){
    sugActive = i;
    Array.prototype.forEach.call(sugBox.querySelectorAll(".suggest-item"), function(li, k){
      li.classList.toggle("active", k === i);
      li.setAttribute("aria-selected", k === i ? "true" : "false");
    });
    if(i >= 0) input.setAttribute("aria-activedescendant", "sug-" + i);
    else input.removeAttribute("aria-activedescendant");
  }

  function renderSuggest(){
    var q = input.value.trim();
    if(!q || document.activeElement !== input || !lastRank){ hideSuggest(); return; }
    sugBox.textContent = "";
    sugItems = lastRank.list.slice(0, 3);
    sugActive = -1;
    if(!sugItems.length){
      sugBox.appendChild(el("li", { className: "suggest-note", role: "presentation",
        text: T("noneForShort", { q: q }) }));
    } else {
      if(lastRank.fuzzy){
        sugBox.appendChild(el("li", { className: "suggest-note", role: "presentation",
          text: T("didYouMean") }));
      }
      sugItems.forEach(function(p, i){
        sugBox.appendChild(el("li", {
            id: "sug-" + i, className: "suggest-item", role: "option", "aria-selected": "false",
            on: {
              mousedown: function(e){ e.preventDefault(); },   // fokus ostaje u polju
              mousemove: function(){ if(sugActive !== i) setActive(i); },
              click: function(){ chooseSuggest(i); }
            }
          },
          el("span", { className: "suggest-name" }, highlight(p.name, lastRank.words)),
          el("span", { className: "suggest-sub", text: regionName(p.region) + " · " + shortAddress(p.address) })
        ));
      });
    }
    sugBox.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function chooseSuggest(i){
    var p = sugItems[i];
    if(!p) return;
    clearTimeout(searchTimer);
    input.value = p.name;
    hideSuggest();
    input.blur();
    applyFilter();
    // Nakon zatvaranja detalja fokus ide na redak u popisu, da se prijedlozi ne otvore ponovo.
    selectPlace(p, { openDetails: true, pan: true });
  }

  var searchTimer;
  input.addEventListener("input", function(){
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilter, 120);
  });
  input.addEventListener("focus", function(){ if(input.value.trim()) applyFilter(); });
  input.addEventListener("blur", hideSuggest);
  input.addEventListener("keydown", function(e){
    if(e.key === "Escape" && !sugBox.hidden){ e.preventDefault(); hideSuggest(); return; }
    if(sugBox.hidden || !sugItems.length) return;
    if(e.key === "ArrowDown"){
      e.preventDefault();
      setActive(sugActive + 1 >= sugItems.length ? 0 : sugActive + 1);
    } else if(e.key === "ArrowUp"){
      e.preventDefault();
      setActive(sugActive <= 0 ? sugItems.length - 1 : sugActive - 1);
    } else if(e.key === "Enter" && sugActive >= 0){
      e.preventDefault();
      chooseSuggest(sugActive);
    }
  });
  $("searchForm").addEventListener("submit", function(e){
    e.preventDefault();
    clearTimeout(searchTimer);
    applyFilter();
    hideSuggest();
    if(filtered.length && filtered.length < places.length) fitTo(filtered);
    input.blur();
  });

  // ---------- Odabir mjesta ----------
  function selectPlace(p, opts){
    selectedKey = p.key;
    updateMarkers();
    renderList();
    if(opts.pan) showOnMap(p, 12);
    if(opts.openDetails){
      // Popis se upravo ponovo iscrtao, pa se fokus nakon zatvaranja vraća na redak po ključu.
      var opener = opts.opener || document.querySelector('.station-row[data-key="' + p.key + '"]');
      openPlaceSheet(p, opener || document.activeElement);
    }
  }

  function openPlaceSheet(p, opener){
    sheetState = { kind: "place", key: p.key };
    openSheet({
      title: p.name,
      sub: regionName(p.region) + " · " + shortAddress(p.address),
      nodes: buildDetails(p),
      foot: buildActions(p),
      opener: opener
    });
  }

  function section(title){
    var s = el("div", { className: "sheet-section" });
    if(title) s.appendChild(el("h3", { text: title }));
    for(var i = 1; i < arguments.length; i++) if(arguments[i]) s.appendChild(arguments[i]);
    return s;
  }

  function dlRows(pairs){
    var dl = el("dl", { className: "sheet-dl" });
    pairs.forEach(function(pr){
      if(!pr) return;
      dl.appendChild(el("dt", { text: pr[0] }));
      dl.appendChild(el("dd", null, pr[1]));
    });
    return dl;
  }

  function link(href, text){
    var url = safeUrl(href);
    if(!url) return document.createTextNode(text);
    var external = /^https?:/i.test(url);
    return el("a", { className: "sheet-link", href: url, text: text,
      target: external ? "_blank" : null, rel: external ? "noopener" : null });
  }

  function hostOf(url){
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch(e){ return url; }
  }

  // Napomena iz JSON-a često samo opisuje preciznost koordinate ili ponavlja status.
  // Zadržavaju se samo dijelovi (odvojeni s ";") koji donose nešto novo.
  function usefulNote(note){
    var parts = String(note).split(";").map(function(s){ return s.trim().replace(/\.$/, ""); }).filter(function(s){
      var n = normalize(s);
      return n && !/^(priblizno sredi|priblizna\/nauticka koordinata|nauticka koordinata|koordinata |aktualni rad uredaja provjeriti)/.test(n);
    });
    if(!parts.length) return "";
    var text = parts.join("; ");
    return text.charAt(0).toUpperCase() + text.slice(1) + ".";
  }
  function noteFor(r){
    var n = usefulNote(r.verification_note || "");
    if(n && isEn() && EN.napomene && EN.napomene[r.id]) return EN.napomene[r.id];
    return n;
  }

  // Redoslijed: ono što nautičaru treba prije dolaska (status, kontakt), zatim usluge, lokacija i izvori.
  // Naziv, regija i adresa su u zaglavlju panela, a Navigacija i Prikaži na karti u njegovom dnu.
  function buildDetails(p){
    var nodes = [];

    // Status i napomene iz izvora
    var status = el("p", { className: "sheet-status", text: T("status") });
    var notes = p.records.map(function(r){
      var note = noteFor(r);
      if(p.records.length > 1) return el("p", null, el("strong", { text: r.name + ": " }), el("span", { className: "sheet-muted", text: note || T("noNote") }));
      return note ? el("p", { className: "sheet-muted", text: note }) : null;
    });
    if(p.records.length > 1) notes.unshift(el("p", { className: "sheet-muted", text: T("recordsNote", { n: p.records.length }) }));
    var statusSection = section(T("secStatus"), status);
    notes.forEach(function(n){ if(n) statusSection.appendChild(n); });
    if(p.contact.prihvat){
      var pr = isEn() && EN.prihvat && EN.prihvat[p.contact.prihvatId] ? EN.prihvat[p.contact.prihvatId] : p.contact.prihvat;
      statusSection.appendChild(el("p", null, el("strong", { text: T("official") }), pr));
    }
    nodes.push(statusSection);

    // Kontakt
    var c = p.contact;
    var contactRows = [
      c.telefon ? [T("phone"), link("tel:" + c.telefon.replace(/[^\d+]/g, ""), c.telefon)] : null,
      c.email ? [T("email"), link("mailto:" + c.email, c.email)] : null,
      c.vhf ? [T("vhf"), String(c.vhf)] : null,
      c.web && safeUrl(c.web) ? [T("web"), link(c.web, hostOf(c.web))] : null
    ].filter(Boolean);
    nodes.push(section(T("secContact"), contactRows.length
      ? dlRows(contactRows)
      : el("p", { className: "sheet-muted", text: T("noContact") })));

    // Dodatne usluge
    nodes.push(section(T("secServices"), c.usluge.length
      ? el("ul", { className: "sheet-tags" }, c.usluge.map(function(u){ return el("li", { text: serviceName(u) }); }))
      : el("p", { className: "sheet-muted", text: T("noData") })));

    // Lokacija
    nodes.push(section(T("secLocation"), dlRows([
      [T("address"), shortAddress(p.address)],
      p.hasPos ? [T("coords"), p.lat.toFixed(5) + ", " + p.lon.toFixed(5)] : [T("coords"), T("coordsNone")],
      userPos && p.dist !== null ? [T("distance"), fmtKm(p.dist) + " " + T("airlineGen")] : null
    ])));

    // Izvori
    var srcSeen = {};
    var sources = [];
    p.records.forEach(function(r){ (r.sources || []).forEach(function(s){ sources.push(s); }); });
    (c.izvori || []).forEach(function(s){ sources.push(s); });
    sources = sources.filter(function(s){
      var u = s && (s.url || "");
      if(!u || srcSeen[u]) return false;
      srcSeen[u] = true; return true;
    });
    if(sources.length){
      nodes.push(section(T("secSources"), el("ol", { className: "sheet-sources" }, sources.map(function(s){
        return el("li", null, link(s.url, s.name || s.naziv || hostOf(s.url)));
      }))));
    }
    return nodes;
  }

  function buildActions(p){
    if(!p.hasPos) return null;
    var actions = [el("a", {
      className: "map-btn primary", href: navUrl(p),
      target: "_blank", rel: "noopener", text: T("navigate")
    })];
    if(map) actions.push(el("button", { type: "button", className: "map-btn", text: T("showOnMap"),
      on: { click: function(){
        closeSheet(false);
        document.querySelector(".map-wrap").scrollIntoView({ block: "start" });
        showOnMap(p, 14);
      } } }));
    return actions;
  }

  // ---------- Upute ----------
  function buildGuide(){
    if(!GUIDE || !GUIDE.koraci || !GUIDE.koraci.length){
      return [section(null, el("p", { className: "sheet-muted", text: T("guideNone") }))];
    }
    var enU = isEn() && EN.upute ? EN.upute : null;
    var nodes = [];
    nodes.push(section(T("secSteps"), el("ol", { className: "guide-steps" },
      GUIDE.koraci.map(function(k, i){ return el("li", { text: enU && enU.koraci[i] ? enU.koraci[i] : k.tekst }); }))));
    if(GUIDE.vazno && GUIDE.vazno.length){
      nodes.push(section(T("secImportant"), el("ul", { className: "guide-list" },
        GUIDE.vazno.map(function(k, i){ return el("li", { text: enU && enU.vazno[i] ? enU.vazno[i] : k.tekst }); }))));
    }
    if(GUIDE.izvori && GUIDE.izvori.length){
      nodes.push(section(T("secSources"), el("ol", { className: "sheet-sources" },
        GUIDE.izvori.map(function(s){ return el("li", null, link(s.url, s.naziv || hostOf(s.url))); }))));
    }
    return nodes;
  }

  function openGuide(opener){
    sheetState = { kind: "guide" };
    openSheet({
      title: T("guideTitle"),
      sub: T("guideSheetSub"),
      nodes: buildGuide(),
      opener: opener
    });
  }
  $("guideBtn").addEventListener("click", function(){ openGuide(this); });

  // ---------- Panel ----------
  var sheet = $("sheet"), backdrop = $("sheetBackdrop"), lastOpener = null;

  // o: { title, sub, nodes, foot (gumbi koji ostaju vidljivi na dnu), opener }
  function openSheet(o){
    lastOpener = o.opener && o.opener !== document.body ? o.opener : null;
    $("sheetTitle").textContent = o.title;
    $("sheetSub").textContent = o.sub || "";
    $("sheetSub").hidden = !o.sub;
    var body = $("sheetBody");
    body.textContent = "";
    o.nodes.forEach(function(n){ body.appendChild(n); });
    body.scrollTop = 0;
    var foot = $("sheetFoot");
    foot.textContent = "";
    (o.foot || []).forEach(function(n){ foot.appendChild(n); });
    foot.hidden = !foot.childNodes.length;
    backdrop.hidden = false;
    sheet.hidden = false;
    sheet.classList.remove("open");
    void sheet.offsetWidth;
    sheet.classList.add("open");
    document.body.style.overflow = "hidden";
    $("sheetClose").focus();
  }

  function closeSheet(restoreFocus){
    if(sheet.hidden) return;
    sheet.hidden = true;
    backdrop.hidden = true;
    sheetState = null;
    document.body.style.overflow = "";
    if(restoreFocus !== false && lastOpener && document.contains(lastOpener)) lastOpener.focus();
  }

  $("sheetClose").addEventListener("click", function(){ closeSheet(); });
  backdrop.addEventListener("click", function(){ closeSheet(); });
  document.addEventListener("keydown", function(e){
    if(sheet.hidden) return;
    if(e.key === "Escape"){ closeSheet(); return; }
    if(e.key !== "Tab") return;
    var f = sheet.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])");
    if(!f.length) return;
    var firstEl = f[0], lastEl = f[f.length - 1];
    if(e.shiftKey && document.activeElement === firstEl){ e.preventDefault(); lastEl.focus(); }
    else if(!e.shiftKey && document.activeElement === lastEl){ e.preventDefault(); firstEl.focus(); }
  });

  // ---------- Najbliže mjesto ----------
  var nearestBtn = $("nearestBtn");
  var nearestLabel = nearestBtn.querySelector("span");
  var busy = false;
  var geoRequest = 0;   // svaki novi zahtjev (ili ručni odabir) poništava stariji odgovor
  var geoWatchdog = null;
  function pickText(){ return finePointer ? T("pickClick") : T("pickTouch"); }

  function setBusy(on){
    busy = on;
    nearestBtn.classList.toggle("busy", on);
    nearestBtn.setAttribute("aria-busy", on ? "true" : "false");
    nearestLabel.textContent = on ? T("searching") : T("nearest");
    if(!on) clearTimeout(geoWatchdog);
  }

  // Skupine se tijekom odabira ne otvaraju (dodatak čita ove postavke u trenutku klika).
  function setClusterClicks(on){
    if(!markerLayer || !markerLayer.options || !("zoomToBoundsOnClick" in markerLayer.options)) return;
    markerLayer.options.zoomToBoundsOnClick = on;
    markerLayer.options.spiderfyOnMaxZoom = on;
  }

  // Točka ispod miša ili prsta; za tipkovnicu položaj samog markera.
  function pickFromEvent(e){
    var ll = e.originalEvent && isNum(e.originalEvent.clientX) && e.originalEvent.type !== "keypress"
      ? map.mouseEventToLatLng(e.originalEvent)
      : e.latlng;
    pickAt(ll.lat, ll.lng);
  }

  function startPick(message){
    if(!map){ showToast(T("noMap")); return; }
    picking = true;
    setClusterClicks(false);
    $("pickText").textContent = pickText();
    $("pickHint").hidden = false;
    $("map").classList.add("picking");
    $("pickHint").scrollIntoView({ block: "start" });
    if(message) showToast(message);
  }

  function stopPick(){
    picking = false;
    setClusterClicks(true);
    $("pickHint").hidden = true;
    $("map").classList.remove("picking");
  }

  function pickAt(lat, lon){
    geoRequest++;      // ručni odabir ima prednost pred zakašnjelim GPS odgovorom
    if(busy) setBusy(false);
    stopPick();
    setUserPosition(lat, lon);
  }

  $("pickCancel").addEventListener("click", stopPick);

  nearestBtn.addEventListener("click", function(){
    // Drugi klik dok se lokacija traži prekida traženje i nudi odabir na karti.
    if(busy){
      geoRequest++;
      setBusy(false);
      startPick();
      return;
    }
    if(picking){ stopPick(); return; }
    // Uputa za odabir na karti stoji iznad karte, pa obavijest navodi samo razlog.
    if(!navigator.geolocation){
      startPick(T("noGeo"));
      return;
    }

    var request = ++geoRequest;
    setBusy(true);
    // Neki preglednici (npr. Firefox kad se upit za dopuštenje samo zatvori) nikad ne jave ni uspjeh ni grešku.
    geoWatchdog = setTimeout(function(){
      if(request !== geoRequest || !busy) return;
      setBusy(false);
      startPick(T("geoSilent"));
    }, 12000);

    navigator.geolocation.getCurrentPosition(function(pos){
      if(request !== geoRequest) return;
      setBusy(false);
      if(picking) stopPick();
      setUserPosition(pos.coords.latitude, pos.coords.longitude);
    }, function(err){
      if(request !== geoRequest) return;
      setBusy(false);
      if(picking) return;
      startPick(!window.isSecureContext
        ? T("geoHttps")
        : err && err.code === 1
          ? T("geoDenied")
          : T("geoNone"));
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  });

  function nearestPlace(){
    for(var i = 0; i < places.length; i++) if(places[i].key === nearestKey) return places[i];
    return null;
  }

  function renderNearest(){
    var box = $("nearestCard");
    box.textContent = "";
    var p = userPos ? nearestPlace() : null;
    if(!p){ box.hidden = true; return; }
    box.appendChild(el("div", { className: "nearest-head" },
      el("h2", { className: "nearest-title", id: "nearestTitle" }, T("nearestTitle"), p.name),
      el("button", { type: "button", className: "link-btn", text: T("reset"), "aria-label": T("resetAria"),
        on: { click: clearUserPosition } })
    ));
    box.appendChild(el("p", { className: "nearest-sub",
      text: fmtKm(p.dist) + " " + T("airlineGen") + " · " + shortAddress(p.address) }));
    box.appendChild(el("div", { className: "nearest-actions" },
      el("button", { type: "button", className: "map-btn primary", text: T("details"),
        on: { click: function(){ selectPlace(p, { openDetails: true, pan: true, opener: this }); } } }),
      el("a", { className: "map-btn", href: navUrl(p), target: "_blank", rel: "noopener", text: T("navigate") })
    ));
    box.hidden = false;
  }

  function setUserPosition(lat, lon){
    userPos = { lat: lat, lon: lon };
    places.forEach(function(p){ p.dist = p.hasPos ? distanceKm(lat, lon, p.lat, p.lon) : null; });

    var nearest = null;
    places.forEach(function(p){ if(p.dist !== null && (!nearest || p.dist < nearest.dist)) nearest = p; });
    nearestKey = nearest ? nearest.key : null;
    if(nearest) selectedKey = nearest.key;

    // Najbliže se traži među svim mjestima, pa se pretraga poništava.
    $("searchInput").value = "";
    filtered = places.slice();
    fuzzyResults = false;
    lastRank = null;
    hideSuggest();

    if(map){
      if(!userMarker){
        userMarker = L.marker([lat, lon], { icon: icons.user, keyboard: false, zIndexOffset: 2000 })
          .bindTooltip(T("you"), { direction: "top", offset: [0, -12] })
          .addTo(map);
      } else {
        userMarker.setLatLng([lat, lon]);
      }
      $("legendUser").hidden = false;
    }

    renderNearest();
    renderList();
    updateMarkers();
    if(nearest && map) fitTo([nearest], [lat, lon]);
    $("nearestCard").scrollIntoView({ block: "nearest" });
  }

  function clearUserPosition(){
    userPos = null;
    nearestKey = null;
    selectedKey = null;
    places.forEach(function(p){ p.dist = null; });
    if(userMarker){ userMarker.remove(); userMarker = null; }
    $("legendUser").hidden = true;
    renderNearest();
    applyFilter();
    fitTo(places);
    nearestBtn.focus();
  }

  // ---------- map.html?station=<id> (poveznice iz Plovi odgovorno i portala službi) ----------
  function openFromUrl(){
    var id = new URLSearchParams(location.search).get("station");
    if(!id) return;
    var p = null;
    places.forEach(function(x){ if(!p && x.records.some(function(r){ return r.id === id; })) p = x; });
    if(p){ selectPlace(p, { openDetails: true, pan: true }); return; }
    // nepoznat id (npr. stara poveznica „split“): prikaži rezultate pretrage
    input.value = id.replace(/[-_]+/g, " ");
    applyFilter();
    hideSuggest();
    if(filtered.length && filtered.length < places.length) fitTo(filtered);
    notice(T("stationUnknown", { id: id }));
  }

  // Obavijesti koje se jave same od sebe (nepoznata poveznica, problem s podlogom karte) ne prebrisuju
  // jedna drugu: sljedeća se prikaže kad prethodna istekne (obavijest traje 3,6 s).
  var noticeFreeAt = 0;
  function notice(msg){
    var now = Date.now(), wait = Math.max(0, noticeFreeAt - now);
    noticeFreeAt = now + wait + 3800;
    if(wait) setTimeout(function(){ showToast(msg); }, wait); else showToast(msg);
  }

  // ---------- Promjena jezika ----------
  window.addEventListener("cm:lang", function(){
    if(!busy) nearestLabel.textContent = T("nearest");
    if(picking) $("pickText").textContent = pickText();
    if(userMarker) userMarker.setTooltipContent(T("you"));
    renderList();
    renderNearest();
    renderSuggest();
    if(markerLayer && markerLayer.refreshClusters) markerLayer.refreshClusters();
    if(sheetState){
      var focusBack = lastOpener;
      if(sheetState.kind === "guide") openGuide(focusBack);
      else {
        var p = null;
        places.forEach(function(x){ if(x.key === sheetState.key) p = x; });
        if(p) openPlaceSheet(p, focusBack);
      }
    }
  });

  // ---------- Pokretanje ----------
  if(DATA.warning) $("mapNotice").title = DATA.warning;
  initMap();
  renderList();
  openFromUrl();
})();
