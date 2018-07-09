const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const bcryptSalt = 10;

/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  if (username == "" || password == "") {
    throw new Error("Fields cannot be empty");
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user != null) {
        throw new Error("Username already exists.")
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      return User.create({
        username,
        password: hashPass
      });
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(e => {
      console.log(e);
      res.render('auth/signup', {
        errorMessage: e.message
      })
    })
});

router.get('/login', (req, res, next) => {
  res.render('auth/login')
})

router.post('/login', (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  new Promise((resolve, reject) => {
      if (username == "" || password == "") return reject(new Error("Fields cannot be empty"))
      resolve()
    })
    .then(() => {
      return User.findOne({
        "username": username
      })
    })
    .then(user => {
      if(!user) throw new Error("User doesn't exist")
      if(!bcrypt.compareSync(password, user.password)) throw new Error ("Incorrect Password")
      req.session.currentUser = user;
      console.log((`user ${user.username} Logged in`));
      res.redirect("/");
    })
    .catch(e => {
      res.render("auth/login", {
        errorMessage: e.message
      })
    })
})

router.get('/logout', (req,res) => {
  req.session.destroy(e => {
    console.log(e.message);
    res.redirect('/login')
  })
})




module.exports = router;