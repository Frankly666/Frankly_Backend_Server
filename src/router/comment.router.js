const koaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/login.middleware");
const { checkContent, checkUserIdIsSame } = require("../middleware/moment.middleware");
const {
  insertComment,
  deleteComment,
  addCommentLike,
  deleteCommentLike,
} = require("../controller/commentController");
const { verifyPermission } = require("../middleware/permission.middleware");

const commentRouter = new koaRouter({
  prefix: "/comment",
});

// 发表评论的接口
commentRouter.post("/publish", verifyAuth, checkContent, insertComment);

// 下面是查看评论的接口
commentRouter.get("/search/:user_id", verifyAuth);

// 删除评论的信息
commentRouter.delete(
  "/delete/:commentId",
  verifyAuth,
  verifyPermission,
  deleteComment
);

// 评论点赞接口
commentRouter.get("/add/comment_like", verifyAuth, checkUserIdIsSame, addCommentLike);

// 评论点赞取消的接口
commentRouter.get("/delete/comment_like", verifyAuth, checkUserIdIsSame, deleteCommentLike);

module.exports = commentRouter;
