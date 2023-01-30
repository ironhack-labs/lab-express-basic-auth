const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;


// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Name is required']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Your password must have at least 8 characters']
    }
});



userSchema.pre('save', function(next) {
  const rawPassword = this.password;
  if (this.isModified('password')) {
    bcrypt.hash(rawPassword, SALT_ROUNDS)
      .then(hash => {
        this.password = hash;
        next()
      })
      .catch(err => next(err))
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
