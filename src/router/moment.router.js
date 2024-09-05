const koaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/login.middleware");
const {
  insertMoment,
  searchAllMoment,
  serchMomentById,
  deleteMoment,
  deleteLikeFavor,
  addLikeFavor,
} = require("../controller/momentController");
const {
  checkContent,
  checkUserIdIsSame,
} = require("../middleware/moment.middleware");
const { verifyPermission } = require("../middleware/permission.middleware");

const momentRouter = new koaRouter({
  prefix: "/moment",
});

// 这个是更新动态的接口
momentRouter.post("/publish", verifyAuth, checkContent, insertMoment);

// 下面是查看动态的接口,这个接口是用来展示所有的动态信息
momentRouter.get("/search/list", verifyAuth, searchAllMoment);

// 进入动态详情页中查看，这是需要传入这条动态的id
momentRouter.get("/search/:momentId", verifyAuth, serchMomentById);

// 删除动态信息操作
momentRouter.get(
  "/delete/:momentId",
  verifyAuth,
  verifyPermission,
  deleteMoment
);

// 给某条评论删除点赞或收藏, 先判断是否登录, 再判断登录用户的id是否与查询的id是否一致
momentRouter.get(
  "/drop/moment_like",
  verifyAuth,
  checkUserIdIsSame,
  deleteLikeFavor
);
momentRouter.get(
  "/drop/moment_favor",
  verifyAuth,
  checkUserIdIsSame,
  deleteLikeFavor
);

// 下面是增添记录
momentRouter.get(
  "/add/moment_like",
  verifyAuth,
  checkUserIdIsSame,
  addLikeFavor
);
momentRouter.get(
  "/add/moment_favor",
  verifyAuth,
  checkUserIdIsSame,
  addLikeFavor
);

module.exports = momentRouter;
