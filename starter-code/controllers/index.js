const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')

exports.showSignup = (req, res, next) => {
  res.render('auth/signup')
}

exports.makeSignup = async (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(7);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = await User.create({ username, password: hashedPassword });
  res.redirect('/login');
}

exports.showLogin = (req, res, next) => {
  res.render('auth/login')
}

exports.makeLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.render('auth/login', { err: "User doesn't exist" });
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.loggedUser = user;
    req.app.locals.loggedUser = user;
    res.redirect('/profile');
  } else {
    res.render('auth/login', { err: 'Your password is password, well at least you would be closer' });
  }
}

exports.access = (req, res, next) => {
  const { loggedUser } = req.app.locals;
  if(loggedUser){
    res.render('auth/profile', loggedUser);
  }
  res.render('auth/login', { err: 'Status Matters try again' });
}

exports.accessMain = (req, res, next) => {
  const { loggedUser } = req.app.locals;
  res.render('auth/main', { err: 'Ooops' });
}

exports.accessPrivate = (req, res, next) => {
  const { loggedUser } = req.app.locals;
  res.render('auth/private', { err: 'No peaking!' });
}



















































































