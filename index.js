/* ČistoMore — Početna (grupa 1): statistika i nedavna aktivnost iz zajedničkog spremišta CM_reports. */
(function () {
  "use strict";
  var t = function (k, v) { return CM_i18n.t(k, v); };
  var $ = function (id) { return document.getElementById(id); };

  var BADGE = { rijeseno: "ok", obrada: "wait", zaprimljeno: "sent" };
  var BOAT = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/><path d="M5 17V9a2 2 0 0 1 2-2h2V4h6v3h2a2 2 0 0 1 2 2v8"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function locale() { return CM_i18n.lang() === "en" ? "en-GB" : "hr-HR"; }
  function fmtNum(n) { try { return n.toLocaleString(locale()); } catch (e) { return String(n); } }

  function time(d) {
    try { return d.toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2); }
  }
  // „jučer, 14:20“, „prije 3 dana“, „prije 2 sata“ (Intl.RelativeTimeFormat zna hrvatske padeže)
  function relDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var diff = (d.getTime() - Date.now()) / 1000; // negativno = prošlost
    var abs = Math.abs(diff);
    if (abs < 60) return t("home.justNow");
    var rtf = null;
    try { rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" }); } catch (e) { rtf = null; }
    if (!rtf) return d.toLocaleDateString(locale()) + ", " + time(d);
    if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
    // Kalendarski dani (ne 24-satni razmaci), da „jučer“ bude točno
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var day = new Date(d.getTime()); day.setHours(0, 0, 0, 0);
    var days = Math.round((day - today) / 86400000);
    if (days === 0) return rtf.format(Math.round(diff / 3600), "hour");
    if (days === -1 || days === 1) return rtf.format(days, "day") + ", " + time(d);
    if (Math.abs(days) < 7) return rtf.format(days, "day");
    return d.toLocaleDateString(locale(), { day: "numeric", month: "short", year: "numeric" });
  }

  function vesselLabel(v) {
    if (!v) return "";
    if (CM_i18n.lang() === "en") {
      var map = t("home.vesselMap");
      if (map && typeof map === "object" && map[v]) return map[v];
    }
    return v;
  }
  function typeLabel(type) {
    var k = "home.type." + type;
    return CM_i18n.has(k) ? t(k) : t("home.type.other");
  }
  function placeLabel(r) {
    if (r.place) return r.place;
    if (typeof r.lat === "number" && typeof r.lng === "number") {
      return (r.lat >= 0 ? "N " : "S ") + Math.abs(r.lat).toFixed(4) + "°, " + (r.lng >= 0 ? "E " : "W ") + Math.abs(r.lng).toFixed(4) + "°";
    }
    return t("home.unknownPlace");
  }
  function sorted(reports) {
    return reports.slice().sort(function (a, b) {
      return (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0);
    });
  }

  function renderStats(reports) {
    var resolved = 0, progress = 0;
    reports.forEach(function (r) {
      if (r.status === "rijeseno") resolved++;
      else if (r.status === "obrada") progress++;
    });
    var st = window.CM_STATIONS && typeof window.CM_STATIONS.record_count === "number" ? window.CM_STATIONS.record_count : 29;
    $("statTotal").textContent = fmtNum(reports.length);
    $("statResolved").textContent = fmtNum(resolved);
    $("statProgress").textContent = fmtNum(progress);
    $("statStations").textContent = fmtNum(st);
  }

  function renderRecent(reports) {
    var card = $("recentCard");
    if (!reports.length) {
      card.innerHTML =
        '<div class="home-empty">' +
          '<div class="home-empty-icon">' + BOAT + "</div>" +
          '<div class="home-empty-title">' + esc(t("home.empty.title")) + "</div>" +
          '<p class="home-empty-text">' + esc(t("home.empty.text")) + "</p>" +
          '<div class="home-empty-actions">' +
            '<a class="btn primary" href="report.html">' + esc(t("home.empty.report")) + "</a>" +
            '<a class="btn ghost" href="obrada.html">' + esc(t("home.empty.demo")) + "</a>" +
          "</div>" +
        "</div>";
      return;
    }
    var rows = sorted(reports).slice(0, 3).map(function (r) {
      var vessel = vesselLabel(r.vessel);
      var type = typeLabel(r.type);
      var title = vessel ? vessel + " — " + type : type.charAt(0).toUpperCase() + type.slice(1);
      var status = BADGE[r.status] ? r.status : "zaprimljeno";
      var sub = placeLabel(r);
      var when = relDate(r.createdAt);
      return '<a class="list-row" href="obrada.html" title="' + esc(t("home.openReport", { id: r.id })) + '">' +
        '<div class="list-icon">' + BOAT + "</div>" +
        '<div class="list-grow">' +
          '<div class="list-title">' + esc(title) + "</div>" +
          '<div class="list-sub">' + esc(sub) + (when ? " · " + esc(when) : "") + "</div>" +
        "</div>" +
        '<span class="badge ' + BADGE[status] + '">' + esc(t("home.status." + status)) + "</span>" +
      "</a>";
    }).join("");
    card.innerHTML = rows + '<a class="home-more" href="obrada.html">' + esc(t("home.recentAll")) + " " + ARROW + "</a>";
  }

  function render() {
    var reports = [];
    try { reports = window.CM_reports ? window.CM_reports.all() : []; } catch (e) { reports = []; }
    renderStats(reports);
    renderRecent(reports);
  }

  // Zvono (obavijesti) vodi zajednički app.js

  render();
  document.addEventListener("cm:lang", render);
  document.addEventListener("cm:reports", render);
  // Promjene iz druge kartice (npr. obrada.html) i povratak na stranicu iz predmemorije
  window.addEventListener("storage", function (e) { if (!e.key || e.key === window.CM_reports.KEY) render(); });
  window.addEventListener("pageshow", function (e) { if (e.persisted) render(); });
})();
