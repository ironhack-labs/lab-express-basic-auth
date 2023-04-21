const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "El formato del email no es válido"],
      trim: true,
      lowercase: true,
    },

    password: {
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
