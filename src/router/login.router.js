const koaRouter = require("@koa/router");
const { verifyLogin, verifyAuth } = require("../middleware/login.middleware");
const { login, flushedData } = require("../controller/loginController");

const loginRouter = new koaRouter({
  prefix: "/login",
});

loginRouter.post("/", verifyLogin, login);
loginRouter.post("/flush", verifyAuth, flushedData);

module.exports = loginRouter;
