const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//SIGNUP
router.get("/signup", (req, res) =>{
    res.render("user/signup.hbs");
})

router.post("/signup", (req, res, next)=>{
    const {username, password} = req.body;
    bcrypt.hash(password, 10, function (err, hash){
    if(err) next("Hashing error occured.");
    else{
            User
                .create({
                    username: username,
                    password: hash
                })
                .then((newUser) => {
                    if (newUser.username === "" || newUser.password === "")
                        res.send('Invalid credentials! You need to fill username and password.');
                    else if (newUser.username === newUser.password)
                        res.send('Username and password can not be the same. Please, try again!')
                    else {
                        req.session.currentUser = newUser;
                        res.redirect('/user/login');
                    }
                })
                .catch((err)=>{
                    next("Error, user not created");
                })
    }})
})

//LOGIN
router.get("/login", (req, res) =>{
    res.render("user/login.hbs");
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  User
  .findOne({
    username
  })
    .then(newUser => {
      if (!newUser) res.redirect("/user/main")
      else {
          bcrypt.compare(password, newUser.password, function(err, correctPassword){
            if(err) res.redirect('/user/main');
            else if (newUser.username === '' || correctPassword === '')res.redirect('/user/main');
            else if(!correctPassword) res.redirect('/user/main');
            else {
                req.session.currentUser = newUser;
                res.redirect('/user/private');
            }
          })
    }
})
    .catch((err) => {
      next('Error, login did not work');
    });
});

router.get('/private', (req, res) => {
  res.render('user/private.hbs');
});

router.get('/main', (req, res) => {
  res.render('user/main.hbs');
});

module.exports = router;
