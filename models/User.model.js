const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username field is required"],
    trim: true,
    lowercase:true
  },
  passwordHash: {
    type: String,
    required: [true, "$Password field is required"],
    trim: true,
    unique: true,
    lowerccase: true
  }, 
  email:   {
    type: String,
    required: [true, 'Email is required.'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    unique: true,
    lowercase: true,
    trim: true
  },
},
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
