'use strict';
/*
 * ČistoMore – baza aplikacije (korisnici, sesije, prijave, fotografije, upozorenja)
 * Datoteka: data/cistomore.db (SQLite preko ugrađenog node:sqlite, kao i baza karata).
 * Mapa data/ je u .gitignore, pa se baza ne šalje na GitHub.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','admin')),
  salt TEXT NOT NULL,
  hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('user','admin')),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  client_id TEXT UNIQUE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS reports_user ON reports(user_id);
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  idx INTEGER NOT NULL,
  mime TEXT NOT NULL,
  data BLOB NOT NULL
);
CREATE INDEX IF NOT EXISTS photos_report ON photos(report_id);
CREATE TABLE IF NOT EXISTS warnings (
  key TEXT PRIMARY KEY,
  at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

function hashPassword(password, salt) {
  return crypto.scryptSync(String(password), salt, 64).toString('hex');
}
function sha256(s) { return crypto.createHash('sha256').update(s).digest('hex'); }

class AppDb {
  constructor(file) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    this.file = file;
    this.db = new DatabaseSync(file);
    this.db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 3000;');
    this.db.exec(SCHEMA);
  }

  tx(fn) {
    this.db.exec('BEGIN IMMEDIATE');
    try { const r = fn(); this.db.exec('COMMIT'); return r; }
    catch (e) { try { this.db.exec('ROLLBACK'); } catch { /* ignore */ } throw e; }
  }

  /* ---------- meta ---------- */
  getMeta(key) { const r = this.db.prepare('SELECT value FROM meta WHERE key = ?').get(key); return r ? r.value : null; }
  setMeta(key, value) { this.db.prepare('INSERT INTO meta(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, String(value)); }

  /* ---------- korisnici ---------- */
  createUser({ username, name, password, role }) {
    const salt = crypto.randomBytes(16).toString('hex');
    const now = new Date().toISOString();
    const r = this.db.prepare('INSERT INTO users(username, name, role, salt, hash, created_at) VALUES(?, ?, ?, ?, ?, ?)')
      .run(username, name, role, salt, hashPassword(password, salt), now);
    return this.getUserById(Number(r.lastInsertRowid));
  }
  getUserById(id) { return this.db.prepare('SELECT id, username, name, role, created_at FROM users WHERE id = ?').get(id) || null; }
  findUser(username) { return this.db.prepare('SELECT * FROM users WHERE username = ?').get(String(username)) || null; }
  userExists(username) { return !!this.db.prepare('SELECT 1 FROM users WHERE username = ?').get(String(username)); }
  setPassword(username, password) {
    const user = this.findUser(username);
    if (!user) return false;
    const salt = crypto.randomBytes(16).toString('hex');
    this.db.prepare('UPDATE users SET salt = ?, hash = ? WHERE id = ?').run(salt, hashPassword(password, salt), user.id);
    this.db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);   // stare prijave više ne vrijede
    return true;
  }
  checkPassword(user, password) {
    if (!user) return false;
    const a = Buffer.from(hashPassword(password, user.salt), 'hex');
    const b = Buffer.from(user.hash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }

  /* ---------- sesije ---------- */
  createSession(userId, kind, ttlMs) {
    const token = crypto.randomBytes(32).toString('base64url');
    const now = Date.now();
    this.db.prepare('INSERT INTO sessions(token_hash, user_id, kind, created_at, expires_at) VALUES(?, ?, ?, ?, ?)')
      .run(sha256(token), userId, kind, new Date(now).toISOString(), new Date(now + ttlMs).toISOString());
    return token;
  }
  sessionUser(token, kind) {
    if (!token || typeof token !== 'string' || token.length > 200) return null;
    const row = this.db.prepare(
      'SELECT u.id, u.username, u.name, u.role, u.created_at, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.kind = ?'
    ).get(sha256(token), kind);
    if (!row) return null;
    if (row.expires_at < new Date().toISOString()) { this.deleteSession(token); return null; }
    if (kind === 'admin' && row.role !== 'admin') return null;
    if (kind === 'user' && row.role !== 'user') return null;
    return { id: row.id, username: row.username, name: row.name, role: row.role, created_at: row.created_at };
  }
  deleteSession(token) { if (token) this.db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(String(token))); }
  purgeSessions() { this.db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(new Date().toISOString()); }

  /* ---------- prijave ---------- */
  nextReportId() {
    const seq = Number(this.getMeta('seq') || '1186') + 1;
    this.setMeta('seq', seq);
    return new Date().getFullYear() + '-' + seq;
  }
  insertReport({ id, clientId, userId, createdAt, data }) {
    this.db.prepare('INSERT INTO reports(id, client_id, user_id, created_at, updated_at, data) VALUES(?, ?, ?, ?, ?, ?)')
      .run(id, clientId || null, userId == null ? null : userId, createdAt, createdAt, JSON.stringify(data));
  }
  updateReportData(id, data) {
    this.db.prepare('UPDATE reports SET data = ?, updated_at = ? WHERE id = ?').run(JSON.stringify(data), new Date().toISOString(), id);
  }
  rowToReport(row) {
    if (!row) return null;
    let data = {};
    try { data = JSON.parse(row.data); } catch { data = {}; }
    return Object.assign(data, {
      id: row.id, clientId: row.client_id, userId: row.user_id, createdAt: row.created_at, updatedAt: row.updated_at,
      reporterName: row.reporter_name || null, reporterUsername: row.reporter_username || null
    });
  }
  getReport(id) {
    const row = this.db.prepare('SELECT r.*, u.name AS reporter_name, u.username AS reporter_username FROM reports r LEFT JOIN users u ON u.id = r.user_id WHERE r.id = ?').get(String(id));
    return this.rowToReport(row);
  }
  getReportByClientId(clientId) {
    const row = this.db.prepare('SELECT r.*, u.name AS reporter_name, u.username AS reporter_username FROM reports r LEFT JOIN users u ON u.id = r.user_id WHERE r.client_id = ?').get(String(clientId));
    return this.rowToReport(row);
  }
  listReports() {
    return this.db.prepare('SELECT r.*, u.name AS reporter_name, u.username AS reporter_username FROM reports r LEFT JOIN users u ON u.id = r.user_id ORDER BY r.created_at DESC')
      .all().map(r => this.rowToReport(r));
  }
  listReportsByUser(userId) {
    return this.db.prepare('SELECT r.*, u.name AS reporter_name, u.username AS reporter_username FROM reports r LEFT JOIN users u ON u.id = r.user_id WHERE r.user_id = ? ORDER BY r.created_at DESC')
      .all(userId).map(r => this.rowToReport(r));
  }
  deleteAllReports() {
    this.db.exec('DELETE FROM photos; DELETE FROM reports; DELETE FROM warnings;');
  }

  /* ---------- fotografije ---------- */
  insertPhoto(reportId, idx, mime, buf) {
    const r = this.db.prepare('INSERT INTO photos(report_id, idx, mime, data) VALUES(?, ?, ?, ?)').run(reportId, idx, mime, buf);
    return Number(r.lastInsertRowid);
  }
  photoIds(reportId) { return this.db.prepare('SELECT id FROM photos WHERE report_id = ? ORDER BY idx').all(reportId).map(r => r.id); }
  photoIdMap() {
    const map = {};
    for (const r of this.db.prepare('SELECT id, report_id FROM photos ORDER BY report_id, idx').all()) (map[r.report_id] = map[r.report_id] || []).push(r.id);
    return map;
  }
  getPhoto(id) {
    const row = this.db.prepare('SELECT p.id, p.report_id, p.mime, p.data, r.user_id FROM photos p JOIN reports r ON r.id = p.report_id WHERE p.id = ?').get(Number(id));
    return row || null;
  }

  /* ---------- upozorenja (prognoza nanosa) ---------- */
  setWarning(key, at) { this.db.prepare('INSERT INTO warnings(key, at) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET at = excluded.at').run(key, at); }
  warnings() { const o = {}; for (const r of this.db.prepare('SELECT key, at FROM warnings').all()) o[r.key] = r.at; return o; }

  close() { try { this.db.close(); } catch { /* ignore */ } }
}

module.exports = { AppDb };
