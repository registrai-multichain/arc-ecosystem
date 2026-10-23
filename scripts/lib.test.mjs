import { test } from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { toCsv, validateEcosystem, validateArcNumbers, validateApps, ecosystemCsvRows, appsCsvRows, arcDailyCsvRows, renderReadme, ECOSYSTEM_HEADER, ARC_DAILY_HEADER } from "./lib.mjs";

test("toCsv: RFC 4180 quoting, nulls empty, formula guard on text only", () => {
  const csv = toCsv(["a", "b", "c"], [["x,y", 'say "hi"', "line1\nline2"], [null, undefined, 5], ["=HYPERLINK(1)", "-3", "@x"], ["+1", -2, "plain"]]);
  assert.equal(csv, 'a,b,c\n"x,y","say ""hi""","line1\nline2"\n,,5\n\'=HYPERLINK(1),-3,\'@x\n\'+1,-2,plain\n');
});

test("validators", () => {
  const ent = (o = {}) => ({ slug: "a", name: "A", status: "live", sources: [{ url: "https://a" }], ...o });
  const many = Array.from({ length: 120 }, (_, i) => ent({ slug: `s${i}` }));
  assert.deepEqual(validateEcosystem({ count: 120, entities: many }, 120), []);
  assert.match(validateEcosystem({ count: 50, entities: many.slice(0, 50) }, 50).join(), /at least 100/);
  assert.match(validateEcosystem({ count: 120, entities: many }, 121).join(), /list count/);
  assert.match(validateEcosystem({ count: 120, entities: [...many.slice(1), ent({ slug: "x", sources: undefined })] }, 120).join(), /sources/);
  assert.deepEqual(validateArcNumbers({ version: 1, network: {} }), []);
  assert.match(validateArcNumbers({ network: {} }).join(), /version/);
  assert.deepEqual(validateApps({ apps: [] }), []);
  assert.match(validateApps({}).join(), /apps/);
});

test("row builders", () => {
  assert.deepEqual(ECOSYSTEM_HEADER, ["slug", "name", "category", "status", "website", "first_live", "last_reviewed", "url"]);
  assert.deepEqual(ecosystemCsvRows([{ slug: "a", name: "A", category: "dexs", status: "live", url: "https://u", last_reviewed: "2026-10-20" }]),
    [["a", "A", "dexs", "live", null, null, "2026-10-20", "https://u"]]);
  assert.deepEqual(appsCsvRows([{ id: "i", name: "N", category: null, usd: 1.5, payments: 2, new_payers: 0, first_hour: "2026-10-10T00:00:00Z", url: "https://x" }]),
    [["i", "N", null, 1.5, 2, 0, "2026-10-10T00:00:00Z", "https://x"]]);
  assert.deepEqual(ARC_DAILY_HEADER, ["day", "usdc_supply", "eurc_supply", "all_stablecoins_usd", "tvl_usd", "usdc_moved_usd_est", "app_usd", "attributed_share_pct_24h"]);
  const d = (day, s) => ({ generated_at: `${day}T00:03:00.000Z`, stablecoins: { usdc_supply: s, eurc_supply: 1, all_stablecoins_usd: 2, tvl_usd: 3 }, activity_24h: { usdc_moved_usd_est: 4, app_usd: 5, attributed_share_pct: 6 } });
  assert.deepEqual(arcDailyCsvRows([d("2026-10-23", 10), d("2026-10-22", 9)]).map((r) => r.slice(0, 2)), [["2026-10-22", 9], ["2026-10-23", 10]]);
});

test("README: counts, date, every category link, page links, citation, no undefined", () => {
  const md = renderReadme({ count: 258, live: 83, deployed: 20, announced: 155, updated: "2026-10-23",
    categories: [{ id: "dexs", label: "DEXs on Arc", count: 25 }, { id: "payments", label: "Payment apps on Arc", count: 39 }] });
  assert.match(md, /^# Arc ecosystem data/m);
  assert.match(md, /258 projects with status and sources/);
  assert.match(md, /Updated 2026-10-23 UTC/);
  assert.match(md, /\[DEXs on Arc\]\(https:\/\/builder\.registrai\.cc\/ecosystem\/dexs\/\) \(25\)/);
  for (const p of ["/ecosystem/", "/arc/", "/arc/most-used-apps/", "/arc/apps-that-accept-usdc/", "/arc/new/", "/arc/get-usdc/", "/methodology/", "/ecosystem/corrections/", "/apps/", "/builders-index/", "/data-api/"])
    assert.ok(md.includes(`https://builder.registrai.cc${p}`), p);
  assert.ok(md.includes("https://builder.registrai.cc/api/mcp"));
  assert.ok(md.includes("cc.registrai/arc-data"));
  assert.match(md, /Registrai, Arc ecosystem data, builder\.registrai\.cc, CC BY 4\.0, retrieved 2026-10-23\./);
  assert.ok(!/undefined|NaN/.test(md));
});

test("workflow, license and citation are in place; no secrets in the workflow", () => {
  const wf = readFileSync(new URL("../.github/workflows/refresh.yml", import.meta.url), "utf8");
  assert.match(wf, /cron: "30 0 \* \* \*"/);
  assert.match(wf, /workflow_dispatch/);
  assert.match(wf, /contents: write/);
  assert.ok(wf.indexOf("node --test scripts/") < wf.indexOf("node scripts/refresh.mjs"));
  assert.ok(!/secrets\./.test(wf));
  assert.match(readFileSync(new URL("../LICENSE", import.meta.url), "utf8"), /Creative Commons Attribution 4\.0[\s\S]*MIT License/);
  assert.match(readFileSync(new URL("../CITATION.cff", import.meta.url), "utf8"), /cff-version: 1\.2\.0[\s\S]*license: CC-BY-4\.0/);
});
