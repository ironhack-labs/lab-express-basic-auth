const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// GET signup page
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// POST signup
router.post("/signup", function (req, res, next) {
  const passwordHash = bcrypt.hashSync(req.body.password, salt);

  new User({
    username: req.body.username,
    email: req.body.email,
    password: passwordHash,
  })
    .save()
    .then(function () {
      res.send("vous etes bien inscrits");
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((userFromDb) => {
      if (userFromDb) {
        if (bcrypt.compareSync(req.body.password, userFromDb.password)) {
          req.session.currentUser = userFromDb;
          res.redirect("/profile");
        }
      } else {
        res.render("auth/login", {
          errorMessage: "email ou mot de passe érroné",
        });
      }
    })
    .catch((err) => next(err));
});

module.exports = router;
