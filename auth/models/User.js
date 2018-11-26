const Schema = require('mongoose').Schema
const userSchema  = new Schema ({
  username: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  }
},
{
  timestamps: {
    createdAt : 'created_at',
    updatedAt : 'updated_at'
  },
  versionKey: false
})

module.exports = require('mongoose').model('User', userSchema)