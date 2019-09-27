const mongoose = require('mongoose');
const { Schema , model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
},
  { timstamps: true },
);

module.exports = model('User', userSchema);