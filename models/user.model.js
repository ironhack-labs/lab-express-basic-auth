const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const WORK_FACTOR = 10;

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    unique: true,
    //match: [EMAIL_REGEX, 'invalid email format'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'user al least 8 chars']
  }
}, { timestamps: true });


schema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash;
            next();
          });
      })
      .catch(error => next(error));
  } else {
    next();
  }
});

schema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', schema);
module.exports = User;
