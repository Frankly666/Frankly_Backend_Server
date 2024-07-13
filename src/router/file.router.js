const koaRouter = require("@koa/router")

const { verifyAuth } = require("../middleware/login.middleware");
const { updateAvatar, getUserAvatar } = require("../controller/fileController");
// const { handleAvatar } = require("../middleware/file.middleware");


const avatarRouter = new koaRouter({
  prefix: "/file"
})

// 由于这里有点bug,考虑后面不直接封装

const multer = require("@koa/multer");
const { UPLOAD_PATH } = require("../config/path");

const uploadAvatar = multer({
  dest: UPLOAD_PATH
});

const handleAvatar = uploadAvatar.single("avatar");


// 更新头像
avatarRouter.post("/avatar", verifyAuth, async (ctx, next) => {
  try {
    console.log('ctx.req.body: ', ctx.req.file);
    await uploadAvatar.single("avatar")()
    next()
  }catch (err) {
    console.log('err: ', err);
 
  }
}, updateAvatar);

// 查看头像的接口
avatarRouter.get("/avatar/:userId", getUserAvatar)

module.exports =  avatarRouter