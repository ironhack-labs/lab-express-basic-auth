//Destructure of mongoose
const { model, Schema } = require('mongoose')
//Create an instance of a new Schema and save it to a constant
const userSchema = new Schema({
  //This instance will have a username and a password both of type string
  username: String,
  password: String
})
//Here we export the module consisting of the User and the structure of userSchema
module.exports = model('User', userSchema)