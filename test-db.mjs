import { createRequire } from "module";
import "dotenv/config";

const _require = createRequire(process.cwd() + "/package.json");
const { PrismaClient } = _require("@prisma/client");
const { PrismaPg } = _require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

prisma.user.findUnique({ where: { username: "testing" } })
  .then(r => { console.log("OK:", r); process.exit(0); })
  .catch(e => { console.error("FAIL:", e.message); process.exit(1); });
