const { insertContent, searchAllContent, serchDetaiContent, deleteByMomentId } = require("../dbService/moment.service");

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
      data: res
    }
  }

  async serchMomentById(ctx, next) {
    const {momentId} = ctx.params;
    const res = await serchDetaiContent(momentId);
    ctx.body = {
      code: 0,
      data: res
    }
  }

  async deleteMoment(ctx, next) {
    const {momentId} = ctx.request.params;
    
    const res = await deleteByMomentId(momentId);

    ctx.body = {
      code: 0,
      message: "你已经成功删除此条动态!",
      data: res 
    }

  }
}


module.exports = new momentController()