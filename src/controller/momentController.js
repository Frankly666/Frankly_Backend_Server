const {
  insertContent,
  searchAllContent,
  serchDetaiContent,
  deleteByMomentId,
  deletLikeFavorDB,
  addLikeFavorDB,
} = require("../dbService/moment.service");

class momentController {
  async insertMoment(ctx, next) {
    // 将数据储存到数据库中去
    const res = await insertContent(ctx.moment);
    ctx.body = {
      code: 0,
      data: {
        res,
      },
    };
  }

  async searchAllMoment(ctx, next) {
    const res = await searchAllContent();
    ctx.body = {
      code: 0,
      data: res,
    };
  }

  async serchMomentById(ctx, next) {
    const { momentId } = ctx.request.params;
    console.log("momentId: ", momentId);
    const res = await serchDetaiContent(momentId);
    ctx.body = {
      code: 0,
      data: res,
    };
  }

  async deleteMoment(ctx, next) {
    const { momentId } = ctx.request.params;

    const res = await deleteByMomentId(momentId);

    ctx.body = {
      code: 0,
      message: "你已经成功删除此条动态!",
      data: res,
    };
  }

  async deleteLikeFavor(ctx, next) {
    const url = ctx.request.url;
    const regex = /moment\/drop\/([^\s?]+)/;
    const match = url.match(regex)[1];
    const { userId, momentId } = ctx.query;
    const res = await deletLikeFavorDB(userId, momentId, match);

    ctx.body = {
      code: 0,
      message: `成功删除对${momentId}动态的收藏或点赞`,
      data: res,
    };
  }

  async addLikeFavor(ctx, next) {
    const url = ctx.request.url;
    const regex = /moment\/add\/([^\s?]+)/;
    const match = url.match(regex)[1];
    const { userId, momentId } = ctx.query;
    const res = await addLikeFavorDB(userId, momentId, match);
    if (res) {
      ctx.body = {
        code: 0,
        message: `成功添加对${momentId}动态的收藏或点赞`,
        data: res,
      };
    } else {
      ctx.body = {
        code: 0,
        message: "数据操作有错!",
      };
    }
  }
}

module.exports = new momentController();
