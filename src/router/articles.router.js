const koaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/login.middleware");
const {
  insertArticle,
  uploadeCover,
  getCover,
  storeTemCover,
  insertLabels,
  getArticleList,
} = require("../controller/articleController");
const {
  handleArticleCover,
  handleTemArticleCover,
} = require("../middleware/article.middleware");

const articleRouter = new koaRouter({
  prefix: "/article",
});

// 文章发布
articleRouter.post("/publish", verifyAuth, insertArticle);
// 文章列表查询
articleRouter.get("/getArticleList", verifyAuth, getArticleList)

// 文章封面上传
articleRouter.post(
  "/cover/:articleId",
  verifyAuth,
  handleArticleCover,
  uploadeCover
);
// 文章封面暂存
articleRouter.post(
  "/temCover",
  verifyAuth,
  handleTemArticleCover,
  storeTemCover
);

// 文章标签上传
articleRouter.post("/label/:articleId", verifyAuth, insertLabels);

// 查看获取封面
articleRouter.get("/getCover/:articleId", getCover);

module.exports = articleRouter;
