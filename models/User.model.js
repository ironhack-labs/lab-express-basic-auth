const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Passowrd is required'],
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  }
},
  {
    timestamps: true,
  });

const User = model("User", userSchema);

module.exports = User;
