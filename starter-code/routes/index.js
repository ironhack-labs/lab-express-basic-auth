const express = require('express');
const router  = express.Router();
const Users = require("../models/Users");
const bcrypt = require("bcrypt");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", (req, res, next) => {
  if (req.query.error) {
    if (req.query.error === "empty") {
      res.render("signup", {
        error: "Tienes que proporcionar un nombre de usuario y una contraseña."
      });
    }

    if (req.query.error === "user-exists") {
      res.render("signup", { error: "El nombre de usuario ya existe; elige otro." });
    }
  } else {
    res.render("signup");
  }
});

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
    res.redirect("/signup?error=empty");
  }

  Users.findOne({ username: username }).then(foundUserData => {
    if (foundUserData === null) {
      const saltRounds = 5;

      const salt = bcrypt.genSaltSync(saltRounds);
      const encryptedPassword = bcrypt.hashSync(password, salt);

      Users.create({ username: username, password: encryptedPassword }).then(
        createdUserData => {
          res.redirect("/login");
        }
      );
    } else {
      res.redirect("/signup?error=user-exists");
    }
  });
});

router.get("/login", (req, res, next) => {
  if (req.query.error) {
    if (req.query.error === "empty") {
      res.render("login", {
        error: "¡Los campos no pueden estar vacíos!"
      });
    }

    if (req.query.error === "user-doesnot-exist" || req.query.error === "wrong-password") {
      res.render("main");
    }

  } else {
    res.render("login");
  }
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
    res.redirect("/login?error=empty");
  }

  Users.findOne({ username: username }).then(foundUserData => {
    if (foundUserData === null) {
      res.redirect("/login?error=user-doesnot-exist");
    } else {
      const bcrypt = require("bcrypt");
      const hashedPassword = foundUserData.password;

      if (bcrypt.compareSync(password, hashedPassword)) {
        req.session.user = foundUserData._id;
        res.redirect("/private");
      } else {
        res.redirect("/login?error=wrong-password");
      }
    }
  });
});

router.get("/private", (req, res) => {
  if (req.session.user) {
    Users.findById(req.session.user).then(yourInfo => {
      res.render("private", {yourInfo: yourInfo});
    })
  } else {
    res.redirect("/main");
  }
});

module.exports = router;
