import "dotenv/config";
import { createRequire } from "module";
import type { PrismaClient as PrismaClientType } from "@prisma/client";

// Use process.cwd() instead of import.meta.url — Vite SSR transforms import.meta.url
// to a virtual module path which causes createRequire to resolve from the wrong directory.
const _require = createRequire(process.cwd() + "/package.json");

const { PrismaClient } = _require("@prisma/client") as {
  PrismaClient: typeof PrismaClientType;
};
const { PrismaPg } = _require("@prisma/adapter-pg") as {
  PrismaPg: any;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClientType };

export const prisma: PrismaClientType =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
