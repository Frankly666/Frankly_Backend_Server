const { connection } = require("../app/database");

class commentService {
  async insert(comment) {
    const { content, user_id, moment_id, comment_id } = comment;

    const statement = "INSERT INTO `comment` (content, moment_id, user_id, comment_id)  VALUES (?, ?, ?, ?);";

    const res = connection.execute(statement, [content,  moment_id, user_id, comment_id])

    return res;
  }
}


module.exports = new commentService();