
const {Schema,model} = require("mongoose");

const userSchema = new Schema({

  username:{
    unique:true,
    type:String,
    required:true
  },
  password:{
    required:true,
    type:String
  }
},{timestamps:true})


module.exports = model("User",userSchema)