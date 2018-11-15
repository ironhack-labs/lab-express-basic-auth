const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema ({
  username : {type: String, required: true, unique: true},
  encryptedPassword : {type: String, required: true},
}, {
  timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User;


// Username: Must be unique in our application, and will identify each user.
// Password: Must be encrypted, using bcrypt.
// To complete this first iteration, you have to create the database model with mongoose, the routes, and the views.

// Remember that you have to handle validation errors when a user signs up:

// The fields can't be empty.
// The username can't be repeated.