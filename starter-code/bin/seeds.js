const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ironAccount");
const User = require("../models/User");

const user = [
  {
  userName:"Gabriel",
  password:"1234"  
},
{
userName:"Marilyn",
password:"3456"  
}
];

User.create(user, (err,result)=>{
  if(err)console.log("Nelll");
  console.log("Logramos", result);
})


