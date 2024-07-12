const koaRouter = require("@koa/router")
const { verifyUser, encryptPassword } = require("../middleware/user.middleware")
const { insertUser } = require("../controller/userController")

const userRouter = new koaRouter({prefix: "/users"})



// 这里面传入的就是中间件
userRouter.post("/", verifyUser, encryptPassword, insertUser)


module.exports = userRouter
