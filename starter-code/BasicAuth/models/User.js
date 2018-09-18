const mongoose = require('mongoose')
const Schema = mongoose.Schema

 const userSchema = new Schema ({

  username:{
    type:String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},{
  timestamps: {
    createdAt:'created_at',
    updatedAt:'updates_at'
  }
})


module.exports = mongoose.model('User', userSchema)