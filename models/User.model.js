const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      require: true,
      minLenght: 2
    },
    password: String,
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
