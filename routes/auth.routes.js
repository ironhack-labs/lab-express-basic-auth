// Primeiro acesso - Authentication: "Who is the user?"
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      res.render('auth/signup', {
        errorMessage: 'All the fields are mandatory. Please input a username and passowrd',
      });
      return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render('auth/signup', {
        errorMessage:
          'Invalid password, password needs to have at least 6 characters and include an uppercase and lowercase character',
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({ username, password: hashedPassword });

    res.redirect('/');
    } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
    res.status(500).render('auth/signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
    res.status(500).render('auth/signup', { errorMessage: ' Username already exists' });
    }

  next(error);
}
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      res.render('auth/login', {
        errorMessage: 'All the fields are mandatory. Please input an email and passowrd',
      });
      return;
    }

    const user = await User.findOne({ username });

    if (!user) {
      res.render('auth/login', {
        errorMessage: 'Username not found',
      });
    } else if (bcrypt.compareSync(password, user.password)) {
      //This will compare the plain text password from the input with the hashed password we stored in the database
      req.session.user = user;
      res.redirect('/main');
    } else {
      //If the user exists BUT the password is wrong
      res.render('auth/login', {
        errorMessage: 'Wrong password. Try your birthday',
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Iteração 03 - main - Add a funny picture of a cat and a link back to the home page
router.get('/main', (req, res) => {
    const user = req.session.user;
    console.log(user);
  
    res.render('main', user);
  });


module.exports = router;

