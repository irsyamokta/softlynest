/**
 * patch-vercel-output.mjs
 *
 * Nitro generates __server.func/package.json with a `dependencies` field
 * listing tslib. Vercel sees this and does NOT treat the node_modules/ folder
 * that Nitro already copied as the resolved dependency — instead it leaves
 * resolution to Node's ESM loader at runtime, which fails because
 * _libs/supabase__*.mjs files sit in /var/task/_libs/ and not at the root.
 *
 * Fixes applied:
 * 1. Copy all missing tslib files (modules/index.js etc.) into the output.
 * 2. Strip `dependencies` from the generated package.json so Vercel treats
 *    the function folder as fully self-contained with no installs needed.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const funcDir = join(root, ".vercel", "output", "functions", "__server.func");

if (!existsSync(funcDir)) {
  console.log("[patch] __server.func not found, skipping.");
  process.exit(0);
}

// ── 1. Copy missing tslib files ──────────────────────────────────────────────
const tslibSrc = join(root, "node_modules", "tslib");
const tslibDest = join(funcDir, "node_modules", "tslib");

mkdirSync(tslibDest, { recursive: true });

// Full copy of the tslib package so every exports map entry resolves
cpSync(tslibSrc, tslibDest, { recursive: true, force: true });
console.log("[patch] copied tslib package completely");

// ── 2. Strip `dependencies` from the generated package.json ─────────────────
const pkgPath = join(funcDir, "package.json");
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (pkg.dependencies) {
    delete pkg.dependencies;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    console.log("[patch] removed `dependencies` from __server.func/package.json");
  }
}

console.log("[patch] done.");
