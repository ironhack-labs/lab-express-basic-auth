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
          password: {
      type: String,
      required: [true, 'Password is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    // email: {
    //   type: String,
    //   required: [true, 'Email is required.'],
    //   unique: true,
    //   lowercase: true,
    //   trim: true
    // // },
    // passwordHash: {
    //   type: String,
    //   required: [true, 'Password is required.']
    // }
  },
  {

    timestamps: true
    
  }
);

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});


module.exports = model('User', userSchema);




