const { connection } = require("../app/database");
const { SERVE_PORT, SERVER_HOST } = require("../config/serve");

class commentService {
  async insert(comment) {
    const { content, user_id, moment_id, comment_id, commentToCommentId } =
      comment;

    const statement0 =
      "INSERT INTO `comment` (content, moment_id, user_id, comment_id, commentToCommentId)  VALUES (?, ?, ?, ?, ?);";

    // 在插入评论时返回时就顺便查询
    const statement1 = `
      SELECT 
        c.id AS id,
        c.content AS content,
        c.user_id AS user_id,
        c.moment_id AS moment_id,
        c.comment_id AS comment_id,
        c.createAt AS createTime,
        u.name AS user_name,
        JSON_OBJECT(
          'likeUserIdArr', JSON_ARRAYAGG(ucf.user_id),
          'likeCount', COUNT(ucf.user_id)
        ) AS commentLike,
        c.commentToCommentId AS commentToCommentId
      FROM comment c
      LEFT JOIN user u ON c.user_id = u.id
      LEFT JOIN user_comment_like ucf ON c.id = ucf.comment_id
      GROUP BY c.id
      HAVING c.id=?
    `;

    // 查询每条评论的子评论
    const statement2 = `
    SELECT 
      JSON_ARRAYAGG(c2.id) AS commentIdArr,
      COUNT(c1.id) AS commentCount
    FROM comment AS c1
    JOIN comment AS c2 ON c1.id = c2.comment_id
    GROUP BY c1.id
    HAVING c1.id = ?;
    `;

    // 回复对象的用户名
    const statement3 = `
      SELECT u.name commentToCommentUserName
      FROM comment c
      LEFT JOIN user u ON c.user_id = u.id
      WHERE c.id=?;
    `;

    const res0 = await connection.execute(statement0, [
      content,
      moment_id,
      user_id,
      comment_id,
      commentToCommentId,
    ]);

    const insertId = res0[0].insertId;

    const res1 = await connection.execute(statement1, [insertId]);
    const res2 = await connection.execute(statement2, [insertId]);
    const res3 = await connection.execute(statement3, [
      res1[0][0].commentToCommentId,
    ]);
    const newComment = res1[0][0];
    const avatar = newComment?.user_id
      ? `${
          SERVER_HOST + ":" + SERVE_PORT + "/file/avatar/" + newComment?.user_id
        }`
      : null;
    newComment.commentSons = res2[0][0];
    newComment.commentToCommentUserName = res3[0][0]?.commentToCommentUserName;
    newComment.userAvatar = avatar;

    return newComment;
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

  async addCommetnLikeDB(userId, momentId, commentId) {
    const statement = `INSERT INTO user_comment_like (user_id, moment_id, comment_id) VALUES (?, ?, ?);`;
    const res = connection.execute(statement, [userId, momentId, commentId]);
    return res;
  }

  async deleteCommetnLikeDB(userId, momentId, commentId) {
    const statement = `DELETE FROM user_comment_like WHERE user_id = ? AND moment_id = ? AND comment_id = ?;`;
    const res = connection.execute(statement, [userId, momentId, commentId]);
    return res;
  }
}

module.exports = new commentService();
