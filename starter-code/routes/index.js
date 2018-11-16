const express = require('express');
const router  = express.Router();
const User    = require('../models/User')

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

// const username = new User();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post("/signUp", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
      res.render("index", {
          errorMessage: "Indicate a username and a password to sign up"
      });
      return
  }
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const miau = User({
      username,
      password: hashPass
  });
  miau.save()
      .then(user => {
          res.redirect("/");
      }).catch(err => console.log(err))
      .catch(error => {
          console.log(error);
      })
});
  router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }
  
    User.findOne({ "username": username })
    .then(user => {
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
    .catch(error => {
      next(error)
    })
  });
  
module.exports = router;
