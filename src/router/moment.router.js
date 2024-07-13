const koaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/login.middleware");
const {
  insertMoment,
  searchAllMoment,
  serchMomentById,
  deleteMoment,
} = require("../controller/momentController");
const { checkContent } = require("../middleware/moment.middleware");
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
momentRouter.delete(
  "/delete/:momentId",
  verifyAuth,
  verifyPermission,
  deleteMoment
);

module.exports = momentRouter;
