const koaRouter = require("@koa/router")


const loginRouter = new koaRouter({
  prefix: "/"
})

loginRouter.post("/");

module.exports = {
  loginRouter
}

