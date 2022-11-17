const router = require("express").Router();
const mongoose = require('mongoose');
/* GET home page */

const User = require("../models/User.model");
const bcrypt = require('bcryptjs');
// const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body;

  if(username === '') {
    res.render('signup', {message: "Username is too short"});
    return;
  }
  if(password.length < 5) {
    res.render('signup', {message: "Your password should contain at least 5 characters"});
    return;
  }

  User.findOne({username})
  .then(foundedUser => {
    if(foundedUser !== null) {
      res.render('signup', {message: "Username is taken"});
      return;
    }
    else {
      const salt = bcrypt.genSaltSync()
      const hashedPassword = bcrypt.hashSync(password, salt)
      User.create({ username,  password: hashedPassword })
      .then(foundedUser => {
        console.log(foundedUser)
        res.redirect('/login')
      })
      .catch(err => {
        next(err)
      })
    }
  })
})

router.get('/login', (req, res, next) => {
  res.render('login');
})

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  console.log('SESSION ==>', req.session);
  User.findOne({ username })
  .then (foundedUser => {
    if (!foundedUser) {
      res.render('login', { message: "Your name is wrong!"});
      return;
    }
    else if (bcrypt.compareSync(password, foundedUser.password)) {
      req.session.currentUser = foundedUser;
      res.redirect('/profile');
    }
    else {
      res.render('login', { message: "Wrong password"})
      return;
    }
  })
  .catch (err => next(err))
})

router.get('/profile', (req, res) => {
  res.render('profile', { foundedeUser: req.session.currentUser });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});



module.exports = router;
