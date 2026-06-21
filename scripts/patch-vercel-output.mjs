/**
 * patch-vercel-output.mjs
 *
 * Nitro traces only the files it detects as imported, but tslib's package.json
 * declares an `exports` map where `import > node` resolves to `./modules/index.js`.
 * Node.js 22 ESM loader tries that path first and throws ERR_MODULE_NOT_FOUND
 * because Nitro only copied tslib.es6.mjs and package.json.
 *
 * Fix: copy the missing tslib files into the Vercel function output so that
 * every entry in the exports map resolves correctly at runtime.
 */

import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const src = join(root, "node_modules", "tslib");
const dest = join(
  root,
  ".vercel",
  "output",
  "functions",
  "__server.func",
  "node_modules",
  "tslib",
);

if (!existsSync(dest)) {
  console.log("[patch] tslib output dir not found, skipping.");
  process.exit(0);
}

// Copy tslib.js (CJS fallback) and modules/ folder (ESM node entry)
const filesToCopy = ["tslib.js", "tslib.es6.js", "tslib.d.ts"];
for (const f of filesToCopy) {
  const srcFile = join(src, f);
  if (existsSync(srcFile)) {
    cpSync(srcFile, join(dest, f));
    console.log(`[patch] copied tslib/${f}`);
  }
}

// Copy modules/ directory
const modulesDir = join(src, "modules");
if (existsSync(modulesDir)) {
  const destModules = join(dest, "modules");
  mkdirSync(destModules, { recursive: true });
  cpSync(modulesDir, destModules, { recursive: true });
  console.log("[patch] copied tslib/modules/");
}

console.log("[patch] tslib output patched successfully.");
