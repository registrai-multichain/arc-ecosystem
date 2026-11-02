// scripts/hf-card.mjs — print the Hugging Face dataset card for the data now in data/ (the workflow copies it as README.md).
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderHfCard, summarize } from "./lib.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const eco = JSON.parse(readFileSync(resolve(root, "data/ecosystem.json"), "utf8"));
const read = (f) => { try { return JSON.parse(readFileSync(resolve(root, "data", f), "utf8")); } catch { return null; } };
process.stdout.write(renderHfCard({ ...summarize(eco.entities), updated: new Date().toISOString().slice(0, 10), arc: read("arc-numbers.json"), week: read("apps-7d.json") }));
