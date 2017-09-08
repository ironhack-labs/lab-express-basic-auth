/*jshint esversion: 6 */

const express      = require('express');
const router       = express.Router();
const User         = require("../models/user");
const bcrypt       = require("bcrypt");
const saltRounds   = 10;
const session      = require("express-session");
const MongoStore   = require("connect-mongo")(session);

/* GET home page. */

router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('welcome');
  } else {
    res.render('sign-up/index');
  }
});

router.get('/welcome', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
  } else {
  res.render('welcome');
  }
});

router.post('/', (req, res, next) => {

    const newUser = User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(saltRounds))
    });

    if (req.body.username === "" || req.body.password === "") {
        res.render("sign-up/index", {
          errorMessage: "All fields required to sign-up"
        });
        return;
    }

    User.findOne({ "username": newUser.username }, "username", (err, user) => {
        if (user !== null) {
          res.render("sign-up/index", {
            errorMessage: "That username already exists"
          });
          return;
        }
    });

   newUser.save((err) => {
        if (err) {
          res.render("sign-up/index", {
             errorMessage: "Something went wrong when signing up"
           });
        } else {
          req.session.currentUser = newUser;
          res.redirect('welcome');
        }
    });
});

router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('welcome');
  } else {
    res.render('log-in/index');
  }
});

router.post('/login', (req, res, next) => {

    const existingUser = User({
        username: req.body.username,
        password: req.body.password
    });

    if (existingUser.username === "" || existingUser.password === "") {
        res.render("log-in/index", {
          errorMessage: "All fields required to log-in"
        });
        return;
    }

    User.findOne({ "username": existingUser.username }, "username password", (err, user) => {
        if (err || !user) {
          res.render("log-in/index", {
            errorMessage: "That username doesn't exist"
          });
          return;
        }
        else if (user && existingUser.username === user.username && bcrypt.compareSync(req.body.password, user.password)) {
          req.session.currentUser = user;
          res.redirect("welcome");
        } else {
          res.render("log-in/index", {
            errorMessage: "Incorrect details"
          });
        }
    });

});


module.exports = router;
