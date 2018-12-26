const http = require("http");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

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
  async initialize(path) {
    this._autoLoadControllers(`${path}/src/controller`);
    this._loadEnvironnementVariables(path);
    try {
      await this._loadMongodb();
      console.log("MONGO started");
    } catch (e) {
      console.log("MONGO not started");
    }

    return "ready";
  }

  async _loadMongodb() {
    return await mongoose.connect(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${
        process.env.MONGO_DATABASE
      }`,
      { useNewUrlParser: true }
    );
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
