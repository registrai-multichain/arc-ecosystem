// scripts/refresh.mjs — fetch the public API, stage in tmp/, validate, then replace data/ and README.md.
import { mkdirSync, rmSync, writeFileSync, renameSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { APPS_HEADER, ARC_DAILY_HEADER, CATEGORY_LABELS, ECOSYSTEM_HEADER, appsCsvRows, arcDailyCsvRows, ecosystemCsvRows, renderReadme, toCsv, validateApps, validateArcNumbers, validateEcosystem } from "./lib.mjs";

const API = "https://builder.registrai.cc/api/v1";
const UA = "registrai-arc-ecosystem-data";
const json = (x) => JSON.stringify(x, null, 2) + "\n";

const realSleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 3 tries for errors; a 429 from the edge backs off (Retry-After seconds, else 2 s × 2^(n-1)) and retries up to 6 times. */
async function getJson(fetcher, url, { allow503 = false, sleep = realSleep } = {}) {
  let last, errors = 0, limited = 0;
  while (errors < 3 && limited < 6) {
    try {
      const r = await fetcher(url, { headers: { "user-agent": UA, accept: "application/json" }, signal: AbortSignal.timeout(20_000) });
      if (r.status === 429) {
        limited++;
        const ra = Number(r.headers.get("retry-after"));
        await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : 2000 * 2 ** (limited - 1));
        last = new Error("HTTP 429");
        continue;
      }
      if (allow503 && r.status === 503) return null;
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) { last = e; errors++; }
  }
  throw new Error(`${url}: ${last?.message ?? last}`);
}

async function pool(items, n, fn) {
  const out = new Array(items.length); let next = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i]); } }));
  return out;
}

export async function refresh({ root, fetcher = fetch, today = new Date().toISOString().slice(0, 10), log = console.log, sleep = realSleep }) {
  const get = (url, o = {}) => getJson(fetcher, url, { ...o, sleep });
  const list = await get(`${API}/ecosystem`);
  const entities = (await pool(list.entities.map((e) => e.slug), 2, async (slug) => (await get(`${API}/ecosystem/${slug}`)).entity))
    .sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
  const [corrections, arcNow, daily, apps, indices] = await Promise.all([
    get(`${API}/ecosystem/corrections`), get(`${API}/arc`), get(`${API}/arc/daily?days=365`),
    get(`${API}/arc/apps-week`, { allow503: true }), get(`${API}/indices`),
  ]);
  const eco = { version: 1, updated: list.updated, count: entities.length, entities };
  const errors = [...validateEcosystem(eco, list.count), ...validateArcNumbers(arcNow), ...(apps ? validateApps(apps) : [])];
  const ecoCsv = toCsv(ECOSYSTEM_HEADER, ecosystemCsvRows(entities)), dailyCsv = toCsv(ARC_DAILY_HEADER, arcDailyCsvRows(daily.days ?? []));
  if (ecoCsv.split("\n").length < 3) errors.push("ecosystem.csv: no rows");
  if (dailyCsv.split("\n").length < 3) errors.push("arc-daily.csv: no rows");
  if (errors.length) throw new Error(`validation failed: ${errors.slice(0, 10).join("; ")}`);

  const tmp = join(root, "tmp"); rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
  const files = { "ecosystem.json": json(eco), "ecosystem.csv": ecoCsv, "corrections.json": json(corrections), "arc-numbers.json": json(arcNow), "arc-daily.csv": dailyCsv, "indices.json": json(indices) };
  if (apps) { files["apps-7d.json"] = json(apps); files["apps-7d.csv"] = toCsv(APPS_HEADER, appsCsvRows(apps.apps)); }
  else log("apps-week: 503, keeping yesterday's apps-7d files");
  for (const [f, body] of Object.entries(files)) writeFileSync(join(tmp, f), body);

  const counts = { live: 0, deployed: 0, announced: 0 }; const byCat = new Map();
  for (const e of entities) { counts[e.status] = (counts[e.status] ?? 0) + 1; byCat.set(e.category, (byCat.get(e.category) ?? 0) + 1); }
  const categories = [...byCat].map(([id, count]) => ({ id, label: CATEGORY_LABELS[id] ?? id, count })).sort((a, b) => b.count - a.count || (a.label < b.label ? -1 : 1));
  writeFileSync(join(tmp, "README.md"), renderReadme({ count: entities.length, ...counts, categories, updated: today }));

  mkdirSync(join(root, "data"), { recursive: true });
  for (const f of readdirSync(tmp)) renameSync(join(tmp, f), f === "README.md" ? join(root, f) : join(root, "data", f));
  rmSync(tmp, { recursive: true, force: true });
  log(`refreshed: ${entities.length} projects, ${Object.keys(files).length} data files`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  refresh({ root: resolve(dirname(fileURLToPath(import.meta.url)), "..") }).catch((e) => { console.error(e.message); process.exit(1); });
}
