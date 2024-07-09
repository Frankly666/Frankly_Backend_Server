const koa = require("koa");
const { userRouter } = require("../router/user.router");
const bodyParser = require("koa-bodyparser");

const app = new koa();

app.use(bodyParser())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

module.exports = app