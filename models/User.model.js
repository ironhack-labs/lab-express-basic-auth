const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: 
  {
    type: String,
    required: true
  },

});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});


const User = model("User", userSchema);

module.exports = User;
