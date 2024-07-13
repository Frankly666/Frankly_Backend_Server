const koa = require("koa");

const bodyParser = require("koa-bodyparser");
const appUseRouter = require("../utils/appUseRouter");

const app = new koa();

app.use(bodyParser())
appUseRouter(app);


module.exports = app