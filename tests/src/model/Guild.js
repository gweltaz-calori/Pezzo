const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is required"]
  },
  icon: {
    type: String
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

Schema.methods.toJSON = function() {
  return {
    name: this.name,
    icon: this.icon,
    _id: this._id
  };
};

module.exports = mongoose.model("Guild", Schema);
