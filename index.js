const http = require("http");
const urlParser = require("url");

class Request {
  constructor(req, params = {}, query = {}, body = {}) {
    this.req = req;
    this.params = params;
    this.query = query;
    this.body = body;
  }
}

class Response {
  constructor(res) {
    this.res = res;
    this.STATUS = 200;
    this.HEADERS = {};
  }
  send(body = null) {
    if (typeof body === "object") {
      this.HEADERS["Content-Type"] = "application/json";
    }
    this.res.writeHead(this.STATUS, this.HEADERS);
    this.res.write(typeof body === "object" ? JSON.stringify(body) : body);
    this.res.end();
  }

  status(status) {
    this.STATUS = status;

    return this;
  }

  set(headerName, headerValue) {
    this.HEADERS[headerName] = headerValue;

    return this;
  }

  end() {
    this.res.end();
    return this;
  }

  pipe(stream) {
    this.res.pipe(stream);
  }
}

class Router {
  constructor({ baseUrl = "" }) {
    this.baseUrl = baseUrl;
    this.routes = [];
  }

  /**
   *
   * @callback callback
   * @param {Request} req
   * @param {Response} res
   */

  /**
   * @param {callback} callback - The callback that handles the response.
   */
  get(url = "", callback) {
    this._addRoute("GET", url, callback);

    return this;
  }

  /**
   * @param {callback} callback - The callback that handles the response.
   */
  post(url = "", callback) {
    this._addRoute("POST", url, callback);

    return this;
  }

  /**
   * @param {callback} callback - The callback that handles the response.
   */
  put(url = "", callback) {
    this._addRoute("PUT", url, callback);

    return this;
  }

  /**
   * @param {callback} callback - The callback that handles the response.
   */
  delete(url = "", callback) {
    this._addRoute("DELETE", url, callback);

    return this;
  }

  _addRoute(method, url, callback) {
    this.routes.push({
      method,
      paramsGroupNames: this._getParamsGroupNames(this.baseUrl + url),
      regex: new RegExp(
        (this.baseUrl + url)
          .replace(/\/(:([a-zA-Z0-9_]+))/g, "/([a-zA-Z0-9_]+)")
          .replace(/\//g, "\\/") + "$"
      ),
      callback: callback
    });
  }

  _getParamsGroupNames(path) {
    const matches = [];
    const exp = new RegExp(":([a-zA-Z0-9_]+)", "g");
    let match;
    while ((match = exp.exec(path))) {
      matches.push(match[1]);
    }
    return matches;
  }

  _getParamsGroupValues(exp, urlToTest) {
    return urlToTest.match(exp).slice(1);
  }

  _getParams(route, path) {
    return route.paramsGroupNames.reduce((params, param, index) => {
      params[param] = this._getParamsGroupValues(route.regex, path)[index];

      return params;
    }, {});
  }

  _formatUrl(url) {
    if (url !== "/") {
      const lastChar = url[url.length - 1];
      if (lastChar === "/") {
        url = url.slice(0, url.length - 1);
      }
    }

    return url;
  }

  async _handleRoute(req, res) {
    const method = req.method;
    const parsedUrl = urlParser.parse(req.url, true);
    const url = this._formatUrl(parsedUrl.pathname);
    const query = parsedUrl.query;

    let foundRoute = null;
    for (let i = this.routes.length - 1; i >= 0; i--) {
      const route = this.routes[i];
      if (method === route.method && route.regex.test(url)) {
        foundRoute = route;
        break;
      }
    }
    if (foundRoute) {
      const body = await this._readBody(req);
      foundRoute.callback(
        new Request(req, this._getParams(foundRoute, url), query, body),
        new Response(res)
      );
    }

    return foundRoute;
  }

  async _readBody(req) {
    return new Promise(resolve => {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });

      req.on("end", () => {
        if (
          req.headers["content-type"] &&
          req.headers["content-type"] === "application/json"
        )
          body = JSON.parse(body);

        resolve(body);
      });
    });
  }

  _readQuery(path) {
    return urlParser.parse(path, true).query;
  }
}

class Pezzo {
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
}

module.exports = {
  Pezzo,
  Router
};
