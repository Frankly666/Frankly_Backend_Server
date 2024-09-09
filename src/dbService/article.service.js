const { connection } = require("../app/database");

class articleService {
  async insert(article) {
    const { id, title, content } = article;

    const statement = `INSERT INTO articles (user_id, title, content ) VALUES (?, ?, ?);`;

    const res = await connection.execute(statement, [id, title, content]);

    return res;
  }
}

module.exports = new articleService();
