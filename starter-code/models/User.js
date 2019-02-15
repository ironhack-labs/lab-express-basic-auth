const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    sessionID: String
}, {
    timestamps: true
});
  
userSchema.pre("save", function(next) {
    try {
      const user = this;
      if (!user.isModified("password")) return next();
      bcrypt.hash(user.password, 10, (err, hash)=> {
          user.password = hash;
          next();
      });
    } catch (err) {
      next(err);
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;