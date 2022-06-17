const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const saltRound = 10;
const User = require('../models/User.model');

router.get('/signup',(req, res, next) => {
  res.render('../views/signup.hbs')
})

module.exports = router