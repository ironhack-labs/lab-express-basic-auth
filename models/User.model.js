const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Write username']
    },
    password: {
      type: String,
      required: [true, 'Write password']
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;