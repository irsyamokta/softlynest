import { createRequire } from "node:module";
const _require = createRequire(import.meta.url);
const { PrismaClient } = _require("../node_modules/@prisma/client/default.js");
export { PrismaClient };
