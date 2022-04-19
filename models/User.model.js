const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'username is mandatory'],
    minlength: [3, 'Length must be: at least 3 characters'],
    trim: true
  },
  password: {
    type: String,
    required: true
  }
},
  {
    timestamps: true,
  }

);

const User = model("User", userSchema);

module.exports = User;
