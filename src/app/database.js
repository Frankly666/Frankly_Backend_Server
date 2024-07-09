const mysql = require("mysql2")

const connectPool = mysql.createPool({
  host:"localhost",
  port: 3306,
  database: "FranklyHub",
  user: "root",
  password: "0309",
  connectionLimit: 5
})

connectPool.getConnection((err, connection) => {
  if(err) {
    console.log("获取连接失败");
    return;
  }

  connection.connect(err => {
    if(err) {
      console.log("和数据库交互失败");
    }else {
      console.log("数据库连接成功,可以操作数据库");
    }
  })
})

const connection = connectPool.promise()
module.exports = {
  connection
}