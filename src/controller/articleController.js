const { TEM_UPLOAD } = require("../config/path");
const {
  insert,
  uploadCoverDB,
  getCoverDB,
} = require("../dbService/article.service");
const fs = require("fs");
const { deleteFileByName } = require("../utils/deleteTemAvatarFile");

class articleController {
  async insertArticle(ctx, next) {
    const { title, content } = ctx.request.body;
    const { id } = ctx.user;
    const article = {
      id,
      title,
      content,
    };

    const res = await insert(article);

    ctx.body = {
      code: 0,
      message: "成功发布文章",
      data: res,
    };
  }

  async uploadeCover(ctx, next) {
    const { filename, mimetype, size } = ctx.request.file;
    const { articleId } = ctx.request.params;

    const res = await uploadCoverDB({ filename, mimetype, size, articleId });

    ctx.body = {
      code: 0,
      message: "上传封面成功!",
      data: res,
    };
  }

  async storeTemCover(ctx, next) {
    const { filename } = ctx.request.file;
    try {
      deleteFileByName(TEM_UPLOAD, filename);
    } catch (err) {
      console.log("err: ", err);
    }
    ctx.body = {
      code: 0,
      message: "成功!"
    };
  }

  async getCover(ctx, next) {
    const { articleId } = ctx.request.params;

    // 查询后返回
    const res = await getCoverDB(articleId);
    const { filename, mimetype } = res;
    const cover = fs.createReadStream(`${ARTICLE_COVER}/${filename}`);

    ctx.type = mimetype;
    ctx.body = cover;
  }
}

module.exports = new articleController();
