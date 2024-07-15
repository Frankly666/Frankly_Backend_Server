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

  async findUserRole(userId) {
    const statement  = `
      SELECT 
        u.id userId,
        u.name username,
        u.createAt createTime,
        JSON_OBJECT(
          "role_name", r.role_name,
          "permission", JSON_ARRAYAGG(
            JSON_OBJECT(
              "father", p.father,
              "url", p.router,
              "name", p.permission_name
            )
          )
        ) role
      FROM user u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN roles_permission rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON p.id = rp.permission_id
      GROUP BY u.id
      HAVING u.id = ?;
    `
    const [res] = await connection.execute(statement, [userId]);
    return res;
  }
}


module.exports = new userSevice();