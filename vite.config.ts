import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nitro: { preset: "vercel" },

  vite: {
    ssr: {
      // Only keep packages that truly cannot be bundled (native node addons).
      // @prisma/client with adapter-pg uses pure JS — it must be bundled so
      // Vercel's serverless function is fully self-contained.
      external: ["pg-native"],
    },
  },
});
