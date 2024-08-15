const { connection } = require("../app/database");
const { SERVE_PORT, SERVER_HOST } = require("../config/serve");

class momentService {
  async insertContent(moment) {
    const { user_id, content, label } = moment;

    // 这里是插入id和内容
    const statement = "INSERT INTO `moment` (content, user_id) VALUES (?, ?);";
    const res = await connection.execute(statement, [content, user_id]);
    const momentId = res[0].insertId;

    // 下面是遍历label数组然后插入表中
    // 首先我们需要判断这些label是否以及存在在label表中,存在的需要找到label的id不存在的需要先储存然后再返回id
    const statement1 = "SELECT id, name FROM label";
    let dbLables = await connection.execute(statement1);
    dbLables = dbLables[0];

    // 得到数据库中已有的label数组
    const values = dbLables.map((item) => {
      return item.name;
    });

    const statement2 =
      "INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);"; // 插入动态与标签的对应关系
    const statement3 = "INSERT INTO label (name) VALUES (?);"; // 插入新的标签
    const statement4 = "SELECT id FROM label WHERE `name` = ?";
    for (let item of label) {
      let label_id = null;
      // 如果表中已经存在这个标签, 就去找到这个标签的id
      if (values.includes(item)) {
        label_id = await connection.execute(statement4, [item]);
        label_id = label_id[0][0].id;
      } else {
        // 先向label表中插入新的label
        label_id = await connection.execute(statement3, [item]);
        label_id = label_id[0].insertId;
      }

      // 最后插入这条动态的label数据
      res.push(await connection.execute(statement2, [momentId, label_id]));
    }
    return res;
  }

  async searchAllContent() {
    // 查询动态以及动态评论
    const statement = `
      SELECT
        m.id AS moment_id,
        m.content AS content,
        m.user_id AS user_id,
        u.name AS user_name,
        m.createAt AS createTime,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", c.id, 
                "content", c.content, 
                "moment_id", c.moment_id, 
                "comment_id", c.comment_id, 
                "user_id", c.user_id, 
                "createTime", c.createAt
            )
        ) AS comments,
        COUNT(c.id) AS commentCount 
    FROM
        moment m
    LEFT JOIN comment c ON m.id = c.moment_id
    LEFT JOIN user u on m.user_id = u.id
    GROUP BY
        m.id;
    `;

    // 查询每条动态的标签
    const statement1 = `
      SELECT 
        ml.moment_id,
        JSON_ARRAYAGG(l.name) AS label_names 
      FROM 
        moment_label ml 
      LEFT JOIN label l ON ml.label_id = l.id 
      GROUP BY ml.moment_id
      HAVING ml.moment_id = ?
    `;

    // 查询动态的点赞数以及点赞者id
    const statement2 = `
      SELECT 
        JSON_ARRAYAGG(uml.user_id) AS likeUserIdArr,
        COUNT(uml.user_id) AS likeCount
      FROM 
        moment m
      LEFT JOIN user_moment_like uml ON m.id = uml.moment_id 
      GROUP BY m.id
      HAVING m.id = ?
    `;

    // 查询动态的收藏数以及收藏者id
    const statement3 = `
      SELECT 
        JSON_ARRAYAGG(umf.user_id) AS favorUserIdArr,
        COUNT(umf.user_id) AS favorCount
      FROM 
        moment m
      LEFT JOIN user_moment_favor umf ON m.id = umf.moment_id 
      GROUP BY m.id
      HAVING m.id = ?
    `;

    // 查询每条评论的用户名
    const statement4 = `
      SELECT
        name
      FROM 
        user
      WHERE user.id = ?
    `;

    const res = await connection.execute(statement);

    let resArry = res[0];

    for (let item of resArry) {
      const avatar = `${
        SERVER_HOST + ":" + SERVE_PORT + "/file/avatar/" + item.user_id
      }`;
      const momentId = item.moment_id;
      const labels = await connection.execute(statement1, [momentId]);
      const like = await connection.execute(statement2, [momentId]);
      const favor = await connection.execute(statement3, [momentId]);
      item.userAvatar = avatar;
      item.labels = labels[0][0];
      item.like = like[0][0];
      item.favor = favor[0][0];

      // 给每条评论增添用户名
      const comments = item.comments;
      for (let comment of comments) {
        const userId = comment.user_id;
        const commentUserName = await connection.execute(statement4, [userId]);
        comment.user_name = commentUserName[0][0]?.name;
      }
    }

    return resArry;
  }

  async serchDetaiContent(momentId) {
    const statement = `
      SELECT
        m.id AS moment_id,
        m.content AS content,
        m.user_id AS user_id,
        m.createAt AS createTime,
        JSON_ARRAYAGG(
        JSON_OBJECT(
          "id", c.id, 
          "content", c.content, 
          "moment_id", c.moment_id, 
          "comment_id", c.comment_id, 
          "user_id", c.user_id, 
          "createTime", c.createAt
        )) AS comments,
        COUNT(c.id) AS commentsCount
      FROM
        moment m
      LEFT JOIN comment c ON m.id = c.moment_id
      GROUP BY
        m.id
      HAVING m.id = ?;
    `;

    const statement1 = `
      SELECT 
        ml.moment_id,
        JSON_ARRAYAGG(l.name) AS label_names 
      FROM 
        moment_label ml 
      LEFT JOIN label l ON ml.label_id = l.id 
      GROUP BY ml.moment_id
      HAVING ml.moment_id = ?
    `;

    const res = await connection.execute(statement, [momentId]);
    const resArry = res[0];

    for (let item of resArry) {
      let momentId = item.moment_id;
      let labels = await connection.execute(statement1, [momentId]);
      labels = labels[0][0];
      item.labels = labels;
    }
    return resArry;
  }

  async deleteByMomentId(momentId) {
    const statement = "DELETE FROM moment WHERE id = ?;";

    const res = await connection.execute(statement, [momentId]);

    return res;
  }
}

module.exports = new momentService();
