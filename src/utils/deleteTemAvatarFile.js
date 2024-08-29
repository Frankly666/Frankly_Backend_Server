const fs = require("fs");
const path = require("path");

/**
 * 删除特定文件夹中与给定文件名匹配的文件
 * @param {string} directoryPath - 文件夹的路径
 * @param {string} fileName - 要删除的文件的名称
 */
function deleteFileByName(directoryPath, fileName) {
  // 构建完整的文件路径
  const fullPath = path.join(directoryPath, fileName);

  // 检查文件是否存在
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${fileName}`);
      return;
    }

    // 尝试删除文件
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${fileName}`, err);
      } else {
        console.log(`File ${fileName} has been deleted`);
      }
    });
  });
}

module.exports = { deleteFileByName };

