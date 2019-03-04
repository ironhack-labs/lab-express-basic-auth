const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { requireAnon, requireUser, requiredFields } = require('../middelwares/auth');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;

router.get('/signup', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', requireAnon, requiredFields, async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ 'username': username });
  try {
    if (user) {
      req.flash('validation', 'This username is taken');
      res.render('auth/signup');
      res.redirect('/auth/signup');
      return;
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const createdUser = await User.create({
        username,
        password: hashPass
      });
      req.session.currentUser = createdUser;
      res.redirect('/');
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', requireAnon, requiredFields, async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ 'username': username });
    if (!user) {
      req.flash('validation', 'Username or password incorrect');
      res.redirect('/auth/login');
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      req.flash('validation', 'Username or password incorrect');
      res.redirect('/auth/login');
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post('/logout', requireUser, async (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
