const { connection } = require("../app/database");

class fileService {
  async insertAvatar(avatarInfo) {
    const { filename, mimetype, size, user_id } = avatarInfo;
    const statement1 =
      "INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);";
    const statement2 = `UPDATE user SET avatarId = ? WHERE id = ?;`;

    const [result] = await connection.execute(statement1, [
      filename,
      mimetype,
      size,
      user_id,
    ]);

    await connection.execute(statement2, [result.insertId, user_id]);
    return result;
  }

  async searchAvatar(userId) {
    const statement = "SELECT * FROM avatar WHERE id = ?;";
    const statement1 = "SELECT avatarId FROM user WHERE id = ?;";
    const res1 = await connection.execute(statement1, [userId]);
    const avatarId = res1[0][0].avatarId;

    const res = await connection.execute(statement, [avatarId]);
    return res[0].pop();
  }

  async getIsInitAvatar(userId) {
    const statement = `SELECT avatarId FROM user WHERE id=?;`;
    const res = connection.execute(statement, [userId]);
    return res;
  }
}

module.exports = new fileService();
