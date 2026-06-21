import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DyzFCpJs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/message.server-ByuRQYLo.js
var getConversationsFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(createSsrRpc("83f156a1ca0c8aefb6213c7ca10d9dfd85e83dc341dbbdfd2704462469ed2860"));
var getMessagesFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0726cf6375655a2d1a9552bc3e48126d9bcce6b79353c4a2db132644f45a084d"));
var sendMessageFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("55a426cd295dc1d2dd9701272d122f5bd79d998107bb257d92bb1fb65c4f8d96"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f8e9971b340ca89ee616d62c1fa880ccff87aa04b7eb10f239d758262a6146c3"));
var markMessagesAsReadFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("27db5257b94479ef610a5558aea0e041c90aa31d580f836ac263fce0a273887b"));
var getUnreadMessagesCountFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(createSsrRpc("e62509829b2aebfa515062edec3dc7e4ce84371f2a8ca9d409231978ffb33b15"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("bc2c689f926e8060c51533463834a233b343eee3ee5c62f4bb989d7c62997b33"));
//#endregion
export { sendMessageFn as a, markMessagesAsReadFn as i, getMessagesFn as n, getUnreadMessagesCountFn as r, getConversationsFn as t };
