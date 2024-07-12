const { insertAvatar } = require("../dbService/file.service");

class fileController {
  async updateAvatar (ctx, next) {
    const { filename, mimetype, size } = ctx.request.file;
    const {id} = ctx.user;

    const res = await insertAvatar({filename, mimetype, size, user_id: id}) 
    console.log('res: ', res);

    ctx.body = {
      code: 0,
      message: "上传头像成功",
      data: res
    }

  }
}


module.exports = new fileController();