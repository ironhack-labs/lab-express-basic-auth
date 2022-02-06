const router = require("express").Router();
const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require('mongoose');
const User = require('../models/User.model')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/register", (req, res, next) => {
  res.render("auth/register");
});

router.post("/register", (req, res, next) => {
  const user = { username, password } = req.body;

  const renderWithErrors = (errors) => {
    res.render('auth/register', {
      errors: errors,
      user: user
    })
  }

  User.findOne({ username: username })
    .then((userFound) => {
      if (userFound) {
        renderWithErrors({ email: 'Email already in use!' })
      } else {
        return User.create({ username, password }).then(() => res.redirect('/'))
      }
    })
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors)
      } else {
        next(err)
      }
    })
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const user = { username, password } = req.body;

  const renderWithErrors = (errors) => {
    res.render('auth/login', {
      errors: errors,
      user: user
    })
  }

  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        renderWithErrors({ username: 'User doesn\'t exist' })
        return
      } else if (bcrypt.compareSync(password, user.password)) {
        res.send('Logged in!')
      } else {
        renderWithErrors({ password: 'Incorrect password' })
      }
    })
    .catch(err => next(err))
});


module.exports = router;
