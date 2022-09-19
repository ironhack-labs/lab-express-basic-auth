const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "username is required"],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required.']
  }
});

module.exports = model("User", userSchema);
