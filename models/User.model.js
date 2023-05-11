const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true, //add comments later
    trim: true,
  },
  password: {
    type: String,
    required: true, //add comments later
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    //REGEX to define the acceptable structure of the email (aaa@bb.com)
    //From Bernardo's notes: // "must match string +@string+ .string"
    match: /^\S+@\S+\.\S+$/, //add comments later
  },
});

const User = model("User", userSchema);

module.exports = User;
