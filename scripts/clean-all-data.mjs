/**
 * clean-all-data.mjs
 *
 * Wipes ALL data from:
 * 1. Cloudinary — deletes the entire "softlynest" folder
 * 2. Prisma DB  — truncates all tables in dependency order
 * 3. Supabase Auth — deletes every user from auth.users
 *
 * Run: node scripts/clean-all-data.mjs
 * Requires .env to be present with all keys.
 */

import "dotenv/config";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const _require = createRequire(join(__dirname, "../package.json"));

// ── 1. Cloudinary ─────────────────────────────────────────────────────────────
async function cleanCloudinary() {
  console.log("\n[1/3] Cleaning Cloudinary...");
  const { v2: cloudinary } = _require("cloudinary");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  try {
    // Delete entire softlynest folder and all its resources
    const result = await cloudinary.api.delete_resources_by_prefix("softlynest");
    console.log(`  ✓ Deleted resources:`, result.deleted ? Object.keys(result.deleted).length : 0);
    // Also delete the folder itself
    try {
      await cloudinary.api.delete_folder("softlynest");
      console.log(`  ✓ Deleted folder: softlynest`);
    } catch {
      console.log(`  ~ Folder already empty or not found`);
    }
  } catch (err) {
    console.warn(`  ! Cloudinary cleanup error:`, err.message);
  }
}

// ── 2. Prisma DB ──────────────────────────────────────────────────────────────
async function cleanPrisma() {
  console.log("\n[2/3] Cleaning Prisma DB...");
  const { PrismaClient } = _require("@prisma/client");
  const { PrismaPg } = _require("@prisma/adapter-pg");

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    // Delete in dependency order (children first)
    const results = await prisma.$transaction([
      prisma.postHashtag.deleteMany(),
      prisma.hashtag.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.message.deleteMany(),
      prisma.favorite.deleteMany(),
      prisma.like.deleteMany(),
      prisma.comment.deleteMany(),
      prisma.follow.deleteMany(),
      prisma.post.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    const tables = [
      "PostHashtag", "Hashtag", "Notification", "Message",
      "Favorite", "Like", "Comment", "Follow", "Post", "User",
    ];
    results.forEach((r, i) => console.log(`  ✓ ${tables[i]}: deleted ${r.count} rows`));
  } finally {
    await prisma.$disconnect();
  }
}

// ── 3. Supabase Auth ──────────────────────────────────────────────────────────
async function cleanSupabaseAuth() {
  console.log("\n[3/3] Cleaning Supabase Auth...");
  const { createClient } = _require("@supabase/supabase-js");

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("  ✗ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return;
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Paginate through all users
  let page = 1;
  let totalDeleted = 0;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) { console.error("  ✗ List users error:", error.message); break; }
    if (!data.users.length) break;

    await Promise.allSettled(
      data.users.map(async (u) => {
        const { error: delErr } = await admin.auth.admin.deleteUser(u.id);
        if (delErr) console.warn(`  ! Failed to delete ${u.email}: ${delErr.message}`);
        else totalDeleted++;
      }),
    );

    if (data.users.length < 100) break;
    page++;
  }

  console.log(`  ✓ Deleted ${totalDeleted} auth users`);
}

// ── Run ───────────────────────────────────────────────────────────────────────
console.log("⚠️  Starting full data cleanup...");
console.log("    This will DELETE ALL data permanently.\n");

await cleanCloudinary();
await cleanPrisma();
await cleanSupabaseAuth();

console.log("\n✅ All data cleaned successfully.");
