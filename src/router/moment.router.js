const koaRouter = require("@koa/router");
const { vertifyAuth } = require("../middleware/login.middleware");
const { insertMoment } = require("../controller/momentController");
const { checkMoment } = require("../middleware/moment.middleware");


const dynamicRouter = new koaRouter({
  prefix: "/moment"
})

// 这个是更新动态的接口
dynamicRouter.post("/update", vertifyAuth,checkMoment, insertMoment);

// 下面是查看动态的接口

module.exports =  dynamicRouter