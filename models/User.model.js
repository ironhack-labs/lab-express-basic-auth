const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    minLength: [4, 'Must have at least 4 characters'],
    unique: true,
    required: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
})

const User = model("User", userSchema);

module.exports = User;
