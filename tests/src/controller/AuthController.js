const { Router, validateBody, Hash } = require("../../../src/index");
const Authenticator = require("../service/Authenticator");
const User = require("../model/User");

const VALIDATION = {
  email: {
    required: "This field is required",
    isEmail: "Email invalid"
  },
  password: {
    required: "This field is required"
  }
};

const Controller = {
  async register(req, res) {
    try {
      const user = new User({
        email: req.body.email,
        password: await Hash.hash(req.body.password)
      });
      await user.save();
      res.send({
        token: await Authenticator.authenticate(
          req.body.email,
          req.body.password
        )
      });
    } catch (e) {
      res.status(400).send(e);
    }
  },
  async login(req, res) {
    try {
      res.send({
        token: await Authenticator.authenticate(
          req.body.email,
          req.body.password
        )
      });
    } catch (e) {
      res.status(400).send(e);
    }
  },
  async logout(req, res) {
    res.send({
      token: null
    });
  }
};

module.exports = new Router({ baseUrl: "/auth" })
  .post("/register", Controller.register, [validateBody(VALIDATION)])
  .post("/login", Controller.login, [validateBody(VALIDATION)])
  .get("/logout", Controller.logout);
