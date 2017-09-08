/*jshint esversion: 6 */

const express      = require('express');
const router       = express.Router();
const User         = require("../models/user");
const bcrypt       = require("bcrypt");
const saltRounds   = 10;

/* GET home page. */

router.get('/', (req, res, next) => {
  res.render('sign-up/index');
});

router.get('/welcome', (req, res, next) => {
  res.render('welcome')
})

router.post('/', (req, res, next) => {

    const newUser = User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(saltRounds))
    });

    if (newUser.username === "" || newUser.password === "") {
        res.render("sign-up/index", {
          errorMessage: "All fields required to sign-up"
        });
        return;
    };

    User.findOne({ "username": newUser.username }, "username", (err, user) => {
        if (user !== null) {
          res.render("sign-up/index", {
            errorMessage: "That username already exists"
          });
          return;
        }
    })

   newUser.save((err) => {
        if (err) {
            return next(err);
            res.render("sign-up/index", {
               errorMessage: "Something went wrong when signing up"
             });
        } else {
          // req.session.currentUser = newUser;
          res.redirect('welcome');
        }
    });
});

router.get('/login', (req, res, next) => {
    res.render('log-in/index');
  });

router.post('/login', (req, res, next) => {

    const existingUser = User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(saltRounds))
    });

    if (existingUser.username === "" || existingUser.password === "") {
        res.render("log-in/index", {
          errorMessage: "All fields required to log-in"
        });
        return;
    }

    User.findOne({ "username": existingUser.username }, "username", (err, user) => {
        if (!user) {
          res.render("log-in/index", {
            errorMessage: "That username doesn't exist"
          });
          return;
        }
    });

    User.findOne({ "username": existingUser.username }, (err, user) => {
        if (user && existingUser.username === user.username && bcrypt.compareSync(req.body.password, user.password)) {
          res.redirect("welcome");
          return;
        } else {
          res.render("log-in/index", {
            errorMessage: "Incorrect details"
          });
        }
    });

});

module.exports = router;
