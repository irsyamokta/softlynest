/**
 * Supabase Admin client — server-side only.
 * Reads env vars at call time. Uses dotenv with override:true to ensure
 * empty strings set by the bundler are replaced with actual .env values.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseAdmin(): SupabaseClient {
  // Load .env with override:true so bundler-injected empty strings
  // don't block the real values from .env file
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("dotenv").config({ override: true });
  } catch {
    // dotenv unavailable in some environments — env vars come from Docker/OS
  }

  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "";

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !key) {
    throw new Error(
      `Supabase admin credentials missing:\n` +
        `  SUPABASE_URL: ${url ? "✓ set" : "✗ NOT SET"}\n` +
        `  SUPABASE_SERVICE_ROLE_KEY: ${key ? "✓ set" : "✗ NOT SET"}`,
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
