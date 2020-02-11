var express = require("express");
var User = require("./../models/User");
var loginRouter = express.Router();
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

loginRouter.get("/",(req,res)=>{
  res.render("auth/login-form");
})

loginRouter.post("/",(req, res)=>{
  const {username, password} = req.body;
  
  if(password == ""|| username ==""){
    res.render("auth/login-form",{
      errorMessage: "Username and Password are required"
    });
    return;
  }
  User.findOne({username})
    .then(user =>{
      if(!user){
        res.render("auth/login-form",{
          errorMessage: "The username doesn't exist."
        });
        return;
      }

      const passwordFromDB = user.password;
      const passwordCorrect = bcrypt.compareSync(password, passwordFromDB);

      if(passwordCorrect){
        req.session.currentUser = user;
        res.redirect("/main");
      }
      else{
        res.render("auth/login-form",{
          errorMessage: "Incorrect password!"
        });
      }
    })
    .catch(err => console.log(err));
})

module.exports = loginRouter;