/**
 * patch-vercel-output.mjs
 *
 * Nitro places bundled chunks in subdirectories (_ssr/, _libs/) but Node.js
 * ESM bare-specifier resolution only walks UP from the importing file's own
 * directory looking for node_modules/. The function's node_modules/ sits at
 * __server.func/ (the root), so it is invisible to files in __server.func/_ssr/
 * and __server.func/_libs/.
 *
 * Patches applied:
 * 1. _libs/ — rewrite `from "tslib"` → `from "./tslib.mjs"` and copy tslib ESM.
 * 2. _ssr/  — rewrite bare `@prisma/client` import → relative path to node_modules.
 * 3. package.json — remove `dependencies` so Vercel treats the bundle as self-contained.
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const funcDir = join(root, ".vercel", "output", "functions", "__server.func");
const libsDir = join(funcDir, "_libs");
const ssrDir = join(funcDir, "_ssr");

if (!existsSync(funcDir)) {
  console.log("[patch] __server.func not found, skipping.");
  process.exit(0);
}

// ── 1. Copy tslib ESM into _libs/ and rewrite bare imports ───────────────────
if (existsSync(libsDir)) {
  const tslibSrc = join(root, "node_modules", "tslib", "tslib.es6.mjs");
  const tslibDest = join(libsDir, "tslib.mjs");
  cpSync(tslibSrc, tslibDest);
  console.log("[patch] copied tslib.es6.mjs → _libs/tslib.mjs");

  let patchedCount = 0;
  for (const file of readdirSync(libsDir).filter(
    (f) => f.endsWith(".mjs") && f !== "tslib.mjs",
  )) {
    const filePath = join(libsDir, file);
    const original = readFileSync(filePath, "utf8");
    const patched = original
      .replace(/from\s+"tslib"/g, 'from "./tslib.mjs"')
      .replace(/from\s+'tslib'/g, "from './tslib.mjs'");
    if (patched !== original) {
      writeFileSync(filePath, patched, "utf8");
      console.log(`[patch] rewrote tslib import in _libs/${file}`);
      patchedCount++;
    }
  }
  console.log(`[patch] patched ${patchedCount} _libs file(s) for tslib`);
}

// ── 2. Rewrite bare package imports in _ssr/ ─────────────────────────────────
// @prisma/client stays as bare import in _ssr/ because it's CJS — Nitro can't
// fully inline it. Solution: create a shim ESM file in _ssr/ that re-exports
// PrismaClient using createRequire (CJS interop), then rewrite the bare import.
if (existsSync(ssrDir)) {
  // Write the shim
  const shimPath = join(ssrDir, "_prisma-client-shim.mjs");
  const shimContent = `import { createRequire } from "node:module";
const _require = createRequire(import.meta.url);
const { PrismaClient } = _require("../node_modules/@prisma/client/default.js");
export { PrismaClient };
`;
  writeFileSync(shimPath, shimContent, "utf8");
  console.log("[patch] wrote _ssr/_prisma-client-shim.mjs");

  // Rewrite the bare import
  let patchedCount = 0;
  for (const file of readdirSync(ssrDir).filter(
    (f) => f.endsWith(".mjs") && f !== "_prisma-client-shim.mjs",
  )) {
    const filePath = join(ssrDir, file);
    const original = readFileSync(filePath, "utf8");
    const patched = original
      .replace(/from\s+"@prisma\/client"/g, 'from "./_prisma-client-shim.mjs"')
      .replace(/from\s+'@prisma\/client'/g, "from './_prisma-client-shim.mjs'");
    if (patched !== original) {
      writeFileSync(filePath, patched, "utf8");
      console.log(`[patch] rewrote @prisma/client import in _ssr/${file}`);
      patchedCount++;
    }
  }
  console.log(`[patch] patched ${patchedCount} _ssr file(s)`);
}

// ── 3. Remove `dependencies` from generated package.json ─────────────────────
const pkgPath = join(funcDir, "package.json");
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (pkg.dependencies) {
    delete pkg.dependencies;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    console.log("[patch] removed dependencies from __server.func/package.json");
  }
}

console.log("[patch] done.");
