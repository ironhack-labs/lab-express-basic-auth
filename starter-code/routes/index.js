const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Users = require("../models/User");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/singup', (req, res, next) => {
  res.render('singup');
});

router.post("/singup", (req, res) => {
  const plainPass = req.body.password;
  if (req.body.username.length > 0 && plainPass.length > 0) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plainPass, salt);

    Users.create({
        name: req.body.username,
        password: hash
      })
      .then(newUser => {
        res.json({
          created: true,
          newUser
        });
      })
      .catch((error) => {
        res.json({
          created: false,
          errorMsg: "That user name is already in use"
        });
      });

  } else {
    res.json({
      created: false,
      errorMsg: "You must fill both user name and password fields!"
    });
  }
});

router.post("/login", (req, res) => {
  const userName = req.body.username;
  const plainPass = req.body.password;

  if (userName.length > 0 && plainPass.length > 0) {
    Users.findOne({
        name: userName
      })
      .then(userFound => {
        if (bcrypt.compareSync(plainPass, userFound.password)) {
          req.session.currentUser = userFound._id;
          res.redirect("/private");
        } else {
          res.json({
            authenticate: false,
            errorMsg: "Your user name or password are wrong"
          });
        }
      })
      .catch(userNotFoundError => {
        res.json({
          authenticate: false,
          errorMsg: "User not found"
        });
      });
  } else {
    res.json({
      authenticate: false,
      errorMsg: "You must fill both user name and password fields!"
    });
  }
});

router.get("/private", (req, res) => {
  if (req.session.currentUser) {
    res.render("private");
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res) => {
  if (req.session.currentUser) {
    res.render("main");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;