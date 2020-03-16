const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema ({
    name: { type: String, unique: true, required: true },
    lastName: { type: String, required: true},
    password: {type: String, unique:true, required: true}   
},
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  })

const User = mongoose.model('User', userSchema)

module.exports= User