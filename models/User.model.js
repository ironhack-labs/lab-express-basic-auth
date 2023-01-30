
const mongoose = require ('mongoose')
const bcrypt = require ('bcryptjs')
const saltRounds = 10
const EMAIL_PATTERN =
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'Name is required']
  },
  email: {
    type: String,
    match: EMAIL_PATTERN,
    required: [true, 'Email is required'],
    unique: [true, 'Email is already in use'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Your password must have at least 8 characters']
  }
});

userSchema.pre('save', function(next) {
  const hashedPass = this.password;
  if (this.isModified('password')) {
    bcrypt.hash(hashedPass, saltRounds)
      .then(hash => {
        this.password = hash;
        next()
      })
      .catch(err => next(err))
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
}


const User = mongoose.model("User", userSchema);

module.exports = User;
