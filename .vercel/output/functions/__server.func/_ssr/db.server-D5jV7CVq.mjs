import { i as TSS_SERVER_FUNCTION } from "./esm-Dova13aH.mjs";
import "../_libs/dotenv.mjs";
import { createRequire } from "module";
//#region node_modules/.nitro/vite/services/ssr/assets/db.server-D5jV7CVq.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _require = createRequire(process.cwd() + "/package.json");
var { PrismaClient } = _require("@prisma/client");
var { PrismaPg } = _require("@prisma/adapter-pg");
function createPrismaClient() {
	const connectionString = process.env.DATABASE_URL;
	return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
var prisma = globalThis.prisma ?? createPrismaClient();
//#endregion
export { prisma as n, createServerRpc as t };
