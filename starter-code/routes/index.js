const express = require('express');
const router = express.Router();
const Users = require("../Models/Users");
const bcrypt = require("bcrypt");
const hbs = require('hbs');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  const saltRounds = 2;
  const thePassword = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(thePassword, salt);

  Users.findOne({
    name: req.body.username
  }).then(user => {
    if (user !== null) {
      res.render("register", {
        errorMessage: "This username already exist."
      });
    } else {
      Users.create({
          name: req.body.username,
          password: hash
        })
        .then(() => {
          res.redirect('home'); //change this
        })
        .catch(() => {
          res.render('home');
        });
    }
  });

});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const thePassword = req.body.password;
  const theUser = req.body.username

  if (theUser === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  Users.findOne({
      "name": theUser
    })
    .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        // req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    })



});

module.exports = router;