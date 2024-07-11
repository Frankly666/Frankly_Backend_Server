const { connection } = require("../app/database");


class momentService {
  async insertContent(moment) {
    const {user_id, content } = moment;

    const statement = "INSERT INTO `moment` (content, user_id) VALUES (?, ?);"

    const res = await connection.execute(statement,[content, user_id]);

    return res;
  }
}

module.exports = new momentService();