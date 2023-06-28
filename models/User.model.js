// const { Schema, model } = require("mongoose");


// // TODO: Please make sure you edit the user model to whatever makes sense in this case
// const userSchema = new Schema({
//   username: {
//     type: String,
//     unique: true
//   },
//   password: String,

//   passwordhash: {
//     type: String,
//     unique: true,
//     required: true,
//     lowercase: true
//   }
// });

// const User = model("User", userSchema);

// module.exports = User;


// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   hash: String,
//   salt: String
// });

// UserSchema.methods.setPassword = function(password) {
//   this.salt = bcrypt.genSaltSync(10);
//   this.hash = bcrypt.hashSync(password, this.salt);
// };

// UserSchema.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.hash);
// };

const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
