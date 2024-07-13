const { connection } = require("../app/database")

class fileService {
  async insertAvatar(avatarInfo) {
    const {filename, mimetype, size, user_id} = avatarInfo
    const statement1 = 'INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);';
    const statement2 = `UPDATE user SET avatarId = ? WHERE id = ?;`
    
    const [result] = await connection.execute(statement1, [filename, mimetype, size, user_id])
    
    await connection.execute(statement2, [result.insertId, user_id])
    return result
  }

  async searchAvatar(userId) {
    const statement = "SELECT * FROM avatar WHERE user_id = ?;"

    const res = await connection.execute(statement, [userId]);
    return res[0].pop();
  }

}

module.exports = new fileService();