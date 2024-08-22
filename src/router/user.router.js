const koaRouter = require("@koa/router")
const { verifyUser, encryptPassword } = require("../middleware/user.middleware")
const { insertUser } = require("../controller/userController")

const userRouter = new koaRouter({prefix: "/users"})



// 用户注册接口
userRouter.post("/enroll", verifyUser, encryptPassword, insertUser)


module.exports = userRouter
