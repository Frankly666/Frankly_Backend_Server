const koaRouter = require("@koa/router");
const { vertifyLogin, vertifyAuth } = require("../middleware/login.middleware");
const { login, test } = require("../controller/loginController");


const loginRouter = new koaRouter({
  prefix: "/login"
})

loginRouter.post("/", vertifyLogin, login);
loginRouter.post("/test",vertifyAuth, test)

module.exports =  loginRouter

