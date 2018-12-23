const http = require("http");
module.exports = class Pezzo {
  constructor({ routers = [], port = 8080 } = {}) {
    this.routers = routers;
    this.server = http.createServer(async (req, res) => {
      if (!(await this._handleRoute(req, res))) {
        res.writeHead(404);
        res.end(`Cannot GET ${req.url}`);
      }
    });

    this.server.listen(port);
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
