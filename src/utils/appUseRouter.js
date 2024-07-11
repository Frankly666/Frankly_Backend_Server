const fs = require("fs")
const path = require("path")

function appUseRouter(app) {
  const routerFiles = fs.readdirSync(path.resolve(__dirname, "../router"))

  for(const item of routerFiles){
    // 只处理router.js结尾的文件
    if(!item.endsWith(".router.js")) continue;

    // 获取到完整的路径然后进行遍历处理
    const filePath = path.resolve(__dirname, "../router/"+item)
    const router = require(filePath)
    app.use(router.routes());
    app.use(router.allowedMethods());
  }
}

module.exports = appUseRouter;


