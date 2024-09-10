const { connection } = require("../app/database");

class articleService {
  async insert(article) {
    const { id, title, content } = article;

    const statement = `INSERT INTO articles (user_id, title, content ) VALUES (?, ?, ?);`;

    const res = await connection.execute(statement, [id, title, content]);

    return res;
  }

  async uploadCoverDB(coverInfo) {
    const { filename, mimetype, size, articleId } = coverInfo;
    const statement = `INSERT INTO articleCover (filename, mimetype, size, article_id) VALUES (?,?,?,?);`;

    const [result] = await connection.execute(statement, [
      filename,
      mimetype,
      size,
      articleId,
    ]);

    return result;
  }

  async getCoverDB(articleId) {
    const statement = `SELECT * FROM articleCover WHERE article_id = ?;`;

    const res = await connection.execute(statement, [articleId]);

    return res[0][0];
  }
}

module.exports = new articleService();
