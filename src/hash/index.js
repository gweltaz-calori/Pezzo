const bcrypt = require("bcryptjs");
module.exports = {
  async hash(value) {
    return await bcrypt.hash(value, 8);
  },
  async compare(first, second) {
    return await bcrypt.compare(first, second);
  }
};
