const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get('/signup', isLoggedOut, (req, res) => {
  const { err } = req.query;
  res.render('signup', { err });
});

router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.redirect('/signup?err=Missing information');
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render('signup', {
        err: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
      });
      return;
    }
    const saltRounds = 10;
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = await User.create({ username, password: hashedPassword });
    res.redirect('/private');
    console.log(newUser);
  } catch (err) {
    // console.log(err.code);
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(500).render('signup', { err: err.message });
    } else if (err.code === 11000) {
      res.status(500).render('signup', {
        err: 'Username  needs to be unique.',
      });
    }
  }
});

router.get('/login', isLoggedOut, (req, res) => {
  const { err } = req.query;
  res.render('login', { err });
});

router.post('/login', async (req, res, next) => {
  console.log('SESSION =====> ', req.session);

  try {
    const { username, password } = req.body;

    if (username === '' || password === '') {
      res.redirect(
        '/login?err=Please enter both, username and password to login.'
      );
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.redirect('/login?err=Email is not registered. Try with other email.');
    } else if (bcryptjs.compareSync(password, user.password)) {
      //******* SAVE THE USER IN THE SESSION ********//
      // when we introduce session, the following line gets replaced with what follows:
      //   res.render('private', { user });
      req.session.currentUser = user;
      res.redirect('/private');
    } else {
      res.redirect('/login?err=Incorrect password.');
    }
  } catch (err) {
    console.log(err);
    res.redirect(`/login?err=${err.message}`);
  }
});

router.get('/private', isLoggedIn, (req, res) => {
  res.render('private', { userInSession: req.session.currentUser });
});

router.post('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
