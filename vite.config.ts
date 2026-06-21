import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nitro: {
    preset: "vercel",
    // traceDeps copies these packages physically into __server.func/node_modules/
    // via nf3 file tracing. Because node_modules/ sits at /var/task/ (the function
    // root), Node.js ESM can resolve bare specifiers like `import "@supabase/auth-js"`
    // from ANY subdirectory (_libs/, _ssr/, etc.) by walking up to /var/task/.
    //
    // Without this, Nitro bundles @supabase/* into _libs/ chunks that still use
    // bare cross-imports, which cannot be resolved at Vercel runtime.
    ...({
      traceDeps: [
        "@supabase/supabase-js*",
        "@supabase/auth-js*",
        "@supabase/postgrest-js*",
        "@supabase/realtime-js*",
        "@supabase/functions-js*",
        "@supabase/storage-js*",
        "tslib*",
      ],
    } as any),
  },

  vite: {
    ssr: {
      external: ["pg-native"],
    },
  },
});
