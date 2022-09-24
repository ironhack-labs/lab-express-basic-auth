const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required."],
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    unique: true,
    lowercase: true,
    trin: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);

module.exports = User;
