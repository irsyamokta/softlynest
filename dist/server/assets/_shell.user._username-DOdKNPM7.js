import { t as Route } from "./_shell.user._username-XSFq8GTP.js";
import { t as ProfileContent } from "./ProfileContent-BKhqG8_o.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_shell.user.$username.tsx?tsr-split=component
function UserProfilePage() {
	const { username } = Route.useParams();
	return /* @__PURE__ */ jsx("div", {
		className: "w-full",
		children: /* @__PURE__ */ jsx(ProfileContent, { username })
	});
}
//#endregion
export { UserProfilePage as component };
