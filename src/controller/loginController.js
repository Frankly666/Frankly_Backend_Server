const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../config/key");
const { TOKEN_IS_WRONG } = require("../config/error");

class loginController {
  login(ctx, next) {
    // 获取用户信息
    const { id, name } = ctx.user;

    // 颁发证书
    try {
      const token = jwt.sign({ id, name }, PRIVATE_KEY, {
        expiresIn: '7d', // 过期时间，例如7天
        algorithm: 'RS256' // 使用的算法
      });
      ctx.body = {code: 0, data:{id, name, token}};
    } catch (error) {
      return ctx.app.emit("error", TOKEN_IS_WRONG, ctx)
    }
  }

  test(ctx, next) {
    ctx.body = "你有权限访问!"
  }
}

module.exports = new loginController();