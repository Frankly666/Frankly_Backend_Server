const { insertContent, searchAllContent, serchDetaiContent } = require("../dbService/moment.service");

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

  async searchAllMoment(ctx, next) {
    const res = await searchAllContent()
    ctx.body = {
      code: 0,
      data: res[0]
    }
  }

  async serchMomentById(ctx, next) {
    const {momentId} = ctx.params;
    console.log('momentId: ', momentId);

    ctx.body = {
      code: 0,
      data: res[0]
    }
  }
}


module.exports = new momentController()