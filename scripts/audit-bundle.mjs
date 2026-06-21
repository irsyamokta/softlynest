import fs from "node:fs";
import path from "node:path";

const funcDir = ".vercel/output/functions/__server.func";
const allDirs = ["", "/_ssr", "/_libs", "/_chunks"];
const bareImports = new Map();

for (const dir of allDirs) {
  const d = funcDir + dir;
  if (!fs.existsSync(d)) continue;
  for (const file of fs.readdirSync(d).filter((f) => f.endsWith(".mjs"))) {
    const content = fs.readFileSync(path.join(d, file), "utf8");
    const re = /from\s+["']([^./][^"']*?)["']/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const raw = m[1];
      const pkg = raw.startsWith("@")
        ? raw.split("/").slice(0, 2).join("/")
        : raw.split("/")[0];
      if (!bareImports.has(pkg)) bareImports.set(pkg, new Set());
      bareImports.get(pkg).add(dir + "/" + file);
    }
  }
}

console.log("\n=== Bare specifier imports in Vercel function bundle ===\n");
for (const [pkg, files] of [...bareImports].sort())
  console.log(`${pkg}\n  → ${[...files].join("\n  → ")}\n`);

// Also check what's in node_modules
console.log("=== node_modules in bundle ===");
const nm = path.join(funcDir, "node_modules");
if (fs.existsSync(nm)) {
  const list = fs.readdirSync(nm);
  for (const d of list) {
    if (d.startsWith("@")) {
      for (const sub of fs.readdirSync(path.join(nm, d)))
        console.log(`  @${d}/${sub}`);
    } else {
      console.log(`  ${d}`);
    }
  }
}
