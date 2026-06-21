import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CvPxwc3u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.server-BroEg_wp.js
var checkUsernameFn = createServerFn({ method: "POST" }).validator((username) => username).handler(createSsrRpc("b56bf2948e980f5cbc9e6e055d16792b6ad547af246d5853999cb55e9f36af16"));
var searchUsersFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("8d6b6ea82add1e843408efeec6f5137c144e16f0bfa026c0aac8a088c3121226"));
var getMyProfileFn = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("e56ddbecd396cd218e2c13df014a63dc9ac751a97146a3443ae8f42e6b3e86a2"));
var syncUserToPrismaFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("a37fd6cda6f1f78d89d9560c28a198c4bfdde021ef8a2523f3f952c8e06a6035"));
var updateProfileFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("468282a84162be15dfb94dc5314dff337da634ea75ae1518ce602a0373fa67af"));
var getFollowListFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("956ffe0d797397518dc89183efccdb4035e2b614fc4426ba94938d02bc69e6f3"));
var getChatContactsFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(createSsrRpc("c585ebeac3288313540302398667ddef2ca61e07cc280d69cb21c4ee357ea1c8"));
var getProfileByUsernameFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("a24376be31bddfd76a8c9c029124ac8f4187ddb0498cce8644c3b617e43c8600"));
//#endregion
export { getProfileByUsernameFn as a, updateProfileFn as c, getMyProfileFn as i, getChatContactsFn as n, searchUsersFn as o, getFollowListFn as r, syncUserToPrismaFn as s, checkUsernameFn as t };
