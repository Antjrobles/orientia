import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const activePath = path.join(cwd, "data", "communications", "subscribers-active.json");

function readJsonArray(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const active = readJsonArray(activePath);
const byEmail = new Map();
let invalid = 0;
let duplicates = 0;

for (const row of active) {
  const email = normalizeEmail(row?.email);
  if (!isValidEmail(email)) {
    invalid += 1;
    continue;
  }
  if (byEmail.has(email)) {
    duplicates += 1;
    continue;
  }

  byEmail.set(email, {
    id: row.id || null,
    email,
    created_at: row.created_at || new Date().toISOString(),
    locale: row.locale || "es-ES",
    wants_updates: row.wants_updates !== false,
    source: row.source || "orientia-web",
    last_notified_at: row.last_notified_at || null,
    status: "active",
  });
}

const cleaned = [...byEmail.values()].sort((a, b) => a.email.localeCompare(b.email));
writeJson(activePath, cleaned);

console.log(`Audit complete. Active: ${cleaned.length}`);
console.log(`Removed invalid: ${invalid}, duplicates: ${duplicates}`);
