const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already exist"],
      require: [true, "Field can't be empty"],
    },
    password: { type: String, required: [true, "Please send your password"] },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
