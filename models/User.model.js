const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({

  username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required.']
  }
  },
  {
    timestamps: true
  }
);


module.exports = model("User", userSchema);
