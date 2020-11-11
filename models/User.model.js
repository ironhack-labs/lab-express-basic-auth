const { Schema, model} = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      unique: true,
    }, 
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
    }, 
    passwordHash: { type: String, required: [true, "Password is required"]}
  },
  {
    timestamps: true,
  }
);

module.exports = model("user", userSchema);