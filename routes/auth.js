const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');


//SIGN UP

router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
    try{
        if (!username || !password){
            render.render('auth/signup',{
                errorMessage: 'All the fields are mandatory. Please input a username, email and passowrd',
            })
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
})



// LOG IN


router.get('/login', isLoggedOut, (req, res) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!password || !username) {
      res.render('auth/login', {
        errorMessage: 'All the fields are mandatory. Please input an username and password',
      });
      return;
    }

    const user = await User.findOne({ username });

    if (!user) {
      res.render('auth/login', {
        errorMessage: 'Username not found',
      });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      //This will compare the plain text password from the input with the hashed password we stored in the database

      req.session.user = user;
      res.redirect('/');
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







router.get('/profile', isLoggedIn, (req, res) => {
    const user = req.session.user;
    console.log(user);
  
    res.render('profile', user);
  });
  
  router.post('/logout', (req, res, next) => {
    if (!req.session) res.redirect('/');
  
    req.session.destroy((err) => {
      if (err) next(err);
      else res.redirect('/');
    });
  });
  







  module.exports = router;