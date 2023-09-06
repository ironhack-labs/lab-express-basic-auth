// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();

const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// GET Routes
router.get("/signup", (req, res) => res.render("auth/signup"));

router.get('/login', (req, res) => res.render('auth/login'));

// POST Routes
router.post("/signup", (req, res, next) => {
  
    const { username, email, password } = req.body;

    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
      }
  
    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username,
          passwordHash: hashedPassword
        });
      })
      .then((userFromDB) => {
        // console.log("Newly created user is: ", userFromDB);
        res.redirect("/userProfile");
      })
      .catch((error) => next(error));
  });

  router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);

    const { username, password } = req.body;
   
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
   
    User.findOne({ username })
      .then(user => {
        if (!user) {
          console.log("Username not registered. ");
          res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
          return;

        } else if (bcryptjs.compareSync(password, user.passwordHash)) {

            req.session.currentUser = user;
          res.render('users/user-profile', { user });

        } else {
          console.log("Incorrect password. ");
          res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

  router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

  router.get("/userProfile", (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

  module.exports = router;