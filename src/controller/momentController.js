const { MOMENT_IS_NOT_ALLOWD_EMPTY } = require("../config/error");
const { insertContent } = require("../dbService/moment.service");

class momentController {
  async insertMoment(ctx, next) {
    // 将数据储存到数据库中去
    const res = await insertContent(ctx.moment);
    ctx.body = {
      code: 0,
      data: {
        res
      }
    }
  }
}


module.exports = new momentController()