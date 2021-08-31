const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: [true, "Username already exists. Please create another."],
    required: [true, "Please enter a username."]
  },
  password: String,
});

const User = model("User", userSchema);

module.exports = User;
