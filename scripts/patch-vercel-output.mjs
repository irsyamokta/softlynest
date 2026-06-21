/**
 * patch-vercel-output.mjs
 *
 * ROOT CAUSE:
 * Nitro's Vercel preset splits packages into _libs/ and _ssr/ subdirectories,
 * but leaves bare-specifier imports (e.g. `from "@supabase/auth-js"`) intact.
 * Node.js ESM bare-specifier resolution walks UP from the importing file's own
 * directory — so a file in /var/task/_libs/ looks for node_modules in:
 *   /var/task/_libs/node_modules/   ← doesn't exist
 *   /var/task/node_modules/         ← doesn't exist at Vercel runtime
 *   /node_modules/                  ← doesn't exist
 * Result: ERR_MODULE_NOT_FOUND for every cross-chunk import.
 *
 * FIX:
 * Build a map of every .mjs file in _libs/ and _ssr/, then rewrite every bare
 * specifier that resolves to another file in the bundle into a relative path.
 * For packages that are NOT in the bundle (true externals), create a shim that
 * uses createRequire from node_modules at the function root.
 */

import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const funcDir = join(root, ".vercel", "output", "functions", "__server.func");

if (!existsSync(funcDir)) {
  console.log("[patch] __server.func not found, skipping.");
  process.exit(0);
}

// ── Build a map: package-name → relative .mjs filename in _libs/ ─────────────
// Nitro names chunks like: supabase__auth-js.mjs for @supabase/auth-js
// We detect this by looking at the first comment in each file: //#region node_modules/PKG
const libsDir = join(funcDir, "_libs");
const ssrDir = join(funcDir, "_ssr");

const pkgToLibFile = new Map(); // "@supabase/auth-js" → "_libs/supabase__auth-js.mjs"

if (existsSync(libsDir)) {
  for (const file of readdirSync(libsDir).filter((f) => f.endsWith(".mjs"))) {
    const content = readFileSync(join(libsDir, file), "utf8");
    // Extract the first //#region node_modules/PKG line
    const m = content.match(/\/\/#region node_modules\/((?:@[^/]+\/[^/]+|[^/]+))/);
    if (m) pkgToLibFile.set(m[1], `_libs/${file}`);
  }
}
console.log("[patch] detected lib chunks:", [...pkgToLibFile.keys()]);

// ── Helper: rewrite bare imports in a file ────────────────────────────────────
function patchFile(filePath, fileRelDir) {
  const original = readFileSync(filePath, "utf8");
  let patched = original;

  // Match: from "pkg" or from "@scope/pkg" or from "@scope/pkg/sub"
  const re = /from\s+["'](@?[a-z0-9_.-]+(?:\/[a-z0-9_.-]+)*)["']/gi;
  patched = patched.replace(re, (match, specifier) => {
    // Normalise to base package name
    const parts = specifier.split("/");
    const pkgName = specifier.startsWith("@")
      ? parts.slice(0, 2).join("/")
      : parts[0];

    if (pkgToLibFile.has(pkgName)) {
      // Resolve relative path from this file's directory to the target lib file
      const targetAbs = join(funcDir, pkgToLibFile.get(pkgName));
      const fromAbs = dirname(filePath);
      let rel = relative(fromAbs, targetAbs).replace(/\\/g, "/");
      if (!rel.startsWith(".")) rel = "./" + rel;
      return `from "${rel}"`;
    }

    // tslib special case: we place tslib.mjs in _libs/
    if (pkgName === "tslib") {
      const targetAbs = join(libsDir, "tslib.mjs");
      const fromAbs = dirname(filePath);
      let rel = relative(fromAbs, targetAbs).replace(/\\/g, "/");
      if (!rel.startsWith(".")) rel = "./" + rel;
      return `from "${rel}"`;
    }

    return match; // leave unknown specifiers untouched
  });

  if (patched !== original) {
    writeFileSync(filePath, patched, "utf8");
    return true;
  }
  return false;
}

// ── 1. Copy tslib ESM into _libs/ ─────────────────────────────────────────────
if (existsSync(libsDir)) {
  const tslibSrc = join(root, "node_modules", "tslib", "tslib.es6.mjs");
  cpSync(tslibSrc, join(libsDir, "tslib.mjs"));
  console.log("[patch] copied tslib.es6.mjs → _libs/tslib.mjs");
  pkgToLibFile.set("tslib", "_libs/tslib.mjs");
}

// ── 2. Patch all _libs/ files ─────────────────────────────────────────────────
let count = 0;
if (existsSync(libsDir)) {
  for (const file of readdirSync(libsDir).filter(
    (f) => f.endsWith(".mjs") && f !== "tslib.mjs",
  )) {
    if (patchFile(join(libsDir, file), "_libs")) {
      console.log(`[patch] patched _libs/${file}`);
      count++;
    }
  }
}

// ── 3. Patch all _ssr/ files ──────────────────────────────────────────────────
if (existsSync(ssrDir)) {
  for (const file of readdirSync(ssrDir).filter(
    (f) => f.endsWith(".mjs") && !f.startsWith("_"),
  )) {
    if (patchFile(join(ssrDir, file), "_ssr")) {
      console.log(`[patch] patched _ssr/${file}`);
      count++;
    }
  }
}
console.log(`[patch] rewrote bare imports in ${count} file(s)`);

// ── 4. @prisma/client shim for _ssr/ (CJS package, needs createRequire) ───────
const shimPath = join(ssrDir, "_prisma-client-shim.mjs");
writeFileSync(
  shimPath,
  `import { createRequire } from "node:module";
const _req = createRequire(import.meta.url);
const { PrismaClient } = _req("../node_modules/@prisma/client/default.js");
export { PrismaClient };
`,
);
console.log("[patch] wrote _ssr/_prisma-client-shim.mjs");

// Patch db.server files to use shim
if (existsSync(ssrDir)) {
  for (const file of readdirSync(ssrDir).filter((f) => f.startsWith("db.server") && f.endsWith(".mjs"))) {
    const fp = join(ssrDir, file);
    const orig = readFileSync(fp, "utf8");
    const p = orig
      .replace(/from\s+"@prisma\/client"/g, 'from "./_prisma-client-shim.mjs"')
      .replace(/from\s+'@prisma\/client'/g, "from './_prisma-client-shim.mjs'");
    if (p !== orig) { writeFileSync(fp, p); console.log(`[patch] prisma shim → _ssr/${file}`); }
  }
}

// ── 5. Remove generated package.json dependencies ────────────────────────────
const pkgPath = join(funcDir, "package.json");
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  delete pkg.dependencies;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("[patch] cleaned package.json");
}

console.log("[patch] done.");
