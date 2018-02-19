import { read } from 'fs';

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/basic-auth");

const User = require("./models/User");

const users = [
  {
  userName:'Ironhacker',
  password: encrypted
  }
]

User.create(users, function(err, result){
  if(err) console.log("Connection failed");
  console.log("Connection succesfull", result);
})