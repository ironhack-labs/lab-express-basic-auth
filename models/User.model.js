const { Schema, model } = require("mongoose")

// TO DO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    minlength: [3, 'Please introduce a longer username']
  },
  password: {
    type: String,
    required: true
  }

})

const User = model("User", userSchema)

module.exports = User
