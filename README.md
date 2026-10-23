# Arc ecosystem data

Open data on the Arc ecosystem from Registrai (registrai.cc): 258 projects with status and sources, daily app activity and Arc chain figures. CC BY 4.0. Updated 2026-10-23 UTC.

258 projects: 83 live on Arc mainnet, 20 deployed, 155 announced. Each has a page with its status, the evidence for it, its sources and a review date.

## Pages

- [Arc ecosystem directory](https://builder.registrai.cc/ecosystem/)
- [Arc in numbers](https://builder.registrai.cc/arc/): chain and stablecoin figures with daily snapshots
- [Most-used apps on Arc, last 7 days](https://builder.registrai.cc/arc/most-used-apps/)
- [Apps that accept USDC on Arc](https://builder.registrai.cc/arc/apps-that-accept-usdc/)
- [New on Arc this week](https://builder.registrai.cc/arc/new/)
- [How to get USDC onto Arc](https://builder.registrai.cc/arc/get-usdc/)
- [Apps on Arc](https://builder.registrai.cc/apps/): hourly payments and volume per app
- [Indices](https://builder.registrai.cc/builders-index/): Arc Builders, Integrations and Ecosystem indices
- [Methodology](https://builder.registrai.cc/methodology/): definitions, sources and limits
- [Corrections log](https://builder.registrai.cc/ecosystem/corrections/)
- [Data API](https://builder.registrai.cc/data-api/): free JSON, no key
- MCP server for AI agents: https://builder.registrai.cc/api/mcp (official MCP Registry: `cc.registrai/arc-data`)

### Categories

- [Payment apps on Arc](https://builder.registrai.cc/ecosystem/payments/) (35)
- [Infrastructure for Arc](https://builder.registrai.cc/ecosystem/infrastructure/) (20)
- [Wallets that support Arc](https://builder.registrai.cc/ecosystem/wallets/) (20)
- [Launchpads on Arc](https://builder.registrai.cc/ecosystem/launchpads/) (19)
- [Banks building on Arc](https://builder.registrai.cc/ecosystem/banks/) (18)
- [Exchanges that support Arc](https://builder.registrai.cc/ecosystem/exchanges/) (18)
- [DEXs on Arc](https://builder.registrai.cc/ecosystem/dexs/) (17)
- [Asset managers on Arc](https://builder.registrai.cc/ecosystem/asset-managers/) (13)
- [Bridges and cross-chain on Arc](https://builder.registrai.cc/ecosystem/bridges/) (12)
- [Trading on Arc](https://builder.registrai.cc/ecosystem/trading/) (11)
- [AI agents on Arc](https://builder.registrai.cc/ecosystem/ai-agents/) (10)
- [Lending on Arc](https://builder.registrai.cc/ecosystem/lending/) (10)
- [Market makers on Arc](https://builder.registrai.cc/ecosystem/market-makers/) (10)
- [Tokenization and RWA on Arc](https://builder.registrai.cc/ecosystem/rwa/) (9)
- [Custody on Arc](https://builder.registrai.cc/ecosystem/custody/) (8)
- [Stablecoin issuers on Arc](https://builder.registrai.cc/ecosystem/stablecoin-issuers/) (8)
- [Developer tools for Arc](https://builder.registrai.cc/ecosystem/developer-tools/) (7)
- [Games and consumer apps on Arc](https://builder.registrai.cc/ecosystem/consumer/) (7)
- [Arc validators](https://builder.registrai.cc/ecosystem/validators/) (3)
- [On/off-ramps for Arc](https://builder.registrai.cc/ecosystem/ramps/) (3)

## Files

| File | Contents | Source |
|---|---|---|
| `data/ecosystem.json` | Every project: status, evidence, sources, links, contracts | `/api/v1/ecosystem/{slug}` |
| `data/ecosystem.csv` | One row per project | same |
| `data/corrections.json` | Public corrections log | `/api/v1/ecosystem/corrections` |
| `data/arc-numbers.json` | Arc in numbers now | `/api/v1/arc` |
| `data/arc-daily.csv` | One row per day, oldest first | `/api/v1/arc/daily` |
| `data/apps-7d.json`, `data/apps-7d.csv` | Apps over the last 7 days | `/api/v1/arc/apps-week` |
| `data/indices.json` | The three Arc indices | `/api/v1/indices` |

API base: https://builder.registrai.cc/api/v1. Definitions of every field: https://builder.registrai.cc/methodology/.

## Cite

Registrai, Arc ecosystem data, builder.registrai.cc, CC BY 4.0, retrieved 2026-10-23.

## Schedule

Refreshed daily at 00:30 UTC by a GitHub Action from the public API; each day is one commit.

## Corrections

Suggest one from any project page on https://builder.registrai.cc/ecosystem/. Approved corrections are listed in `data/corrections.json`.

## License

Data and this README: CC BY 4.0. Scripts: MIT. Registrai is independent and not affiliated with Circle or Arc.
