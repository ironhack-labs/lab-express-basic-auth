// User model here
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {   
        username:{
            type: String,
            trim: true,
            required: [ true ],
            unique: true
        },
      password: {
      type: String,
      required: [ true ],
    }
  },
);

module.exports = model('User', userSchema);