
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', (req, res, next) => {
  res.render('success');
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/signUp", (req, res, next) => {
  
  res.render("auth/signUp");
});

router.post('/signup', (req, res) => {

  const {username, password} = req.body;

  const saltRounds = 5;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password : hash
  })
  newUser.save()
  .then(user => {
    console.log(user);
    res.redirect('/auth/login')
  })
})

router.post("/login", (req, res, next) => {
  console.log("hola")
  const username = req.body.username;
  const password = req.body.password;

  console.log(username, password)

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
      if (!user) {
        console.log("123")

        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        console.log("456")

        // Save the login in the session!
        // req.session.newUser = user;
        res.redirect("/");
      } else {
        console.log("789")

        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});

module.exports = router;