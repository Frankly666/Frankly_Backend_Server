const { insert } = require("../dbService/article.service");

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
}

module.exports = new articleController();
