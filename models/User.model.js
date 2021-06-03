const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  { 
    username: {     
        type: String,
        unique: [true, 'that username has already been taken, pick a unique Username'],
        trim: true
    },
    passwordHash: {
      type: String,
      unique: [true,'that email has already been registered'],
      trim: true
    },  
  },
  {
    timestamps: true
  },
);

const User = model("User", userSchema);

module.exports = User;
