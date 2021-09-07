const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to 
//whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required.']
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  {
    timestamps: true
  }
});

const User = model("User", userSchema);

module.exports = model('User', userSchema);
