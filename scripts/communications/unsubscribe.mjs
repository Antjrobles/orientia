import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const baseDir = path.join(cwd, "data", "communications");
const activePath = path.join(baseDir, "subscribers-active.json");
const archivePath = path.join(baseDir, "subscribers-archive.json");
const unsubscribedPath = path.join(baseDir, "unsubscribed.json");

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

function argValue(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return "";
  return process.argv[idx + 1] || "";
}

const email = normalizeEmail(argValue("--email"));
const reason = argValue("--reason") || "user_request";

if (!email) {
  console.error("Missing required flag: --email user@example.com");
  process.exit(1);
}

const active = readJsonArray(activePath);
const archive = readJsonArray(archivePath);
const unsubscribed = readJsonArray(unsubscribedPath);

const now = new Date().toISOString();

const remaining = [];
let removedEntry = null;

for (const row of active) {
  const rowEmail = normalizeEmail(row?.email);
  if (rowEmail === email) {
    removedEntry = {
      ...row,
      email,
      wants_updates: false,
      status: "archived",
      archived_at: now,
      archived_reason: reason,
    };
    continue;
  }
  remaining.push(row);
}

if (removedEntry) {
  archive.push(removedEntry);
}

const alreadyUnsubscribed = unsubscribed.some((row) => normalizeEmail(row?.email) === email);
if (!alreadyUnsubscribed) {
  unsubscribed.push({
    email,
    unsubscribed_at: now,
    reason,
    source: "manual",
  });
}

writeJson(activePath, remaining);
writeJson(archivePath, archive);
writeJson(unsubscribedPath, unsubscribed);

console.log(`Unsubscribed: ${email}`);
console.log(`Removed from active: ${removedEntry ? "yes" : "no (not found)"}`);
