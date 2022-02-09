const { Schema, model } = require("mongoose");
uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      // This is done client-side in the HTML form atm:
      //match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'], 
      trim: true,
      lowercase: true
    },
    pwHash: {
      type: String,
      required: true
    } 
  },
  {
    timestamps: true
  }
);

// return a mongoose ValidationError in case a username or email already exists
userSchema.plugin(uniqueValidator, { message: '{PATH} already taken!' });

module.exports = model("User", userSchema);

