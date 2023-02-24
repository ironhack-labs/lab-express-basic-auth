const { Router } = require('express');
const bcrypt = require('bcryptjs');
const router = new Router();
const User = require('../models/User.model');

const saltRounds = 10;

router.get('/signup', (req, res) => res.render('auth/signup'));

router.get('/userProfile', (req, res) => res.render('auth/user-profile'));

//POST
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render('auth/signup', {
        errorMessage:
          'All fields are mandatory. Please provide your username and password.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      username,
      password: hashedPassword,
    });

    res.redirect('/userProfile');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
