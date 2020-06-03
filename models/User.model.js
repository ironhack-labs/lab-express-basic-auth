const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
     username: {
       type: String,
       required: [true, 'Please enter username'], 
       unique: true
    },
     passwordHash: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

 module.exports = model('User', userSchema);
