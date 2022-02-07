const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,                 // borra los espacios            
      unique: true,
      required: [true, 'Please indicate a username']
    },
    password: {
      type: String,
      required: [true, 'Please indicate a password']
    },
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
