const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
// const userSchema = new Schema({
//   username: {
//     type: String,
//     unique: true
//   },
//   password: String
// });

// const User = model("User", userSchema);

// module.exports = User;

// models/User.model.js


const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
      //     password: {
      // type: String,
      // required: [true, 'Password is required.'],
      // unique: true,
      // lowercase: true,
      // trim: true
    // },
    // email: {
    //   type: String,
    //   required: [true, 'Email is required.'],
    //   unique: true,
    //   lowercase: true,
    //   trim: true
    // // },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {

    timestamps: true
    
  }
);

module.exports = model('User', userSchema);




