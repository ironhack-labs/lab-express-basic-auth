const express     = require('express');
const router      = express.Router();
const mongoose    = require('mongoose')
const User        = require('../models/user')
const bcrypt      = require("bcrypt");
const bcryptSalt  = 10;
const session     = require("express-session");
const MongoStore  = require("connect-mongo")(session);
const app         = require('../app')
const login       = require('../routes/login')


router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get('/', (req, res, next) => {
  const currentUser = req.session.currentUser.username
  res.render('private', {currentUser});
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;

