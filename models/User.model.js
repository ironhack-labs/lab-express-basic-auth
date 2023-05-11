const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      require: [true, 'Username is required.'],
      trim: true
    },
    passwordHash: {
      type: String,
      require: [true, 'Username is required.']
    },
  },
    {
      timestamps: true
    }
);

const User = model("User", userSchema);

module.exports = User;
