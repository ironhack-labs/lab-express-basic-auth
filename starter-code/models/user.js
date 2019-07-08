const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const userModel = mongoose.model("userCollection", userSchema);

module.exports = userModel;
