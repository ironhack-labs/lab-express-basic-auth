const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.login = ((req, res, next) => {
  res.render('auth/form.hbs')
})

module.exports.doLogin = ((req, res, next) => {
  const user = new User(req.body)
  
})