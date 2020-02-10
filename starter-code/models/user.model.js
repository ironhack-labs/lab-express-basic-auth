const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: text => text.endsWith('@ironhack.com'),
      message: "El correo debe ser interno"
    }
  },
  password:{ 
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;