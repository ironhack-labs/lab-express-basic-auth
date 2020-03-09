const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
      unique: true,
      type: String
    },
    password: String
  },
  {
    timestamps: true

});

const User = mongoose.model('User', userSchema);

module.exports = User;
