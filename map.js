// ČistoMore: karta prihvatnih mjesta za pražnjenje spremnika (map.html).
// Podaci:  window.CM_STATIONS (data/stations.js, iz JSON-a)
//          window.CM_CONTACTS (data/kontakti.js, istraženi kontakti i usluge)
//          window.CM_GUIDE    (data/upute.js, opće upute) i window.CM_GUIDE_EN (data/upute-en.js, engleski)
//          window.CM_REGIONS  (data/regije.js, regija za svaku lokaciju)
// Tekstovi sučelja: map-i18n.js (CM_i18n, ključevi "map.*"). Na promjenu jezika (događaj "cm:lang")
// ponovo se iscrtava sve što ovaj kod gradi: popis, kartica najbližeg, otvoreni panel, prijedlozi, karta.
// Poveznice iz drugih stranica: map.html?station=<id iz data/stations.js> otvara to mjesto,
// map.html?lat=<..>&lon=<..>[&zoom=<..>] centrira kartu.
(function(){
  "use strict";

  var DATA = window.CM_STATIONS || { locations: [] };
  var CONTACTS = window.CM_CONTACTS || {};
  var REGIONS = window.CM_REGIONS || { redoslijed: [], lokacije: {} };
  var I18N = window.CM_MAP_I18N || { hr: { map: {} }, en: { map: {} } };
  var SVC_EN = window.CM_MAP_SVC_EN || {};
  var OTHER_REGION = "Ostalo";
  var INTERACTIVE_GUIDE = "plovi-odgovorno.html#prihvat";

  // Miš na računalu ili dodir na mobitelu, za tekst uputa ("Kliknite" / "Dodirnite").
  var finePointer = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);

  // ---------- Jezik ----------
  function lang(){ return window.CM_i18n ? window.CM_i18n.lang() : "hr"; }
  function isEn(){ return lang() === "en"; }
  function lookup(obj, key){
    return key.split(".").reduce(function(o, k){ return o == null ? undefined : o[k]; }, obj);
  }
  // Tekst sučelja; bez app.js koristi hrvatski rječnik iz map-i18n.js.
  function T(key, vars){
    if(window.CM_i18n) return window.CM_i18n.t("map." + key, vars);
    var v = lookup(I18N.hr.map, key);
    if(typeof v !== "string") return key;
    return vars ? v.replace(/\{(\w+)\}/g, function(m, k){ return vars[k] != null ? vars[k] : m; }) : v;
  }
  function regionName(r){
    var dict = (I18N[lang()] || I18N.hr).map.regions || {};
    return dict[r] || r;
  }
  function svcName(s){
    if(!isEn()) return s;
    if(SVC_EN[s]) return SVC_EN[s];
    var m = /^Benzinska crpka u blizini(?:\s*\((.+)\))?$/.exec(s);
    if(m) return "Fuel station nearby" + (m[1] ? " (" + m[1].replace(",", ".") + ")" : "");
    m = /^Gorivo u blizini(?:\s*\((.+)\))?$/.exec(s);
    if(m) return "Fuel nearby" + (m[1] ? " (" + m[1].replace(",", ".") + ")" : "");
    return s;
  }
  function guideData(){
    return isEn() && window.CM_GUIDE_EN ? window.CM_GUIDE_EN : (window.CM_GUIDE || null);
  }
  // Hrvatski tekst iz izvora u engleskom sučelju označava se jezikom (za čitače zaslona).
  function hrLang(){ return isEn() ? "hr" : null; }

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

  // HR: 1 mjesto, 21 mjesto; 2, 5, 28 mjesta.  EN: 1 place; 2, 28 places
  function countText(n){
    var one = isEn() ? n === 1 : (n % 10 === 1 && n % 100 !== 11);
    return T(one ? "list.one" : "list.many", { n: n });
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
    var enRegions = (I18N.en && I18N.en.map && I18N.en.map.regions) || {};
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
      // Regija se može tražiti hrvatskim i engleskim nazivom ("istra", "istria").
      p.nRegion = normalize(p.region + (enRegions[p.region] && enRegions[p.region] !== p.region ? " " + enRegions[p.region] : ""));
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
    var out = { telefon: null, email: null, vhf: null, web: null, prihvat: null, usluge: [], izvori: [] };
    records.forEach(function(r){
      var c = CONTACTS[r.id];
      if(!c) return;
      ["telefon", "email", "vhf", "web", "prihvat"].forEach(function(k){ if(!out[k] && c[k]) out[k] = c[k]; });
      out.usluge = unique(out.usluge.concat(c.usluge || []));
      out.izvori = out.izvori.concat(c.izvori || []);
    });
    return out;
  }

  function placeById(id){
    var want = String(id || "").trim().toUpperCase();
    if(!want) return null;
    for(var i = 0; i < places.length; i++){
      for(var j = 0; j < places[i].records.length; j++){
        if(String(places[i].records[j].id).toUpperCase() === want) return places[i];
      }
    }
    return null;
  }

  // ---------- Stanje ----------
  var filtered = places.slice();
  var selectedKey = null;
  var nearestKey = null;
  var userPos = null;
  var picking = false;
  var map = null, markerLayer = null, userMarker = null, tiles = null;
  var fallbackKey = null;

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
    var label = document.createElement("span");
    label.textContent = T("cluster", { n: n });
    return L.divIcon({
      className: "cm-cluster",
      html: '<span aria-hidden="true">' + n + '</span><span class="visually-hidden">' + label.innerHTML + '</span>',
      iconSize: [size, size]
    });
  }

  function osmAttribution(){
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' + T("osmContrib");
  }

  function showFallback(key){
    fallbackKey = key;
    var box = $("map");
    var node = box.querySelector(".map-fallback");
    if(!node){ node = el("div", { className: "map-fallback" }); box.appendChild(node); }
    node.textContent = T(key);
  }

  // Tekstovi unutar Leafleta (zumiranje, atribucija, skupine, vaša lokacija) prate jezik.
  function updateMapTexts(){
    if(fallbackKey) showFallback(fallbackKey);
    if(!map) return;
    var zin = $("map").querySelector(".leaflet-control-zoom-in");
    var zout = $("map").querySelector(".leaflet-control-zoom-out");
    if(zin){ zin.title = T("zoomIn"); zin.setAttribute("aria-label", T("zoomIn")); }
    if(zout){ zout.title = T("zoomOut"); zout.setAttribute("aria-label", T("zoomOut")); }
    if(tiles && map.attributionControl){
      var next = osmAttribution();
      if(tiles.options.attribution !== next){
        map.attributionControl.removeAttribution(tiles.options.attribution);
        tiles.options.attribution = next;
        map.attributionControl.addAttribution(next);
      }
    }
    if(markerLayer && markerLayer.refreshClusters) markerLayer.refreshClusters();
    if(userMarker) userMarker.setTooltipContent(T("yourLocation"));
  }

  function initMap(){
    var box = $("map");
    if(typeof window.L === "undefined"){
      showFallback("fallbackNoLeaflet");
      return;
    }
    // OpenStreetMap blokira pločice bez zaglavlja Referer, a stranica otvorena dvoklikom (file://) ga ne šalje.
    if(location.protocol === "file:"){
      showFallback("fallbackFile");
      return;
    }
    makeIcons();
    map = L.map(box, { scrollWheelZoom: false, zoomSnap: 0.5, maxZoom: 18 });
    // Zumiranje kotačićem tek kad korisnik klikne na kartu, da ne smeta pomicanju stranice.
    map.on("focus", function(){ map.scrollWheelZoom.enable(); });
    map.on("blur", function(){ map.scrollWheelZoom.disable(); });

    var tileErrorShown = false;
    tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: osmAttribution()
    }).on("tileerror", function(){
      if(tileErrorShown) return;
      tileErrorShown = true;
      showToast(T("tileError"));
    }).addTo(map);

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
    updateMapTexts();

    map.on("click", function(e){
      if(picking) pickAt(e.latlng.lat, e.latlng.lng);
    });
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
    if(!p.hasPos) sub += " · " + T("list.notMapped");
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
        ? el("span", { className: "station-dist" }, el("strong", { text: fmtKm(p.dist) }), el("span", { text: T("list.straight") }))
        : null,
      chevron()
    );
  }

  function renderList(){
    var box = $("stationList");
    $("listTitle").textContent = userPos ? T("list.titleByDistance") : T("list.title");
    $("listCount").textContent = filtered.length === places.length
      ? countText(places.length)
      : (fuzzyResults ? T("list.similar") : "") + T("list.of", { n: filtered.length, total: places.length });

    box.textContent = "";
    if(!filtered.length){
      box.appendChild(el("div", { className: "card station-empty" },
        el("p", { text: T("list.empty", { q: $("searchInput").value.trim() }) }),
        el("button", { type: "button", className: "link-btn", text: T("list.clear"),
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
        text: T("suggest.none", { q: q }) }));
    } else {
      if(lastRank.fuzzy){
        sugBox.appendChild(el("li", { className: "suggest-note", role: "presentation",
          text: T("suggest.fuzzy") }));
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
    if(opts.pan) showOnMap(p, opts.zoom || 12);
    if(opts.openDetails){
      // Popis se upravo ponovo iscrtao, pa se fokus nakon zatvaranja vraća na redak po ključu.
      var opener = opts.opener || document.querySelector('.station-row[data-key="' + p.key + '"]');
      openSheet({ kind: "place", place: p }, opener || document.activeElement);
    }
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

  // Redoslijed: ono što nautičaru treba prije dolaska (status, kontakt), zatim usluge, lokacija i izvori.
  // Naziv, regija i adresa su u zaglavlju panela, a Navigacija i Prikaži na karti u njegovom dnu.
  function buildDetails(p){
    var nodes = [];
    var first = p.records[0];
    var hasHrText = false;

    // Status i napomene iz izvora (napomene su na hrvatskom, kao u izvoru)
    var status = el("p", { className: "sheet-status", text: T("detail.statusConfirm") });
    var notes = p.records.map(function(r){
      var note = usefulNote(r.verification_note || "");
      if(note) hasHrText = true;
      if(p.records.length > 1){
        return el("p", null, el("strong", { text: r.name + ": " }),
          note ? el("span", { className: "sheet-muted", lang: hrLang(), text: note })
               : el("span", { className: "sheet-muted", text: T("detail.noNote") }));
      }
      return note ? el("p", { className: "sheet-muted", lang: hrLang(), text: note }) : null;
    });
    if(p.records.length > 1) notes.unshift(el("p", { className: "sheet-muted", text: T("detail.records", { n: p.records.length }) }));
    var statusSection = section(T("detail.status"), status);
    notes.forEach(function(n){ if(n) statusSection.appendChild(n); });
    if(p.contact.prihvat){
      hasHrText = true;
      statusSection.appendChild(el("p", null,
        el("strong", { text: T("detail.official") }), el("span", { lang: hrLang(), text: p.contact.prihvat })));
    }
    if(hasHrText && T("detail.hrNotes")){
      statusSection.appendChild(el("p", { className: "sheet-muted sheet-hint", text: T("detail.hrNotes") }));
    }
    nodes.push(statusSection);

    // Vrste voda prema JSON-u (crne, sive, kaljužne)
    var ww = first.wastewater || {};
    var waterRows = [
      ww.black_water_fecal ? [T("detail.waterBlack"), waterValue(ww.black_water_fecal)] : null,
      ww.grey_water ? [T("detail.waterGrey"), waterValue(ww.grey_water)] : null,
      ww.bilge_water ? [T("detail.waterBilge"), waterValue(ww.bilge_water)] : null
    ].filter(Boolean);
    if(waterRows.length) nodes.push(section(T("detail.water"), dlRows(waterRows)));

    // Kontakt
    var c = p.contact;
    var contactRows = [
      c.telefon ? [T("detail.phone"), link("tel:" + c.telefon.replace(/[^\d+]/g, ""), c.telefon)] : null,
      c.email ? [T("detail.email"), link("mailto:" + c.email, c.email)] : null,
      c.vhf ? [T("detail.vhf"), String(c.vhf)] : null,
      c.web && safeUrl(c.web) ? [T("detail.web"), link(c.web, hostOf(c.web))] : null
    ].filter(Boolean);
    nodes.push(section(T("detail.contact"), contactRows.length
      ? dlRows(contactRows)
      : el("p", { className: "sheet-muted", text: T("detail.noContact") })));

    // Dodatne usluge
    nodes.push(section(T("detail.services"), c.usluge.length
      ? el("ul", { className: "sheet-tags" }, c.usluge.map(function(u){ return el("li", { text: svcName(u) }); }))
      : el("p", { className: "sheet-muted", text: T("detail.noData") })));

    // Lokacija
    nodes.push(section(T("detail.location"), dlRows([
      [T("detail.address"), shortAddress(p.address)],
      p.hasPos ? [T("detail.coords"), p.lat.toFixed(5) + ", " + p.lon.toFixed(5)] : [T("detail.coords"), T("detail.noCoords")],
      userPos && p.dist !== null ? [T("detail.distance"), T("detail.distanceVal", { d: fmtKm(p.dist) })] : null
    ])));

    // Kako koristiti uslugu: opće upute u panelu i interaktivni vodič grupe 4
    nodes.push(section(T("detail.howTo"),
      el("p", { className: "sheet-muted", text: T("detail.howToText") }),
      el("p", { className: "sheet-links" },
        el("button", { type: "button", className: "link-btn", text: T("detail.guideLink"),
          on: { click: function(){ openSheet({ kind: "guide" }, lastOpener); } } }),
        el("a", { className: "sheet-link", href: INTERACTIVE_GUIDE, text: T("guide.interactive") })
      )));

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
      nodes.push(section(T("detail.sources"), el("ol", { className: "sheet-sources" }, sources.map(function(s){
        return el("li", null, link(s.url, s.name || s.naziv || hostOf(s.url)));
      }))));
    }
    return nodes;
  }

  function waterValue(v){
    var t = T("detail.waterVal." + v);
    return t === "map.detail.waterVal." + v ? String(v).replace(/_/g, " ") : t;
  }

  function buildActions(p){
    if(!p.hasPos) return null;
    var actions = [el("a", {
      className: "map-btn primary", href: navUrl(p),
      target: "_blank", rel: "noopener", text: T("detail.directions"),
      "aria-label": T("detail.directionsAria", { name: p.name })
    })];
    if(map) actions.push(el("button", { type: "button", className: "map-btn", text: T("detail.showOnMap"),
      on: { click: function(){
        closeSheet(false);
        document.querySelector(".map-wrap").scrollIntoView({ block: "start" });
        showOnMap(p, 14);
      } } }));
    return actions;
  }

  // ---------- Upute ----------
  function buildGuide(){
    var g = guideData();
    if(!g || !g.koraci || !g.koraci.length){
      return [section(null, el("p", { className: "sheet-muted", text: T("guide.unavailable") }))];
    }
    var nodes = [];
    nodes.push(section(T("guide.steps"), el("ol", { className: "guide-steps" },
      g.koraci.map(function(k){ return el("li", { text: k.tekst }); }))));
    if(g.vazno && g.vazno.length){
      nodes.push(section(T("guide.important"), el("ul", { className: "guide-list" },
        g.vazno.map(function(k){ return el("li", { text: k.tekst }); }))));
    }
    if(g.izvori && g.izvori.length){
      nodes.push(section(T("guide.sources"), el("ol", { className: "sheet-sources" },
        g.izvori.map(function(s){ return el("li", null, link(s.url, s.naziv || hostOf(s.url))); }))));
    }
    return nodes;
  }

  function guideActions(){
    return [el("a", { className: "map-btn primary", href: INTERACTIVE_GUIDE, text: T("guide.interactive") })];
  }

  $("guideBtn").addEventListener("click", function(){
    openSheet({ kind: "guide" }, this);
  });

  // ---------- Panel ----------
  var sheet = $("sheet"), backdrop = $("sheetBackdrop"), lastOpener = null;
  var sheetState = null;   // { kind: "place", place } ili { kind: "guide" }; za ponovno iscrtavanje na promjenu jezika

  function sheetContent(state){
    if(state.kind === "place"){
      var p = state.place;
      return {
        title: p.name,
        sub: regionName(p.region) + " · " + shortAddress(p.address),
        nodes: buildDetails(p),
        foot: buildActions(p)
      };
    }
    return { title: T("guide.title"), sub: T("guide.sub"), nodes: buildGuide(), foot: guideActions() };
  }

  function fillSheet(state, keepScroll){
    var o = sheetContent(state);
    var body = $("sheetBody");
    var top = body.scrollTop;
    $("sheetTitle").textContent = o.title;
    $("sheetSub").textContent = o.sub || "";
    $("sheetSub").hidden = !o.sub;
    body.textContent = "";
    o.nodes.forEach(function(n){ body.appendChild(n); });
    body.scrollTop = keepScroll ? top : 0;
    var foot = $("sheetFoot");
    foot.textContent = "";
    (o.foot || []).forEach(function(n){ foot.appendChild(n); });
    foot.hidden = !foot.childNodes.length;
  }

  // Adresa stranice prati otvoreno mjesto (map.html?station=<id>), pa se može podijeliti.
  function setUrlStation(id){
    if(!window.history || !history.replaceState || typeof URLSearchParams === "undefined") return;
    try {
      var params = new URLSearchParams(location.search);
      if(id) params.set("station", id); else params.delete("station");
      var qs = params.toString();
      history.replaceState(history.state, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
    } catch(e){}
  }

  function openSheet(state, opener){
    lastOpener = opener && opener !== document.body ? opener : null;
    sheetState = state;
    fillSheet(state, false);
    setUrlStation(state.kind === "place" ? state.place.records[0].id : null);
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
    document.body.style.overflow = "";
    if(sheetState && sheetState.kind === "place") setUrlStation(null);
    sheetState = null;
    if(restoreFocus === false || !lastOpener) return;
    // Popis se mogao ponovo iscrtati (npr. promjena jezika), pa se redak traži po ključu.
    var target = lastOpener;
    if(!document.contains(target) && target.getAttribute && target.getAttribute("data-key")){
      target = document.querySelector('.station-row[data-key="' + target.getAttribute("data-key") + '"]');
    }
    if(target && document.contains(target)) target.focus();
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
  var nearestLabel = $("nearestLabel");
  var busy = false;
  var geoRequest = 0;   // svaki novi zahtjev (ili ručni odabir) poništava stariji odgovor
  var geoWatchdog = null;
  function pickText(){ return T(finePointer ? "pick.click" : "pick.tap"); }

  function setBusy(on){
    busy = on;
    nearestBtn.classList.toggle("busy", on);
    nearestBtn.setAttribute("aria-busy", on ? "true" : "false");
    nearestLabel.textContent = on ? T("locating") : T("nearest");
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
    if(!map){ showToast(T("geo.noMap")); return; }
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
      startPick(T("geo.unsupported"));
      return;
    }

    var request = ++geoRequest;
    setBusy(true);
    // Neki preglednici (npr. Firefox kad se upit za dopuštenje samo zatvori) nikad ne jave ni uspjeh ni grešku.
    geoWatchdog = setTimeout(function(){
      if(request !== geoRequest || !busy) return;
      setBusy(false);
      startPick(T("geo.silent"));
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
        ? T("geo.https")
        : err && err.code === 1
          ? T("geo.denied")
          : T("geo.unavailable"));
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
      el("h2", { className: "nearest-title", id: "nearestTitle" }, T("near.title"), p.name),
      el("button", { type: "button", className: "link-btn", text: T("near.clear"), "aria-label": T("near.clearAria"),
        on: { click: clearUserPosition } })
    ));
    box.appendChild(el("p", { className: "nearest-sub",
      text: T("near.sub", { d: fmtKm(p.dist), addr: shortAddress(p.address) }) }));
    box.appendChild(el("div", { className: "nearest-actions" },
      el("button", { type: "button", className: "map-btn primary", text: T("near.details"),
        on: { click: function(){ selectPlace(p, { openDetails: true, pan: true, opener: this }); } } }),
      el("a", { className: "map-btn", href: navUrl(p), target: "_blank", rel: "noopener", text: T("detail.directions") })
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
          .bindTooltip(T("yourLocation"), { direction: "top", offset: [0, -12] })
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

  // Upozorenje iz JSON-a (na hrvatskom) kao opis napomene ispod karte, samo u hrvatskom sučelju.
  function updateNoticeTitle(){
    var n = $("mapNotice");
    if(DATA.warning && !isEn()) n.title = DATA.warning; else n.removeAttribute("title");
  }

  // ---------- Promjena jezika ----------
  document.addEventListener("cm:lang", function(){
    updateNoticeTitle();
    setBusy(busy);
    if(picking) $("pickText").textContent = pickText();
    updateMapTexts();
    renderNearest();
    renderList();
    if(!sugBox.hidden) renderSuggest();
    if(!sheet.hidden && sheetState) fillSheet(sheetState, true);
  });

  // ---------- Poveznice iz drugih stranica ----------
  // ?station=<id> otvara mjesto (nepoznat id se tiho zanemaruje); ?lat=&lon=[&zoom=] centrira kartu.
  function queryParam(name){
    var m = new RegExp("[?&]" + name + "=([^&#]*)").exec(location.search);
    if(!m) return null;
    try { return decodeURIComponent(m[1].replace(/\+/g, " ")); } catch(e){ return m[1]; }
  }

  function applyDeepLink(){
    var p = placeById(queryParam("station"));
    if(p){
      selectPlace(p, { openDetails: true, pan: true, zoom: 13 });
      return;
    }
    if(queryParam("station") !== null) setUrlStation(null);
    var lat = parseFloat(queryParam("lat")), lon = parseFloat(queryParam("lon") || queryParam("lng"));
    if(map && isFinite(lat) && isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180){
      var z = parseFloat(queryParam("zoom"));
      map.setView([lat, lon], isFinite(z) ? Math.min(Math.max(z, 3), 18) : 11);
    }
  }

  // ---------- Pokretanje ----------
  updateNoticeTitle();
  setBusy(false);
  initMap();
  renderList();
  applyDeepLink();
})();
