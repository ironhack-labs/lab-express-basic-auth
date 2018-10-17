const express = require('express');
const router = express.Router();
const User = require('../models/user');
const friends = require('../middlefriend/friends');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('register');
});

router.post('/', friends.checkEmpty, (req, res, next) => {
  const user = req.body;
  const name = user.name;
  const pass = user.password;

  const salt  = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(pass, salt);

  User.create({name: name, password: hashedPassword})
  .then (() => {
    res.redirect('/')
  })
  .catch(next);
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', friends.checkEmpty, (req, res, next) => {
  const name = req.body.name;
  const pass = req.body.password;

  User.findOne({name})
  .then((user) => {
    console.log(user)
    if (bcrypt.compareSync(pass, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.redirect('/auth/login');
    }
  })
  .catch(next)
})

module.exports = router;
