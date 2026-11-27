/* ČistoMore — Nova prijava (grupa 1). Sprema prijavu u zajedničko spremište CM_reports (app.js). */
(function () {
  "use strict";
  var t = function (k, v) { return window.CM_i18n ? CM_i18n.t(k, v) : k; };
  var $ = function (id) { return document.getElementById(id); };

  // ---------- Datum i vrijeme: unaprijed upiši trenutno lokalno vrijeme ----------
  var dtInput = $("datetime");
  function nowLocal() {
    var d = new Date();
    d.setSeconds(0, 0);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  function prefillDate() { if (!dtInput.value) dtInput.value = nowLocal(); }
  prefillDate();

  // ---------- Color picker <-> hex field sync ----------
  var colorInput = $("shipColor");
  var colorHex = $("shipColorHex");
  colorInput.addEventListener("input", function () { colorHex.value = colorInput.value; });
  colorHex.addEventListener("input", function () {
    var v = colorHex.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) colorInput.value = v;
  });

  // ---------- File uploads: multi preview gallery ----------
  var fileInput = $("fileInput");
  var gallery = $("fileGallery");
  var selectedFiles = [];
  var thumbUrls = [];

  function isPreviewable(f) {
    return f.type && f.type.indexOf("image/") === 0 && f.type !== "image/heic" && f.type !== "image/heif";
  }
  function renderGallery() {
    thumbUrls.forEach(function (u) { URL.revokeObjectURL(u); });
    thumbUrls = [];
    gallery.innerHTML = "";
    selectedFiles.forEach(function (f, i) {
      var thumb = document.createElement("div");
      thumb.className = "file-thumb";
      if (isPreviewable(f)) {
        var img = document.createElement("img");
        var u = URL.createObjectURL(f);
        thumbUrls.push(u);
        img.src = u;
        img.alt = f.name;
        thumb.appendChild(img);
      } else {
        thumb.textContent = f.name.length > 14 ? f.name.slice(0, 11) + "…" : f.name;
      }
      var rm = document.createElement("div");
      rm.className = "rm";
      rm.textContent = "×";
      rm.setAttribute("role", "button");
      rm.setAttribute("tabindex", "0");
      rm.setAttribute("data-name", f.name);
      rm.setAttribute("aria-label", t("report.fileRemove", { name: f.name }));
      var remove = function () { selectedFiles.splice(i, 1); renderGallery(); };
      rm.addEventListener("click", remove);
      rm.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); remove(); }
      });
      thumb.appendChild(rm);
      gallery.appendChild(thumb);
    });
  }

  fileInput.addEventListener("change", function () {
    Array.prototype.forEach.call(fileInput.files, function (f) { selectedFiles.push(f); });
    fileInput.value = "";
    renderGallery();
  });

  // ---------- GPS ----------
  var gpsBtn = $("gpsBtn");
  var gpsCoord = $("gpsCoord");
  var latInput = $("lat");
  var lonInput = $("lon");
  var toggleLand = $("toggleLand");
  var compassSection = $("compassSection");
  var gpsState = "none";           // none | loading | ok | error
  var gpsFix = null;               // {lat, lng, latText, lonText} — točne brojčane vrijednosti GPS-a

  function fmtCoord(lat, lon) {
    var ns = lat >= 0 ? "N" : "S";
    var ew = lon >= 0 ? "E" : "W";
    return ns + " " + Math.abs(lat).toFixed(4) + "°, " + ew + " " + Math.abs(lon).toFixed(4) + "°";
  }
  function renderGps() {
    if (gpsState === "ok" && gpsFix) gpsCoord.textContent = fmtCoord(gpsFix.lat, gpsFix.lng);
    else gpsCoord.textContent = t(gpsState === "loading" ? "report.gpsLoading" : gpsState === "error" ? "report.gpsFail" : "report.gpsNone");
  }
  renderGps();

  // "N 43.5081", "43,5081", "S 12.3°", "16.44 E" -> broj (null ako je prazno, NaN ako ne valja)
  function parseCoord(text, max) {
    var s = String(text || "").trim().toUpperCase().replace(/°/g, "").replace(",", ".");
    if (!s) return null;
    var sign = 1;
    var m = s.match(/^([NSEWJIZ])\s*(.*)$/) || s.match(/^(.*?)\s*([NSEWJIZ])$/);
    if (m) {
      var letter = /^[NSEWJIZ]$/.test(m[1]) ? m[1] : m[2];
      var num = /^[NSEWJIZ]$/.test(m[1]) ? m[2] : m[1];
      if ("SWJZ".indexOf(letter) >= 0) sign = -1;
      s = num.trim();
    }
    if (!/^[-+]?\d+(\.\d+)?$/.test(s)) return NaN;
    var v = sign * parseFloat(s);
    return Math.abs(v) <= max ? v : NaN;
  }
  function readCoords() {
    if (gpsFix && latInput.value === gpsFix.latText && lonInput.value === gpsFix.lonText) {
      return { lat: gpsFix.lat, lng: gpsFix.lng };
    }
    return { lat: parseCoord(latInput.value, 90), lng: parseCoord(lonInput.value, 180) };
  }
  function checkCoordField(input, max, key) {
    var v = parseCoord(input.value, max);
    input.setCustomValidity(v !== v ? t(key) : ""); // v !== v -> NaN
  }
  latInput.addEventListener("input", function () { checkCoordField(latInput, 90, "report.val.lat"); });
  lonInput.addEventListener("input", function () { checkCoordField(lonInput, 180, "report.val.lon"); });

  function setLand(isLand) {
    toggleLand.classList.toggle("on", !!isLand);
    toggleLand.setAttribute("aria-checked", isLand ? "true" : "false");
    compassSection.style.display = isLand ? "block" : "none";
    bearingManual.disabled = !isLand; // skriveno polje ne smije blokirati slanje
  }
  function flipLand() { setLand(!toggleLand.classList.contains("on")); }
  toggleLand.addEventListener("click", flipLand);
  toggleLand.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipLand(); }
  });

  gpsBtn.addEventListener("click", function () {
    if (!("geolocation" in navigator)) {
      showToast(t("report.toast.noGeo"));
      return;
    }
    gpsState = "loading";
    renderGps();
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude, lon = pos.coords.longitude;
      gpsFix = {
        lat: lat, lng: lon,
        latText: (lat >= 0 ? "N " : "S ") + Math.abs(lat).toFixed(4),
        lonText: (lon >= 0 ? "E " : "W ") + Math.abs(lon).toFixed(4)
      };
      gpsState = "ok";
      renderGps();
      latInput.value = gpsFix.latText;
      lonInput.value = gpsFix.lonText;
      latInput.dataset.value = String(lat);
      lonInput.dataset.value = String(lon);
      latInput.setCustomValidity("");
      lonInput.setCustomValidity("");

      // Best-effort check whether the point is at sea; if the lookup fails,
      // fall back to leaving the land/compass toggle for the user to set by hand.
      fetch("https://api.bigdatacloud.net/data/is-a-point-in-the-ocean?latitude=" + lat + "&longitude=" + lon)
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(function (data) {
          if (!data || typeof data.isOcean !== "boolean") return; // neočekivan odgovor: ne diraj prekidač
          setLand(!data.isOcean);
          if (!data.isOcean) { showToast(t("report.toast.onLand")); }
        })
        .catch(function () { /* leave toggle as the user set it */ });
    }, function () {
      gpsState = "error";
      renderGps();
      showToast(t("report.toast.gpsFail"));
    }, { enableHighAccuracy: true, timeout: 10000 });
  });

  // ---------- Compass ----------
  var compassBtn = $("compassBtn");
  var compassArrow = $("compassArrow");
  var compassDeg = $("compassDeg");
  var bearingManual = $("bearingManual");
  bearingManual.disabled = true;

  function applyHeading(deg) {
    deg = ((deg % 360) + 360) % 360;
    compassDeg.textContent = Math.round(deg) % 360 + "°";
    compassArrow.style.transform = "translate(-50%,-100%) rotate(" + deg + "deg)";
    bearingManual.value = Math.round(deg) % 360;
  }

  function onOrientation(e) {
    var heading = (typeof e.webkitCompassHeading === "number")
      ? e.webkitCompassHeading
      : (e.alpha != null ? (360 - e.alpha) : null);
    if (heading != null) applyHeading(heading);
  }

  compassBtn.addEventListener("click", function () {
    // The Device Orientation API only works in a secure context (HTTPS, or
    // localhost). On file:// or plain http:// it fails silently with no
    // error, which looks exactly like "the compass does nothing" — so warn
    // about that case explicitly instead of just doing nothing.
    if (!window.isSecureContext) {
      showToast(t("report.toast.compassHttps"));
      return;
    }

    var gotReading = false;
    var onFirstReading = function (e) {
      gotReading = true;
      onOrientation(e);
    };

    function attachListeners() {
      window.addEventListener("deviceorientationabsolute", onFirstReading);
      window.addEventListener("deviceorientation", onFirstReading);
      showToast(t("report.toast.compassOn"));
      // If no sensor event arrives at all, the device likely has none —
      // tell the user instead of leaving the button looking inert.
      setTimeout(function () {
        if (!gotReading) {
          showToast(t("report.toast.compassNoReading"));
        }
      }, 4000);
    }

    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().then(function (state) {
        if (state === "granted") {
          attachListeners();
        } else {
          showToast(t("report.toast.compassDenied"));
        }
      }).catch(function () { showToast(t("report.toast.compassUnavailable")); });
    } else if ("ondeviceorientationabsolute" in window || "ondeviceorientation" in window) {
      attachListeners();
    } else {
      showToast(t("report.toast.compassNone"));
    }
  });

  bearingManual.addEventListener("input", function () {
    if (bearingManual.value !== "" && bearingManual.validity.valid) applyHeading(parseFloat(bearingManual.value));
  });

  // ---------- Poruke provjere obrasca na odabranom jeziku ----------
  var form = $("reportForm");
  ["datetime", "wasteType", "shipType", "shipSize", "bearingManual"].forEach(function (id) {
    var el = $(id);
    el.addEventListener("invalid", function () {
      if (el.validity.customError && el.validationMessage) return;
      var key = el.tagName === "SELECT" ? "report.val.select"
        : id === "bearingManual" ? "report.val.bearing" : "report.val.required";
      el.setCustomValidity(t(key));
    });
    var clear = function () { el.setCustomValidity(""); };
    el.addEventListener("input", clear);
    el.addEventListener("change", clear);
  });

  // ---------- Fotografija: prva slika, najviše 1024 px, JPEG 0.7 ----------
  function compressImage(file) {
    return new Promise(function (resolve) {
      var url;
      try { url = URL.createObjectURL(file); } catch (e) { resolve(null); return; }
      var img = new Image();
      img.onload = function () {
        try {
          var w = img.naturalWidth, h = img.naturalHeight;
          if (!w || !h) { URL.revokeObjectURL(url); resolve(null); return; }
          var s = Math.min(1, 1024 / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * s)), ch = Math.max(1, Math.round(h * s));
          var c = document.createElement("canvas");
          c.width = cw; c.height = ch;
          var ctx = c.getContext("2d");
          ctx.fillStyle = "#ffffff"; // prozirni PNG -> bijela pozadina u JPEG-u
          ctx.fillRect(0, 0, cw, ch);
          ctx.drawImage(img, 0, 0, cw, ch);
          URL.revokeObjectURL(url);
          resolve(c.toDataURL("image/jpeg", 0.7));
        } catch (e) { URL.revokeObjectURL(url); resolve(null); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }
  // Prva slika koju preglednik zna dekodirati (HEIC u većini preglednika ne može)
  function firstPhoto(files) {
    var imgs = files.filter(function (f) {
      return (f.type && f.type.indexOf("image/") === 0) || /\.(png|jpe?g|webp|heic|heif|gif|bmp)$/i.test(f.name);
    });
    var i = 0;
    function next() {
      if (i >= imgs.length) return Promise.resolve(null);
      return compressImage(imgs[i++]).then(function (d) { return d || next(); });
    }
    return next();
  }

  // ---------- Potvrda nakon slanja ----------
  var doneCard = $("doneCard");
  var doneTitle = $("doneTitle");
  var lastId = null;
  function renderDone() {
    if (!lastId) return;
    doneTitle.innerHTML = "";
    var parts = t("report.done.title", { id: "\u0000" }).split("\u0000");
    doneTitle.appendChild(document.createTextNode(parts[0] || ""));
    var idEl = document.createElement("span");
    idEl.className = "rp-done-id";
    idEl.textContent = lastId;
    doneTitle.appendChild(idEl);
    doneTitle.appendChild(document.createTextNode(parts[1] || ""));
  }
  $("doneAgain").addEventListener("click", function () {
    doneCard.hidden = true;
    lastId = null;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    dtInput.focus({ preventScroll: true });
  });

  function resetForm() {
    form.reset();
    selectedFiles = [];
    renderGallery();
    colorHex.value = colorInput.value = "#0077b6";
    gpsState = "none";
    gpsFix = null;
    delete latInput.dataset.value;
    delete lonInput.dataset.value;
    latInput.setCustomValidity("");
    lonInput.setCustomValidity("");
    renderGps();
    setLand(false);
    compassDeg.textContent = "—°";
    compassArrow.style.transform = "translate(-50%,-100%) rotate(0deg)";
    prefillDate();
  }

  // ---------- Slanje: spremi u CM_reports ----------
  var TYPE_MAP = { fekalna: "fekalne", otpadna: "fekalne", ostalo: "otpad_more" };
  var submitBtn = $("submitBtn");
  var submitLabel = $("submitLabel");
  var busy = false;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (busy) return;

    var coords = readCoords();
    // Ručno upisane koordinate koje se ne daju pročitati: pokaži poruku uz polje
    if (coords.lat !== coords.lat) { checkCoordField(latInput, 90, "report.val.lat"); latInput.reportValidity(); return; }
    if (coords.lng !== coords.lng) { checkCoordField(lonInput, 180, "report.val.lon"); lonInput.reportValidity(); return; }
    var hasPos = coords.lat != null && coords.lng != null;

    var wasteType = $("wasteType").value;
    var shipType = $("shipType").value;      // vrijednost = hrvatski naziv (npr. "Jedrilica")
    var shipSize = $("shipSize").value;
    var registration = $("registration").value.trim();
    var notes = $("notes").value.trim();
    var observedFromLand = toggleLand.classList.contains("on");
    var bearing = observedFromLand && bearingManual.value !== "" ? Math.round(parseFloat(bearingManual.value)) % 360 : null;
    var dtLocal = dtInput.value;
    var created = dtLocal ? new Date(dtLocal) : new Date();
    if (isNaN(created.getTime())) created = new Date();

    var desc = [notes, registration ? "Registracija: " + registration : ""].filter(Boolean).join("\n");
    var wantsPhoto = selectedFiles.length > 0;

    busy = true;
    submitBtn.disabled = true;
    submitLabel.setAttribute("data-i18n", "report.saving");
    submitLabel.textContent = t("report.saving");

    firstPhoto(selectedFiles).then(function (photo) {
      var r = null;
      try {
        r = window.CM_reports.add({
          type: TYPE_MAP[wasteType] || "fekalne",
          lat: hasPos ? coords.lat : null,
          lng: hasPos ? coords.lng : null,
          place: "",
          desc: desc,
          createdAt: created.toISOString(),
          vessel: shipType,
          heading: isNaN(bearing) ? null : bearing,
          photo: photo || null,
          extra: {
            wasteType: wasteType,
            shipSize: shipSize,
            shipColor: colorInput.value,
            registration: registration,
            observedFromLand: observedFromLand,
            datetimeLocal: dtLocal
          }
        });
      } catch (err) { r = null; }

      var stored = r && window.CM_reports.all().some(function (x) { return x.id === r.id; });
      busy = false;
      submitBtn.disabled = false;
      submitLabel.setAttribute("data-i18n", "report.submit");
      submitLabel.textContent = t("report.submit");

      if (!stored) { showToast(t("report.toast.saveFail")); return; }

      showToast(t(wantsPhoto && photo && !r.photo ? "report.toast.savedNoPhoto" : "report.toast.saved", { id: r.id }));
      lastId = r.id;
      renderDone();
      doneCard.hidden = false;
      resetForm();
      doneCard.scrollIntoView({ behavior: "smooth", block: "center" });
      doneCard.focus({ preventScroll: true });
    });
  });

  // ---------- Promjena jezika: tekstovi koje gradi JS ----------
  document.addEventListener("cm:lang", function () {
    renderGps();
    renderDone();
    Array.prototype.forEach.call(gallery.querySelectorAll(".rm"), function (rm) {
      rm.setAttribute("aria-label", t("report.fileRemove", { name: rm.getAttribute("data-name") }));
    });
    // poruke provjere ponovno na novom jeziku
    ["datetime", "wasteType", "shipType", "shipSize", "bearingManual"].forEach(function (id) { $(id).setCustomValidity(""); });
    if (latInput.value) checkCoordField(latInput, 90, "report.val.lat");
    if (lonInput.value) checkCoordField(lonInput, 180, "report.val.lon");
  });
})();
