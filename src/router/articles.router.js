const koaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/login.middleware");
const { insertArticle } = require("../controller/articleController");


const articleRouter = new koaRouter({
  prefix: "/article"
})

articleRouter.post("/publish", verifyAuth, insertArticle);

module.exports =  articleRouter