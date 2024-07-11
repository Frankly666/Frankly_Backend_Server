const { USER_IS_NOT_EXISTS, PASSWORD_IS_NOT_CORRECT, NAME_OR_PASSWORD_IS_REQUIRED, NO_AUTHORITY } = require("../config/error");
const { findUserByName } = require("../dbService/user.service");
const { md5Password } = require("../utils/md5Password");
const jwt = require("jsonwebtoken")
const {PUBLIC_KEY} = require("../config/key")

// 验证传过来的数据
async function vertifyLogin(ctx, next) {
  // 验证客户端传过来的数据
  const {name, password} = ctx.request.body;

  // 判断用户名和密码是否为空
  if(!name || !password) {
    return ctx.app.emit('error', NAME_OR_PASSWORD_IS_REQUIRED, ctx);
  }

  // 判断是否存在这个用户,如果没有存在就提示用户进行注册
  const users = await findUserByName(name);
  if (users.length === 0) {
    return ctx.app.emit('error', USER_IS_NOT_EXISTS, ctx)
  }

  // 得到正确的密码
  const pwd = users[0].password;

    // 验证密码是否正确
  if(md5Password(password) !== pwd){
    return ctx.app.emit("error", PASSWORD_IS_NOT_CORRECT, ctx);
  }

  // 如果密码正确保存用户的信息
  ctx.user = users[0];
  
  await next();
}

// 验证用户是否拥有token或者判断用户的token是否过期
async function vertifyAuth(ctx, next) {
  // 获取客户端传过来的token
  const authorization = ctx.headers.authorization;
  if(!authorization) {
    return ctx.app.emit("error", NO_AUTHORITY, ctx);    
  }

  // 处理token数据
  const token = authorization.replace("Bearer ", "");

  try{
    const res = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = res;
  } catch(err) {
    console.log("toke对比结果:",err);
    return ctx.app.emit("error", NO_AUTHORITY, ctx);
  }


  await next();
}

module.exports = {
  vertifyLogin,
  vertifyAuth
}