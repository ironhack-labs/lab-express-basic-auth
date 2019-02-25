const mongoose = require('mongoose');

const { Schema } = mongoose;

const mySchema = new Schema({
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  username: { type: String, unique: true },
  password: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', mySchema);
