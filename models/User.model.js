const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {type: String, rquired: true, unique: true},
  password: {type: String, required: true}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
