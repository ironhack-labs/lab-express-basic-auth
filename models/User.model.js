const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Mandatory Username'],
      minlength: [3, 'Username must be at least 3 characters long']
    },
    password: {
      type: String,
      required: [true, 'Password required']
    },

  },
  {
    timestamps: true
  }
)

const User = model("User", userSchema);

module.exports = User;
