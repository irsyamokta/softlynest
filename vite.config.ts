import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nitro: {
    preset: "vercel",
    // Bundle @supabase/* and tslib INLINE into the main server chunks instead
    // of splitting them into _libs/ subdirectory files. When Nitro splits them
    // into _libs/, each file still uses bare specifiers to cross-import each
    // other (e.g. supabase__auth-js.mjs imports from "@supabase/supabase-js")
    // which Node.js ESM cannot resolve from /var/task/_libs/ at Vercel runtime.
    ...({
      externals: {
        inline: [
          "@supabase/supabase-js",
          "@supabase/auth-js",
          "@supabase/postgrest-js",
          "@supabase/realtime-js",
          "@supabase/functions-js",
          "@supabase/storage-js",
          "tslib",
        ],
      },
    } as any),
  },

  vite: {
    ssr: {
      external: ["pg-native"],
    },
  },
});
