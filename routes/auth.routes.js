const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');

router.get('/private', (req, res) => {
  res.render('private');
});

router.get('/signup', (req, res) => {
  const { err } = req.query;
  res.render('signup', { err });
});

router.get('/login', (req, res) => {
  const { err } = req.query;
  res.render('login', { err });
});

router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.redirect('/signup?err=Missing information');
    }
    const saltRounds = 10;
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = await User.create({ username, password: hashedPassword });
    res.redirect('/private');
    console.log(newUser);
  } catch (err) {
    console.log(err.message);
  }
});

router.post('/login', async (req, res, next) => {
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
      res.redirect('/private');
    } else {
      res.redirect('/login?err=Incorrect password.');
    }
  } catch (err) {
    console.log(err);
    res.redirect(`/login?err=${err}`);
  }
});

module.exports = router;
