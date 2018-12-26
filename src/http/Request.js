module.exports = class Request {
  constructor(req, params = {}, query = {}, body = {}, headers = {}) {
    this.req = req;
    this.params = params;
    this.query = query;
    this.body = body;
    this.headers = headers;
  }
};
