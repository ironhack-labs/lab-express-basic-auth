const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: [true, "El email es obligatorio."],
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria."]
    }
  },
  {
    timestamps: true
  }

);

const User = model("User", userSchema);

module.exports = User;
