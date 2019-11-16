const express = require('express');
const router = express.Router();
const Users = require("../models/User");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");


router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(
  session({
    secret: "basic-auth-secret",
    cookie: {
      maxAge: 60000
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60
    })
  })
);




/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/signup', (req, res, next) => {
  const saltRounds = 10;
  const plainPassword1 = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword1, salt);
  Users.findOne({
      name: req.body.username
    })
    .then(userFound => {
      if (userFound === null) {
        Users.create({
            name: req.body.username,
            password: hash
          })
          .then(createdUser => {
            res.json({
              created: true,
              createdUser
            })
          })
          .catch(() => {
            res.json({
              created: false
            })
          })
      } else {
        res.json({
          authorised: false,
          reason: 'User already exists'
        })
      }
    })
});


router.post('/login', (req, res, next) => {
  Users.findOne({
      name: req.body.username
    })
    .then(userFound => {
      if (bcrypt.compareSync(req.body.password, userFound.password)) {
        req.session.currentUser = userFound._id;
        res.redirect("/private");
      } else {
        res.json({
          authorised: false,
          reason: 'username or password are wrong'
        })
      }
    })
    .catch(() => {
      res.json({
        authorised: false,
        reason: 'user do not exist in the database'
      })
    })
})

router.get('/private', (req, res, next) => {
  if (req.session.currentUser) {
    res.render("private");
  } else {
    res.redirect("/login");
  }  
})

router.get('/main', (req, res, next) => {
  if (req.session.currentUser) {
    res.render("main");
  } else {
    res.redirect("/login");
  }  
})

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;