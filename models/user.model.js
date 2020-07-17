const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username must be unique"],
    minlength: [3, "username must be at least 3 characters long"],
  },
  password: {
    type: String,
    required: [true, "password required"],
    minlength: [3, "password must be at least 3 characters long"],
  },
})

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 10).then((hash) => {
      this.password = hash
      next()
    })
  } else {
    next()
  }
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)
module.exports = User
