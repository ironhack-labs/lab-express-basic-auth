// User model here
const mongoose = require("mongoose");

const SingSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      unique: true,
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\S+@\S+\.\S+$/,
        "Por favor utilice un correo electronico valido",
      ],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", SingSchema);
