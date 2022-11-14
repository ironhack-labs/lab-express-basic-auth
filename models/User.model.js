const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs')
const SALT_ROUNDS = 9

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
});

userSchema.pre('save', function (next) {
  if (this.isNew) {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    const hash = bcrypt.hashSync(this.password, salt)
    this.password = hash
  }
  next()
})

const UserModel = model("User", userSchema);

module.exports = UserModel;
