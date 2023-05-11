let { Schema, model } = require("mongoose");

let userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},
{    
  timestamps: true
});

let User = model("User", userSchema);

module.exports = User;