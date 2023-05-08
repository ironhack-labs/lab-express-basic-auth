const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: false,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    unique: true,
    required: false,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
},
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
