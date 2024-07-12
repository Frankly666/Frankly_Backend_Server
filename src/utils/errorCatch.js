const app  = require("../app");
const {NAME_IS_ALREADY_EXISTS, NAME_OR_PASSWORD_IS_REQUIRED, USER_IS_NOT_EXISTS, PASSWORD_IS_NOT_CORRECT, NO_AUTHORITY, TOKEN_IS_WRONG, MOMENT_IS_NOT_ALLOWD_EMPTY, HAVE_NO_PRIVILEGES_TO_DELETE} = require("../config/error")

app.on('error', (error, ctx) => {
  let code = 0
  let message = ""

  switch(error){
    case NAME_OR_PASSWORD_IS_REQUIRED:
      code = -1001;
      message = "用户名或密码不能为空!"
      break;
    case NAME_IS_ALREADY_EXISTS:
      code = -1002;
      message = "已存在该用户名,请重新输入"
      break;
    case USER_IS_NOT_EXISTS:
      code = -1003;
      message = "该用户还未注册,请注册后再登录!";
      break;
    case PASSWORD_IS_NOT_CORRECT:
      code = -1004;
      message = "密码错误,请重新输入!"
      break;
    case NO_AUTHORITY:
      code = -1004;
      message = "没有登陆或者登录过期!"
      break;
    case TOKEN_IS_WRONG:
      code = -1005;
      message = "你的token信息错误!"
      break;
    case MOMENT_IS_NOT_ALLOWD_EMPTY:
      code = -1006;
      message = "发表的动态内容不能为空！"
      break;
    case HAVE_NO_PRIVILEGES_TO_DELETE:
      code = -1007;
      message = "你没有操作的权限!";
      break;
  }

  ctx.body = {code, message}
})

