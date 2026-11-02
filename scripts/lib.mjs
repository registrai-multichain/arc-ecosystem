// scripts/lib.mjs — pure helpers for the Arc ecosystem data repo (no dependencies).
export const SITE = "https://builder.registrai.cc";
export const ECOSYSTEM_HEADER = ["slug", "name", "category", "status", "website", "first_live", "last_reviewed", "url"];
export const APPS_HEADER = ["id", "name", "category", "usd", "payments", "new_payers", "first_hour", "url"];
export const ARC_DAILY_HEADER = ["snapshot_date", "activity_date", "defillama_date", "usdc_supply", "eurc_supply", "all_stablecoins_usd", "tvl_usd", "usdc_moved_usd_est", "app_usd", "attributed_share_pct_24h"];
/** The site's category labels (src/lib/arc-ecosystem.ts CATEGORIES); an unknown id falls back to the id. */
export const CATEGORY_LABELS = {
  payments: "Payment apps on Arc", wallets: "Wallets that support Arc", exchanges: "Exchanges that support Arc", banks: "Banks building on Arc",
  "stablecoin-issuers": "Stablecoin issuers on Arc", infrastructure: "Infrastructure for Arc", "developer-tools": "Developer tools for Arc", dexs: "DEXs on Arc",
  lending: "Lending on Arc", trading: "Trading on Arc", "market-makers": "Market makers on Arc", custody: "Custody on Arc", rwa: "Tokenization and RWA on Arc",
  bridges: "Bridges and cross-chain on Arc", "ai-agents": "AI agents on Arc", ramps: "On/off-ramps for Arc", consumer: "Games and consumer apps on Arc",
  launchpads: "Launchpads on Arc", validators: "Arc validators", "asset-managers": "Asset managers on Arc",
};

const NUMERIC = /^-?\d+(\.\d+)?$/;
function cell(v) {
  if (v === null || v === undefined) return "";
  let s = String(v);
  if (typeof v === "string" && /^[=+\-@]/.test(s) && !NUMERIC.test(s)) s = `'${s}`;   // spreadsheet formula guard
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
export const toCsv = (header, rows) => [header, ...rows].map((r) => r.map(cell).join(",")).join("\n") + "\n";

export function validateEcosystem(e, listCount) {
  const err = [];
  if (!e || !Array.isArray(e.entities)) return ["ecosystem: entities missing"];
  if (e.entities.length < 100) err.push(`ecosystem: ${e.entities.length} entities, expected at least 100`);
  if (e.entities.length !== listCount) err.push(`ecosystem: ${e.entities.length} entities, list count ${listCount}`);
  for (const x of e.entities) for (const k of ["slug", "name", "status", "sources"]) if (x?.[k] === undefined || x?.[k] === null) err.push(`ecosystem: ${x?.slug ?? "?"} missing ${k}`);
  return err;
}
export const validateArcNumbers = (x) => [...(x?.version === undefined ? ["arc-numbers: version missing"] : []), ...(x?.network ? [] : ["arc-numbers: network missing"])];
export const validateApps = (x) => (Array.isArray(x?.apps) ? [] : ["apps-7d: apps missing"]);

export const ecosystemCsvRows = (entities) => entities.map((e) => [e.slug, e.name, e.category ?? null, e.status, e.website ?? null, e.first_live ?? null, e.last_reviewed ?? null, e.url ?? null]);
export const appsCsvRows = (apps) => apps.map((a) => [a.id, a.name, a.category ?? null, a.usd, a.payments, a.new_payers, a.first_hour ?? null, a.url ?? null]);
/** One row per daily snapshot, oldest first. Supplies are read at the snapshot (≈00:03 UTC); the 24 h activity ends at
 *  data_until (00:00 UTC), so it covers the day before (activity_date); DefiLlama figures carry their own date. */
const dayBefore = (iso) => (iso ? new Date(Date.parse(iso) - 86400e3).toISOString().slice(0, 10) : null);
export const arcDailyCsvRows = (days) => [...days].reverse().map((d) => [String(d.generated_at).slice(0, 10), dayBefore(d.activity_24h?.data_until), d.stablecoins?.defillama_date ?? null,
  d.stablecoins?.usdc_supply ?? null, d.stablecoins?.eurc_supply ?? null, d.stablecoins?.all_stablecoins_usd ?? null, d.stablecoins?.tvl_usd ?? null,
  d.activity_24h?.usdc_moved_usd_est ?? null, d.activity_24h?.app_usd ?? null, d.activity_24h?.attributed_share_pct ?? null]);

export const GITHUB = "https://github.com/registrai-multichain/arc-ecosystem";

/** Status counts and category counts (primary category plus tags, as the site's category pages count). */
export function summarize(entities) {
  const counts = { live: 0, deployed: 0, announced: 0 }; const byCat = new Map();
  for (const e of entities) {
    counts[e.status] = (counts[e.status] ?? 0) + 1;
    for (const c of new Set([e.category, ...(e.tags ?? [])].filter(Boolean))) byCat.set(c, (byCat.get(c) ?? 0) + 1);
  }
  const categories = [...byCat].map(([id, count]) => ({ id, label: CATEGORY_LABELS[id] ?? id, count })).sort((a, b) => b.count - a.count || (a.label < b.label ? -1 : 1));
  return { count: entities.length, ...counts, categories };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const longDay = (d) => { const x = new Date(`${String(d).slice(0, 10)}T00:00:00Z`); return `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`; };
const int = (n) => Math.round(n).toLocaleString("en-US");
const md = (s) => String(s).replace(/([\\`*_[\]|<>])/g, "\\$1");
const RPC_DOCS = "https://docs.arc.io/arc/references/rpc-endpoints";

/** "Arc at a glance" from /api/v1/arc (data/arc-numbers.json): facts with their sources, so the README answers chain
 *  questions on its own; empty when the figures are missing. */
export function arcSection(arc) {
  const n = arc?.network;
  if (!n?.chain_id) return "";
  const mainnet = (arc.timeline ?? []).find((t) => /mainnet launched/i.test(t.text ?? ""));
  const s = arc.stablecoins ?? {};
  const lines = [
    `- Arc is the Layer-1 blockchain built by Circle. Its public mainnet launched on ${longDay(n.mainnet_since)}${mainnet?.source ? ` ([source](${mainnet.source}))` : ""}.`,
    `- Gas is paid in ${md(n.gas_token)}. Mainnet chain ID: ${n.chain_id}. Public RPC: ${n.rpc_url ?? ""}. Block explorer: ${n.explorer_url ?? ""} ([Arc docs](${RPC_DOCS})).`,
    ...(typeof s.usdc_supply === "number" ? [`- USDC on Arc: ${int(s.usdc_supply)}${typeof s.eurc_supply === "number" ? `; EURC: ${int(s.eurc_supply)}` : ""}, read from the chain on ${longDay(s.as_of ?? arc.generated_at)}.`] : []),
  ];
  return `## Arc at a glance\n\n${lines.join("\n")}\n\nEvery fact with its source: [Arc blockchain: facts with sources](${SITE}/arc/facts/). Figures that change, with daily history: [Arc in numbers](${SITE}/arc/).\n`;
}

/** The ten apps that received the most in stablecoin payments over the window of /api/v1/arc/apps-week (data/apps-7d.json). */
export function topAppsSection(week, n = 10) {
  const apps = [...(week?.apps ?? [])].filter((a) => typeof a.usd === "number").sort((a, b) => b.usd - a.usd).slice(0, n);
  if (!apps.length || !week.until) return "";
  const days = Math.round((week.window_hours ?? 168) / 24);
  const rows = apps.map((a, i) => `| ${i + 1} | [${md(a.name)}](${a.url}) | ${md(CATEGORY_LABELS[a.category]?.replace(/ (on|for|that support) Arc$/, "") ?? a.category ?? "")} | $${int(a.usd)} | ${int(a.payments)} |`).join("\n");
  return `## Most-used apps on Arc, last ${days} days

To ${String(week.until).slice(0, 16).replace("T", " ")} UTC, by stablecoin payments received (USD). Source: Arc Ecosystem Index (Registrai); definitions on the [methodology](${SITE}/methodology/) page. Hourly, with every app: [Most-used apps on Arc](${SITE}/arc/most-used-apps/).

| # | App | Category | Received (USD) | Payments |
|---:|---|---|---:|---:|
${rows}
`;
}

/** `hf`: the Hugging Face copy, which carries data/ and LICENSE but not the scripts. `arc` and `week`: data/arc-numbers.json
 *  and data/apps-7d.json, for the answer sections (left out when missing). */
export function renderReadme({ count, live, deployed, announced, categories, updated, hf = false, arc = null, week = null }) {
  const cats = categories.map((c) => `- [${c.label}](${SITE}/ecosystem/${c.id}/) (${c.count})`).join("\n");
  const answers = [arcSection(arc), topAppsSection(week)].filter(Boolean).join("\n");
  return `# Arc ecosystem data

Open data on the Arc ecosystem from Registrai (registrai.cc): ${count} projects with status and sources, daily app activity and Arc chain figures. CC BY 4.0. Updated ${updated} UTC.

${count} projects: ${live} live on Arc mainnet, ${deployed} deployed, ${announced} announced. Each has a page with its status, the evidence for it, its sources and a review date.

${answers ? `${answers}\n` : ""}## Arc data API and MCP server

- Data API: ${SITE}/api/v1, public JSON, no key, CORS open. For example \`/ecosystem\` (every project), \`/arc\` (Arc in numbers), \`/arc/apps-week\` (apps over 7 days), \`/indices\`. Reference: ${SITE}/data-api/
- MCP server for AI agents, read-only, no key: ${SITE}/api/mcp (official MCP Registry: \`cc.registrai/arc-data\`)

## Pages

- [Registrai: data on the Arc ecosystem](${SITE}/): every page below in one list
- [Arc ecosystem directory](${SITE}/ecosystem/)
- [Arc blockchain: facts with sources](${SITE}/arc/facts/)
- [Arc in numbers](${SITE}/arc/): chain and stablecoin figures with daily snapshots
- [Most-used apps on Arc, last 7 days](${SITE}/arc/most-used-apps/)
- [Apps that accept USDC on Arc](${SITE}/arc/apps-that-accept-usdc/)
- [New on Arc this week](${SITE}/arc/new/)
- [How to get USDC onto Arc](${SITE}/arc/get-usdc/)
- [Apps on Arc](${SITE}/apps/): hourly payments and volume per app
- [Indices](${SITE}/builders-index/): Arc Builders, Integrations and Ecosystem indices
- [Methodology](${SITE}/methodology/): definitions, sources and limits
- [Corrections log](${SITE}/ecosystem/corrections/)
- [Apps built with Arc Studio](${SITE}/arc/studio/): weekly
- [AI answers about Arc](${SITE}/arc/ai-answers/): which pages AI models cite for Arc questions, weekly
- [Data API](${SITE}/data-api/): free JSON, no key

### Categories

${cats}

## Files

| File | Contents | Source |
|---|---|---|
| \`data/ecosystem.json\` | Every project: status, evidence, sources, links, contracts | \`/api/v1/ecosystem/{slug}\` |
| \`data/ecosystem.csv\` | One row per project | same |
| \`data/corrections.json\` | Public corrections log | \`/api/v1/ecosystem/corrections\` |
| \`data/arc-numbers.json\` | Arc in numbers now | \`/api/v1/arc\` |
| \`data/arc-daily.csv\` | One row per day, oldest first | \`/api/v1/arc/daily\` |
| \`data/apps-7d.json\`, \`data/apps-7d.csv\` | Apps over the last 7 days | \`/api/v1/arc/apps-week\` |
| \`data/indices.json\` | The three Arc indices | \`/api/v1/indices\` |

API base: ${SITE}/api/v1. Definitions of every field: ${SITE}/methodology/.

In \`arc-daily.csv\`, \`snapshot_date\` is the day of the 00:00 UTC snapshot: supplies are read then, while the 24 h activity columns cover \`activity_date\`, the day before. \`tvl_usd\` and \`all_stablecoins_usd\` come from DefiLlama (defillama.com) as of \`defillama_date\`; DefiLlama's terms apply to those two fields.

## Cite

Registrai, Arc ecosystem data, builder.registrai.cc, CC BY 4.0, retrieved ${updated}.

## Schedule

${hf ? `Copied here daily from ${GITHUB}, which is refreshed at 00:30 UTC by a GitHub Action from the public API.` : "Refreshed daily at 00:30 UTC by a GitHub Action from the public API; each day is one commit."}

## Corrections

Suggest one from any project page on ${SITE}/ecosystem/. Approved corrections are listed in \`data/corrections.json\`.

## License

${hf ? `Data and this card: CC BY 4.0 (LICENSE). The scripts are in ${GITHUB} (MIT).` : "Data and this README: CC BY 4.0 (LICENSE). Scripts: MIT (scripts/LICENSE)."} Registrai is independent and not affiliated with Circle or Arc.
`;
}

/** Hugging Face dataset card: metadata block, then the README. The viewer reads the CSVs; the JSON files are downloads. */
export const renderHfCard = (a) => `---
license: cc-by-4.0
pretty_name: Arc ecosystem data
language:
- en
tags:
- arc
- blockchain
- stablecoins
- usdc
- open-data
size_categories:
- n<1K
configs:
- config_name: projects
  data_files: data/ecosystem.csv
  default: true
- config_name: arc_daily
  data_files: data/arc-daily.csv
- config_name: apps_7d
  data_files: data/apps-7d.csv
---

${renderReadme({ ...a, hf: true })}`;
