const { Router } = require('express');
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 12;
const User = require('../models/User.model');


// .get() route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.render("auth/signup", {
        email,
        username,
        errorMessage:
            "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

/* const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
    res
        .status(500)
        .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
    } */

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {return User.create({
        username,
        email,
        passwordHash: hashedPassword
    });
    })
    .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        res.redirect('/userProfile');
    })
    .catch(error => next(error));
});

// 1. GET route ==> to render /user-profile views
router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });

// 2. GET route ==> to render /login views 
router.get('/login', (req, res) => res.render('auth/login'));

// 2. POST route ==> to process form data 
router.post("/login", (req, res, next) => {
    const { email, password } = req.body;
    console.log("SESSION =====> ", req.session);
    // get the data from login form
    
  
    // Validate that incoming data is not empty.
    if (!email || !password) {
      res.render("auth/login", {
        email,
        errorMessage:
          "All fields are mandatory. Please provide your email and password.",
      });
      return;
    }
  
    // 1. find if user doesn't exist, and redirect to login page
    // 2. find existing user, check password / hashed password
    // 3. patching session to the user
    User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) { 
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
      .catch((error) => next(error));
  });


  // 2. POST logout route ==> to log out user AND destroy session.
  router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

// 3. GET route for userProfile
router.get("/userProfile", (req, res) => {
  res.render("user-profile", {userInSession: req.session.currentUser});
});

// 3. GET  Main-Public / Private routes ==> to render part of our app only accessible behind authentication
router.get('/main', (req, res) => {
  if (req.session.currentUser) {
    res.render("main", {userInSession: req.session.currentUser});
  } else {
    res.render("auth/login", {
      errorMessage: `Please log in`,
    });
  }
});

router.get('/private', (req, res) => {
  if (req.session.currentUser) {
    res.render('private', {userInSession: req.session.currentUser});
  } else {
    res.render("auth/login", {
      erroMessage: `Please log in.`,
    });
  }
});


module.exports = router;