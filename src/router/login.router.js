const koaRouter = require("@koa/router");
const { verifyLogin, verifyAuth } = require("../middleware/login.middleware");
const { login, test } = require("../controller/loginController");

const loginRouter = new koaRouter({
  prefix: "/login",
});

loginRouter.post("/", verifyLogin, login);
loginRouter.post("/test", verifyAuth, test);

module.exports = loginRouter;
