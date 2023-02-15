const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: [true, "Please submit a username"],
  },
  password: {
    type: String,
    require: [true, "Please submit an email"],
  }
});

const User = model("User", userSchema);

module.exports = User;
