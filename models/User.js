const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
 username:{
   type:String,
   unique:true,
   require: true
   
 },
 password:{
   type:String,
   require: true
 }

},{
 timestamps:{
   createdAt:'created_at',
   updatedAt:'updated_at'
 }
})

module.exports = mongoose.model('User',userSchema)