const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs')
const SALT_ROUNDS = 10

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: false,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},
  {
    timestamps: true,
  }
)

userSchema.pre('save', function (next) {
  if (this.isNew) {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    const hash1 = bcrypt.hashSync(this.password, salt)
    this.password = hash1
  }
  next()
})

const User = model("User", userSchema);

module.exports = User;
