// User model here
const bycrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:{type: String, required: true, unique: true },
  password: {type: String, required: true}
})

userSchema.pre('save', function(next) {
  const user = this;
  bycrypt.genSalt(10, (err, salt) => {
    if (err) {
      next(err);
    }
    bycrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        next(err);
      }
      user.password = hash;
      next();
    })
  })
})

const User = mongoose.model('User', userSchema)

module.exports = User;