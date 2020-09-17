// User model here
const { Schema, model } = require("mongoose");

// modelo de usuario em branco

const userSchema = new Schema(
  {
    // campo de nome do usuario
    username: {
      type: String,
      trim: true,
      require: [true, "Username is required..."],
      unique: trues,
    },

    // campo email
    email: {
      type: String,
      require: [true, " Email is required..."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    //campo de senha
    passwordHash: {
      type: String,
      require: [true, " Password is required"],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
