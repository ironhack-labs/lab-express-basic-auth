const Schema = require('mongoose').Schema;

const userSchema = new Schema({

  username:{
  type:String,
  unique: true,
  required:true
  },
  password:{
    type:String,
    required:true,
  },
  email: {
    type:String,
    unique:true,
    required:true
  },
  
},{
  timestamps:{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = require('mongoose').model('User', userSchema)