const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Username is required.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  }
},
  {
    timestamps: true
  }
)

const User = model("User", userSchema);

module.exports = User;
