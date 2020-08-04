// User model here

const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    /*Define schema here */
    username: {
      type: String, 
      required: true,
      unique: true, 
    },
    passwordHash: {
      type: String, 
      required: true
    }
  },
  {
    // add keys createdAt and updatedAt in the object in the DB
    timestamps: true
  }
);


module.exports = model('User', userSchema);
