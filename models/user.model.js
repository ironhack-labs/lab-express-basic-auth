const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: "username must be unique",
    required: "username must be required"
  },
  password: {
    type: String,
    required: "Password must be required"
  }
});

userSchema.pre('save', function(next){
  console.log('das');
  
  if (!this.isModified('password')) {
    next();
  } else{
    bcrypt.genSalt(saltRounds)
    .then(saltValue =>{
      return bcrypt.hash(this.password, saltValue);
    })
    .then(hash =>{
      this.password = hash;
      next();
    })
    .catch(()=>{
      this.password = null;
      next();
    });
  }
});

userSchema.methods.checkPassword = function(passwordToCheck){
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;