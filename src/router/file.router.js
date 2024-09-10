const koaRouter = require("@koa/router");

const { verifyAuth } = require("../middleware/login.middleware");
const {
  updateAvatar,
  getUserAvatar,
  storeTempAvatar,
  deleteTemAvatar,
} = require("../controller/fileController");
const {
  handleAvatar,
  handleTemAvatar,
  checkIsInitAvatar,
} = require("../middleware/file.middleware");

const avatarRouter = new koaRouter({
  prefix: "/file",
});

// 更新头像
avatarRouter.post("/avatar", verifyAuth, handleAvatar, updateAvatar);
avatarRouter.post(
  "/avatar/initReal/:id",
  handleAvatar,
  checkIsInitAvatar,
  updateAvatar
);

// 暂存头像
avatarRouter.post(
  "/avatar/init/",
  handleTemAvatar,
  storeTempAvatar
);


// 查看头像的接口
avatarRouter.get("/avatar/:userId", getUserAvatar);

module.exports = avatarRouter;
