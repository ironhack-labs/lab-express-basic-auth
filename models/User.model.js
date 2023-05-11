const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username required.'],
      unique: false
    },
    passwordHash: {
      type: String,
      required: [true, 'Password required.']
    }
  },
  {
    timestamps: true
  }
);


const User = model("User", userSchema);

module.exports = User;
