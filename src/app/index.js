const koa = require("koa");
const bodyParser = require("koa-bodyparser");
const appUseRouter = require("../utils/appUseRouter");

const app = new koa();

app.use(bodyParser())
appUseRouter(app);
// app.use(userRouter.routes())
// app.use(userRouter.allowedMethods())
// app.use(loginRouter.routes());
// app.use(loginRouter.allowedMethods());

module.exports = app