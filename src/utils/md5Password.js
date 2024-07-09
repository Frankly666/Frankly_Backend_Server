const crpyto = require("crypto")

function md5Password(pwd) {
  const md5 = crpyto.createHash("md5")
  const md5pwd = md5.update(pwd).digest("hex");
  return md5pwd;
}

module.exports = {
  md5Password
}