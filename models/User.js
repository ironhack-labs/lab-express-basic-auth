// User model here
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  cpf: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
  imageAvatar: { type: String, default: 'https://res.cloudinary.com/dobzwgcvl/image/upload/v1599596161/shorty-app/default-avatar.jpg' },
},
{
  timestamps: true,
});

const User = mongoose.model('user', userSchema);

module.exports = User;

