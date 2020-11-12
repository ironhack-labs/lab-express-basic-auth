const { Router } = require("express");
const bcryptjs = require("bcrypt");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = Router();
const saltRounds = 10;
const flash = require('connect-flash');

const User = require("../models/User.model");
const { resource } = require("../app");

//Sign-up page

router.get("/sign-up", (req, res) => res.render("auth/sign-up"));

router.post("/sign-up", (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth/sign-up', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
      }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                password: hashedPassword
            });
        })
        .then(userFromDB => {
            // console.log('Newly created user is:', userFromDB);
            //adding a user to session on signup
            req.session.currentUser = userFromDB;
            res.redirect("/user-profile")
        })
        .catch((error) => {
            //for a unique username + error message
            if (error.code === 11000) {
              res.status(500).render("auth/sign-up", {
                username,
                errorMessage:
                  "Username needs to be unique. Username is already used.",
              });
            } else {
              next(error);
            }
          })
        .catch((err) => next(err));
  });


  //Login page
  router.get("/login", (req, res) => {res.render("auth/login", { errorMessage: req.flash('error')})
    });

  //render private page
  router.get("/user-profile", (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

  router.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  (req, res, next) => {
      const { username, password } = req.body
      
      if (username === '' || password === '') {
          res.render('auth/login', {
              errorMessage: 'Please enter both, email and password to login'
          })
          return;
      } 

      User.findOne({ username })
        .then( user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Username is not registered. Try another username.'});
                return;
            } else if (bcryptjs.compareSync(password, user.password)) {
                req.session.currentUser = user;
                console.log(user)
                res.redirect('/user-profile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.'});
            }
        })
        .catch(error => next(error));
  });

  router.get("/main", (req, res) => {
    if (!req.user) {
        res.redirect('/login'); // can't access the page, so go and log in
        return;
      }
      // ok, req.user is defined
      res.render('users/main', { user: req.user });
    });

    router.get("/private", (req, res) => {
        if (!req.user) {
            res.redirect('/login'); // can't access the page, so go and log in
            return;
          }
          // ok, req.user is defined
          res.render('users/private', { user: req.user });
        });

  router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });



  module.exports = router;