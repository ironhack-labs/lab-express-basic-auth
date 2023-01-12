const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
  username: {
    type: String,
    unique: true,
    required: [true, 'username is required']
  },
  passwordHash: {
    type: String,
    required: [true, 'password is required']
  }
},
{
  timestamps: true
}
);

const User = model("User", userSchema);

module.exports = User;
