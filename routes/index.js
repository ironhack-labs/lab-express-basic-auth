const express = require('express');
const router  = express.Router();
const User = require('../models/Users')
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


/* GET home page */

router.get('/', (req, res, next) => {
  res.render('home');
});


router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post("/signup", (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser  = User({
    name,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect("/");

  });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;

  if (name === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Coloca un usuario"
    });
    return;
  }

  User.findOne({ "name": name }, (err, user) => {
      if (err || !user) {
        res.render("/login", {
          errorMessage: "El usuario no existe"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("/login", {
          errorMessage: "Password incorrecto"
        });
      }
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;
