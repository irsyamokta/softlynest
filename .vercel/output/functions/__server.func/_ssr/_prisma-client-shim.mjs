import { createRequire } from "node:module";
const _req = createRequire(import.meta.url);
const { PrismaClient } = _req("../node_modules/@prisma/client/default.js");
export { PrismaClient };
