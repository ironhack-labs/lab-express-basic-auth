const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Name is required"],
    unique: [true, "Name is required"]
  },
  password: {
    type: String,
    required: [true, "Password is required"]
}

});


const User = model("User", userSchema);

module.exports = User;
