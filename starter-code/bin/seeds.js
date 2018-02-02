const mongoose = require("mongoose");
const Auth = require("../models/user");

mongoose.connect("mongodb://localhost/auth-dev").then(() => console.log("Conectado"));

const auth = [
  { username: 'John', password: '123'},
]

Auth.collection.drop();

auth.forEach( c => {
  let au = new Auth(c);
  au.save((err, auth) => {
    if(err){
      throw err;
    }
    console.log(`Celebrity guardada ${auth.name}`);
   // mongoose.disconnect();
  })
});