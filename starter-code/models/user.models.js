const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    required: [true, 'Username is required']
  }
}, {timestamps:true});

//Authentication 

var User = mongoose.model('User', userSchema);


module.exports = User;
