const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    validate: {
      validator: function(val) {
        return /[A-Za-z0-9]+/.test(val)
      },
      message: props => `${props.value} is not a valid username! (but you probably know that already!)`
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(val) {
        return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}/.test(val)
      },
      message: props => `${props.value} is not a valid password! (but you probably know that already!)`
    }
  }
}
);

const User = mongoose.model("users", userSchema);

module.exports = User;