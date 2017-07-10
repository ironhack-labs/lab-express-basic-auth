const express = require("express");
const authRoutes = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

function withTitle(c, title) {
  c.title = title || 'Undefined title';
  return c;
}

authRoutes.get("/", (req, res, next) => {
  res.render("index");
});

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User({
    username,
    password: hashPass
  });

  User.findOne({
    "username": req.body.username
  }, "username", (err, user) => {
    if (user !== null) {
      console.log("User exists");
      return res.render('signup',
      withTitle({
        errorMessage: "Username already exists"
      }));
    }
    var username = req.body.username;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username:req.body.username,
      password: hashPass
    });

    newUser.save((err) => {
      res.redirect("../");
    });
  });
});


module.exports = authRoutes;
