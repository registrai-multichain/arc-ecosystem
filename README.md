# Arc ecosystem data

Open data on the Arc ecosystem from Registrai (registrai.cc): 297 projects with status and sources, daily app activity and Arc chain figures. CC BY 4.0. Updated 2026-11-10 UTC.

297 projects: 142 live on Arc mainnet, 21 deployed, 134 announced. Each has a page with its status, the evidence for it, its sources and a review date.

## Arc at a glance

- Arc is the Layer-1 blockchain built by Circle. Its public mainnet launched on 16 September 2026 ([source](https://www.arc.io/pressroom/circle-launches-arc-mainnet-an-economic-operating-system-for-the-internet)).
- Gas is paid in USDC. Mainnet chain ID: 5042. Public RPC: https://rpc.mainnet.arc.io. Block explorer: https://explorer.arc.io ([Arc docs](https://docs.arc.io/arc/references/rpc-endpoints)).
- USDC on Arc: 1,291,775,318; EURC: 8,356,397, read from the chain on 10 November 2026.

Every fact with its source: [Arc blockchain: facts with sources](https://builder.registrai.cc/arc/facts/). Figures that change, with daily history: [Arc in numbers](https://builder.registrai.cc/arc/).

## Most-used apps on Arc, last 7 days

To 2026-11-10 07:00 UTC, by stablecoin payments received (USD). Source: Arc Ecosystem Index (Registrai); definitions on the [methodology](https://builder.registrai.cc/methodology/) page. Hourly, with every app: [Most-used apps on Arc](https://builder.registrai.cc/arc/most-used-apps/).

| # | App | Category | Received (USD) | Payments |
|---:|---|---|---:|---:|
| 1 | [Uniswap](https://builder.registrai.cc/ecosystem/uniswap/) | DEXs | $48,370,703 | 425,776 |
| 2 | [KyberSwap](https://builder.registrai.cc/ecosystem/kyberswap/) | DEXs | $3,747,529 | 10,039 |
| 3 | [Morpho](https://builder.registrai.cc/ecosystem/morpho/) | Lending | $2,868,111 | 2,955 |
| 4 | [Archery](https://builder.registrai.cc/ecosystem/archery/) | DEXs | $2,040,562 | 12,053 |
| 5 | [Relay](https://builder.registrai.cc/ecosystem/relay/) | Bridges and cross-chain | $1,575,887 | 9,822 |
| 6 | [rhino.fi](https://builder.registrai.cc/ecosystem/rhino-fi/) | Bridges and cross-chain | $1,461,312 | 2,264 |
| 7 | [0x](https://builder.registrai.cc/ecosystem/0x/) | DEXs | $1,411,833 | 5,098 |
| 8 | [LI.FI](https://builder.registrai.cc/ecosystem/li-fi/) | Bridges and cross-chain | $1,306,427 | 10,446 |
| 9 | [OKX Wallet](https://builder.registrai.cc/ecosystem/okx-wallet/) | Wallets | $662,073 | 4,906 |
| 10 | [Across](https://builder.registrai.cc/ecosystem/across/) | Bridges and cross-chain | $497,346 | 1,882 |

## Arc data API and MCP server

- Data API: https://builder.registrai.cc/api/v1, public JSON, no key, CORS open. For example `/ecosystem` (every project), `/arc` (Arc in numbers), `/arc/apps-week` (apps over 7 days), `/indices`. Reference: https://builder.registrai.cc/data-api/
- MCP server for AI agents, read-only, no key: https://builder.registrai.cc/api/mcp (official MCP Registry: `cc.registrai/arc-data`)

## Pages

- [Registrai: data on the Arc ecosystem](https://builder.registrai.cc/): every page below in one list
- [Arc ecosystem directory](https://builder.registrai.cc/ecosystem/)
- [Arc blockchain: facts with sources](https://builder.registrai.cc/arc/facts/)
- [Arc in numbers](https://builder.registrai.cc/arc/): chain and stablecoin figures with daily snapshots
- [Most-used apps on Arc, last 7 days](https://builder.registrai.cc/arc/most-used-apps/)
- [Apps that accept USDC on Arc](https://builder.registrai.cc/arc/apps-that-accept-usdc/)
- [New on Arc this week](https://builder.registrai.cc/arc/new/)
- [How to get USDC onto Arc](https://builder.registrai.cc/arc/get-usdc/)
- [Apps on Arc](https://builder.registrai.cc/apps/): hourly payments and volume per app
- [Indices](https://builder.registrai.cc/builders-index/): Arc Builders, Integrations and Ecosystem indices
- [Methodology](https://builder.registrai.cc/methodology/): definitions, sources and limits
- [Corrections log](https://builder.registrai.cc/ecosystem/corrections/)
- [Apps built with Arc Studio](https://builder.registrai.cc/arc/studio/): weekly
- [AI answers about Arc](https://builder.registrai.cc/arc/ai-answers/): which pages AI models cite for Arc questions, weekly
- [Data API](https://builder.registrai.cc/data-api/): free JSON, no key

### Categories

- [Payment apps on Arc](https://builder.registrai.cc/ecosystem/payments/) (51)
- [Infrastructure for Arc](https://builder.registrai.cc/ecosystem/infrastructure/) (29)
- [DEXs on Arc](https://builder.registrai.cc/ecosystem/dexs/) (27)
- [Launchpads on Arc](https://builder.registrai.cc/ecosystem/launchpads/) (27)
- [Wallets that support Arc](https://builder.registrai.cc/ecosystem/wallets/) (27)
- [Exchanges that support Arc](https://builder.registrai.cc/ecosystem/exchanges/) (20)
- [Banks building on Arc](https://builder.registrai.cc/ecosystem/banks/) (18)
- [AI agents on Arc](https://builder.registrai.cc/ecosystem/ai-agents/) (15)
- [Asset managers on Arc](https://builder.registrai.cc/ecosystem/asset-managers/) (15)
- [Bridges and cross-chain on Arc](https://builder.registrai.cc/ecosystem/bridges/) (15)
- [Lending on Arc](https://builder.registrai.cc/ecosystem/lending/) (15)
- [Trading on Arc](https://builder.registrai.cc/ecosystem/trading/) (14)
- [Custody on Arc](https://builder.registrai.cc/ecosystem/custody/) (13)
- [Developer tools for Arc](https://builder.registrai.cc/ecosystem/developer-tools/) (13)
- [Arc validators](https://builder.registrai.cc/ecosystem/validators/) (12)
- [Tokenization and RWA on Arc](https://builder.registrai.cc/ecosystem/rwa/) (12)
- [Stablecoin issuers on Arc](https://builder.registrai.cc/ecosystem/stablecoin-issuers/) (11)
- [Market makers on Arc](https://builder.registrai.cc/ecosystem/market-makers/) (10)
- [games](https://builder.registrai.cc/ecosystem/games/) (6)
- [Games and consumer apps on Arc](https://builder.registrai.cc/ecosystem/consumer/) (5)
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

In `arc-daily.csv`, `snapshot_date` is the day of the 00:00 UTC snapshot: supplies are read then, while the 24 h activity columns cover `activity_date`, the day before. `tvl_usd` and `all_stablecoins_usd` come from DefiLlama (defillama.com) as of `defillama_date`; DefiLlama's terms apply to those two fields.

## Cite

Registrai, Arc ecosystem data, builder.registrai.cc, CC BY 4.0, retrieved 2026-11-10.

## Schedule

Refreshed daily at 00:30 UTC by a GitHub Action from the public API; each day is one commit.

## Corrections

Suggest one from any project page on https://builder.registrai.cc/ecosystem/. Approved corrections are listed in `data/corrections.json`.

## License

Data and this README: CC BY 4.0 (LICENSE). Scripts: MIT (scripts/LICENSE). Registrai is independent and not affiliated with Circle or Arc.
