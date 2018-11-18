const express     = require('express');
const router      = express.Router();
const mongoose    = require('mongoose')
const User        = require('../models/user')
const bcrypt      = require("bcrypt");
const bcryptSalt  = 10;
const session     = require("express-session");
const MongoStore  = require("connect-mongo")(session);
const app         = require('../app')

/* GET login page */
router.get('/', (req, res, next) => {
    res.render('login');
});

router.post("/", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("/", {
      errorMessage: "Rellena ambos campos"
    });
    return;
  }

  User.findOne({ "username": username })
  .then((user) => {
      if (!user) {
        res.render("/", {
          errorMessage: "No exixste este usuario"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/account");
      } else {
        res.render("/", {
          errorMessage: "Contrase'a incorrecta"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});



module.exports = router;

