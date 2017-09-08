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
          res.render('welcome', { user: newUser });
        }
    });
});

router.get('/login', (req, res, next) => {
    res.render('login/index');
  });

module.exports = router;
