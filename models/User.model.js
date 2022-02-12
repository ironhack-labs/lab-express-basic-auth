const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "user name required"],
      unique: true,
    },
    email: {
      type: String,
      // regex to match email address
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      required: [true, "email is required"],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, "password is required"],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
