const mongoose = require('mongoose');
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const bcrypt = require('bcrypt');
const WORK_FACTOR = 10;

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    match: [EMAIL_REGEX, 'invalid email format'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [8, 'user at least 8 chars']
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