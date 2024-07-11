const { addUser } = require("../dbService/user.service");


class userController {
  async insertUser(ctx, next) {
    // 获取客户端传来的用户信息
    const user = ctx.request.body;

    // 将用户信息写入数据库并返回结果
    const res = await addUser(user);

    // 给前端展示结果
    ctx.body = {
      message: '创建用户成功~',
      data: res
    }
  }
}


module.exports = new userController();