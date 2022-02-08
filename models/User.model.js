const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Indique el nombre de usuario"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Indique su email"],
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Indique su contrasena"],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
