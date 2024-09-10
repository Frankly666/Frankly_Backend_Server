const multer = require("@koa/multer");
const { ARTICLE_COVER, TEM_UPLOAD } = require("../config/path");

const uploadArticleCover = multer({
  dest: ARTICLE_COVER,
});
const handleArticleCover = uploadArticleCover.single("articleCover");

const uploadTemArticleCover = multer({
  dest: TEM_UPLOAD,
});
const handleTemArticleCover = uploadTemArticleCover.single("file");

module.exports = {
  handleArticleCover,
  handleTemArticleCover,
};
