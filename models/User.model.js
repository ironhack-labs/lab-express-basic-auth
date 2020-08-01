// User model here
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bycrypt = require('bcrypt')

 
const userSchema = new Schema(
  {
    name: { type: String, unique: true },
    password: { type: String, minlength: 5 }
  },
  { timestamps: true }
);
 
userSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    bycrypt.hash(user.password, 10).then((hash)=> {
      user.password = hash;
      next();
    });
  } else {
    next();
  }
})


userSchema.methods.checkPassword = function(password) {
  return bycrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);
 
module.exports = User;