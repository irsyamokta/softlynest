import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Cast to any because @lovable.dev/vite-tanstack-config exposes only a subset
  // of Nitro's options. externals.inline forces Nitro to bundle tslib (required
  // by all @supabase/* packages) into the Vercel function output.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nitro: {
    preset: "vercel",
    ...({ externals: { inline: ["tslib"] } } as any),
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