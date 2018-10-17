const express = require('express');
const router = express.Router();
const User = require('../models/user');
const middlewares = require('../middlewares/middlewares');

// npm install bcrypt
const bcrypt     = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/index');
});

router.get('/signup', (req, res, next) => {
  res.render('users/signup');
});

router.post('/signup', middlewares.requireFields, middlewares.userExists, (req, res, next) => {
  let user = req.body;

  // Signup user
  const salt  = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(user.password, salt);

  user.password = hashedPassword;

  User.create(user)
    .then(() => {
      res.redirect('/users');
    })
    .catch(() => {
      next(error);
    })
  .catch(next);
})

router.get('/login', (req, res, next) => {
  res.render('users/login');
})

router.post('/login', (req, res, next) => {
  const user = req.body;

  User.find({username: user.username})
    .then(userFound => {
      console.log({password: userFound[0].password});
      // Login user
      if (bcrypt.compareSync(user.password, userFound[0].password)) {
        // Save the login in the session!
        console.log('Password correcto');
        req.session.currentUser = user.username;
        res.redirect('/users');
      } else {
        console.log('Password erroneo');
        res.redirect('/users/login');
      }
    })
})

module.exports = router;