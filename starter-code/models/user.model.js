const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  userName: {
    type:String,
    unique: true,
    required: [true, 'Name is Required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
}, { timestamps: true})

userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(SALT_WORK_FACTOR)
    .then(salt => {
      return bcrypt.hash(user.password, salt)
        .then(hash => {
          user.password= hash;
          next();
        })
    })
    .catch(error => next(error));
})

const User = mongoose.model('User', userSchema)
module.exports = User;