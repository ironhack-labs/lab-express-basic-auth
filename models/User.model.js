const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'es necesario el nombre de Usuario'],
      trim: true,
      unique: true,
      min: 4
    },
    password: {
      type: String,
      required: [true, 'hace falta contraseña'],
      trim: true,
      min: 4
    }
  }
);

const UserModel = model("user", userSchema);

module.exports = UserModel;
