// const { Mongoose } = require("mongoose")

// User model here
const {Schema, model} = require("mongoose");

const UserSchema = new Schema ({
    username: {type: String, unique: true, trim: true,  required: true},
    
    passwordHash: {type: String, required: [true, 'Password is required.']},
  },
  {timestamps:true}
  );

module.exports = model('User', UserSchema);
