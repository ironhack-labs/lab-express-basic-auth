const express = require('express');
const mainRouter = express.Router();

const User = require('./../models/User')

mainRouter.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  }
  else {
    res.redirect('auth/login');
  }
})

mainRouter.get('/', (req, res, next) => {
  res.render('main');
})

module.exports = mainRouter;