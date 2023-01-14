const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    match: [
      /^[a-zA-Z0-9_.]{4,}$/,
      "A username can only contain characters between a-z (case-insensitive), 0-9, or . (dot) or _ (underscore). Please try again.",
    ],
  },
  password: String,
});

const User = model("User", userSchema);

module.exports = User;
