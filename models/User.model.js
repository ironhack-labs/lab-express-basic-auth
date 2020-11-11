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

   
    },
{
    timestamps: true
  }
)

module.exports = model("User", userSchema);
