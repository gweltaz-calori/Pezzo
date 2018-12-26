const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class Authenticator {
  async authenticate(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw { email: ["Unknown email"] };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { password: ["Invalid password"] };
    }
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  }
}

module.exports = new Authenticator();
