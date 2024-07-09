const koaRouter = require("@koa/router")
const { vertifyUser, encryptPassword, handleUsers } = require("../middleware/user.middleware")


const userRouter = new koaRouter({prefix: "/users"})

// 这里面传入的就是中间件
userRouter.post("/", vertifyUser, encryptPassword, handleUsers)


module.exports = {
  userRouter
}