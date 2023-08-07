const { Schema, model } = require("mongoose");

const userSchema = new Schema(

  {

    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Username is needed"]
    },

    password: {
      type: String,
      required: [true, "Password is needed"]
    }

  },

  {
    timestamps: true
  }

);

const User = model("User", userSchema);

module.exports = User;
