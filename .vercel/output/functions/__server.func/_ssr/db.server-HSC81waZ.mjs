import { i as TSS_SERVER_FUNCTION } from "./esm-Dova13aH.mjs";
import { t as PrismaPgAdapterFactory } from "../_libs/@prisma/adapter-pg.mjs";
import { PrismaClient } from "./_prisma-client-shim.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db.server-HSC81waZ.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function createPrismaClient() {
	const connectionString = process.env.DATABASE_URL;
	return new PrismaClient({ adapter: new PrismaPgAdapterFactory({ connectionString }) });
}
var prisma = globalThis.prisma ?? createPrismaClient();
//#endregion
export { prisma as n, createServerRpc as t };
