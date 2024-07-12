const koaRouter = require("@koa/router")

const { verifyAuth } = require("../middleware/login.middleware");
const { updateAvatar } = require("../controller/fileController");
const { handleAvatar } = require("../middleware/file.middleware");



const avatarRouter = new koaRouter({
  prefix: "/file"
})

// 更新头像
avatarRouter.post("/avatar", verifyAuth, handleAvatar, updateAvatar);

module.exports =  avatarRouter