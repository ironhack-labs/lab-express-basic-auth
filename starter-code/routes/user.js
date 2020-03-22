const express = require("express")
const app = express()
const User = require("../models/User")
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

app.get("/signup", (req, res) => {
  res.render("user/signup")
})

app.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ "username": username })
    .then((user) => {
      if (user !== null) {
        res.render("user/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }
      else {
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) next("Hashing error")
          else {
            User.create({
              username: username,
              password: hash
            })
            .then((user)=>{
              res.redirect("/login")
            })
            .catch((error)=>{
              res.send("Error user not created",error)
            })
          }
          
        })
      }
    })
  })

  app.get("/login", (req, res) => {
    res.render("user/login")
  })

  
  app.post("/login", (req,res,next)=> {
    const {username, password} = req.body;
    User.findOne({
        username 
    })
    .then((user)=> {
        if(!user) res.send("invalid credentials.")
        else {
            bcrypt.compare(password, user.password, function(err, correctPassword) {
                if(err) next("hash compare error");
                else if(!correctPassword) res.send("invalid credentials.");
                else {
                    req.session.currentUser = user;
                    res.redirect("profile");
                }
            });
        }
    })
    .catch((err)=> {
        res.send("Error, not logged in.")
    })
  })

  app.get("/profile", (req, res) => {
    res.render("user/profile")
  })


  module.exports = app;