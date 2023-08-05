const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Required field: email']
  },
  password: String,

});

const User = model("User", userSchema);

module.exports = User;
