const mongoose = require("mongoose");

const userSchema = new mongooseSchema (
  {
    username: {
      type: String,
      required: "Username is required",
      unique: true,
    },
    password: {
      type: String,
      required: "Username is required",
    }  
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);;
