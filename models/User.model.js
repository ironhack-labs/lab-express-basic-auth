const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'escribe tu nombre por favor']
    },
    password: {
      type: String,
      required: [true, 'es necesaria una contraseña, si eres tan amable']
    }
  },
  {
    timestamps: true,
  });

const User = model("User", userSchema);

module.exports = User;
