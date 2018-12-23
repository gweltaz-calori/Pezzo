const Router = require("../http/Router");

function Path(path = "") {
  return function(target, propertyKey) {
    target.prototype.__router__ = new Router({ baseUrl: path });
  };
}

function Get(path = "") {
  return function(target, propertyKey) {
    console.log(target.__router__);
  };
}

module.exports = {
  Get,
  Path
};
