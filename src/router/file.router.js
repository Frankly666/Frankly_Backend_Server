const koaRouter = require("@koa/router")

const { verifyAuth } = require("../middleware/login.middleware");
const { updateAvatar, getUserAvatar } = require("../controller/fileController");
const { handleAvatar } = require("../middleware/file.middleware");


const avatarRouter = new koaRouter({
  prefix: "/file"
})



// 更新头像
avatarRouter.post("/avatar", verifyAuth, handleAvatar, updateAvatar);

// 查看头像的接口
avatarRouter.get("/avatar/:userId", getUserAvatar)

module.exports =  avatarRouter