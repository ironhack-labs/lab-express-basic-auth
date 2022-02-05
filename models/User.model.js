const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    required: [true, "Username is mandatory!"],
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    required: [true, "You forgot to insert the password"],
    type: String,
  },
});

const User = model("User", userSchema);

module.exports = User;
