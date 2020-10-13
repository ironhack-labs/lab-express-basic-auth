// User model here
//request Mongoose here
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    //create this in Compass
    //createdAt: 2020-10-13T09:02:47.334+00:00
  }
);


module.exports = mongoose.model('user', userSchema)