module.exports = class Response {
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
};
