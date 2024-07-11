const fs = require("fs")
const path = require("path")


const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, "./keys/public.key"));
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, "./keys/private.key"));

module.exports = {
  PUBLIC_KEY,
  PRIVATE_KEY
}