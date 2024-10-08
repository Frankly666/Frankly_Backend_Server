const {
  insertAvatar,
  searchAvatar,
  insertTemAvatar,
  deleteTemAvatarDB,
} = require("../dbService/file.service");
const fs = require("fs");

const { SERVER_HOST, SERVE_PORT } = require("../config/serve");
const { UPLOAD_PATH, TEM_UPLOAD } = require("../config/path");
const { deleteFileByName } = require("../utils/deleteTemAvatarFile");

class fileController {
  async updateAvatar(ctx, next) {
    const { filename, mimetype, size } = ctx.request.file;
    const { id } = ctx.user || ctx.request.params;

    const res = await insertAvatar({ filename, mimetype, size, user_id: id });

    // 下面进行拼接url然后给客户端返回
    const avatarUrl = `${SERVER_HOST}:${SERVE_PORT}/file/avatar/${id}`;

    ctx.body = {
      code: 0,
      message: "上传头像成功",
      data: avatarUrl,
    };
  }

  async getUserAvatar(ctx, next) {
    const { userId } = ctx.request.params;

    // 下面是查询到用户的头像然后返回
    const res = await searchAvatar(userId);
    const { filename, mimetype } = res;

    const avatar = fs.createReadStream(`${UPLOAD_PATH}/${filename}`);
    ctx.type = mimetype;
    ctx.body = avatar;
  }

  async storeTempAvatar(ctx, next) {
    const { filename } = ctx.request.file;

    try {
      deleteFileByName(TEM_UPLOAD, filename);
    } catch (err) {
      console.log("err: ", err);
    }

    ctx.body = {
      code: 0,
      message: "成功",
    };
  }
}

module.exports = new fileController();
