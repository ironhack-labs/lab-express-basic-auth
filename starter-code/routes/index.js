const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");



router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", (req, res) => {
  const saltRounds = 10;
  const plainPassword1 = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword1, salt);

  User.findOne({ name: req.body.username }).then(userFound => {
    if (userFound !== null) {
      res.json({ authorised: false, reason: "User exists" });
    } else {
      User.create({ name: req.body.username, password: hash })
        .then(userCreated => {
          res.json({ created: true, userCreated });
        })
        .catch(() => {
          res.json({ created: false });
        });
    }
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

router.get("/main", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("main")
  }
});

router.get("/private", (req, res) => {
  if (req.session.currentUser) {
    res.render("private");
    //   } else {
    //     res.redirect("/login");
  }
});

router.post("/login", (req, res) => {
  function notFound(reason) {
    res.json({ authorised: false, reason });
  }
  User.findOne({ name: req.body.username })
    .then(userFound => {
      if (bcrypt.compareSync(req.body.password, userFound.password)) {
        req.session.currentUser = userFound._id;
        res.redirect("/main");
      } else {
        notFound("password or user are wrong");
      }
    })
    .catch(userNotFoundError => {
      notFound("user not found");
    });
});

module.exports = router;

