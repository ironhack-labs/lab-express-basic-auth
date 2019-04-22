const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    password: String
  },
  {
    timestamps: true,
    versionKey: false
  }
  ,{
    timestamps:true,
    versionKey:false
  }
)

module.exports = mongoose.model('User', userSchema)
