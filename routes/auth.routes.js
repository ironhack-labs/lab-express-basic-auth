const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');


//Signup
router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !password || !email) {
      res.render('auth/signup', { errorMessage: 'Please input all the fields' });
    }

    //after this we know we have all the fields

    //now we need to check the password
    //regEx
     const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    //the test method is from js and can be used with regex
    if (!regex.test(password)) {
      res.render('auth/signup', {
        errorMessage:
          'Your password needs to be 8 characters long and include lowercase letters and uppercase letters',
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, email, password: hashedPassword });

    res.redirect('/');
  } catch (error) {
    //Catch mongoose errors
    if (error instanceof mongoose.Error.ValidationError) {
      res.render('auth/signup', {
        errorMessage: error.message,
      });
    } else if (error.code === 11000) {
      res.render('auth/signup', {
        errorMessage: 'Email already registered',
      });
    }
    console.log(error);
    next(error);
  }
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!password || !email) {
      res.render('auth/login', { errorMessage: 'Please input all the fields' });
    }

    //check if the email exists

    let user = await User.findOne({ email });

    if (!user) {
      res.render('auth/login', { errorMessage: 'Account does not exist' });
    } else if (bcrypt.compareSync(password, user.password)) {
      //the user can  now login
      //this saves the user in the session
      req.session.user = user;

      res.redirect('/profile');
    } else {
      //this runs if the user exists but the password is wrong
      res.render('auth/login', { errorMessage: 'Wrong credentials' });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// routes protected by authentication

router.get('/main', (req, res) => res.render('main'));

router.get('/private', (req, res) => res.render('private'));


    









module.exports = router;