const koaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/login.middleware");
const { checkContent } = require("../middleware/moment.middleware");
const { insertComment, deleteComment } = require("../controller/commentController");
const { verifyPermission } = require("../middleware/permission.middleware");


const commentRouter = new koaRouter({
  prefix: "/comment"
})

// 发表评论的接口
commentRouter.post("/publish", verifyAuth, checkContent, insertComment);

// 下面是查看评论的接口
commentRouter.get("/search/:user_id", verifyAuth)

// 删除评论的信息
commentRouter.delete("/delete/:commentId", verifyAuth, verifyPermission, deleteComment)
module.exports =  commentRouter