const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const validationSchema = new Schema({
  userName: {type: String, unique: true},
  userPass: String
});

module.exports = mongoose.model('validation', validationSchema);
