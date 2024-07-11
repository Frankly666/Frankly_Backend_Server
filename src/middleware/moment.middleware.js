const { MOMENT_IS_NOT_ALLOWD_EMPTY } = require("../config/error");

async function checkMoment(ctx, next) {
  // 得到用户id和动态内容
  const { content } = ctx.request.body;
  const { id } = ctx.user;
  const moment = {content, user_id: id};
  let judge = "";
  if(content) {
     judge = content.replace(" ", '');
  }

  if(content == 0 || judge == 0) return ctx.app.emit("error", MOMENT_IS_NOT_ALLOWD_EMPTY, ctx);
  ctx.moment = moment;
  

  await next()
}

module.exports = {
  checkMoment
}