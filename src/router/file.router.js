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
} = require("../middleware/file.middleware");

const avatarRouter = new koaRouter({
  prefix: "/file",
});

// 更新头像
avatarRouter.post("/avatar", verifyAuth, handleAvatar, updateAvatar);

// 用户注册时就上传头像
avatarRouter.post(
  "/avatar/init/:userRealName",
  handleTemAvatar,
  storeTempAvatar
);

// 删除用户的暂存头像
avatarRouter.get("/avatar/init/delete/:userRealName", deleteTemAvatar);

// 查看头像的接口
avatarRouter.get("/avatar/:userId", getUserAvatar);

module.exports = avatarRouter;
