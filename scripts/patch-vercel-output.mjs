/**
 * patch-vercel-output.mjs
 *
 * Nitro splits @supabase/* packages into _libs/ chunks that still contain
 * bare `import { ... } from "tslib"` statements. Those files live in
 * /var/task/_libs/ at Vercel runtime — a subdirectory with no node_modules
 * sibling — so Node's ESM resolver cannot find tslib no matter what we put in
 * /var/task/node_modules/.
 *
 * The only reliable fix is to rewrite every bare `from "tslib"` import in
 * _libs/ chunks into a relative path pointing to a real tslib ESM file we
 * place alongside them.
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

if (!existsSync(funcDir)) {
  console.log("[patch] __server.func not found, skipping.");
  process.exit(0);
}

// ── 1. Copy tslib ESM file into _libs/ so relative imports resolve ────────────
const tslibSrc = join(root, "node_modules", "tslib", "tslib.es6.mjs");
const tslibDest = join(libsDir, "tslib.mjs");

if (existsSync(libsDir)) {
  cpSync(tslibSrc, tslibDest);
  console.log("[patch] copied tslib.es6.mjs → _libs/tslib.mjs");
} else {
  console.log("[patch] _libs/ not found, skipping tslib copy.");
}

// ── 2. Rewrite bare `from "tslib"` in every _libs/*.mjs file ─────────────────
if (existsSync(libsDir)) {
  const files = readdirSync(libsDir).filter(
    (f) => f.endsWith(".mjs") && f !== "tslib.mjs",
  );

  let patchedCount = 0;
  for (const file of files) {
    const filePath = join(libsDir, file);
    const original = readFileSync(filePath, "utf8");

    // Match both named and namespace imports from "tslib"
    const patched = original
      .replace(/from\s+"tslib"/g, 'from "./tslib.mjs"')
      .replace(/from\s+'tslib'/g, "from './tslib.mjs'");

    if (patched !== original) {
      writeFileSync(filePath, patched, "utf8");
      console.log(`[patch] rewrote tslib import in _libs/${file}`);
      patchedCount++;
    }
  }
  console.log(`[patch] patched ${patchedCount} file(s) in _libs/`);
}

// ── 3. Clean up the generated package.json dependencies ──────────────────────
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
