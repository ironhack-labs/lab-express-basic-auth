const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Username is required']
    },
    password: {
      type: String,
      minlength: [5, 'Password must be 5 characters'],
      required: [true, 'Password is required']
    }
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt
      .genSalt(10)
      .then((salt) => {
        return bcrypt.hash(this.password, salt).then((hash) => {
          this.password = hash;
          next();
        });
      })
      .catch((error) => next(error))
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


