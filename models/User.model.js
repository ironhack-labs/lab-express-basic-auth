const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'username is required']
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'password is required']
    },
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
