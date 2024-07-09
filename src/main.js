const app = require("./app");
const { SERVE_PORT } = require("./config/serve");
require("./utils/errorCatch")

// 进行端口监听
app.listen(SERVE_PORT,(err) => {
  console.log("监听成功");
})
