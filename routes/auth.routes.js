const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');

//MAIN & PRIVATE
router.get('/main', (req, res, next) => {
  if(!req.session.currentUser){
      res.render('auth/main', {errorMessage: 'You are not logged in!'})
  } else {
      res.render('auth/main', {success: 'Welcome!'})
  }
})

router.get('/private', (req, res, next) => {
  if(!req.session.currentUser){
      res.render('auth/private', {errorMessage: 'You are not logged in!'})
  } else {
      res.render('auth/private', {success: 'Private'})
  }
})


//SIGNUP

//get route and display signup form.
router.get('/signup', (req,res) => {
    res.render('auth/signup')
})

//post route with inputs from form.
router.post('/signup', (req, res, next) => {

    //destructure input data
    const { username, password } = req.body;

    //check if both fields are completed
    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'Both field are mandatory'})

    //else => stop code with empty return
    return;
    }


    //Checks that a password has a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.
    const regex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

    if(!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password must have a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.'})

    //else => stop code with empty return    
    return;
    }

    //encrypt password
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password,salt))
        .then(hashedPassword => {
            return User.create({
                username,
                passwordHash: hashedPassword
            });
        })
        .then(userFromDb => {
            console.log('Newly created user is: ',userFromDb);
            res.redirect('/userProfile');
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
              res.status(500).render('auth/signup', {
                errorMessage: 'Username and email need to be unique. Either username or email is already used.'
              });
            } else {
              next(error);
            }
          });
});
////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGIN ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// .get() route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
  // console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, Email/Username and password to login.'
    });
    return;
  }
  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // the following line gets replaced with what follows:
        // res.render('users/user-profile', { user });

        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGOUT ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
// router.get('/userProfile', (req, res) => res.render('users/user-profile'));

router.get('/userProfile', (req, res) => {
  // console.log('your sess exp: ', req.session.cookie.expires);
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});


module.exports = router;
