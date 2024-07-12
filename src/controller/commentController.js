const { insert } = require("../dbService/comment.service");

class commentCotroller {
  async insertComment(ctx, next) {
    // 获取客户端传来的数据并进行组装
    // 这里需要注意如果这条评论的评论对象不是评论,那么需要要求客户端传过来的comment_id是null
    const { content, moment_id, comment_id } = ctx.request.body;
    const { id } = ctx.user;

    const comment = {
      content,
      moment_id,
      comment_id,
      user_id: id
    }


    const res = await insert(comment);

    ctx.body = {
      code: 0,
      res
    }
  }
}

module.exports = new commentCotroller();