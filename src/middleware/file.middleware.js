const multer = require("@koa/multer");
const { UPLOAD_PATH, TEM_UPLOAD } = require("../config/path");
const { getIsInitAvatar } = require("../dbService/file.service");
const { IS_NOT_INIT_AVATAR } = require("../config/error");

//  更新头像的中间件
const uploadAvatar = multer({
  dest: UPLOAD_PATH,
});
const handleAvatar = uploadAvatar.single("avatar");

// 头像暂存
const uploadTempAvatar = multer({
  dest: TEM_UPLOAD,
});
const handleTemAvatar = uploadTempAvatar.single("file");

async function checkIsInitAvatar(ctx, next) {
  const { id } = ctx.request.params;
  // 查询数据库中该用户是否有头像
  const res = await getIsInitAvatar(id);
  const avatarId = res[0][0].avatarId;
  if (avatarId) return ctx.app.emit("error", IS_NOT_INIT_AVATAR, ctx);
  await next();
}

module.exports = {
  handleAvatar,
  handleTemAvatar,
  checkIsInitAvatar,
};
