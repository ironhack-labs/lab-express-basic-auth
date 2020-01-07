const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render('index')
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render('index')
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        req.session.currentUser = user;
        res.render('success');
      } else {
        res.render('index');
      }
  })
  .catch(error => {
    next(error);
  })
});

module.exports = router;