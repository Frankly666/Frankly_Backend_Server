const { connection } = require("../app/database");

class articleService {
  async insert(article) {
    const { id, title, content, category } = article;

    const statement = `INSERT INTO articles (user_id, title, content, category ) VALUES (?, ?, ?, ?);`;

    const res = await connection.execute(statement, [
      id,
      title,
      content,
      category,
    ]);

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

  async insertLabelDB(label, artcleId) {
    console.log("label: ", label);
    const statement1 = "SELECT id, name FROM label";
    let dbLables = await connection.execute(statement1);
    dbLables = dbLables[0];

    // 得到数据库中已有的label数组
    const values = dbLables.map((item) => {
      return item.name;
    });

    const statement2 =
      "INSERT INTO article_label (article_id, label_id) VALUES (?, ?);"; // 插入动态与标签的对应关系
    const statement3 = "INSERT INTO label (name) VALUES (?);"; // 插入新的标签
    const statement4 = "SELECT id FROM label WHERE `name` = ?";
    let res = [];
    for (let item of label) {
      let label_id = null;
      // 如果表中已经存在这个标签, 就去找到这个标签的id
      try {
        if (values.includes(item)) {
          label_id = await connection.execute(statement4, [item]);
          label_id = label_id[0][0].id;
        } else {
          // 先向label表中插入新的label
          label_id = await connection.execute(statement3, [item]);
          label_id = label_id[0].insertId;
        }
      } catch (err) {
        console.log("err: ", err);
      }

      // 最后插入这条动态的label数据
      try {
        const res1 = await connection.execute(statement2, [artcleId, label_id]);
        res.push(res1);
      } catch (err) {
        console.log("err: ", err);
      }
    }
  }

  async searchAllArticle() {}

  async searchArticleDetail() {}
}

module.exports = new articleService();
