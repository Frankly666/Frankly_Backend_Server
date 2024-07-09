const { connection } = require("../app/database");


class userSevice {
  async addUser(user) {
    const {name, password} = user;

    const statemate = "INSERT INTO `user` (name, password) VALUES (?, ?);"
    const [res] = await connection.execute(statemate,[name, password]);
    return res
  }

  async findUserByName(name, ctx) {
    const statement = "SELECT * FROM `user` WHERE `name` = ?;"
  
    const [res] = await connection.execute(statement,[name]);
    return res;
  }
}


module.exports = new userSevice();