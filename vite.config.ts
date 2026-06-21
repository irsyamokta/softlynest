import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nitro: {
    preset: process.env.NITRO_PRESET ?? "node-server",
  },

  vite: {
    ssr: {
      external: ["pg-native"],
    },
  },
});
