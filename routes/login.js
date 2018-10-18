const express = require('express');
const router = express.Router();
const User = require ("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post("/", function(req, res, next){
  const {username, password} = req.body
  if (!username || ! password) {
    res.redirect('/login')
  }
  User.findOne({username})
  .then((user) => {
    if(!user){
      res.redirect('/login')
    } else{}
      if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
        // Save the login in the session!
        req.session.user = user;
        res.redirect('/profile');
      } else {
        res.redirect('/login');
      }
  })
})

router.post('/logout', (req, res, next) => {
  const user = req.session.currentUser;

  if (!user) {
    return res.redirect('/login')
  } else {
    next();
  }
  req.session.destroy((err) => next(err));
  res.redirect('/');
});

module.exports = router;