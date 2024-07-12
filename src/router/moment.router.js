const koaRouter = require("@koa/router");
const { vertifyAuth } = require("../middleware/login.middleware");
const { insertMoment } = require("../controller/momentController");
const { checkContent } = require("../middleware/moment.middleware");


const momentRouter = new koaRouter({
  prefix: "/moment"
})

// 这个是更新动态的接口
momentRouter.post("/publish", vertifyAuth,checkContent, insertMoment);

// 下面是查看动态的接口
momentRouter.get("/search/:user_id")

module.exports =  momentRouter