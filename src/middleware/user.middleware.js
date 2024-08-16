const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_IS_ALREADY_EXISTS,
} = require("../config/error");
const userSevice = require("../dbService/user.service");
const { md5Password } = require("../utils/md5Password");

// 验证传过来的数据
async function verifyUser(ctx, next) {
  // 验证客户端传过来的数据
  const { name, password } = ctx.request.body;

  // 判断用户名和密码是否为空
  if (!name || !password) {
    return ctx.app.emit("error", NAME_OR_PASSWORD_IS_REQUIRED, ctx);
  }

  // 判断是否存在这个用户
  const users = await userSevice.findUserByName(name);
  if (users.length) {
    return ctx.app.emit("error", NAME_IS_ALREADY_EXISTS, ctx);
  }

  await next();
}

// 对密码进行加密
async function encryptPassword(ctx, next) {
  const { password } = ctx.request.body;

  ctx.request.body.password = md5Password(password);

  await next();
}

module.exports = {
  verifyUser,
  encryptPassword,
};
