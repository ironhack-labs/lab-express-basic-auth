const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required!'],
      trim: true,
      lowercase: true
    },
    pwHash: {
      type: String,
      required: [true, 'Password is required!']
    } 
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
