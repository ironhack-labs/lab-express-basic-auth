const express = require('express');
const router = express.Router();
const User = require('../models/User.model.js');
const bcryptjs = require('bcryptjs');

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.get('/logout', (req,res,next) => {
  res.redirect('/')
})


module.exports = router;