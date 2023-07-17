const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const SALT_ROUNDS = 10;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      match: [EMAIL_PATTERN, 'Email is invalid.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must have at least 8 characters.']
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, SALT_ROUNDS)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch(error => next(error));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function(passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = model("User", userSchema);

module.exports = User;
