import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Nitro's dependency tracer leaves bare-specifier imports like `import { __awaiter } from "tslib"`
// intact in _libs/ chunks. At Vercel runtime those files live in /var/task/_libs/ which has no
// node_modules sibling, so Node's ESM resolver throws ERR_MODULE_NOT_FOUND.
//
// Fix: set noExternals:true so Rollup inlines every npm package, then re-externalise only the
// packages that cannot be bundled (Prisma/pg need native bindings; cloudinary/dotenv are
// server-only singletons that must stay external for Vercel's Node runtime).
const nitroExtra = {
  noExternals: true,
  externals: {
    external: [
      "@prisma/client",
      "@prisma/adapter-pg",
      ".prisma/client",
      "pg",
      "pg-pool",
      "cloudinary",
      "dotenv",
    ],
  },
};

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nitro: { preset: "vercel", ...(nitroExtra as any) },

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
