import { p as TSS_SERVER_FUNCTION } from "./esm-Dova13aH.js";
import "dotenv/config";
import { createRequire } from "module";
//#region node_modules/@tanstack/start-server-core/dist/esm/createServerRpc.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/lib/db.server.ts
var _require = createRequire(process.cwd() + "/package.json");
var { PrismaClient } = _require("@prisma/client");
var { PrismaPg } = _require("@prisma/adapter-pg");
function createPrismaClient() {
	const connectionString = process.env.DATABASE_URL;
	return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
var prisma = globalThis.prisma ?? createPrismaClient();
//#endregion
export { createServerRpc as n, prisma as t };
