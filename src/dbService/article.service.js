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

  async getArticleDetailDB(artcleId) {
    const statement = `
      SELECT
          a.id AS artcleId,
          a.title AS title,
          a.content AS content,
          a.user_id AS userId,
          u.name AS user_name,
          MAX(a.created_at) AS createTime,
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  "id", ac.id, 
                  "content", ac.content, 
                  "articleId", ac.article_id, 
                  "commentId", ac.comment_id, 
                  "commentToCommentId", ac.commentToCommentId,
                  "userId", ac.user_id, 
                  "createTime", ac.createAt
              )
          ) AS comments,
          COUNT(ac.id) AS commentsCount 
      FROM
          articles a
      LEFT JOIN article_comment ac ON a.id = ac.article_id
      LEFT JOIN user u ON a.user_id = u.id
      GROUP BY
          a.id
      HAVING a.id = ?;
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

    // 评论点赞的用户
    const statement4 = `
      SELECT 
        JSON_ARRAYAGG(uacl.user_id) AS likeUserIdArr,
        COUNT(uacl.user_id) AS likeCount
      FROM 
        article_comment ac
      LEFT JOIN user_article_comment_like uacl ON ac.id = uacl.article_id
      GROUP BY ac.id
      HAVING ac.id = ?;
    `;

    // 每条评论的用户名
    const statement5 = `
      SELECT
        name
      FROM 
        user
      WHERE user.id = ?
    `;

    // 每条评论的子评论
    const statement6 = `
      SELECT 
        JSON_ARRAYAGG(c2.id) AS commentIdArr,
        COUNT(c1.id) AS commentCount
      FROM article_comment AS c1
      JOIN article_comment AS c2 ON c1.id = c2.comment_id
      GROUP BY c1.id
      HAVING c1.id = ?;
    `;

    // 查询回复人的名字
    const statement7 = `
      SELECT u.name commentToCommentUserName
      FROM article_comment ac
      LEFT JOIN user u ON ac.user_id = u.id
      WHERE ac.id = ?;
    `;

    const res = await connection.execute(statement, [artcleId]);
    const mainContent = res[0][0];

    // 针对文章的信息添加
    const labels = await connection.execute(statement1, [artcleId]);
    const like = await connection.execute(statement2, [artcleId]);
    const favor = await connection.execute(statement3, [artcleId]);
    mainContent.labels = labels[0][0];
    mainContent.like = like[0][0];
    mainContent.favor = favor[0][0];

    // 针对文章评论的信息添加
    const comments = mainContent.comments;
    for (let item of comments) {
      const commentUserId = item.userId;
      const commentId = item.id;

      const commentLike = await connection.execute(statement4, [artcleId]);
      const userName = await connection.execute(statement5, [commentUserId]);
      const commentSons = await connection.execute(statement6, [commentId]);
      const commentToCommentUserName = await connection.execute(statement7, [
        commentId,
      ]);

      item.commentToCommentUserName = commentToCommentUserName[0];
      item.commentLike = commentLike[0];
      item.userName = userName[0];
      item.commentSons = commentSons[0];
    }

    return mainContent;
  }
}

module.exports = new articleService();
