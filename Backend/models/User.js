const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  roles: {
    User: {
      type: Number,
      default: 4000,
    },
    Employees: Number,
    Manager: Number,
    Admin: Number,
  },
  password: {
    type: String,
    require: true,
  },
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
