const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
},
{
  timestamps: true,
});

const User = mongoose.model('user', userSchema);

module.exports = User;
