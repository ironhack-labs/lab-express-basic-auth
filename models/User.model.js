const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role:{
      type: String,
      enum: ["Admin", "User"],
      default:"User"
    }
  },
  {
        timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;



