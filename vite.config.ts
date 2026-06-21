import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server/entry.ts",
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
  },
});