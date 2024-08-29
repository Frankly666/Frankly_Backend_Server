const {
  MOMENT_IS_NOT_ALLOWD_EMPTY,
  HAVE_NO_PRIVILEGES_TO_DELETE,
} = require("../config/error");

async function checkContent(ctx, next) {
  // 得到用户id和动态内容
  const { content, label } = ctx.request.body;
  const { id } = ctx.user;
  const moment = { content, user_id: id, label };
  let judge = "";
  if (content) {
    judge = content.replace(" ", "");
  }

  if (content == 0 || judge == 0)
    return ctx.app.emit("error", MOMENT_IS_NOT_ALLOWD_EMPTY, ctx);
  ctx.moment = moment;

  await next();
}

async function checkUserIdIsSame(ctx, next) {
  const { id } = ctx.user;
  const { userId } = ctx.query;
  if (userId != id)
    return ctx.app.emit("error", HAVE_NO_PRIVILEGES_TO_DELETE, ctx);

  await next();
}

module.exports = {
  checkContent,
  checkUserIdIsSame,
};
