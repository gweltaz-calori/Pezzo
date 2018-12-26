const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true
  },
  password: String,
  guilds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guild" }]
});

Schema.methods.toJSON = function() {
  return {
    email: this.email,
    _id: this._id
  };
};

Schema.plugin(uniqueValidator);
module.exports = mongoose.model("User", Schema);
