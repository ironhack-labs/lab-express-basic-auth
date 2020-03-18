const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

router.get('/main', (req, res) => {
  res.render('main');
});

router.get('/private', (req,res)=>{
  // console.log(req.session.currentUser.username);
  let userName = req.session.currentUser.username;
  res.render('private',{
    welcomeMessage: `Welcome ${userName}`
  })
})

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  // const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username:username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      } else {
        bcrypt.hash(password, 10, function(err, hash){
          if (err) next('Problem in creating hashed password!');
          else {
            User.create({
              username: username, 
              password: hash 
            })
            .then((user) => {
              res.redirect("/user/login");
            })
            .catch((error) => {
              console.log("user was not created",error);
              next("user was not created");
            })
          }
        }) 
      }
    })
    .catch((error) => {
      next('Error occured during signup!');
    }); 
        
  

})
    


router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  // const {username, password} = req.body;
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to login"
    });
    return;
  }

  User.findOne({ username }) // short hand notation for {username: username}
    .then(user => {
        if (!user) {
          res.render("auth/login", {errorMessage: "Invalid credentials!"});
          return;
        }
        bcrypt.compare(password, user.password, function(err, result){
          if (err) next('Error occured in comparing hashes!')
          else if (result) {
            req.session.currentUser = user;
            res.redirect("/user/private");
          } else {
            res.render("auth/login", {errorMessage: "Invalid credentials!"});
          }    
        })   
    })
    .catch((error) => {
      console.log(error);
      next("Error, not logged in.",error);
    });
})


module.exports = router;
