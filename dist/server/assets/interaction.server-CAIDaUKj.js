import { i as createServerFn } from "./esm-Dova13aH.js";
import { t as createSsrRpc } from "./createSsrRpc-CwTB2-hy.js";
//#region src/lib/interaction.server.ts
var likePostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("9711f81d28457d45d362150574431804cbca6102a1e50d3228b2fb096b4c28f7"));
var favoritePostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("589c7e6813f6d50c190b81108fa54e3444c726f2c1762beb0922de73230b6040"));
var commentPostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("fa0e0e1dae08acf63c0a591f16aea751ab253c85e728be2461a105a464fc28b1"));
var getCommentsFn = createServerFn({ method: "POST" }).validator((postId) => postId).handler(createSsrRpc("49b920660566bf2892d04ad626af48052cc433ba1147c67059221b093ce93487"));
var getNotificationsFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(createSsrRpc("a66e672d52c420d38b1121f21dd83303b54bb597c4a112d4c073fe4567d72bd7"));
var markAllNotificationsReadFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(createSsrRpc("e48c9ee005cdd3aafc102420d29ed82769b546110c14c3958c097649917f0306"));
var markNotificationReadFn = createServerFn({ method: "POST" }).validator((notificationId) => notificationId).handler(createSsrRpc("db3458b7aafbd1a9a24421cf09d674a57b42be68cf94f2f48d4bb98f52013795"));
var deleteNotificationFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("2e4bd468a3e6b2b23cee067aea9663b8510cc2a66d1707a52de085cf61179fbf"));
var deleteCommentFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0f5c261735d929e2bd41004ff0132f227c4453e47eb60cca37f6be968ba5c6d5"));
var toggleFollowFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f763b515b06f8ee714e636f05adf1579d3c5e97c010cd84347b3f0f8aa1752cd"));
//#endregion
export { getCommentsFn as a, markAllNotificationsReadFn as c, favoritePostFn as i, markNotificationReadFn as l, deleteCommentFn as n, getNotificationsFn as o, deleteNotificationFn as r, likePostFn as s, commentPostFn as t, toggleFollowFn as u };
