var express = require("express");
var authRouter = express.Router();
const User = require("./../models/User");

const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

authRouter.get("/", (req, res)=>{
  res.render("auth/signup-form");
})
authRouter.post("/", (req, res, next)=>{
  const{username, password} = req.body;

  if(password === "" || username ===""){
    res.render("auth/signup-form",{
      errorMessage: "Username and password are required"
    });
    return;
  }

  if (zxcvbn(password).score <3){
    res.render("auth/signup-form",{
      errorMessage: "Password too weak, try again..."
    });
    return;
  }
  
  User.findOne({username})
  .then (user =>{
    if(user){
      res.render("auth/signup-form",{
        errorMessage: "User already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    User.create({username, password: hashedPassword})
    .then (createUser => res.redirect("/"))
    .catch(err =>{
      res.render("auth/signup-form", {
        errorMessage: "Error while creating the new user."
      });
    });
  })
  .catch(err => console.log(err));
})

module.exports = authRouter;