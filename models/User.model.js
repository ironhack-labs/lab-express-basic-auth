const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required'],
    unique: [true, 'Username is already taken'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
}
);

const User = model("User", userSchema);

module.exports = User;
