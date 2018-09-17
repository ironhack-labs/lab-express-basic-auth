const express = require('express');
const router  = express.Router();
const User = require("../models/user");

const bcrypt     = require("bcrypt");
const saltRounds = 10;

const session= require('express-session')

/* GET home page */
router.get('/signup', (req, res, next) => {
  

  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ "username": username })
    .then(user => {
      console.log("hola"+user)
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }else{
        const newUser  = new User({
          username,
          password: hashPass
        });
      
        newUser.save()
        .then(user => {
          res.redirect("/");
        })
      }
    })
    .catch(err => {
      next(error)
    })

  
});

//================================

router.get('/login', (req, res, next) => {
  

  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Fill in all fields!"
    });
    return;
  }
  User.findOne({ username})
    .then(user => {
      console.log(user)
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(err => {
      next(err)
    })

  });
  
  router.get('/logout',(req,res,next)=>{
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/");
    });
  })



module.exports = router;
