import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const baseDir = path.join(cwd, "data", "communications");
const activePath = path.join(baseDir, "subscribers-active.json");
const unsubscribedPath = path.join(baseDir, "unsubscribed.json");
const queuePath = path.join(baseDir, "send-queue.json");

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
const unsubscribed = readJsonArray(unsubscribedPath);
const unsubscribedSet = new Set(unsubscribed.map((row) => normalizeEmail(row?.email)).filter(Boolean));

const unique = new Map();
const dropped = {
  invalid_email: 0,
  unsubscribed: 0,
  no_updates: 0,
  duplicate: 0,
};

for (const row of active) {
  const email = normalizeEmail(row?.email);
  if (!isValidEmail(email)) {
    dropped.invalid_email += 1;
    continue;
  }
  if (row?.wants_updates === false) {
    dropped.no_updates += 1;
    continue;
  }
  if (unsubscribedSet.has(email)) {
    dropped.unsubscribed += 1;
    continue;
  }
  if (unique.has(email)) {
    dropped.duplicate += 1;
    continue;
  }

  unique.set(email, {
    id: row.id || null,
    email,
    locale: row.locale || "es-ES",
    source: row.source || "orientia-web",
  });
}

const recipients = [...unique.values()].sort((a, b) => a.email.localeCompare(b.email));

const queue = {
  generated_at: new Date().toISOString(),
  total_recipients: recipients.length,
  dropped,
  recipients,
};

writeJson(queuePath, queue);

console.log(`Prepared send queue: ${recipients.length} recipients`);
console.log(`Dropped: ${JSON.stringify(dropped)}`);
console.log(`Queue file: ${path.relative(cwd, queuePath)}`);
