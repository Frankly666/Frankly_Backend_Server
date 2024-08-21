const koa = require("koa");
const cors = require("koa2-cors");

const bodyParser = require("koa-bodyparser");
const appUseRouter = require("../utils/appUseRouter");

const app = new koa();

// 解决跨域问题
app.use(
  cors({
    origin: "*", // 允许的源，您可以根据需要设置
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 允许的方法
    credentials: true, // 允许发送cookies
    maxAge: 3600, // 预检请求的有效期
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ], // 允许的头信息
  })
);

app.use(bodyParser());
appUseRouter(app);

module.exports = app;
