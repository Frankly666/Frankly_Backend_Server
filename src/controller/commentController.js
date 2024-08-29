const {
  insert,
  deleteCommentById,
  addCommetnLikeDB,
  deleteCommetnLikeDB,
} = require("../dbService/comment.service");

class commentCotroller {
  async insertComment(ctx, next) {
    // 获取客户端传来的数据并进行组装
    // 这里需要注意如果这条评论的评论对象不是评论,那么需要要求客户端传过来的comment_id是null
    const { content, moment_id, comment_id, commentToCommentId } =
      ctx.request.body;
    const { id } = ctx.user;

    const comment = {
      content,
      moment_id,
      comment_id,
      user_id: id,
      commentToCommentId,
    };

    const res = await insert(comment);

    ctx.body = {
      code: 0,
      message: "发表评论成功!",
      res,
    };
  }

  async deleteComment(ctx, next) {
    const { commentId } = ctx.request.params;

    const res = await deleteCommentById(commentId);

    ctx.body = {
      code: 0,
      message: "成功删除此条评论!",
      data: res,
    };
  }

  async addCommentLike(ctx, next) {
    const { userId, momentId, commentId } = ctx.query;
    const res = await addCommetnLikeDB(userId, momentId, commentId);
    ctx.body = {
      code: 0,
      message: `成功添加对${commentId}评论的点赞`,
      data: res,
    };
  }

  async deleteCommentLike(ctx, next) {
    const { userId, momentId, commentId } = ctx.query;
    const res = await deleteCommetnLikeDB(userId, momentId, commentId);
    ctx.body = {
      code: 0,
      message: `成功删除对${commentId}评论的点赞`,
      data: res,
    };
  }
}

module.exports = new commentCotroller();
