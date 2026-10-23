import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { refresh } from "./refresh.mjs";

const B = "https://builder.registrai.cc/api/v1";
const ent = (i) => ({ slug: `p${String(i).padStart(3, "0")}`, name: i === 0 ? "=EVIL()" : `P${i}`, category: i % 2 ? "dexs" : "payments", status: i < 10 ? "live" : "announced", sources: [{ url: "https://s" }], url: `https://builder.registrai.cc/ecosystem/p${i}/`, last_reviewed: "2026-10-20" });
function fake({ failSlug, appsDown } = {}) {
  const ents = Array.from({ length: 120 }, (_, i) => ent(i));
  const routes = {
    [`${B}/ecosystem`]: { version: 1, updated: "2026-10-20", count: 120, entities: ents.map(({ sources, ...e }) => e) },
    [`${B}/ecosystem/corrections`]: { version: 1, corrections: [] },
    [`${B}/arc`]: { version: 1, network: { chain_id: 5042 } },
    [`${B}/arc/daily?days=365`]: { version: 1, days: [{ generated_at: "2026-10-23T00:03:00Z", stablecoins: { usdc_supply: 1 }, activity_24h: { app_usd: 1 } }] },
    [`${B}/arc/apps-week`]: { version: 1, until: "2026-10-23T00:00:00Z", window_hours: 168, apps: [{ id: "a", name: "A", usd: 1, payments: 1, new_payers: 0, first_hour: null, url: "https://u" }] },
    [`${B}/indices`]: { version: 1, data_until: "2026-10-23T00:00:00Z", indices: {} },
  };
  for (const e of ents) routes[`${B}/ecosystem/${e.slug}`] = { version: 1, entity: e };
  return async (url) => {
    if (failSlug && url === `${B}/ecosystem/${failSlug}`) throw new Error("boom");
    if (appsDown && url === `${B}/arc/apps-week`) return new Response("{}", { status: 503 });
    const body = routes[url];
    return body ? new Response(JSON.stringify(body), { status: 200 }) : new Response("nf", { status: 404 });
  };
}
const repo = () => { const r = mkdtempSync(join(tmpdir(), "aed-")); mkdirSync(join(r, "data")); return r; };

test("writes every file, README, deterministic across runs", async () => {
  const r = repo();
  await refresh({ root: r, fetcher: fake(), today: "2026-10-23", log: () => {} });
  for (const f of ["ecosystem.json", "ecosystem.csv", "corrections.json", "arc-numbers.json", "arc-daily.csv", "apps-7d.json", "apps-7d.csv", "indices.json"]) assert.ok(existsSync(join(r, "data", f)), f);
  const eco = JSON.parse(readFileSync(join(r, "data/ecosystem.json"), "utf8"));
  assert.equal(eco.count, 120);
  assert.deepEqual(eco.entities.map((e) => e.slug), [...eco.entities.map((e) => e.slug)].sort());
  assert.match(readFileSync(join(r, "data/ecosystem.csv"), "utf8"), /'=EVIL\(\)/);
  const md = readFileSync(join(r, "README.md"), "utf8");
  assert.match(md, /120 projects with status and sources/);
  assert.match(md, /\[DEXs on Arc\]/);
  const before = ["ecosystem.json", "ecosystem.csv", "README.md"].map((f) => readFileSync(join(r, f.startsWith("README") ? f : `data/${f}`), "utf8"));
  await refresh({ root: r, fetcher: fake(), today: "2026-10-23", log: () => {} });
  const after = ["ecosystem.json", "ecosystem.csv", "README.md"].map((f) => readFileSync(join(r, f.startsWith("README") ? f : `data/${f}`), "utf8"));
  assert.deepEqual(after, before);
});

test("a failing entity fetch throws and leaves data/ untouched", async () => {
  const r = repo();
  writeFileSync(join(r, "data/ecosystem.json"), "OLD");
  await assert.rejects(refresh({ root: r, fetcher: fake({ failSlug: "p005" }), today: "2026-10-23", log: () => {} }), /p005/);
  assert.equal(readFileSync(join(r, "data/ecosystem.json"), "utf8"), "OLD");
  assert.ok(!existsSync(join(r, "README.md")));
});

test("apps-week 503 keeps yesterday's apps files and the run succeeds", async () => {
  const r = repo();
  writeFileSync(join(r, "data/apps-7d.json"), "YESTERDAY-JSON");
  writeFileSync(join(r, "data/apps-7d.csv"), "YESTERDAY-CSV");
  await refresh({ root: r, fetcher: fake({ appsDown: true }), today: "2026-10-23", log: () => {} });
  assert.equal(readFileSync(join(r, "data/apps-7d.json"), "utf8"), "YESTERDAY-JSON");
  assert.equal(readFileSync(join(r, "data/apps-7d.csv"), "utf8"), "YESTERDAY-CSV");
  assert.ok(existsSync(join(r, "data/ecosystem.json")));
});

test("429 from the edge: backs off (Retry-After or exponential) and retries instead of failing", async () => {
  const r = repo();
  const base = fake();
  const hits = new Map();
  const waits = [];
  const flaky = async (url, init) => {
    const n = (hits.get(url) ?? 0) + 1; hits.set(url, n);
    if (url.endsWith("/ecosystem/p007") && n <= 2) return new Response("slow down", { status: 429, headers: n === 1 ? { "retry-after": "3" } : {} });
    return base(url, init);
  };
  await refresh({ root: r, fetcher: flaky, today: "2026-10-23", log: () => {}, sleep: async (ms) => { waits.push(ms); } });
  assert.equal(hits.get("https://builder.registrai.cc/api/v1/ecosystem/p007"), 3);
  assert.deepEqual(waits.slice(0, 2), [3000, 4000]);
  assert.ok(existsSync(join(r, "data/ecosystem.json")));
});
