const { connection } = require("../app/database");
const { SERVE_PORT, SERVER_HOST } = require("../config/serve");

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

  async getArticleListDB() {
    // 查询整体
    const statement = `
      SELECT
        a.id AS artcleId,
        a.title AS title,
        SUBSTRING(a.content, 1, 100) AS content,
        aco.id AS coverId,
        a.user_id AS userId,
        u.name AS user_name,
        MAX(a.created_at) AS createTime,
        COUNT(ac.id) AS commentsCount 
    FROM
        articles a
    LEFT JOIN article_comment ac ON a.id = ac.article_id
    LEFT JOIN user u ON a.user_id = u.id
    LEFT JOIN articlecover aco ON aco.article_id = a.id
    GROUP BY
        a.id,
        aco.id
    ORDER BY
        MAX(a.created_at) DESC;
    `;

    // 查询标签
    const statement1 = `
      SELECT 
        al.article_id,
        JSON_ARRAYAGG(l.name) AS label_names 
      FROM 
        article_label al
      LEFT JOIN label l ON al.label_id = l.id 
      GROUP BY al.article_id
      HAVING al.article_id = ?;
    `;

    // 文章点赞人以及点赞数
    const statement2 = `
      SELECT 
        JSON_ARRAYAGG(ual.user_id) AS likeUserIdArr,
        COUNT(ual.user_id) AS likeCount
      FROM 
        articles a
      LEFT JOIN user_article_like ual ON a.id = ual.article_id
      GROUP BY a.id
      HAVING a.id = ?;    
    `;

    // 文章收藏人以及收藏数
    const statement3 = `
      SELECT 
        JSON_ARRAYAGG(uaf.user_id) AS favorUserIdArr,
        COUNT(uaf.user_id) AS favorCount
      FROM 
        articles a
      LEFT JOIN user_article_favor uaf ON a.id = uaf.article_id
      GROUP BY a.id
      HAVING a.id = ?;    
    `;

    const res = await connection.execute(statement);
    const resArry = res[0];

    for (let item of resArry) {
      const artcleId = item.artcleId;

      const articleCover = `${
        SERVER_HOST + ":" + SERVE_PORT + "/article/getCover/" + artcleId
      }`;
      const labels = await connection.execute(statement1, [artcleId]);
      const like = await connection.execute(statement2, [artcleId]);
      const favor = await connection.execute(statement3, [artcleId]);
      item.cover = articleCover;
      item.labels = labels[0][0];
      item.like = like[0][0];
      item.favor = favor[0][0];
    }
    return resArry;
  }

  async searchArticleDetail() {}
}

module.exports = new articleService();
