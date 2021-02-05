// User model here

const moongose = require("mongoose");

const userSchema = new moongose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    }
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
