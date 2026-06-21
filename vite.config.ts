// @lovable.dev/vite-tanstack-config already includes base plugins (do not duplicate)
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      // Entry SSR server kamu
      entry: "server",
    },
  },

  vite: {
    ssr: {
      external: [
        "@prisma/client",
        "@prisma/adapter-pg",
        ".prisma/client",
        "pg",
        "pg-pool",
        "dotenv",
        "cloudinary",
      ],
    },

    optimizeDeps: {
      exclude: [
        "@prisma/client",
        "@prisma/adapter-pg",
        "pg",
        "cloudinary",
      ],
    },
  },
});