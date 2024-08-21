const multer = require("@koa/multer");
const { UPLOAD_PATH, TEM_UPLOAD } = require("../config/path");

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

module.exports = {
  handleAvatar,
  handleTemAvatar,
};
