const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please tell us your name!']
    },
    password: {
      type: String,
      minlength: 4,
      required: [true, 'Please provide a password!']
      
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
module.exports = User;