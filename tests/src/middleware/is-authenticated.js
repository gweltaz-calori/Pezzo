const User = require("../model/User");
const jwt = require("jsonwebtoken");
module.exports = function isAuthenticated(req, res, next) {
  jwt.verify(
    req.headers.authorization,
    process.env.JWT_SECRET,
    async (err, data) => {
      if (err) return res.status(401).send({ message: "Unauthorized" });

      req.user = await User.findOne({ _id: data.id });
      next();
    }
  );
};
