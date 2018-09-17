const express = require('express');
const authRoutes = express.Router();
const User = require("../models/User")
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/", (req, res, next) => {
  res.render("index");
});

authRoutes.get("/signup",(req,res,next)=>{
  res.render("auth/signup")
})

authRoutes.post("/signup",(req,res,next)=>{
  let {username,password} =req.body;
  if(username=="" || password==""){
    res.render("auth/signup",{
      message: "Indicate a username and a password to sign up"
    })
    return;
  }
  User.findOne({"username": username})
  .then(user=>{
    if( user!== null ){
      res.render("auth/signup",{
        message: "The username already exists"
      })
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password:hashPass
    })

    console.log(newUser)

    newUser.save((err)=>{
      if(err){
        res.render("auth/signup",{message:"Something went wrong"});
      }else{
        res.redirect("/");
      }
    })
    })
    .catch(error=>{
      next(error)
    });
  })

  authRoutes.get("/signin",(req,res,next)=>{
    res.render("auth/signin")
  })

  authRoutes.post("/signin", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      res.render("auth/signin", {
        message: "Indicate a username and a password to sign up"
      });
      return;
    }
  
    User.findOne({ "username": username })
    .then(user => {
        if (!user) {
          res.render("auth/signin", {
            message: "The username doesn't exist"
          });
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/signin", {
            message: "Incorrect password"
          });
        }
    })
    .catch(error => {
      next(error)
    })
  });

  authRoutes.get("/signout", (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/singin");
    });
   });




module.exports = authRoutes;