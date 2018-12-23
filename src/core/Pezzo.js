const http = require("http");
const fs = require("fs");
const path = require("path");
module.exports = class Pezzo {
  constructor({ routers = [] } = {}) {
    this.routers = routers;
    this.server = http.createServer(async (req, res) => {
      if (!(await this._handleRoute(req, res))) {
        res.writeHead(404);
        res.end(`Cannot GET ${req.url}`);
      }
    });
  }

  listen(port = 8080) {
    this.server.listen(port);
  }

  /*
  Auto load controllers
  */
  initialize(path) {
    this._autoLoadControllers(`${path}/src/controller`);
    this._loadEnvironnementVariables(path);
  }

  _autoLoadControllers(path) {
    fs.readdir(path, (err, files) => {
      for (let file of files) {
        const router = require(`${path}/${file}`);
        this.addRouter(router);
      }
    });
  }

  _loadEnvironnementVariables(rootPath) {
    const dotenv = require("dotenv");
    const envConfig = dotenv.parse(
      fs.readFileSync(path.resolve(__dirname, `${rootPath}/.env`))
    );
    for (let k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }

  addRouter(router) {
    this.routers.push(router);
  }

  async _handleRoute(req, res) {
    let foundRoute;
    for (let router of this.routers) {
      foundRoute = await router._handleRoute(req, res);
      if (foundRoute) {
        break;
      }
    }

    return foundRoute;
  }
};
