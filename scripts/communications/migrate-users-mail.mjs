import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = process.cwd();
const legacyPath = path.join(cwd, "users_mail", "users_mail.json");
const targetDir = path.join(cwd, "data", "communications");
const activePath = path.join(targetDir, "subscribers-active.json");
const archivePath = path.join(targetDir, "subscribers-archive.json");
const unsubscribedPath = path.join(targetDir, "unsubscribed.json");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJsonArray(filePath, fallback = []) {
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return fallback;
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : fallback;
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function buildId(email) {
  return `sub_${crypto.createHash("sha1").update(email).digest("hex").slice(0, 12)}`;
}

ensureDir(targetDir);

const legacy = readJsonArray(legacyPath, []);
const existing = readJsonArray(activePath, []);

const byEmail = new Map();

for (const row of existing) {
  const email = normalizeEmail(row?.email);
  if (!email) continue;
  byEmail.set(email, {
    id: row.id || buildId(email),
    email,
    created_at: row.created_at || new Date().toISOString(),
    locale: row.locale || "es-ES",
    wants_updates: row.wants_updates !== false,
    source: row.source || "orientia-web",
    last_notified_at: row.last_notified_at || null,
    status: "active",
  });
}

for (const row of legacy) {
  const email = normalizeEmail(row?.email);
  if (!email) continue;
  if (byEmail.has(email)) continue;

  byEmail.set(email, {
    id: buildId(email),
    email,
    created_at: new Date().toISOString(),
    locale: "es-ES",
    wants_updates: true,
    source: "orientia-web",
    last_notified_at: null,
    status: "active",
  });
}

const active = [...byEmail.values()].sort((a, b) => a.email.localeCompare(b.email));
writeJson(activePath, active);

if (!fs.existsSync(archivePath)) writeJson(archivePath, []);
if (!fs.existsSync(unsubscribedPath)) writeJson(unsubscribedPath, []);

console.log(`Migrated subscribers: ${active.length}`);
console.log(`Active file: ${path.relative(cwd, activePath)}`);
