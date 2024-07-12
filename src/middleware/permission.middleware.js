const { HAVE_NO_PRIVILEGES_TO_DELETE } = require("../config/error");
const { searchUserId } = require("../dbService/comment.service");

async function verifyPermission(ctx, next) {
  let targetTable = Object.keys(ctx.request.params)[0];
  const targetId = ctx.request.params[targetTable]
  const { id } = ctx.user;
  targetTable = targetTable.replace("Id", "");
  
  // 接下来去数据库中查询出这条信息对应的作者id是谁
  const dbId = await searchUserId(targetTable, targetId);
  
  if(Array.isArray(dbId)) {
    if(!dbId.includes(id)) {
      return ctx.app.emit("error", HAVE_NO_PRIVILEGES_TO_DELETE, ctx)
    }
  } else if(id !== dbId) {
     return ctx.app.emit("error", HAVE_NO_PRIVILEGES_TO_DELETE, ctx)
  }
  
  
  await next();
}

module.exports = {
  verifyPermission
}