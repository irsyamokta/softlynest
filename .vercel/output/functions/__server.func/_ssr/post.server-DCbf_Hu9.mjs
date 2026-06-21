import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CvPxwc3u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/post.server-DCbf_Hu9.js
var getFeedFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("9e7eaf989d9b57aac5be3140f267164a8516d30d17910bc8c8eafc9485f22129"));
var createPostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("dc16952635d1d6747da6c74f60044a2212be5fcd7b2cab4a42811c1e77c17de9"));
var getHashtagsFn = createServerFn({ method: "GET" }).handler(createSsrRpc("c1521c6c961f9c49d625848f21aa7281f73a821397059130c33ff7f56cd97558"));
var getExploreFeedFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("c7c2ac4b928f079d8088466fd352a33075871835f9edef669ab389084581e650"));
var searchPostsFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("3dc0360ccd780d2fa82c5bf100c989a98bbab23999252b684c5a2626270bdd3f"));
var getFavoritesFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(createSsrRpc("3a0df688679e9e773ecc4bc0ca33e19da53d16cb808975cc8e842799edc9361e"));
var getPostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("09ad60b3bba6d01ae609ce629888277ad70dac69407936a2399d8fddbbaf8d9f"));
var getUserPostsFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("c54f2f6aaf2504ea153342332e9b650e1de9d4efca51feead796399669265dcd"));
var deletePostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("8a1792cb2a129b576864a351631efd5b1e082ca63236dfdde2bab2a257efa07e"));
//#endregion
export { getFeedFn as a, getUserPostsFn as c, getFavoritesFn as i, searchPostsFn as l, deletePostFn as n, getHashtagsFn as o, getExploreFeedFn as r, getPostFn as s, createPostFn as t };
