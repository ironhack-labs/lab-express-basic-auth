const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true

  },
  password: {
    type: String,
    required: true
  }
},
  {
    timestamps: true
  });

const User = model("User", userSchema);

module.exports = User;
