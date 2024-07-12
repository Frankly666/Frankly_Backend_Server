const koaRouter = require("@koa/router");
const { vertifyAuth } = require("../middleware/login.middleware");
const { checkContent } = require("../middleware/moment.middleware");
const { insertComment } = require("../controller/commentController");


const commentRouter = new koaRouter({
  prefix: "/comment"
})

// 发表评论的接口
commentRouter.post("/publish", vertifyAuth, checkContent, insertComment);

// 下面是查看评论的接口
commentRouter.get("/search/:user_id")
module.exports =  commentRouter