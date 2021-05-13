// routes/auth.routes.js
const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');

const mongoose = require('mongoose');

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
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
    // const hashedPassword = bcryptjs.hashSync(password, 10);
    // console.log(`Password hash: ${hashedPassword}`);
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
        res.redirect('/userProfile');
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message }); //se puede cambiar el mensaje
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
             errorMessage: 'Username need to be unique. Username is already used.'
          });
        } else {
          next(error);
        }
      }); // close .catch()
  });

router.get('/userProfile', (req, res) => {
    res.render('users/userProfile', { user: req.session.currentUser });
});

/////LOGIN//////
// .get() route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);

    const { username, password } = req.body;
   
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }
   
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
          return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // when we introduce session, the following line gets replaced with what follows:
        // res.render('users/user-profile', { user });
 
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        console.log(req.session);
        res.redirect('/userProfile');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

  // RUTA PRIVADA
router.get('/private', (req, res) => {
    const user = req.session.currentUser
    if(!user){
        res.redirect("/login")
    }
    res.render('private')
})

router.get('/main', (req, res) => {
    const user = req.session.currentUser
    if(!user){
        res.redirect("/login")
    }
    res.render('main')
})

module.exports = router;