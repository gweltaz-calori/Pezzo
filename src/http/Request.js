module.exports = class Request {
  constructor(req, params = {}, query = {}, body = {}) {
    this.req = req;
    this.params = params;
    this.query = query;
    this.body = body;
  }
};
