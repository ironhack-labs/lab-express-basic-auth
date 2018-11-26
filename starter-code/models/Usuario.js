const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuarioSchema = new Schema ({

userame : {
  type: String,
  unique: true
},
password : String,

},{
  timestamps : {
    createdAt : true,
    updatedAt: true,
  },
  versionKey : false,
})

module.exports = mongoose.model('Usuario', usuarioSchema)