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
    const statement = "SELECT * FROM avatar WHERE user_id = ?;";

    const res = await connection.execute(statement, [userId]);
    return res[0].pop();
  }

  async insertTemAvatar(avatarInfo) {
    const { filename, mimetype, size, userRealName } = avatarInfo;
    const statement = `INSERT INTO avatar_temp (filename, mimetype, size, userRealName) VALUES (?, ?, ?, ?);`;

    const [result] = await connection.execute(statement, [
      filename,
      mimetype,
      size,
      userRealName,
    ]);

    return result;
  }

  async deleteTemAvatarDB(userRealName) {
    const statement0 = `SELECT filename FROM avatar_temp WHERE userRealName=?;`;
    const res0 = await connection.execute(statement0, [userRealName]);
    const filename = res0[0][0].filename;
    const statement = `DELETE FROM avatar_temp WHERE  userRealName=?;`;
    const res = await connection.execute(statement, [userRealName]);
    return { res, filename };
  }

  async getIsInitAvatar(userId) {
    const statement = `SELECT avatarId FROM user WHERE id=?;`
    const res = connection.execute(statement, [userId]);
    return res;
  }
}

module.exports = new fileService();
