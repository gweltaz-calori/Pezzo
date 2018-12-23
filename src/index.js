const Pezzo = require("./core/Pezzo");
const Router = require("./http/Router");
const { Get, Post, Put, Delete, Path } = require("./decorators");
module.exports = {
  Pezzo,
  Router,
  Get,
  Post,
  Put,
  Delete,
  Path
};
