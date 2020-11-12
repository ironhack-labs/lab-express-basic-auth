// User model here

const { Schema, model} = require("mongoose")

const userSchema = new Schema(
{
    Username : {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true

    },
    Password : {
      type: String,
      trim: true,
      required: [true, 'Password is required.'],
      },

  /*     email: {
        type: String,
        required: [true, 'Email is required.'],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        unique: true,
        lowercase: true,
        trim: true,
      } */

   
    },
{
    timestamps: true
  }
)

module.exports = model("User", userSchema);
