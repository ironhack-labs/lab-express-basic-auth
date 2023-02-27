// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();

const User = require('../models/User.model');
//bcryptjs setup
const bcryptjs = require('bcryptjs');
const saltRounds = 10;


//Get route at signup page (displaying form to user)
router.get('/signup', (req, res) => res.render('auth/signup'));

//Post route at signup page to get user's data (use bcryptbjs)
router.post('/signup', (req, res, next) => {
    console.log("The form data: ", req.body);
    console.log('what the fuck')
   
      const { username, password } = req.body;

      // make sure users fill all mandatory fields:
  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          // username: username
          username,
          // passwordHash => this is the key from the User model
          //     ^
          //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        res.redirect('userProfile') 
      })
      .catch(error => {
        if (error.code === 11000) {
          res.status(500).render('auth/signup', {
             errorMessage: 'Username needs to be unique. Username is already used.'
          });
        } else {
          next(error);
        }
        }); 
  });

//Get login route
router.get('/login', (req, res) => res.render('auth/login'));

//Post login route (to process form data)
router.post('/login', (req, res, next) => {

  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/login', { 
      errorMessage: 'Please enter both, username and password to login'
    });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (!user) {
      res.render('auth/login', { errorMessage: 'Username is not registered.' });
    return;
    } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect('/userProfile');
    } else {
      res.render('auth/login', { errorMessage: 'Incorrect password.' });
    }
  })
  .catch(error => next(error));
})

//Logout post route
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  })
})

//Get route to redirect to user's page
router.get('/userProfile', (req, res) => {

  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;