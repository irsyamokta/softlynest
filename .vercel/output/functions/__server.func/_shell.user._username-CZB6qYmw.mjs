import { a as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { t as ProfileContent } from "./_ssr/ProfileContent-CCY1GGMc.mjs";
import { t as Route } from "./_shell.user._username-8Zaz0aFX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.user._username-CZB6qYmw.js
var import_jsx_runtime = require_jsx_runtime();
function UserProfilePage() {
	const { username } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileContent, { username })
	});
}
//#endregion
export { UserProfilePage as component };
