const { connection } = require("../app/database");

class commentService {
  async insert(comment) {
    const { content, user_id, moment_id, comment_id } = comment;

    const statement =
      "INSERT INTO `comment` (content, moment_id, user_id, comment_id)  VALUES (?, ?, ?, ?);";

    const res = connection.execute(statement, [
      content,
      moment_id,
      user_id,
      comment_id,
    ]);

    return res;
  }

  async searchUserId(targetTable, tagetId) {
    let statement = `SELECT user_id FROM ${targetTable} WHERE id = ?;`;
    if (targetTable === "comment")
      statement = `
      SELECT 
        ${targetTable}.user_id cuserId,
        m.user_id muserId
      FROM ${targetTable}
      LEFT JOIN moment m ON ${targetTable}.moment_id = m.id
      WHERE ${targetTable}.id = ?;
    `;

    let res = await connection.execute(statement, [tagetId]);
    if (targetTable === "comment") {
      res = Object.values(res[0][0]);
    } else {
      res = res[0][0].user_id;
    }

    return res;
  }

  async deleteCommentById(commentId) {
    const statement = "DELETE FROM comment WHERE id = ?;";

    const res = await connection.execute(statement, [commentId]);

    return res;
  }
}

module.exports = new commentService();
